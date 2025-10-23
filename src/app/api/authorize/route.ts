import { NextResponse } from "next/server";

export async function OPTIONS() {
  // CORS preflight
  const res = new NextResponse(null, { status: 204 });
  res.headers.set("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN || "*");
  res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // minimal safety: never store/log full PAN or CVV
    const cardNumber: string = body.cardNumber ?? "";
    const last4 = cardNumber.slice(-4);

    const payload = {
      ...body,
      cardNumber: process.env.SEND_FULL_CARD === "true" ? cardNumber : undefined,
      cardNumberLast4: last4,
      cvv: undefined, // never forward CVV
      app: process.env.APP_NAME || "jab-credit-auth",
      ts: new Date().toISOString(),
    };

    const r = await fetch(process.env.WEBHOOK_URL as string, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // You can enable timeout/abort here if needed
    });

    if (!r.ok) {
      const text = await r.text();
      return NextResponse.json({ ok: false, error: `Webhook: ${r.status} ${text}` }, { status: 502 });
    }

    const res = NextResponse.json({ ok: true });
    res.headers.set("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN || "*");
    return res;
  } catch (e: any) {
    const res = NextResponse.json({ ok: false, error: e?.message || "Server error" }, { status: 500 });
    res.headers.set("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN || "*");
    return res;
  }
}
