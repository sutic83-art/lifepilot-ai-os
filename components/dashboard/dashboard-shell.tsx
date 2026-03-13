import { ReactNode } from "react";
import Link from "next/link";

type DashboardShellProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/tasks", label: "Tasks" },
  { href: "/dashboard/goals", label: "Goals" },
  { href: "/dashboard/habits", label: "Habits" },
  { href: "/dashboard/coach", label: "Coach" },
  { href: "/dashboard/weekly-review", label: "Weekly Review" },
];

export function DashboardShell({
  title,
  description,
  children,
}: DashboardShellProps) {
  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="space-y-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            {description ? (
              <p className="mt-2 text-muted-foreground">{description}</p>
            ) : null}
          </div>

          <nav className="flex flex-wrap gap-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl border px-4 py-2 text-sm hover:bg-muted/40"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        {children}
      </div>
    </main>
  );
}