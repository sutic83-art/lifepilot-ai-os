import Link from 'next/link';
import { signOut } from '@/auth';

const links = [
  ['Overview', '/dashboard'],
  ['Tasks', '/dashboard/tasks'],
  ['Goals', '/dashboard/goals'],
  ['Habits', '/dashboard/habits'],
  ['Journal', '/dashboard/journal'],
  ['Insights', '/dashboard/insights'],
  ['Coach', '/dashboard/coach'],
  ['Billing', '/dashboard/billing']
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container-shell grid gap-6 py-6 md:grid-cols-[220px_1fr]">
        <aside className="card h-fit p-4">
          <div className="mb-4 text-lg font-bold">LifePilot AI</div>
          <nav className="flex flex-col gap-2">
            {links.map(([label, href]) => (
              <Link key={href} href={href} className="rounded-lg px-3 py-2 hover:bg-slate-100">
                {label}
              </Link>
            ))}
          </nav>
          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/' });
            }}
            className="mt-6"
          >
            <button className="btn-secondary w-full" type="submit">Sign out</button>
          </form>
        </aside>
        <main className="space-y-6">{children}</main>
      </div>
    </div>
  );
}
