import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/session';
import { stripe } from '@/lib/stripe';

export async function POST() {
  const authResult = await requireUser();
  if ('error' in authResult) return authResult.error;
  const user = await db.user.findUnique({ where: { id: authResult.userId } });
  if (!user?.stripeCustomerId) return NextResponse.json({ error: 'Stripe customer ne postoji.' }, { status: 400 });

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`
  });

  return NextResponse.json({ url: session.url });
}
