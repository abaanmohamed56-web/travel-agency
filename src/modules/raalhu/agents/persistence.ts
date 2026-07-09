import { prisma } from "@/lib/prisma";
import type Anthropic from "@anthropic-ai/sdk";

export async function ensureConversation(opts: {
  organizationId: string;
  userId: string;
  conversationId?: string;
  title: string;
}) {
  if (opts.conversationId) {
    const existing = await prisma.conversation.findFirst({
      where: { id: opts.conversationId, organizationId: opts.organizationId },
    });
    if (existing) return existing;
  }
  return prisma.conversation.create({
    data: {
      organizationId: opts.organizationId,
      createdById: opts.userId,
      title: opts.title.slice(0, 120),
    },
  });
}

export function saveUserMessage(conversationId: string, text: string) {
  return prisma.chatMessage.create({
    data: {
      conversationId,
      role: "USER",
      content: [{ type: "text", text }],
    },
  });
}

export function saveAssistantMessage(
  conversationId: string,
  text: string,
  agentRunId: string
) {
  return prisma.chatMessage.create({
    data: {
      conversationId,
      role: "ASSISTANT",
      agentId: "master",
      agentRunId,
      content: [{ type: "text", text }],
    },
  });
}

export function createRun(opts: {
  organizationId: string;
  conversationId: string;
  userId: string;
  model: string;
}) {
  return prisma.agentRun.create({
    data: {
      organizationId: opts.organizationId,
      conversationId: opts.conversationId,
      triggeredById: opts.userId,
      rootAgentId: "master",
      model: opts.model,
    },
  });
}

export function finishRun(
  runId: string,
  status: "SUCCEEDED" | "FAILED" | "CANCELLED",
  error?: string
) {
  return prisma.agentRun.update({
    where: { id: runId },
    data: { status, error: error?.slice(0, 4000), finishedAt: new Date() },
  });
}

export async function addRunUsage(runId: string, usage: Anthropic.Usage) {
  await prisma.agentRun.update({
    where: { id: runId },
    data: {
      inputTokens: { increment: usage.input_tokens },
      outputTokens: { increment: usage.output_tokens },
    },
  });
}

export function createTask(opts: {
  runId: string;
  agentId: string;
  task: string;
  parentTaskId?: string;
}) {
  return prisma.agentTask.create({
    data: {
      agentRunId: opts.runId,
      agentId: opts.agentId,
      parentTaskId: opts.parentTaskId ?? null,
      input: { task: opts.task },
    },
  });
}

export function completeTask(taskId: string, output: string) {
  return prisma.agentTask.update({
    where: { id: taskId },
    data: {
      status: "SUCCEEDED",
      output: { text: output.slice(0, 50000) },
      finishedAt: new Date(),
    },
  });
}

export function failTask(taskId: string, error: string) {
  return prisma.agentTask.update({
    where: { id: taskId },
    data: {
      status: "FAILED",
      output: { error: error.slice(0, 4000) },
      finishedAt: new Date(),
    },
  });
}

export async function addTaskUsage(taskId: string, usage: Anthropic.Usage) {
  await prisma.agentTask.update({
    where: { id: taskId },
    data: {
      inputTokens: { increment: usage.input_tokens },
      outputTokens: { increment: usage.output_tokens },
    },
  });
}
