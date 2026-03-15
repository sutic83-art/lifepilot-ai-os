import { cookies } from "next/headers";
import type { Locale } from "./types";

export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get("lifepilot-locale")?.value;

  if (locale === "sr") return "sr";
  return "en";
}