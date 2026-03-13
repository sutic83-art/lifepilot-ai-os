import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST() {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe is not configured." },
        { status: 500 }
      );
    }

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || !user.email) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
      });

      customerId = customer.id;

      await db.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    if (!process.env.STRIPE_PRICE_ID) {
      return NextResponse.json(
        { error: "STRIPE_PRICE_ID is not configured." },
        { status: 500 }
      );
    }

    if (!process.env.NEXT_PUBLIC_APP_URL) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_APP_URL is not configured." },
        { status: 500 }
      );
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?canceled=1`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("POST /api/billing/checkout error:", error);

    return NextResponse.json(
      {
        error: "Checkout failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
