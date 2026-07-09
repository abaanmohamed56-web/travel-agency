# Raalhu AI — Architecture

## Layout

```
src/app/raalhu/               routes (landing, onboarding, dashboard/*)
src/app/api/raalhu/           route handlers (chat SSE, organizations, …)
src/components/raalhu/        ui/ landing/ dashboard/ chat/
src/modules/raalhu/
  agents/                     multi-agent core (registry, orchestrator, stream)
  auth/context.ts             requireRaalhuContext() — session + org + membership
  db/queries.ts               org-scoped Prisma helpers
  lib/                        rate limiting, zod validation
```

`/` redirects to `/raalhu`. `src/proxy.ts` guards
`/raalhu/dashboard`, `/raalhu/onboarding`, and `/api/raalhu/*`.

## Theming

The root layout (`src/app/layout.tsx`) loads Inter as `--font-inter`. Raalhu's
nested layout (`src/app/raalhu/layout.tsx`) wraps its subtree in
`<div class="raalhu dark …">` and `raalhu.css` declares the HSL CSS-variable
contract consumed by `tailwind.config.js` (`--background`, `--primary`,
`--card`, `--chart-*`, …). All token utilities (`bg-background`,
`text-primary`, …) resolve to the ocean palette (accent `#1EA7FF` =
`hsl(203 100% 56%)`).

Components that render through Radix **portals** (dialog, dropdown, tooltip)
mount outside the subtree, so their content re-applies the `raalhu` class.

⚠️ Nested-layout CSS bundles globally in Next.js — every selector in
`raalhu.css` must start with `.raalhu`.

## Design system

Hand-rolled shadcn-style primitives in `src/components/raalhu/ui/` built on
Radix primitives + CVA + `cn()` (`src/lib/utils.ts`). No shadcn CLI — it would
rewrite shared theme files. Raalhu-specific utility classes are prefixed `r-`
(`r-glass`, `r-glow`, `r-gradient-text`).

## Multi-tenancy

Every Raalhu domain row hangs off an `Organization`. Users join orgs through
`Membership` (OWNER / ADMIN / MEMBER / VIEWER). The active org id travels in
the NextAuth JWT (`raalhuOrgId`) as a *hint*; `requireRaalhuContext()`
re-verifies membership in the database on every server-side use. All queries
go through `src/modules/raalhu/db/queries.ts` and filter by `organizationId`.

## Multi-agent AI

Hierarchy: **Master Agent → Marketing Manager → specialists** (research, SEO,
content, social, email, analytics — the registry scales to more). Delegation
is enforced structurally: each agent's `delegate_to_agent` tool only accepts
its `children` as an enum. The orchestrator is a manual Claude tool-use loop
(`@anthropic-ai/sdk`, streaming); depth-0 text streams to the browser over SSE
from `POST /api/raalhu/chat`. Runs and per-agent tasks are persisted
(`AgentRun` / `AgentTask`) with token usage for the runs drawer and audit.

See `docs/raalhu/agents.md` for agent details and `docs/raalhu/data-model.md`
for the schema ERD.
