# Raalhu AI — Data Model

All Raalhu tables are prefixed `raalhu_` (Prisma `@@map`) and live in
`prisma/schema/raalhu.prisma`, alongside the shared NextAuth models
(`base.prisma`). `Organization` is the tenancy boundary — every domain row
hangs off it and every query filters by `organizationId`.

```mermaid
erDiagram
    User ||--o{ Membership : "joins orgs via"
    Organization ||--o{ Membership : has
    Organization ||--|| BusinessProfile : has
    Organization ||--o{ Conversation : has
    Organization ||--o{ AgentRun : has
    Organization ||--o{ Campaign : has
    Organization ||--o{ ContentItem : has
    Organization ||--o{ Contact : has
    Organization ||--o{ RaalhuNotification : has
    Organization ||--o{ AuditLog : has
    Organization ||--o{ ApiKey : has
    Organization ||--o{ SocialAccount : has
    Organization ||--|| AutopilotSettings : has
    Conversation ||--o{ ChatMessage : contains
    Conversation ||--o{ AgentRun : triggers
    AgentRun ||--o{ AgentTask : "delegations"
    AgentTask ||--o{ AgentTask : "parentTaskId (tree)"
    Campaign ||--o{ ContentItem : contains
    Contact ||--o{ ContactActivity : "timeline"

    Membership {
        enum role "OWNER ADMIN MEMBER VIEWER"
    }
    BusinessProfile {
        string brandVoice
        string targetAudience
        json goals
    }
    ChatMessage {
        enum role "USER ASSISTANT SYSTEM TOOL"
        json content "content blocks"
    }
    AgentRun {
        enum status "RUNNING SUCCEEDED FAILED CANCELLED"
        string rootAgentId
        int inputTokens
        int outputTokens
    }
    AgentTask {
        string agentId "registry key"
        json input
        json output
    }
    Campaign {
        enum status "DRAFT ACTIVE PAUSED COMPLETED ARCHIVED"
        string[] channels
        boolean createdByAgent
    }
    ContentItem {
        enum contentType "SOCIAL_POST BLOG_POST EMAIL AD_COPY SCRIPT OTHER"
        enum status "IDEA DRAFT REVIEW APPROVED SCHEDULED PUBLISHED"
        datetime scheduledAt "calendar index"
        enum imageStatus "NONE PENDING READY FAILED"
        enum videoStatus "NONE PENDING READY FAILED"
        enum publishStatus "NONE PENDING READY FAILED"
    }
    Contact {
        enum stage "LEAD MQL SQL CUSTOMER CHURNED"
    }
    ContactActivity {
        enum type "NOTE STAGE_CHANGE EMAIL CALL"
        string body
    }
    SocialAccount {
        enum provider "INSTAGRAM TIKTOK"
        string externalAccountId
        string accessToken "encrypted"
    }
    AutopilotSettings {
        boolean enabled
        int postsPerDay
        int videosPerDay
        string lastRunStatus "SUCCEEDED FAILED SKIPPED"
    }
```

Notes:

- `createdById` / `triggeredById` / `actorUserId` are plain indexed user-id
  strings, not relations, to minimize churn on the shared `User` model. The
  only Raalhu relation on `User` is `memberships`.
- `ContentItem.@@index([organizationId, scheduledAt])` powers the calendar;
  `Contact.@@unique([organizationId, email])` dedupes CRM contacts per org.
- `ContentItem` image/video fields (`image*`/`video*`, `mediaError`) track
  AI-generated visuals (Higgsfield, `src/lib/higgsfield.ts`). Generation is
  async — jobs start `PENDING` and are moved to `READY`/`FAILED` either by a
  short bounded poll at request time or by the client polling
  `GET /api/raalhu/content/[id]/media-status`. Video is image-to-video only,
  so it requires an existing image on the same item.
- `SocialAccount` is one connected account per provider per org
  (`@@unique([organizationId, provider])`) — `src/lib/meta.ts` (Instagram
  Graph API) and `src/lib/tiktok.ts` (Content Posting API) handle OAuth and
  publishing; `src/modules/raalhu/lib/social.ts` dispatches by matching a
  `ContentItem.channel` string (contains "instagram"/"tiktok") to a connected
  provider. Instagram publishes an existing image or video; TikTok publishes
  video only. Tokens are AES-256-GCM encrypted (`src/lib/crypto.ts`) and never
  selected into API responses. `ContentItem.publishStatus`/`publishJobId`
  track TikTok's async publish job the same way image/video generation is
  tracked — polled via the same media-status endpoint.
- `ContactActivity.@@index([contactId, createdAt])` powers the CRM timeline;
  stage changes on a `Contact` are auto-logged as a `STAGE_CHANGE` activity.
- `AutopilotSettings` (`src/modules/raalhu/lib/autopilot.ts`) is opt-in
  daily automation, disabled by default. Vercel Cron hits
  `GET /api/cron/autopilot` once a day (`vercel.json`, secured by
  `CRON_SECRET` — deliberately outside `/api/raalhu/*`, since that prefix's
  proxy guard requires a browser session a cron job doesn't have). It runs
  the normal master-agent orchestration (`startRun`) as the org's OWNER
  member, with an instruction to draft the configured post/video count and
  save everything as `DRAFT` — it never calls the publish tools itself.
- Migrations live in `prisma/schema/migrations/` (`init_baseline` = base
  schema, `raalhu_multitenant` = core Raalhu models, `remove_skillpips` =
  dropped the pre-existing SkillPips tables/columns, `raalhu_crm_depth` =
  `ContactActivity`).
