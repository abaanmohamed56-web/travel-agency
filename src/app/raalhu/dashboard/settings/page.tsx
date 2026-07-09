import { KeyRound } from "lucide-react";
import { requireRaalhuContext } from "@/modules/raalhu/auth/context";
import {
  getBusinessProfile,
  listMembers,
} from "@/modules/raalhu/db/queries";
import { prisma } from "@/lib/prisma";
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

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const { org } = await requireRaalhuContext();
  const [profile, members, apiKeys] = await Promise.all([
    getBusinessProfile(org.id),
    listMembers(org.id),
    prisma.apiKey.findMany({
      where: { organizationId: org.id, revokedAt: null },
      orderBy: { createdAt: "desc" },
    }),
  ]);

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

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Business profile</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="api-keys">API keys</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="text-base">
                What your AI team knows
              </CardTitle>
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
              <p className="pt-2 text-xs text-muted-foreground">
                Profile editing lands with the next phase — for now this is set
                during onboarding.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="text-base">
                Members ({members.length})
              </CardTitle>
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
                  <Badge variant="secondary">{m.role.toLowerCase()}</Badge>
                </div>
              ))}
              <p className="pt-2 text-xs text-muted-foreground">
                Invitations arrive with the collaboration phase.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api-keys">
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="text-base">API keys</CardTitle>
            </CardHeader>
            <CardContent>
              {apiKeys.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <KeyRound className="size-7 text-primary" />
                  <p className="max-w-sm text-sm text-muted-foreground">
                    Programmatic access to your workspace — key creation ships
                    with the public API phase.
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
                      <p className="text-xs text-muted-foreground">
                        {k.lastUsedAt
                          ? `last used ${k.lastUsedAt.toLocaleDateString()}`
                          : "never used"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
