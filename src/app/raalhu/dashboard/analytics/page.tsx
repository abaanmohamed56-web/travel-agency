import { CalendarClock, FileText, Megaphone, Users } from "lucide-react";
import { requireRaalhuContext } from "@/modules/raalhu/auth/context";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/raalhu/dashboard/PageHeader";
import { StatCard } from "@/components/raalhu/dashboard/StatCard";
import {
  ContentByWeekChart,
  ContactsByStageChart,
} from "@/components/raalhu/dashboard/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/raalhu/ui/card";

export const metadata = { title: "Analytics" };

const STAGE_ORDER = ["LEAD", "MQL", "SQL", "CUSTOMER", "CHURNED"] as const;

export default async function AnalyticsPage() {
  const { org } = await requireRaalhuContext();

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() - 7); // last week's Sunday
  const weeks = Array.from({ length: 6 }, (_, i) => {
    const from = new Date(weekStart.getTime() + i * 7 * 24 * 3600 * 1000);
    const to = new Date(from.getTime() + 7 * 24 * 3600 * 1000);
    return { from, to };
  });

  const [campaigns, contacts, contentItems, stageGroups, weekCounts] =
    await Promise.all([
      prisma.campaign.count({ where: { organizationId: org.id } }),
      prisma.contact.count({ where: { organizationId: org.id } }),
      prisma.contentItem.count({ where: { organizationId: org.id } }),
      prisma.contact.groupBy({
        by: ["stage"],
        where: { organizationId: org.id },
        _count: true,
      }),
      Promise.all(
        weeks.map(({ from, to }) =>
          prisma.contentItem.count({
            where: {
              organizationId: org.id,
              scheduledAt: { gte: from, lt: to },
            },
          })
        )
      ),
    ]);

  const scheduled = await prisma.contentItem.count({
    where: { organizationId: org.id, scheduledAt: { gte: now } },
  });

  const weekly = weeks.map(({ from }, i) => ({
    week: from.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    count: weekCounts[i],
  }));

  const byStage = STAGE_ORDER.map((stage) => ({
    stage,
    count: stageGroups.find((g) => g.stage === stage)?._count ?? 0,
  }));

  const hasData = contentItems > 0 || contacts > 0;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <PageHeader
        title="Analytics"
        description="How the machine is running. Live channel metrics arrive with the integrations phase."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Campaigns" value={campaigns} icon={Megaphone} />
        <StatCard label="Contacts" value={contacts} icon={Users} />
        <StatCard label="Content items" value={contentItems} icon={FileText} />
        <StatCard label="Scheduled ahead" value={scheduled} icon={CalendarClock} />
      </div>

      {hasData ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card variant="glass" className="min-w-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Content per week</CardTitle>
            </CardHeader>
            <CardContent>
              <ContentByWeekChart data={weekly} />
            </CardContent>
          </Card>
          <Card variant="glass" className="min-w-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Pipeline by stage</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactsByStageChart data={byStage} />
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card variant="glass" className="mt-6 p-10 text-center">
          <p className="text-sm text-muted-foreground">
            No activity to chart yet. Once your AI team schedules content and
            captures leads, this page comes alive.
          </p>
        </Card>
      )}
    </main>
  );
}
