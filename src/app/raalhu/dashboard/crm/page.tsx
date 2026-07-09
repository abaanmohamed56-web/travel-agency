import { requireRaalhuContext } from "@/modules/raalhu/auth/context";
import { listContacts } from "@/modules/raalhu/db/queries";
import { PageHeader } from "@/components/raalhu/dashboard/PageHeader";
import { ContactsTable } from "@/components/raalhu/dashboard/ContactsTable";
import { AddContactDialog } from "@/components/raalhu/dashboard/AddContactDialog";

export const metadata = { title: "CRM" };

export default async function CrmPage() {
  const { org } = await requireRaalhuContext();
  const contacts = await listContacts(org.id);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <PageHeader
        title="CRM"
        description="Leads and customers, connected to every campaign that touched them."
        actions={<AddContactDialog />}
      />
      <ContactsTable
        contacts={contacts.map((c) => ({
          id: c.id,
          name: c.name,
          email: c.email,
          company: c.company,
          stage: c.stage,
          source: c.source,
          tags: c.tags,
          updatedAt: c.updatedAt.toISOString(),
        }))}
      />
    </main>
  );
}
