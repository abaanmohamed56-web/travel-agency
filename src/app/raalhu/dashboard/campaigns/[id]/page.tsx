import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Bot } from "lucide-react";
import { requireRaalhuContext } from "@/modules/raalhu/auth/context";
import { getCampaign } from "@/modules/raalhu/db/queries";
import { isHiggsfieldConfigured } from "@/lib/higgsfield";
import { listConnectedAccounts } from "@/modules/raalhu/lib/social";
import { Badge } from "@/components/raalhu/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/raalhu/ui/card";
import { CampaignStatusSelect } from "@/components/raalhu/dashboard/CampaignStatusSelect";
import { ContentStatusSelect } from "@/components/raalhu/dashboard/ContentStatusSelect";
import { ContentMediaControls } from "@/components/raalhu/dashboard/ContentMediaControls";

export const metadata = { title: "Campaign" };

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { org } = await requireRaalhuContext();
  const { id } = await params;
  const [campaign, socialAccounts] = await Promise.all([
    getCampaign(org.id, id),
    listConnectedAccounts(org.id),
  ]);
  if (!campaign) notFound();
  const mediaEnabled = isHiggsfieldConfigured();
  const connectedProviders = socialAccounts.map((a) => a.provider);

  const fmt = (d: Date | null) =>
    d?.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) ?? "—";

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <Link
        href="/raalhu/dashboard/campaigns"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> All campaigns
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">{campaign.name}</h1>
        <CampaignStatusSelect campaignId={campaign.id} status={campaign.status} />
        {campaign.createdByAgent && (
          <Badge variant="outline">
            <Bot className="size-3" /> created by AI
          </Badge>
        )}
      </div>
      {campaign.objective && (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {campaign.objective}
        </p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card variant="glass" className="p-4">
          <p className="text-xs text-muted-foreground">Channels</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {campaign.channels.length ? (
              campaign.channels.map((c) => (
                <Badge key={c} variant="outline">{c}</Badge>
              ))
            ) : (
              <span className="text-sm">—</span>
            )}
          </div>
        </Card>
        <Card variant="glass" className="p-4">
          <p className="text-xs text-muted-foreground">Schedule</p>
          <p className="mt-1.5 text-sm">
            {fmt(campaign.startDate)} → {fmt(campaign.endDate)}
          </p>
        </Card>
        <Card variant="glass" className="p-4">
          <p className="text-xs text-muted-foreground">Budget</p>
          <p className="mt-1.5 text-sm">
            {campaign.budget ? `$${campaign.budget.toString()}` : "—"}
          </p>
        </Card>
      </div>

      <Card variant="glass" className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">
            Content ({campaign.contentItems.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {campaign.contentItems.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No content attached yet.
            </p>
          )}
          {campaign.contentItems.map((item) => (
            <div
              key={item.id}
              className="space-y-3 rounded-lg border border-border bg-card/50 px-4 py-3"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.channel ?? "unassigned"} ·{" "}
                    {item.scheduledAt
                      ? item.scheduledAt.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : "unscheduled"}
                  </p>
                </div>
                <ContentStatusSelect contentId={item.id} status={item.status} />
              </div>
              <ContentMediaControls
                contentId={item.id}
                channel={item.channel}
                mediaEnabled={mediaEnabled}
                connectedProviders={connectedProviders}
                initial={{
                  imageStatus: item.imageStatus,
                  imageUrl: item.imageUrl,
                  videoStatus: item.videoStatus,
                  videoUrl: item.videoUrl,
                  mediaError: item.mediaError,
                  publishStatus: item.publishStatus,
                  externalPostUrl: item.externalPostUrl,
                  publishError: item.publishError,
                }}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
