import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';

export default function HomePage() {
  return (
    <div>
      <SiteHeader />
      <section className="container-shell py-16">
        <div className="card grid gap-8 p-8 md:grid-cols-2 md:p-12">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-700">LifePilot AI</p>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              Lični AI operativni sistem za zadatke, ciljeve, navike i fokus.
            </h1>
            <p className="mt-5 text-lg text-slate-600">
              Planiraj dan, vodi dnevnik, prati ciljeve, upravljaj navikama i koristi AI coach savete na jednom mestu.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/auth/signup" className="btn-primary">Pokreni aplikaciju</Link>
              <Link href="/pricing" className="btn-secondary">Pogledaj planove</Link>
            </div>
          </div>
          <div className="card bg-slate-900 p-6 text-white">
            <div className="text-sm text-slate-300">Danas</div>
            <div className="mt-4 space-y-3">
              <div className="rounded-xl bg-white/10 p-4">Top prioritet: završi najvažniji zadatak do 10:30.</div>
              <div className="rounded-xl bg-white/10 p-4">Goal score: 72%</div>
              <div className="rounded-xl bg-white/10 p-4">Habit streak: 6 dana</div>
              <div className="rounded-xl bg-white/10 p-4">AI Coach: skrati listu obaveza i zaštiti fokus blok.</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
