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

    if (!user?.stripeCustomerId) {
      return NextResponse.json(
        { error: "Stripe customer not found." },
        { status: 404 }
      );
    }

    if (!process.env.NEXT_PUBLIC_APP_URL) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_APP_URL is not configured." },
        { status: 500 }
      );
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("POST /api/billing/portal error:", error);

    return NextResponse.json(
      {
        error: "Billing portal failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
