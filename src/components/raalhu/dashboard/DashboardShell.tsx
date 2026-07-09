"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import {
  BarChart3,
  Bell,
  Calendar,
  Check,
  ChevronsUpDown,
  LogOut,
  Megaphone,
  Menu,
  MessageSquare,
  Settings,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RaalhuLogo, RaalhuMark } from "@/components/raalhu/RaalhuLogo";
import { Avatar } from "@/components/raalhu/ui/avatar";
import { Badge } from "@/components/raalhu/ui/badge";
import { Button } from "@/components/raalhu/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/raalhu/ui/dropdown-menu";

const NAV = [
  { href: "/raalhu/dashboard", label: "Command Center", icon: MessageSquare, exact: true },
  { href: "/raalhu/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/raalhu/dashboard/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/raalhu/dashboard/calendar", label: "Calendar", icon: Calendar },
  { href: "/raalhu/dashboard/crm", label: "CRM", icon: Users },
  { href: "/raalhu/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/raalhu/dashboard/settings", label: "Settings", icon: Settings },
];

export interface ShellNotification {
  id: string;
  title: string;
  body: string | null;
  type: string;
  read: boolean;
  createdAt: string;
}

export function DashboardShell({
  user,
  org,
  role,
  orgs,
  notifications,
  children,
}: {
  user: { name: string | null; email: string | null };
  org: { id: string; name: string; plan: string };
  role: string;
  orgs: { id: string; name: string }[];
  notifications: ShellNotification[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { update } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  async function switchOrg(orgId: string) {
    if (orgId === org.id) return;
    await update({ raalhuOrgId: orgId });
    router.refresh();
  }

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {NAV.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              active
                ? "bg-primary/12 font-medium text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <item.icon className="size-4 shrink-0" />
            {item.label}
            {item.label === "Notifications" && unread > 0 && (
              <Badge className="ml-auto">{unread}</Badge>
            )}
          </Link>
        );
      })}
    </nav>
  );

  const orgSwitcher = (
    <DropdownMenu>
      <DropdownMenuTrigger className="mx-3 mb-3 flex items-center gap-2.5 rounded-lg border border-border bg-secondary/40 px-3 py-2.5 text-left transition-colors hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <RaalhuMark className="size-6" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium">{org.name}</span>
          <span className="block text-xs text-muted-foreground">
            {org.plan.toLowerCase()} · {role.toLowerCase()}
          </span>
        </span>
        <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-60">
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        {orgs.map((o) => (
          <DropdownMenuItem key={o.id} onSelect={() => switchOrg(o.id)}>
            <span className="flex-1 truncate">{o.name}</span>
            {o.id === org.id && <Check className="text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="flex min-h-dvh">
      {/* Desktop sidebar */}
      <aside className="r-glass-deep fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border py-5 lg:flex">
        <Link href="/raalhu" className="mb-6 px-6">
          <RaalhuLogo />
        </Link>
        {orgSwitcher}
        {nav}
        <div className="r-divider mx-3 my-3" />
        <div className="flex items-center gap-3 px-6">
          <Avatar name={user.name} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user.name ?? "You"}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Sign out"
            onClick={() => signOut({ callbackUrl: "/raalhu" })}
          >
            <LogOut />
          </Button>
        </div>
      </aside>

      {/* Mobile top bar + drawer */}
      <div className="r-glass-deep fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-border px-4 lg:hidden">
        <Link href="/raalhu">
          <RaalhuLogo />
        </Link>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </Button>
      </div>
      {mobileOpen && (
        <div className="fixed inset-0 z-20 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <div className="r-glass-deep absolute inset-y-0 left-0 flex w-72 flex-col pb-6 pt-20">
            {orgSwitcher}
            {nav}
            <div className="mt-auto px-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/raalhu" })}
              >
                <LogOut /> Sign out
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="min-w-0 flex-1 pt-14 lg:pl-64 lg:pt-0">{children}</div>
    </div>
  );
}
