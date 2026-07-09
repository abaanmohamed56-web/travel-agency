# Raalhu AI — Agent System

## Hierarchy

```
Master Agent (user-facing)
└── Marketing Manager
    ├── Research Agent
    ├── SEO Agent
    ├── Content Writer
    ├── Social Media Agent
    ├── Email Agent
    └── Analytics Agent
```

Delegation is **structural, not prompt-enforced**: each agent gets a
`delegate_to_agent` tool whose `agent_id` input schema is an enum generated
from its `children` array (`src/modules/raalhu/agents/tools.ts`). The Master
Agent physically cannot call a specialist directly, and specialists cannot
delegate at all. Depth is capped by `RAALHU_MAX_AGENT_DEPTH` (default 2) and
each agent's loop by `MAX_ITERATIONS` (8).

## How a run works

1. `POST /api/raalhu/chat` (SSE) authenticates, checks the org rate limit
   (10 runs / 10 min), and calls `startRun()` (`agents/run.ts`).
2. `startRun` persists the user message, creates an `AgentRun` row, loads the
   business profile + recent conversation history, and starts the master
   agent's loop.
3. `runAgent()` (`agents/orchestrator.ts`) is a manual Claude tool-use loop
   over `client.messages.stream()`. Depth-0 text deltas stream to the browser;
   `stop_reason === "tool_use"` triggers tool execution, and **all** results
   return in a single user message.
4. Each delegation creates an `AgentTask` row (parent-linked), recurses into
   the child agent with a fresh conversation containing only the task brief,
   and returns the child's final text as the tool result.
5. Domain tools (`get_business_profile`, `list_campaigns`,
   `save_campaign_draft`, `save_content_items`) are org-scoped Prisma
   operations; agent-created artifacts are marked `createdByAgent` and audited
   in `AuditLog`.
6. On completion the assistant reply is persisted (`ChatMessage`) and the run
   marked `SUCCEEDED` with accumulated token usage; failures mark `FAILED`
   with the error, client disconnects mark `CANCELLED`.

## SSE event vocabulary

`text_delta`, `agent_started`, `agent_finished`, `tool_started`,
`tool_finished`, `run_finished`, `error` — defined in `agents/types.ts` and
mirrored client-side in `components/raalhu/chat/useAgentStream.ts`, which
drives the chat text and the agent-activity chips.

## Models

Centralized in `agents/models.ts`: `RAALHU_DEFAULT_MODEL`
(default `claude-sonnet-5`) for orchestrators/specialists,
`RAALHU_FAST_MODEL` (default `claude-haiku-4-5`) for cheap subtasks
(currently the Analytics Agent). Sonnet 5 notes honored by the orchestrator:
no sampling params or `budget_tokens` (they 400), adaptive thinking is the
default, `output_config.effort` is sent only to effort-capable models, and
requests always stream.

## Failure modes

- **No `ANTHROPIC_API_KEY`**: the chat route returns a structured
  `ai_not_configured` SSE event; the UI shows a setup banner and disables the
  composer. Nothing crashes.
- **Invalid key / provider errors**: run marked `FAILED`, sanitized message
  surfaced to the UI.
- **Rate limit**: HTTP 429 with `Retry-After`; the UI shows a friendly toast.
- **Hard cap**: every run is aborted after 5 minutes via `AbortSignal`.

## Adding a specialist

1. Add a definition in `agents/definitions.ts` (id, description — parents use
   it to decide when to delegate — model tier, prompt, tools, children).
2. Add its id to the parent's `children` array (usually `marketing-manager`).
3. If it needs a new capability, add a `DomainToolName`, its schema, and its
   executor in `agents/tools.ts` (always filter by `ctx.org.id`).
4. Add the display name/icon in `CommandCenterChat.tsx` (`AGENT_META`) and
   `RunsHistory.tsx` (`AGENT_LABEL`).
