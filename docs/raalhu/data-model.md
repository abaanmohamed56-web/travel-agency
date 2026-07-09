# Raalhu AI — Data Model

All Raalhu tables are prefixed `raalhu_` (Prisma `@@map`) and live in
`prisma/schema/raalhu.prisma`, alongside the shared NextAuth models
(`base.prisma`) and SkillPips models (`skillpips.prisma`). `Organization` is
the tenancy boundary — every domain row hangs off it and every query filters
by `organizationId`.

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
    Conversation ||--o{ ChatMessage : contains
    Conversation ||--o{ AgentRun : triggers
    AgentRun ||--o{ AgentTask : "delegations"
    AgentTask ||--o{ AgentTask : "parentTaskId (tree)"
    Campaign ||--o{ ContentItem : contains

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
    }
    Contact {
        enum stage "LEAD MQL SQL CUSTOMER CHURNED"
    }
```

Notes:

- `createdById` / `triggeredById` / `actorUserId` are plain indexed user-id
  strings, not relations, to minimize churn on the shared `User` model. The
  only Raalhu relation on `User` is `memberships`.
- `ContentItem.@@index([organizationId, scheduledAt])` powers the calendar;
  `Contact.@@unique([organizationId, email])` dedupes CRM contacts per org.
- `RaalhuNotification` is named to avoid colliding with SkillPips'
  `Notification` model.
- Migrations live in `prisma/schema/migrations/` (`init_baseline` = pre-Raalhu
  tables, `raalhu_multitenant` = everything here).
