"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";

const primaryLinkKeys = [
  ["dashboard", "/dashboard"],
  ["tasks", "/dashboard/tasks"],
  ["goals", "/dashboard/goals"],
  ["habits", "/dashboard/habits"],
  ["coach", "/dashboard/coach"],
  ["weeklyReview", "/dashboard/weekly-review"],
] as const;

const secondaryLinkKeys = [
  ["journal", "/dashboard/journal"],
  ["insights", "/dashboard/insights"],
  ["billing", "/dashboard/billing"],
] as const;

export function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container-shell grid gap-6 py-6 md:grid-cols-[240px_1fr]">
        <aside className="card h-fit p-4">
          <div className="mb-1 text-lg font-bold">{t.common.appName}</div>
          <div className="mb-4 text-sm text-slate-500">
            {t.nav.operatingSystem}
          </div>

          <div className="mb-4">
            <LanguageSwitcher />
          </div>

          <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            {t.nav.main}
          </div>
          <nav className="flex flex-col gap-2">
            {primaryLinkKeys.map(([key, href]) => (
              <Link
                key={href}
                href={href}
                className="rounded-lg px-3 py-2 font-medium hover:bg-slate-100"
              >
                {t.nav[key]}
              </Link>
            ))}
          </nav>

          <div className="mt-6 border-t pt-4">
            <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t.nav.secondary}
            </div>

            <nav className="flex flex-col gap-2">
              {secondaryLinkKeys.map(([key, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-lg px-3 py-2 hover:bg-slate-100"
                >
                  {t.nav[key]}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        <main className="space-y-6">{children}</main>
      </div>
    </div>
  );
}