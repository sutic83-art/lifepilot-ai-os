import Link from "next/link";
import { signOut } from "@/auth";

const primaryLinks = [
  ["Dashboard", "/dashboard"],
  ["Tasks", "/dashboard/tasks"],
  ["Goals", "/dashboard/goals"],
  ["Habits", "/dashboard/habits"],
  ["Coach", "/dashboard/coach"],
  ["Weekly Review", "/dashboard/weekly-review"],
];

const secondaryLinks = [
  ["Journal", "/dashboard/journal"],
  ["Insights", "/dashboard/insights"],
  ["Billing", "/dashboard/billing"],
];

export function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container-shell grid gap-6 py-6 md:grid-cols-[240px_1fr]">
        <aside className="card h-fit p-4">
          <div className="mb-1 text-lg font-bold">LifePilot AI</div>
          <div className="mb-4 text-sm text-slate-500">
            Your AI operating system
          </div>

          <nav className="flex flex-col gap-2">
            {primaryLinks.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="rounded-lg px-3 py-2 font-medium hover:bg-slate-100"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="mt-6 border-t pt-4">
            <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Secondary
            </div>

            <nav className="flex flex-col gap-2">
              {secondaryLinks.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-lg px-3 py-2 hover:bg-slate-100"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
            className="mt-6"
          >
            <button className="btn-secondary w-full" type="submit">
              Sign out
            </button>
          </form>
        </aside>

        <main className="space-y-6">{children}</main>
      </div>
    </div>
  );
}
