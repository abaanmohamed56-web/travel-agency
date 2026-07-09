import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import type { RaalhuContext } from "@/modules/raalhu/auth/context";
import { getAgent } from "./definitions";
import { DEFAULT_MODEL } from "./models";
import { runAgent } from "./orchestrator";
import {
  createRun,
  ensureConversation,
  finishRun,
  saveAssistantMessage,
  saveUserMessage,
} from "./persistence";
import type { EmitFn } from "./types";

/**
 * Full lifecycle of one chat run: conversation + message persistence,
 * AgentRun bookkeeping, and the master agent's orchestration loop.
 */
export async function startRun(opts: {
  raalhu: RaalhuContext;
  conversationId?: string;
  message: string;
  emit: EmitFn;
  signal: AbortSignal;
}): Promise<void> {
  const { raalhu, emit, signal } = opts;

  const conversation = await ensureConversation({
    organizationId: raalhu.org.id,
    userId: raalhu.user.id,
    conversationId: opts.conversationId,
    title: opts.message,
  });
  await saveUserMessage(conversation.id, opts.message);

  const run = await createRun({
    organizationId: raalhu.org.id,
    conversationId: conversation.id,
    userId: raalhu.user.id,
    model: DEFAULT_MODEL,
  });

  try {
    const [profile, history] = await Promise.all([
      prisma.businessProfile.findUnique({
        where: { organizationId: raalhu.org.id },
      }),
      prisma.chatMessage.findMany({
        where: { conversationId: conversation.id },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
    ]);

    // Rebuild the master agent's conversation from persisted messages
    // (oldest first; the just-saved user message is included).
    const messages = history
      .reverse()
      .filter((m) => m.role === "USER" || m.role === "ASSISTANT")
      .map((m) => {
        const blocks = m.content as { type: string; text?: string }[];
        const text = blocks
          .filter((b) => b.type === "text" && b.text)
          .map((b) => b.text)
          .join("\n");
        return {
          role: m.role === "USER" ? ("user" as const) : ("assistant" as const),
          content: text || "…",
        };
      });

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const finalText = await runAgent({
      client,
      agent: getAgent("master"),
      messages,
      ctx: {
        org: raalhu.org,
        profile,
        userId: raalhu.user.id,
        runId: run.id,
      },
      emit,
      depth: 0,
      signal,
    });

    if (finalText) {
      await saveAssistantMessage(conversation.id, finalText, run.id);
    }
    await finishRun(run.id, "SUCCEEDED");
    emit({ type: "run_finished", runId: run.id, conversationId: conversation.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const cancelled = signal.aborted;
    await finishRun(run.id, cancelled ? "CANCELLED" : "FAILED", message);
    if (!cancelled) {
      emit({ type: "error", message: safeErrorMessage(error) });
    }
  }
}

function safeErrorMessage(error: unknown): string {
  if (error instanceof Anthropic.AuthenticationError) {
    return "The configured Anthropic API key was rejected. Check ANTHROPIC_API_KEY.";
  }
  if (error instanceof Anthropic.RateLimitError) {
    return "The AI provider is rate-limiting us — try again in a minute.";
  }
  if (error instanceof Anthropic.APIError) {
    return "The AI provider returned an error. Try again shortly.";
  }
  if (error instanceof Error && error.message.includes("safety")) {
    return error.message;
  }
  return "Something went wrong while running your AI team.";
}
