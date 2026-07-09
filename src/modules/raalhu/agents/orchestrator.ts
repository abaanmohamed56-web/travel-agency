import Anthropic from "@anthropic-ai/sdk";
import { getAgent } from "./definitions";
import {
  DEFAULT_MODEL,
  FAST_MODEL,
  MAX_AGENT_DEPTH,
  MAX_ITERATIONS,
  MAX_OUTPUT_TOKENS,
  effortFor,
} from "./models";
import {
  addRunUsage,
  addTaskUsage,
  completeTask,
  createTask,
  failTask,
} from "./persistence";
import { DELEGATE_TOOL, buildTools, executeDomainTool } from "./tools";
import type { AgentContext, AgentDefinition, EmitFn } from "./types";

interface RunAgentOptions {
  client: Anthropic;
  agent: AgentDefinition;
  messages: Anthropic.MessageParam[];
  ctx: AgentContext;
  emit: EmitFn;
  depth: number;
  parentTaskId?: string;
  /** Task row to attribute this agent's own token usage to (undefined at depth 0 → run totals). */
  taskId?: string;
  signal: AbortSignal;
}

function resolveModel(agent: AgentDefinition): string {
  return agent.model === "fast" ? FAST_MODEL : DEFAULT_MODEL;
}

/**
 * Runs one agent's tool-use loop. Delegations recurse with depth+1; every
 * delegation is persisted as an AgentTask. Only the depth-0 (master) agent
 * streams text to the browser.
 */
export async function runAgent(opts: RunAgentOptions): Promise<string> {
  const { client, agent, ctx, emit, depth, signal } = opts;
  const model = resolveModel(agent);
  const effort = effortFor(model);
  const tools = buildTools(agent, depth, MAX_AGENT_DEPTH);
  const messages: Anthropic.MessageParam[] = [...opts.messages];
  let finalText = "";

  for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
    const stream = client.messages.stream(
      {
        model,
        max_tokens: MAX_OUTPUT_TOKENS,
        system: agent.systemPrompt(ctx),
        ...(effort ? { output_config: { effort } } : {}),
        ...(tools.length > 0 ? { tools } : {}),
        messages,
      },
      { signal }
    );

    if (depth === 0) {
      stream.on("text", (delta) => emit({ type: "text_delta", text: delta }));
    }

    const message = await stream.finalMessage();

    if (opts.taskId) await addTaskUsage(opts.taskId, message.usage);
    else await addRunUsage(ctx.runId, message.usage);

    if (message.stop_reason === "refusal") {
      throw new Error("The model declined this request for safety reasons.");
    }

    const text = message.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");
    if (text) finalText = text;

    if (message.stop_reason !== "tool_use") {
      if (message.stop_reason === "max_tokens") {
        finalText += "\n\n_(Response was truncated by the output limit.)_";
      }
      break;
    }

    messages.push({ role: "assistant", content: message.content });

    const toolUses = message.content.filter(
      (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
    );

    // Execute all tool calls, then return every result in ONE user message.
    const results: Anthropic.ToolResultBlockParam[] = [];
    for (const toolUse of toolUses) {
      let output: string;
      let isError = false;
      try {
        if (toolUse.name === DELEGATE_TOOL) {
          output = await runDelegation(opts, toolUse);
        } else {
          emit({ type: "tool_started", agentId: agent.id, tool: toolUse.name });
          output = await executeDomainTool(
            toolUse.name,
            toolUse.input,
            ctx,
            agent.id
          );
          emit({ type: "tool_finished", agentId: agent.id, tool: toolUse.name });
        }
      } catch (error) {
        isError = true;
        output = `Error: ${error instanceof Error ? error.message : String(error)}`;
        if (toolUse.name !== DELEGATE_TOOL) {
          emit({ type: "tool_finished", agentId: agent.id, tool: toolUse.name });
        }
      }
      results.push({
        type: "tool_result",
        tool_use_id: toolUse.id,
        content: output,
        ...(isError ? { is_error: true } : {}),
      });
    }
    messages.push({ role: "user", content: results });
  }

  return finalText;
}

async function runDelegation(
  parentOpts: RunAgentOptions,
  toolUse: Anthropic.ToolUseBlock
): Promise<string> {
  const { agent_id, task } = toolUse.input as { agent_id: string; task: string };
  // The enum already constrains agent_id, but re-validate against children —
  // never trust model input for routing.
  if (!parentOpts.agent.children.includes(agent_id)) {
    return `Error: "${agent_id}" is not on your team.`;
  }
  const child = getAgent(agent_id);
  const taskRow = await createTask({
    runId: parentOpts.ctx.runId,
    agentId: child.id,
    task,
    parentTaskId: parentOpts.taskId,
  });
  parentOpts.emit({ type: "agent_started", agentId: child.id, task });
  try {
    const output = await runAgent({
      ...parentOpts,
      agent: child,
      depth: parentOpts.depth + 1,
      taskId: taskRow.id,
      parentTaskId: taskRow.id,
      messages: [{ role: "user", content: task }],
    });
    await completeTask(taskRow.id, output);
    parentOpts.emit({ type: "agent_finished", agentId: child.id });
    return output || "(The delegate returned no output.)";
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await failTask(taskRow.id, message);
    parentOpts.emit({ type: "agent_finished", agentId: child.id });
    throw error;
  }
}
