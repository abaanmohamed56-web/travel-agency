import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getPlanFromPriceId(priceId: string): "STARTER" | "PRO" | "VIP" {
  const mapping: Record<string, "STARTER" | "PRO" | "VIP"> = {
    [process.env.STRIPE_PRICE_STARTER ?? "starter"]: "STARTER",
    [process.env.STRIPE_PRICE_PRO ?? "pro"]: "PRO",
    [process.env.STRIPE_PRICE_VIP ?? "vip"]: "VIP",
  };
  return mapping[priceId] ?? "STARTER";
}

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || !webhookSecret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const { default: Stripe } = await import("stripe");
  const stripe = new Stripe(stripeKey, { apiVersion: "2026-04-22.dahlia" });

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated"
  ) {
    const subscription = event.data.object as any;
    const customerId = subscription.customer as string;
    const priceId = subscription.items.data[0].price.id;
    const plan = getPlanFromPriceId(priceId);

    await prisma.user.update({
      where: { stripeCustomerId: customerId },
      data: {
        plan,
        stripeSubscriptionId: subscription.id,
        planExpiresAt: subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000)
          : null,
      },
    });
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as any;
    await prisma.user.update({
      where: { stripeCustomerId: subscription.customer as string },
      data: { plan: "FREE", stripeSubscriptionId: null, planExpiresAt: null },
    });
  }

  return NextResponse.json({ received: true });
}
