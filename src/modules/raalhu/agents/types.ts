import type { BusinessProfile, Organization } from "@prisma/client";

export type DomainToolName =
  | "get_business_profile"
  | "list_campaigns"
  | "save_campaign_draft"
  | "save_content_items"
  | "generate_content_image"
  | "generate_content_video";

export interface AgentContext {
  org: Organization;
  profile: BusinessProfile | null;
  userId: string;
  runId: string;
}

export interface AgentDefinition {
  id: string;
  name: string;
  /** Shown to parent agents so they know when to delegate here. */
  description: string;
  model: "default" | "fast";
  systemPrompt: (ctx: AgentContext) => string;
  /** Org-scoped domain tools this agent may call. */
  tools: DomainToolName[];
  /** Agents this one may delegate to (drives the delegate tool's enum). */
  children: string[];
}

/** Events streamed to the browser over SSE (mirrored in useAgentStream.ts). */
export type AgentEvent =
  | { type: "text_delta"; text: string }
  | { type: "agent_started"; agentId: string; task?: string }
  | { type: "agent_finished"; agentId: string }
  | { type: "tool_started"; agentId: string; tool: string }
  | { type: "tool_finished"; agentId: string; tool: string }
  | { type: "run_finished"; runId?: string; conversationId?: string }
  | { type: "error"; code?: string; message: string };

export type EmitFn = (event: AgentEvent) => void;
