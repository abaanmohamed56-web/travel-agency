import { prisma } from "@/lib/prisma";
import { startRun } from "@/modules/raalhu/agents/run";
import type { RaalhuContext } from "@/modules/raalhu/auth/context";

export interface AutopilotConfig {
  enabled: boolean;
  postsPerDay: number;
  videosPerDay: number;
  channels: string[];
}

export async function getAutopilotSettings(organizationId: string) {
  return prisma.autopilotSettings.findUnique({ where: { organizationId } });
}

export async function upsertAutopilotSettings(organizationId: string, config: AutopilotConfig) {
  return prisma.autopilotSettings.upsert({
    where: { organizationId },
    create: { organizationId, ...config },
    update: config,
  });
}

function buildInstruction(config: AutopilotConfig): string {
  const channelNote = config.channels.length
    ? ` across our active channels (${config.channels.join(", ")})`
    : " across our active channels";
  return `Autopilot: generate today's content batch — ${config.postsPerDay} social post(s) and ${config.videosPerDay} short video(s)${channelNote}. Save everything as DRAFT on the calendar for a human to review — do not publish anything. If image or video generation tools are available to you, generate real visuals for each item; otherwise skip visuals and note that in your summary.`;
}

export interface AutopilotRunResult {
  status: "SUCCEEDED" | "FAILED" | "SKIPPED";
  error?: string;
}

const RUN_TIMEOUT_MS = 4 * 60 * 1000;

/** Runs one autopilot batch for an org and records the outcome. Never throws. */
export async function runAutopilotForOrg(organizationId: string): Promise<AutopilotRunResult> {
  const settings = await prisma.autopilotSettings.findUnique({ where: { organizationId } });
  if (!settings?.enabled) {
    return { status: "SKIPPED", error: "Autopilot is not enabled for this workspace." };
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    await recordRun(organizationId, "SKIPPED", "ANTHROPIC_API_KEY not configured.");
    return { status: "SKIPPED", error: "ANTHROPIC_API_KEY not configured." };
  }

  const org = await prisma.organization.findUnique({ where: { id: organizationId } });
  if (!org) return { status: "FAILED", error: "Organization not found." };

  const membership =
    (await prisma.membership.findFirst({ where: { organizationId, role: "OWNER" } })) ??
    (await prisma.membership.findFirst({ where: { organizationId }, orderBy: { createdAt: "asc" } }));
  if (!membership) {
    await recordRun(organizationId, "FAILED", "No workspace member to run as.");
    return { status: "FAILED", error: "No workspace member to run as." };
  }

  const context: RaalhuContext = {
    user: { id: membership.userId },
    org,
    membership,
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), RUN_TIMEOUT_MS);

  try {
    await startRun({
      raalhu: context,
      message: buildInstruction(settings),
      emit: () => {},
      signal: controller.signal,
    });
    await prisma.raalhuNotification.create({
      data: {
        organizationId,
        title: "Autopilot ran today's content batch",
        body: `Draft ${settings.postsPerDay} post(s) and ${settings.videosPerDay} video(s) are ready to review on the Content Calendar.`,
        type: "info",
      },
    });
    await recordRun(organizationId, "SUCCEEDED");
    return { status: "SUCCEEDED" };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await recordRun(organizationId, "FAILED", message);
    return { status: "FAILED", error: message };
  } finally {
    clearTimeout(timeout);
  }
}

async function recordRun(organizationId: string, status: string, error?: string) {
  await prisma.autopilotSettings.update({
    where: { organizationId },
    data: { lastRunAt: new Date(), lastRunStatus: status, lastRunError: error ?? null },
  });
}

export async function runAutopilotForAllEnabledOrgs(): Promise<
  { organizationId: string; result: AutopilotRunResult }[]
> {
  const enabled = await prisma.autopilotSettings.findMany({
    where: { enabled: true },
    select: { organizationId: true },
  });
  const results: { organizationId: string; result: AutopilotRunResult }[] = [];
  for (const { organizationId } of enabled) {
    const result = await runAutopilotForOrg(organizationId);
    results.push({ organizationId, result });
  }
  return results;
}
