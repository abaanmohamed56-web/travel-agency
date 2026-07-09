import { Bot } from "lucide-react";
import { listAgentRuns } from "@/modules/raalhu/db/queries";
import { Badge } from "@/components/raalhu/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/raalhu/ui/card";

const STATUS_VARIANT: Record<string, "default" | "success" | "warning" | "destructive"> = {
  RUNNING: "warning",
  SUCCEEDED: "success",
  FAILED: "destructive",
  CANCELLED: "default",
};

const AGENT_LABEL: Record<string, string> = {
  master: "Master",
  "marketing-manager": "Manager",
  research: "Research",
  seo: "SEO",
  content: "Content",
  social: "Social",
  email: "Email",
  analytics: "Analytics",
};

export async function RunsHistory({ organizationId }: { organizationId: string }) {
  const runs = await listAgentRuns(organizationId);
  if (runs.length === 0) return null;

  return (
    <Card variant="glass">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Bot className="size-4 text-primary" /> Recent agent runs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {runs.slice(0, 5).map((run) => (
          <div key={run.id} className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <p className="min-w-0 truncate text-xs text-muted-foreground">
                {run.startedAt.toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
                {" · "}
                {(run.inputTokens + run.outputTokens).toLocaleString()} tokens
              </p>
              <Badge variant={STATUS_VARIANT[run.status] ?? "default"} className="shrink-0">
                {run.status.toLowerCase()}
              </Badge>
            </div>
            {run.tasks.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {run.tasks.map((task) => (
                  <span
                    key={task.id}
                    className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground"
                    title={
                      typeof task.input === "object" &&
                      task.input !== null &&
                      "task" in task.input
                        ? String((task.input as { task: unknown }).task).slice(0, 200)
                        : undefined
                    }
                  >
                    {AGENT_LABEL[task.agentId] ?? task.agentId}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
