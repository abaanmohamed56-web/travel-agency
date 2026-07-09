import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isValid,
  parse,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { requireRaalhuContext } from "@/modules/raalhu/auth/context";
import { listCampaigns, listContentInRange } from "@/modules/raalhu/db/queries";
import { PageHeader } from "@/components/raalhu/dashboard/PageHeader";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/raalhu/ui/button";
import { AddContentDialog } from "@/components/raalhu/dashboard/AddContentDialog";

export const metadata = { title: "Content Calendar" };

const CHANNEL_DOT: Record<string, string> = {
  instagram: "bg-[hsl(var(--chart-1))]",
  facebook: "bg-[hsl(var(--chart-3))]",
  tiktok: "bg-[hsl(var(--chart-5))]",
  email: "bg-[hsl(var(--chart-4))]",
  blog: "bg-[hsl(var(--chart-2))]",
};

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { org } = await requireRaalhuContext();
  const { month } = await searchParams;

  const parsed = month ? parse(month, "yyyy-MM", new Date()) : new Date();
  const cursor = isValid(parsed) ? parsed : new Date();
  const monthStart = startOfMonth(cursor);
  const gridStart = startOfWeek(monthStart);
  const gridEnd = endOfWeek(endOfMonth(cursor));

  const [items, campaigns] = await Promise.all([
    listContentInRange(org.id, gridStart, gridEnd),
    listCampaigns(org.id),
  ]);

  const days: Date[] = [];
  for (let d = gridStart; d <= gridEnd; d = addDays(d, 1)) days.push(d);

  const prev = format(addMonths(monthStart, -1), "yyyy-MM");
  const next = format(addMonths(monthStart, 1), "yyyy-MM");

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <PageHeader
        title="Content Calendar"
        description="Everything scheduled to go out, month by month."
        actions={
          <div className="flex items-center gap-2">
            <Link
              href={`?month=${prev}`}
              aria-label="Previous month"
              className={buttonVariants({ variant: "outline", size: "icon-sm" })}
            >
              <ChevronLeft />
            </Link>
            <span className="min-w-32 text-center text-sm font-medium">
              {format(monthStart, "MMMM yyyy")}
            </span>
            <Link
              href={`?month=${next}`}
              aria-label="Next month"
              className={buttonVariants({ variant: "outline", size: "icon-sm" })}
            >
              <ChevronRight />
            </Link>
            <AddContentDialog
              campaigns={campaigns.map((c) => ({ id: c.id, name: c.name }))}
              defaultDate={format(monthStart, "yyyy-MM-dd")}
            />
          </div>
        }
      />

      <div className="overflow-x-auto">
        <div className="min-w-[760px]">
          <div className="grid grid-cols-7 gap-px text-center text-xs font-medium text-muted-foreground">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="pb-2">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-border bg-border">
            {days.map((day) => {
              const dayItems = items.filter(
                (i) => i.scheduledAt && isSameDay(i.scheduledAt, day)
              );
              const today = isSameDay(day, new Date());
              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "min-h-28 bg-background p-2",
                    !isSameMonth(day, monthStart) && "opacity-40"
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex size-6 items-center justify-center rounded-full text-xs",
                      today
                        ? "bg-primary font-semibold text-primary-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {format(day, "d")}
                  </span>
                  <div className="mt-1.5 space-y-1">
                    {dayItems.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        title={`${item.title} (${item.status.toLowerCase()})`}
                        className="flex items-center gap-1.5 rounded-md border border-border bg-card px-1.5 py-1"
                      >
                        <span
                          className={cn(
                            "size-1.5 shrink-0 rounded-full",
                            CHANNEL_DOT[item.channel ?? ""] ?? "bg-muted-foreground"
                          )}
                        />
                        <span className="truncate text-[11px] leading-tight">
                          {item.title}
                        </span>
                      </div>
                    ))}
                    {dayItems.length > 3 && (
                      <p className="px-1.5 text-[11px] text-muted-foreground">
                        +{dayItems.length - 3} more
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
        {Object.entries(CHANNEL_DOT).map(([channel, cls]) => (
          <span key={channel} className="inline-flex items-center gap-1.5">
            <span className={cn("size-2 rounded-full", cls)} /> {channel}
          </span>
        ))}
      </div>
    </main>
  );
}
