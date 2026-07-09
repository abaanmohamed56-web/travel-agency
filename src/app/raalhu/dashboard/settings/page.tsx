import { KeyRound } from "lucide-react";
import { hasRole, requireRaalhuContext } from "@/modules/raalhu/auth/context";
import {
  getBusinessProfile,
  listMembers,
} from "@/modules/raalhu/db/queries";
import { prisma } from "@/lib/prisma";
import { isMetaConfigured } from "@/lib/meta";
import { isTiktokConfigured } from "@/lib/tiktok";
import { listConnectedAccounts } from "@/modules/raalhu/lib/social";
import { getAutopilotSettings } from "@/modules/raalhu/lib/autopilot";
import { PageHeader } from "@/components/raalhu/dashboard/PageHeader";
import { Avatar } from "@/components/raalhu/ui/avatar";
import { Badge } from "@/components/raalhu/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/raalhu/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/raalhu/ui/tabs";
import { EditProfileDialog } from "@/components/raalhu/dashboard/EditProfileDialog";
import { InviteMemberDialog } from "@/components/raalhu/dashboard/InviteMemberDialog";
import { MemberRoleSelect } from "@/components/raalhu/dashboard/MemberRoleSelect";
import { RemoveMemberButton } from "@/components/raalhu/dashboard/RemoveMemberButton";
import { CreateApiKeyDialog } from "@/components/raalhu/dashboard/CreateApiKeyDialog";
import { RevokeApiKeyButton } from "@/components/raalhu/dashboard/RevokeApiKeyButton";
import { ConnectedAccountsCard } from "@/components/raalhu/dashboard/ConnectedAccountsCard";
import { AutopilotSettingsCard } from "@/components/raalhu/dashboard/AutopilotSettingsCard";

export const metadata = { title: "Settings" };

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; connected?: string; error?: string }>;
}) {
  const { org, membership } = await requireRaalhuContext();
  const isAdmin = hasRole(membership, "ADMIN");
  const { tab, connected, error } = await searchParams;
  const [profile, members, apiKeys, socialAccounts, autopilotSettings] = await Promise.all([
    getBusinessProfile(org.id),
    listMembers(org.id),
    prisma.apiKey.findMany({
      where: { organizationId: org.id, revokedAt: null },
      orderBy: { createdAt: "desc" },
    }),
    listConnectedAccounts(org.id),
    getAutopilotSettings(org.id),
  ]);
  const aiConfigured = Boolean(process.env.ANTHROPIC_API_KEY);

  const profileRows: [string, string | null][] = [
    ["Business name", profile?.businessName ?? org.name],
    ["Industry", profile?.industry ?? null],
    ["Description", profile?.description ?? null],
    ["Target audience", profile?.targetAudience ?? null],
    ["Brand voice", profile?.brandVoice ?? null],
    ["Website", profile?.websiteUrl ?? null],
  ];

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <PageHeader
        title="Settings"
        description={`Workspace configuration for ${org.name}.`}
      />

      <Tabs
        defaultValue={
          tab === "social" || tab === "autopilot" || tab === "team" || tab === "api-keys"
            ? tab
            : "profile"
        }
      >
        <TabsList>
          <TabsTrigger value="profile">Business profile</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="api-keys">API keys</TabsTrigger>
          <TabsTrigger value="social">Connected accounts</TabsTrigger>
          <TabsTrigger value="autopilot">Autopilot</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card variant="glass">
            <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
              <CardTitle className="text-base">
                What your AI team knows
              </CardTitle>
              {isAdmin && (
                <EditProfileDialog
                  profile={{
                    businessName: profile?.businessName ?? org.name,
                    industry: profile?.industry ?? "",
                    description: profile?.description ?? "",
                    targetAudience: profile?.targetAudience ?? "",
                    brandVoice: profile?.brandVoice ?? "",
                    websiteUrl: profile?.websiteUrl ?? "",
                    goals: Array.isArray(profile?.goals)
                      ? (profile.goals as string[])
                      : [],
                  }}
                />
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {profileRows.map(([label, value]) => (
                <div key={label} className="grid gap-1 sm:grid-cols-[180px_1fr]">
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-sm leading-relaxed">
                    {value ?? <span className="text-muted-foreground">Not set</span>}
                  </p>
                </div>
              ))}
              {Array.isArray(profile?.goals) && profile.goals.length > 0 && (
                <div className="grid gap-1 sm:grid-cols-[180px_1fr]">
                  <p className="text-sm text-muted-foreground">Goals</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(profile.goals as string[]).map((g) => (
                      <Badge key={g} variant="outline">{g}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card variant="glass">
            <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
              <CardTitle className="text-base">
                Members ({members.length})
              </CardTitle>
              {isAdmin && <InviteMemberDialog />}
            </CardHeader>
            <CardContent className="space-y-4">
              {members.map((m) => (
                <div key={m.id} className="flex items-center gap-3">
                  <Avatar name={m.user.name} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {m.user.name ?? "Unnamed"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {m.user.email}
                    </p>
                  </div>
                  {m.role === "OWNER" ? (
                    <Badge>owner</Badge>
                  ) : isAdmin ? (
                    <div className="flex items-center gap-1">
                      <MemberRoleSelect membershipId={m.id} role={m.role} />
                      <RemoveMemberButton membershipId={m.id} />
                    </div>
                  ) : (
                    <Badge variant="secondary">{m.role.toLowerCase()}</Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api-keys">
          <Card variant="glass">
            <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
              <CardTitle className="text-base">API keys</CardTitle>
              {isAdmin && <CreateApiKeyDialog />}
            </CardHeader>
            <CardContent>
              {apiKeys.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <KeyRound className="size-7 text-primary" />
                  <p className="max-w-sm text-sm text-muted-foreground">
                    Programmatic access to your workspace. Create a key to get
                    started.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {apiKeys.map((k) => (
                    <div
                      key={k.id}
                      className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium">{k.name}</p>
                        <p className="font-mono text-xs text-muted-foreground">
                          ••••{k.lastFour}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-xs text-muted-foreground">
                          {k.lastUsedAt
                            ? `last used ${k.lastUsedAt.toLocaleDateString()}`
                            : "never used"}
                        </p>
                        {isAdmin && <RevokeApiKeyButton apiKeyId={k.id} />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <ConnectedAccountsCard
            accounts={socialAccounts}
            isAdmin={isAdmin}
            connected={connected}
            error={error}
            configured={{ INSTAGRAM: isMetaConfigured(), TIKTOK: isTiktokConfigured() }}
          />
        </TabsContent>

        <TabsContent value="autopilot">
          <AutopilotSettingsCard
            isAdmin={isAdmin}
            aiConfigured={aiConfigured}
            initial={{
              enabled: autopilotSettings?.enabled ?? false,
              postsPerDay: autopilotSettings?.postsPerDay ?? 2,
              videosPerDay: autopilotSettings?.videosPerDay ?? 1,
              channels: autopilotSettings?.channels ?? [],
              lastRunAt: autopilotSettings?.lastRunAt?.toISOString() ?? null,
              lastRunStatus: autopilotSettings?.lastRunStatus ?? null,
              lastRunError: autopilotSettings?.lastRunError ?? null,
            }}
          />
        </TabsContent>
      </Tabs>
    </main>
  );
}
