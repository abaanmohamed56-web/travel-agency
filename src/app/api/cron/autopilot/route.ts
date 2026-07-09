import { runAutopilotForAllEnabledOrgs } from "@/modules/raalhu/lib/autopilot";

// Each org's agent run can take a while; keep well under Vercel's cron
// function ceiling with headroom for multiple orgs run sequentially.
export const maxDuration = 280;

/**
 * Vercel Cron entrypoint (see vercel.json). Deliberately outside /api/raalhu/*
 * — that prefix is guarded by src/proxy.ts, which requires a signed-in
 * session and would 401 every cron invocation (no browser session exists).
 * Auth here is a shared secret instead.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return Response.json({ error: "cron_not_configured" }, { status: 503 });
  }
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const results = await runAutopilotForAllEnabledOrgs();
  return Response.json({ ranAt: new Date().toISOString(), results });
}
