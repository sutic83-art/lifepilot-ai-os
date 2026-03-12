import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headerStore = await headers();
    const signature = headerStore.get("stripe-signature");

    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: "Webhook nije podešen." },
        { status: 400 }
      );
    }

    // ovde ostaje tvoja postojeća Stripe logika

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("POST /api/stripe/webhook error:", error);

    return NextResponse.json(
      {
        error: "Stripe webhook failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
