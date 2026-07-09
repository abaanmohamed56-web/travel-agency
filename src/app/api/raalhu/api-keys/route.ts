import { randomBytes, createHash } from "node:crypto";
import { assertRole, requireRaalhuApiContext } from "@/modules/raalhu/auth/context";
import { prisma } from "@/lib/prisma";
import { createApiKeySchema } from "@/modules/raalhu/lib/validation";

function generateApiKey() {
  const plaintext = `rlk_${randomBytes(24).toString("base64url")}`;
  const hashedKey = createHash("sha256").update(plaintext).digest("hex");
  const lastFour = plaintext.slice(-4);
  return { plaintext, hashedKey, lastFour };
}

/** Creates an API key for the caller's active organization. The plaintext is returned once. */
export async function POST(request: Request) {
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

  const parsed = createApiKeySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "validation_failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { plaintext, hashedKey, lastFour } = generateApiKey();

  const apiKey = await prisma.$transaction(async (tx) => {
    const created = await tx.apiKey.create({
      data: {
        organizationId: raalhu.org.id,
        name: parsed.data.name,
        hashedKey,
        lastFour,
        createdById: raalhu.user.id,
      },
    });
    await tx.auditLog.create({
      data: {
        organizationId: raalhu.org.id,
        actorUserId: raalhu.user.id,
        action: "api_key.created",
        targetType: "ApiKey",
        targetId: created.id,
        metadata: { name: parsed.data.name },
      },
    });
    return created;
  });

  return Response.json({ apiKey, plaintextKey: plaintext }, { status: 201 });
}
