import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/session';
import { stripe } from '@/lib/stripe';

export async function POST() {
  const authResult = await requireUser();
  if ('error' in authResult) return authResult.error;

  const user = await db.user.findUnique({ where: { id: authResult.userId } });
  if (!user?.email) return NextResponse.json({ error: 'Korisnik nije pronađen.' }, { status: 404 });
  if (!process.env.STRIPE_PRICE_PRO_MONTHLY) return NextResponse.json({ error: 'Stripe cena nije podešena.' }, { status: 400 });

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({ email: user.email, name: user.name || undefined });
    customerId = customer.id;
    await db.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: process.env.STRIPE_PRICE_PRO_MONTHLY, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?canceled=1`
  });

  return NextResponse.json({ url: session.url });
}
