import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe is not configured." },
        { status: 500 }
      );
    }

    const body = await request.text();
    const headerStore = await headers();
    const signature = headerStore.get("stripe-signature");

    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: "Webhook nije podešen." },
        { status: 400 }
      );
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    return NextResponse.json({ received: true, type: event.type });
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
