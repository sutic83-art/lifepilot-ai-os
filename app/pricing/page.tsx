import { SiteHeader } from '@/components/site-header';
import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: '€0',
    features: ['Do 20 taskova', '2 aktivna cilja', 'Osnovni AI coach']
  },
  {
    name: 'Pro',
    price: '€19',
    features: ['Neograničeni taskovi', 'Napredni AI coach', 'Journal i billing'],
    highlighted: true
  }
];

export default function PricingPage() {
  return (
    <div>
      <SiteHeader />
      <div className="container-shell py-14">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold">Jednostavna SaaS naplata</h1>
          <p className="mt-3 text-slate-600">Free za probu, Pro za ozbiljan rad.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {plans.map((plan) => (
            <div key={plan.name} className={`card p-8 ${plan.highlighted ? 'border-blue-500' : ''}`}>
              <div className="text-sm uppercase tracking-wide text-slate-500">{plan.name}</div>
              <div className="mt-3 text-4xl font-bold">{plan.price}<span className="text-lg text-slate-500">/mesec</span></div>
              <ul className="mt-6 space-y-2 text-slate-700">
                {plan.features.map((feature) => <li key={feature}>• {feature}</li>)}
              </ul>
              <Link href="/auth/signup" className="btn-primary mt-8">Izaberi {plan.name}</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
