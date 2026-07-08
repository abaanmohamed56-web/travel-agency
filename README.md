# Two apps, one repo

This repository hosts **two products** in a single Next.js 16 application:

| App | What it is | URL space |
| --- | --- | --- |
| **SkillPips** | Forex education & trading-signals SaaS | `/`, `/dashboard`, `/admin` |
| **Raalhu AI** | Autonomous AI marketing platform | `/raalhu`, `/raalhu/dashboard` |

They share one Postgres database (Raalhu tables are prefixed `raalhu_`), one
NextAuth user pool, and the design-token contract in `tailwind.config.js` —
and are otherwise isolated. See `docs/raalhu/architecture.md` for the rules
that keep them from stepping on each other.

## Getting started

```bash
npm install
cp .env.example .env         # fill in at least DATABASE_URL and NEXTAUTH_SECRET

# local database (Postgres 16 via Docker)
docker compose up -d db
npx prisma migrate dev       # apply migrations
npm run db:seed:raalhu       # optional: demo Raalhu org + data

npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for SkillPips or
[http://localhost:3000/raalhu](http://localhost:3000/raalhu) for Raalhu AI.

## Environment variables

`.env.example` documents every variable and which app owns it. Highlights:

- `DATABASE_URL` — runtime connection (Supabase transaction pooler is fine).
- `DIRECT_URL` — non-pooled connection for `prisma migrate` (Supabase port 5432).
- `ANTHROPIC_API_KEY` — powers Raalhu's agent team; optional in dev
  (the UI degrades gracefully with a setup banner).
- `STRIPE_*` — SkillPips billing only.

## Useful commands

```bash
npm run dev            # dev server (Turbopack)
npm run build          # prisma generate + production build
npx tsc --noEmit       # typecheck
npx prisma studio      # browse the database
npm run db:seed:raalhu # seed demo Raalhu workspace
```

## Documentation

- `docs/raalhu/architecture.md` — Raalhu system design and isolation rules
- `docs/raalhu/data-model.md` — multi-tenant schema ERD
- `docs/raalhu/agents.md` — agent hierarchy and how to add a specialist
- `AGENTS.md` — read this before writing Next.js code (Next 16 conventions
  live in `node_modules/next/dist/docs/`)
