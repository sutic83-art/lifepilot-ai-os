import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Webhook nije podešen.' }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: 'Neispravan Stripe potpis.' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const customerId = typeof session.customer === 'string' ? session.customer : null;
      const subscriptionId = typeof session.subscription === 'string' ? session.subscription : null;
      if (customerId) {
        const user = await db.user.findFirst({ where: { stripeCustomerId: customerId } });
        if (user) {
          if (subscriptionId) {
            await db.subscription.upsert({
              where: { stripeSubscriptionId: subscriptionId },
              update: { status: 'active', plan: 'PRO', stripeCustomerId: customerId },
              create: {
                userId: user.id,
                status: 'active',
                plan: 'PRO',
                stripeCustomerId: customerId,
                stripeSubscriptionId: subscriptionId,
                stripePriceId: process.env.STRIPE_PRICE_PRO_MONTHLY || null
              }
            });
          }
        }
      }
      break;
    }
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const sub = event.data.object;
      const currentPeriodEnd = typeof sub.current_period_end === 'number' ? new Date(sub.current_period_end * 1000) : null;
      await db.subscription.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: {
          status: sub.status,
          currentPeriodEnd,
          plan: sub.status === 'active' ? 'PRO' : 'FREE'
        }
      });
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
