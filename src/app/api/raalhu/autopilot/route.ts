import { assertRole, requireRaalhuApiContext } from "@/modules/raalhu/auth/context";
import { getAutopilotSettings, upsertAutopilotSettings } from "@/modules/raalhu/lib/autopilot";
import { updateAutopilotSchema } from "@/modules/raalhu/lib/validation";

export async function GET() {
  const raalhu = await requireRaalhuApiContext();
  if (raalhu instanceof Response) return raalhu;

  const settings = await getAutopilotSettings(raalhu.org.id);
  return Response.json({ settings });
}

/** Admin-only: enables/configures daily autopilot content generation for the workspace. */
export async function PATCH(request: Request) {
  const raalhu = await requireRaalhuApiContext();
  if (raalhu instanceof Response) return raalhu;
  const forbidden = assertRole(raalhu.membership, "ADMIN");
  if (forbidden) return forbidden;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = updateAutopilotSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "validation_failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const settings = await upsertAutopilotSettings(raalhu.org.id, parsed.data);
  return Response.json({ settings });
}
