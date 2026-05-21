import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const limit = parseInt(searchParams.get("limit") ?? "20");

  const userPlan = (session.user as any).plan ?? "FREE";
  const isVip = userPlan === "VIP";

  const signals = await prisma.signal.findMany({
    where: {
      ...(status ? { status: status as any } : {}),
      ...(isVip ? {} : { isVipOnly: false }),
    },
    orderBy: { postedAt: "desc" },
    take: limit,
  });

  return NextResponse.json({ signals });
}

const signalSchema = z.object({
  pair: z.string(),
  type: z.enum(["BUY", "SELL"]),
  entry: z.number(),
  tp1: z.number(),
  tp2: z.number().optional(),
  sl: z.number(),
  riskReward: z.string().optional(),
  confidence: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  analysis: z.string(),
  isVipOnly: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const data = signalSchema.parse(body);

  const signal = await prisma.signal.create({ data });
  return NextResponse.json({ signal }, { status: 201 });
}
