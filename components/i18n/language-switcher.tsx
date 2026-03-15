"use client";

import { useI18n } from "@/lib/i18n/context";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-500">{t.common.language}</span>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as "en" | "sr")}
        className="rounded-lg border px-3 py-2 text-sm"
      >
        <option value="en">{t.common.english}</option>
        <option value="sr">{t.common.serbian}</option>
      </select>
    </div>
  );
}