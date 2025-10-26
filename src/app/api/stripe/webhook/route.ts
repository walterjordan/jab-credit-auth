import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return new NextResponse("Missing STRIPE_WEBHOOK_SECRET", { status: 500 });

  const buf = Buffer.from(await req.arrayBuffer());
  const sig = req.headers.get("stripe-signature");

  try {
    if (!sig) throw new Error("Missing Stripe signature header");
    const event = stripe.webhooks.constructEvent(buf, sig, secret);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        // TODO: mark your credit-auth record as paid in your DB
        // e.g. await db.creditAuth.update({ where: {...}, data: { paid: true, stripeSessionId: session.id }});
        break;
      }
      default:
        break;
    }
    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook error:", err?.message || err);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }
}
