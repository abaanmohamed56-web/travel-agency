import { requireRaalhuContext } from "@/modules/raalhu/auth/context";

export const metadata = { title: "Command Center" };

export default async function DashboardPage() {
  const { user, org } = await requireRaalhuContext();

  return (
    <main className="flex min-h-dvh items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome to {org.name}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Signed in as {user.email}. The command center arrives in Phase 3.
        </p>
      </div>
    </main>
  );
}
