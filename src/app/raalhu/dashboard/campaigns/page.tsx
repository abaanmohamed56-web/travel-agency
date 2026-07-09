import Link from "next/link";
import { Bot, Megaphone } from "lucide-react";
import { requireRaalhuContext } from "@/modules/raalhu/auth/context";
import { listCampaigns } from "@/modules/raalhu/db/queries";
import { PageHeader } from "@/components/raalhu/dashboard/PageHeader";
import { Badge } from "@/components/raalhu/ui/badge";
import { Card } from "@/components/raalhu/ui/card";
import { AddCampaignDialog } from "@/components/raalhu/dashboard/AddCampaignDialog";

export const metadata = { title: "Campaigns" };

const STATUS_VARIANT: Record<string, "default" | "secondary" | "success" | "warning" | "outline"> = {
  ACTIVE: "success",
  DRAFT: "secondary",
  PAUSED: "warning",
  COMPLETED: "outline",
  ARCHIVED: "outline",
};

export default async function CampaignsPage() {
  const { org } = await requireRaalhuContext();
  const campaigns = await listCampaigns(org.id);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <PageHeader
        title="Campaigns"
        description="Every initiative your team is running — human- or agent-created."
        actions={<AddCampaignDialog />}
      />

      {campaigns.length === 0 ? (
        <Card variant="glass" className="flex flex-col items-center gap-3 p-12 text-center">
          <Megaphone className="size-8 text-primary" />
          <h2 className="font-medium">No campaigns yet</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Ask the AI team for one in the Command Center — try
            &ldquo;Draft a campaign to grow our bookings.&rdquo;
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {campaigns.map((c) => (
            <Link key={c.id} href={`/raalhu/dashboard/campaigns/${c.id}`}>
              <Card
                variant="glass"
                className="h-full p-6 transition-colors hover:border-primary/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-medium leading-snug">{c.name}</h2>
                  <Badge variant={STATUS_VARIANT[c.status] ?? "secondary"}>
                    {c.status.toLowerCase()}
                  </Badge>
                </div>
                {c.objective && (
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {c.objective}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  {c.channels.map((channel) => (
                    <Badge key={channel} variant="outline">
                      {channel}
                    </Badge>
                  ))}
                  <span className="ml-auto">
                    {c._count.contentItems} content item
                    {c._count.contentItems === 1 ? "" : "s"}
                  </span>
                  {c.createdByAgent && (
                    <span className="inline-flex items-center gap-1 text-primary">
                      <Bot className="size-3.5" /> AI
                    </span>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
