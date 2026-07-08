# Raalhu AI — Architecture

Raalhu AI is an autonomous marketing platform that lives **alongside SkillPips**
in this repository. Both products share one Next.js 16 app, one Postgres
database, and one NextAuth user pool — but are otherwise fully isolated.

## Two apps, one repo

| Concern      | SkillPips                        | Raalhu AI                              |
| ------------ | -------------------------------- | -------------------------------------- |
| URL space    | `/`, `/dashboard`, `/admin`, …   | `/raalhu`, `/raalhu/dashboard`, …      |
| API routes   | `/api/{auth,stripe,signals}`     | `/api/raalhu/*`                        |
| Components   | `src/components/{sections,…}`    | `src/components/raalhu/*`              |
| Domain code  | (inline in routes)               | `src/modules/raalhu/*`                 |
| DB tables    | unprefixed                       | `raalhu_*` (via Prisma `@@map`)        |
| Theme        | global `globals.css`             | `.raalhu`-scoped `raalhu.css`          |

**Isolation rules**

1. Raalhu code never imports from `src/components/{sections,layout,dashboard,admin}`
   (keeps three.js/gsap chunks out of Raalhu bundles, and vice versa).
2. Every selector in `src/app/raalhu/raalhu.css` starts with `.raalhu` —
   nested-layout CSS is bundled globally in Next.js, so unscoped selectors
   would leak into SkillPips.
3. Shared files are limited to: `src/lib/{prisma,auth,utils}.ts`, the Prisma
   schema, `package.json`, and `src/proxy.ts` (whose matcher is Raalhu-only).

## Theming

The root layout (`src/app/layout.tsx`, owned by SkillPips) already loads Inter
as `--font-inter`. Raalhu's nested layout (`src/app/raalhu/layout.tsx`) wraps
its subtree in `<div class="raalhu dark …">` and `raalhu.css` re-declares the
same HSL CSS-variable contract consumed by `tailwind.config.js`
(`--background`, `--primary`, `--card`, `--chart-*`, …). All token utilities
(`bg-background`, `text-primary`, …) therefore resolve to Raalhu's
ocean palette (accent `#1EA7FF` = `hsl(203 100% 56%)`) inside `/raalhu/*`
without touching SkillPips' theme.

Components that render through Radix **portals** (dialog, dropdown, tooltip)
mount outside the subtree, so their content re-applies the `raalhu` class.

## Design system

Hand-rolled shadcn-style primitives in `src/components/raalhu/ui/` built on
the already-installed Radix primitives + CVA + `cn()` (`src/lib/utils.ts`).
No shadcn CLI — it would rewrite shared theme files. Raalhu-specific utility
classes are prefixed `r-` (`r-glass`, `r-glow`, `r-gradient-text`).

## Layers (Phases 1–4)

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

## Multi-tenancy

Every Raalhu domain row hangs off an `Organization`. Users join orgs through
`Membership` (OWNER / ADMIN / MEMBER / VIEWER). The active org id travels in
the NextAuth JWT (`raalhuOrgId`) as a *hint*; `requireRaalhuContext()`
re-verifies membership in the database on every server-side use. All queries
go through `src/modules/raalhu/db/queries.ts` and filter by `organizationId`.

## Multi-agent AI (Phase 4)

Hierarchy: **Master Agent → Marketing Manager → specialists** (research, SEO,
content, social, email, analytics — the registry scales to more). Delegation
is enforced structurally: each agent's `delegate_to_agent` tool only accepts
its `children` as an enum. The orchestrator is a manual Claude tool-use loop
(`@anthropic-ai/sdk`, streaming); depth-0 text streams to the browser over SSE
from `POST /api/raalhu/chat`. Runs and per-agent tasks are persisted
(`AgentRun` / `AgentTask`) with token usage for the runs drawer and audit.

See `docs/raalhu/agents.md` for agent details and `docs/raalhu/data-model.md`
for the schema ERD.
