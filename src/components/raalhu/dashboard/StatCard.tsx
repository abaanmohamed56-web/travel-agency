import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/raalhu/ui/card";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
}) {
  return (
    <Card variant="glow" className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        {Icon && (
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 shadow-[0_0_16px_rgba(30,167,255,0.25)]">
            <Icon className="size-4 text-primary" />
          </span>
        )}
      </div>
      <p className="mt-2 text-3xl font-semibold tracking-tight r-text-glow">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </Card>
  );
}
