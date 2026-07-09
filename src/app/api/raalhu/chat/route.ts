import { requireRaalhuApiContext } from "@/modules/raalhu/auth/context";
import { startRun } from "@/modules/raalhu/agents/run";
import type { AgentEvent } from "@/modules/raalhu/agents/types";
import {
  CHAT_RUN_LIMIT,
  getRateLimiter,
} from "@/modules/raalhu/lib/rate-limit";
import { chatRequestSchema } from "@/modules/raalhu/lib/validation";

// Delegation chains (and, now, image generation tool calls) can run long —
// match the platform function budget to the internal run timeout below so
// Vercel doesn't truncate the SSE stream before RUN_TIMEOUT_MS ever fires.
export const maxDuration = 300;

const RUN_TIMEOUT_MS = 5 * 60 * 1000;

const encoder = new TextEncoder();

function sseFrame(event: AgentEvent): Uint8Array {
  return encoder.encode(`data: ${JSON.stringify(event)}\n\n`);
}

function sseResponse(stream: ReadableStream, status = 200): Response {
  return new Response(stream, {
    status,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

function singleEventStream(event: AgentEvent): Response {
  return sseResponse(
    new ReadableStream({
      start(controller) {
        controller.enqueue(sseFrame(event));
        controller.close();
      },
    })
  );
}

export async function POST(request: Request) {
  const raalhu = await requireRaalhuApiContext();
  if (raalhu instanceof Response) return raalhu;

  // Graceful degrade: a structured event, not a crash.
  if (!process.env.ANTHROPIC_API_KEY) {
    return singleEventStream({
      type: "error",
      code: "ai_not_configured",
      message:
        "The AI team is offline — set ANTHROPIC_API_KEY to bring it online.",
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }
  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "validation_failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const limit = getRateLimiter().check(
    `chat:${raalhu.org.id}`,
    CHAT_RUN_LIMIT.limit,
    CHAT_RUN_LIMIT.windowMs
  );
  if (!limit.ok) {
    return Response.json(
      { error: "rate_limited", retryAfterSec: limit.retryAfterSec },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSec ?? 60) },
      }
    );
  }

  // Abort when the client disconnects or the hard run cap is hit.
  const signal = AbortSignal.any([
    request.signal,
    AbortSignal.timeout(RUN_TIMEOUT_MS),
  ]);

  const stream = new ReadableStream({
    async start(controller) {
      let closed = false;
      const emit = (event: AgentEvent) => {
        if (closed) return;
        try {
          controller.enqueue(sseFrame(event));
        } catch {
          closed = true; // client went away mid-run
        }
      };
      try {
        await startRun({
          raalhu,
          conversationId: parsed.data.conversationId,
          message: parsed.data.message,
          emit,
          signal,
        });
      } catch (error) {
        emit({
          type: "error",
          message:
            error instanceof Error && signal.aborted
              ? "The run was cancelled."
              : "Something went wrong while running your AI team.",
        });
      } finally {
        closed = true;
        try {
          controller.close();
        } catch {
          // already closed by cancel()
        }
      }
    },
  });

  return sseResponse(stream);
}
