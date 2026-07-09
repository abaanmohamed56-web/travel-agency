# Raalhu AI

Raalhu AI is an autonomous AI marketing platform — a team of specialist agents
(research, SEO, content, social, email, analytics, and more) that research,
strategize, create, publish, and optimize growth for a business, orchestrated
through one command center.

## Getting started

```bash
npm install
cp .env.example .env         # fill in at least DATABASE_URL and NEXTAUTH_SECRET

# local database (Postgres 16 via Docker)
docker compose up -d db
npx prisma migrate dev       # apply migrations
npm run db:seed:raalhu       # optional: demo org + data

npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to
[http://localhost:3000/raalhu](http://localhost:3000/raalhu).

## Environment variables

`.env.example` documents every variable. Highlights:

- `DATABASE_URL` — runtime connection. On serverless platforms (Vercel), use
  Supabase's **session pooler** (port 5432, `postgres.<project-ref>` user) —
  the direct host is IPv6-only and unreachable from most serverless egress.
- `DIRECT_URL` — non-pooled connection for `prisma migrate` (Supabase port 5432).
- `ANTHROPIC_API_KEY` — powers the agent team; optional in dev (the UI
  degrades gracefully with a setup banner).
- `HF_CREDENTIALS` — powers AI image/video generation (Higgsfield, format
  `KEY_ID:KEY_SECRET`); optional — without it, generate buttons are hidden
  and the agent team skips visuals.
- `META_APP_ID` / `META_APP_SECRET` — Instagram publishing (Meta Graph API).
  Requires a Meta Developer app and, for public posting, App Review.
- `TIKTOK_CLIENT_KEY` / `TIKTOK_CLIENT_SECRET` — TikTok publishing (Content
  Posting API, video only). Unaudited apps can only post `SELF_ONLY`.
- `SOCIAL_TOKEN_ENCRYPTION_KEY` — any string; encrypts stored Instagram/TikTok
  OAuth tokens at rest.

## Useful commands

```bash
npm run dev            # dev server (Turbopack)
npm run build          # prisma generate + production build
npx tsc --noEmit       # typecheck
npx prisma studio      # browse the database
npm run db:seed:raalhu # seed demo workspace
```

## Documentation

- `docs/raalhu/architecture.md` — system design
- `docs/raalhu/data-model.md` — schema ERD
- `docs/raalhu/agents.md` — agent hierarchy and how to add a specialist
- `AGENTS.md` — read this before writing Next.js code (Next 16 conventions
  live in `node_modules/next/dist/docs/`)
