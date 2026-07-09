import type Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { AGENTS } from "./definitions";
import type { AgentContext, AgentDefinition, DomainToolName } from "./types";

export const DELEGATE_TOOL = "delegate_to_agent";

/**
 * Builds the delegate tool for one agent. The `agent_id` enum is generated
 * from the agent's children, which is what makes the hierarchy structural
 * rather than prompt-enforced.
 */
export function buildDelegateTool(agent: AgentDefinition): Anthropic.Tool {
  const roster = agent.children
    .map((id) => `- ${id}: ${AGENTS[id].description}`)
    .join("\n");
  return {
    name: DELEGATE_TOOL,
    description: `Delegate a focused subtask to a member of your team. The delegate cannot see this conversation — the task text must be fully self-contained. Your team:\n${roster}`,
    input_schema: {
      type: "object",
      properties: {
        agent_id: {
          type: "string",
          enum: agent.children,
          description: "Which team member to delegate to.",
        },
        task: {
          type: "string",
          description:
            "The complete, self-contained brief for the delegate, including all context they need.",
        },
      },
      required: ["agent_id", "task"],
      additionalProperties: false,
    },
  };
}

const DOMAIN_TOOLS: Record<DomainToolName, Anthropic.Tool> = {
  get_business_profile: {
    name: "get_business_profile",
    description:
      "Fetch the full saved business profile for this workspace (name, industry, description, audience, brand voice, goals, links).",
    input_schema: { type: "object", properties: {}, additionalProperties: false },
  },
  list_campaigns: {
    name: "list_campaigns",
    description:
      "List the workspace's existing marketing campaigns with status, channels, and objectives.",
    input_schema: { type: "object", properties: {}, additionalProperties: false },
  },
  save_campaign_draft: {
    name: "save_campaign_draft",
    description:
      "Save a new campaign draft to the workspace so the user can review it on the Campaigns page. Returns the campaign id — pass it as campaignId when saving that campaign's content items.",
    input_schema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Campaign name." },
        objective: {
          type: "string",
          description: "What the campaign is trying to achieve and how.",
        },
        channels: {
          type: "array",
          items: { type: "string" },
          description:
            "Channels, lowercase (e.g. instagram, facebook, tiktok, email, blog).",
        },
        brief: {
          type: "object",
          description:
            "Free-form structured brief: angle, offer, audience, key messages.",
        },
      },
      required: ["name", "objective", "channels"],
      additionalProperties: false,
    },
  },
  save_content_items: {
    name: "save_content_items",
    description:
      "Save drafted content items to the workspace content calendar. Use ISO 8601 datetimes for scheduledAt, spread sensibly over the coming weeks.",
    input_schema: {
      type: "object",
      properties: {
        campaignId: {
          type: "string",
          description:
            "Optional id of the campaign these items belong to (from save_campaign_draft or list_campaigns).",
        },
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              body: {
                type: "string",
                description: "The full copy: caption, email body, or outline.",
              },
              contentType: {
                type: "string",
                enum: ["SOCIAL_POST", "BLOG_POST", "EMAIL", "AD_COPY", "SCRIPT", "OTHER"],
              },
              channel: {
                type: "string",
                description: "e.g. instagram, tiktok, facebook, email, blog.",
              },
              scheduledAt: {
                type: "string",
                description: "ISO 8601 datetime for when this should go out.",
              },
            },
            required: ["title", "contentType"],
            additionalProperties: false,
          },
        },
      },
      required: ["items"],
      additionalProperties: false,
    },
  },
};

export function buildTools(
  agent: AgentDefinition,
  depth: number,
  maxDepth: number
): Anthropic.Tool[] {
  const tools = agent.tools.map((name) => DOMAIN_TOOLS[name]);
  if (agent.children.length > 0 && depth < maxDepth) {
    tools.push(buildDelegateTool(agent));
  }
  return tools;
}

const saveCampaignInput = z.object({
  name: z.string().min(1).max(200),
  objective: z.string().min(1).max(4000),
  channels: z.array(z.string().min(1).max(40)).max(12),
  brief: z.record(z.string(), z.unknown()).optional(),
});

const saveContentInput = z.object({
  campaignId: z.string().optional(),
  items: z
    .array(
      z.object({
        title: z.string().min(1).max(300),
        body: z.string().max(20000).optional(),
        contentType: z.enum([
          "SOCIAL_POST",
          "BLOG_POST",
          "EMAIL",
          "AD_COPY",
          "SCRIPT",
          "OTHER",
        ]),
        channel: z.string().max(40).optional(),
        scheduledAt: z.string().optional(),
      })
    )
    .min(1)
    .max(40),
});

/** Executes an org-scoped domain tool. Returns the string fed back to the model. */
export async function executeDomainTool(
  name: string,
  input: unknown,
  ctx: AgentContext,
  agentId: string
): Promise<string> {
  switch (name as DomainToolName) {
    case "get_business_profile": {
      const profile = await prisma.businessProfile.findUnique({
        where: { organizationId: ctx.org.id },
      });
      if (!profile) return "No business profile has been set up yet.";
      return JSON.stringify(profile, null, 2);
    }

    case "list_campaigns": {
      const campaigns = await prisma.campaign.findMany({
        where: { organizationId: ctx.org.id },
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          name: true,
          status: true,
          objective: true,
          channels: true,
          startDate: true,
          endDate: true,
        },
      });
      if (campaigns.length === 0) return "No campaigns exist yet.";
      return JSON.stringify(campaigns, null, 2);
    }

    case "save_campaign_draft": {
      const data = saveCampaignInput.parse(input);
      const campaign = await prisma.campaign.create({
        data: {
          organizationId: ctx.org.id,
          createdById: ctx.userId,
          name: data.name,
          objective: data.objective,
          channels: data.channels.map((c) => c.toLowerCase()),
          brief: (data.brief ?? {}) as object,
          status: "DRAFT",
          createdByAgent: true,
        },
      });
      await prisma.auditLog.create({
        data: {
          organizationId: ctx.org.id,
          actorUserId: ctx.userId,
          actorAgentId: agentId,
          action: "campaign.created_by_agent",
          targetType: "Campaign",
          targetId: campaign.id,
          metadata: { runId: ctx.runId, name: data.name },
        },
      });
      return `Saved campaign draft "${data.name}" with id ${campaign.id}. The user can review it on the Campaigns page.`;
    }

    case "save_content_items": {
      const data = saveContentInput.parse(input);
      // Only attach to a campaign that belongs to this org.
      let campaignId: string | null = null;
      if (data.campaignId) {
        const campaign = await prisma.campaign.findFirst({
          where: { id: data.campaignId, organizationId: ctx.org.id },
          select: { id: true },
        });
        campaignId = campaign?.id ?? null;
      }
      const created = await prisma.contentItem.createMany({
        data: data.items.map((item) => {
          const scheduledAt = item.scheduledAt
            ? new Date(item.scheduledAt)
            : null;
          return {
            organizationId: ctx.org.id,
            createdById: ctx.userId,
            campaignId,
            title: item.title,
            body: item.body ?? null,
            contentType: item.contentType,
            channel: item.channel?.toLowerCase() ?? null,
            status: "DRAFT" as const,
            scheduledAt:
              scheduledAt && !Number.isNaN(scheduledAt.getTime())
                ? scheduledAt
                : null,
            createdByAgent: true,
          };
        }),
      });
      await prisma.auditLog.create({
        data: {
          organizationId: ctx.org.id,
          actorUserId: ctx.userId,
          actorAgentId: agentId,
          action: "content.created_by_agent",
          targetType: "ContentItem",
          metadata: { runId: ctx.runId, count: created.count },
        },
      });
      return `Saved ${created.count} content item(s) to the workspace calendar as drafts.`;
    }

    default:
      return `Error: unknown tool "${name}".`;
  }
}
