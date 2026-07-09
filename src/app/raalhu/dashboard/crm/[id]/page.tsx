import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, Mail, Phone } from "lucide-react";
import { requireRaalhuContext } from "@/modules/raalhu/auth/context";
import { getContact, listContactActivities } from "@/modules/raalhu/db/queries";
import { Badge } from "@/components/raalhu/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/raalhu/ui/card";
import { StageSelect } from "@/components/raalhu/dashboard/StageSelect";
import { ContactActivityTimeline } from "@/components/raalhu/dashboard/ContactActivityTimeline";

export const metadata = { title: "Contact" };

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { org } = await requireRaalhuContext();
  const { id } = await params;
  const contact = await getContact(org.id, id);
  if (!contact) notFound();

  const activities = await listContactActivities(contact.id);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Link
        href="/raalhu/dashboard/crm"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to CRM
      </Link>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {contact.name ?? "Unknown contact"}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {contact.email && (
              <span className="inline-flex items-center gap-1.5">
                <Mail className="size-3.5" /> {contact.email}
              </span>
            )}
            {contact.phone && (
              <span className="inline-flex items-center gap-1.5">
                <Phone className="size-3.5" /> {contact.phone}
              </span>
            )}
            {contact.company && (
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="size-3.5" /> {contact.company}
              </span>
            )}
          </div>
        </div>
        <StageSelect contactId={contact.id} stage={contact.stage} />
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <Card variant="glass">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Source</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {contact.source ?? "Unknown"}
            </p>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {contact.tags.length ? (
                contact.tags.map((t) => (
                  <Badge key={t} variant="outline">{t}</Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No tags</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="mb-4 text-lg font-semibold tracking-tight">Timeline</h2>
      <ContactActivityTimeline
        contactId={contact.id}
        activities={activities.map((a) => ({
          id: a.id,
          type: a.type,
          body: a.body,
          createdAt: a.createdAt.toISOString(),
        }))}
      />
    </main>
  );
}
