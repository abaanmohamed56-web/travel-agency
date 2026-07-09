import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Megaphone,
  Users,
} from "lucide-react";
import { requireRaalhuContext } from "@/modules/raalhu/auth/context";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/raalhu/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/raalhu/ui/card";
import { Badge } from "@/components/raalhu/ui/badge";
import { CommandCenterChat } from "@/components/raalhu/chat/CommandCenterChat";
import { RunsHistory } from "@/components/raalhu/dashboard/RunsHistory";

export const metadata = { title: "Command Center" };

export default async function CommandCenterPage() {
  const { user, org } = await requireRaalhuContext();

  const now = new Date();
  const in7days = new Date(now.getTime() + 7 * 24 * 3600 * 1000);
  const [activeCampaigns, contacts, scheduledThisWeek, upcoming] =
    await Promise.all([
      prisma.campaign.count({
        where: { organizationId: org.id, status: "ACTIVE" },
      }),
      prisma.contact.count({ where: { organizationId: org.id } }),
      prisma.contentItem.count({
        where: {
          organizationId: org.id,
          scheduledAt: { gte: now, lte: in7days },
        },
      }),
      prisma.contentItem.findMany({
        where: { organizationId: org.id, scheduledAt: { gte: now } },
        orderBy: { scheduledAt: "asc" },
        take: 4,
        select: {
          id: true,
          title: true,
          channel: true,
          status: true,
          scheduledAt: true,
        },
      }),
    ]);

  const firstName = user.name?.split(" ")[0] ?? "there";
  const aiConfigured = Boolean(process.env.ANTHROPIC_API_KEY);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Good {now.getHours() < 12 ? "morning" : now.getHours() < 18 ? "afternoon" : "evening"}, {firstName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your AI marketing team is standing by for {org.name}.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Active campaigns" value={activeCampaigns} icon={Megaphone} />
        <StatCard label="Contacts in CRM" value={contacts} icon={Users} />
        <StatCard label="Scheduled this week" value={scheduledThisWeek} icon={Calendar} />
      </div>

      <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          <CommandCenterChat aiConfigured={aiConfigured} />
        </div>

        <div className="min-w-0 space-y-6">
        <Card variant="glass" className="h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Coming up</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nothing scheduled yet. Ask your AI team to draft a content plan.
              </p>
            ) : (
              upcoming.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  <div className="min-w-0">
                    <p className="truncate text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.scheduledAt?.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      · {item.channel ?? "unassigned"}{" "}
                      <Badge variant="outline" className="ml-1">
                        {item.status.toLowerCase()}
                      </Badge>
                    </p>
                  </div>
                </div>
              ))
            )}
            <Link
              href="/raalhu/dashboard/calendar"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              Open calendar <ArrowRight className="size-3.5" />
            </Link>
          </CardContent>
        </Card>
        <RunsHistory organizationId={org.id} />
        </div>
      </div>
    </main>
  );
}
