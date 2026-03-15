"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import type { Locale } from "./types";
import { getMessages } from "./messages";

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => Promise<void>;
  t: ReturnType<typeof getMessages>;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "lifepilot-locale";
const COOKIE_NAME = "lifepilot-locale";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved === "en" || saved === "sr") {
      setLocaleState(saved);
      document.cookie = `${COOKIE_NAME}=${saved}; path=/; max-age=31536000`;
    } else {
      document.cookie = `${COOKIE_NAME}=en; path=/; max-age=31536000`;
    }
  }, []);

  const setLocale = async (nextLocale: Locale) => {
    setLocaleState(nextLocale);
    window.localStorage.setItem(STORAGE_KEY, nextLocale);
    document.cookie = `${COOKIE_NAME}=${nextLocale}; path=/; max-age=31536000`;

    try {
      await fetch("/api/ai/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locale: nextLocale,
        }),
      });
    } catch {}
  };

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: getMessages(locale),
    }),
    [locale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used inside I18nProvider");
  }
  return ctx;
}