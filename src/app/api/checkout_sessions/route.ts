import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      amount = 1999, // cents ($19.99)
      currency = process.env.STRIPE_DEFAULT_CURRENCY || "usd",
      name = "Credit Authorization Fee",
      description = "JAB Credit Authorization",
      quantity = 1,
      metadata = {},
      customer_email,
    } = body || {};

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity,
          price_data: {
            currency,
            unit_amount: amount,
            product_data: { name, description },
          },
        },
      ],
      customer_email,
      metadata,
      billing_address_collection: "auto",
      success_url:
        process.env.STRIPE_SUCCESS_URL ||
        "http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: process.env.STRIPE_CANCEL_URL || "http://localhost:3000/cancel",
    });

    return NextResponse.json({ url: session.url, id: session.id });
  } catch (err: any) {
    console.error("Checkout session error:", err?.message || err);
    return new NextResponse("Failed to create checkout session", { status: 500 });
  }
}
