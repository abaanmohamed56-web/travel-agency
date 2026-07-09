import Link from "next/link";
import { RaalhuLogo } from "@/components/raalhu/RaalhuLogo";
import { Card } from "@/components/raalhu/ui/card";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <main className="r-hero-backdrop flex min-h-dvh flex-col items-center justify-center px-4 py-10">
      <Link href="/raalhu" className="r-glow-soft mb-8 rounded-full">
        <RaalhuLogo />
      </Link>
      <Card variant="glass-deep" className="r-glow-soft w-full max-w-md border-primary/10 p-8">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
        <div className="mt-7">{children}</div>
      </Card>
      <p className="mt-6 text-sm text-muted-foreground">{footer}</p>
    </main>
  );
}
