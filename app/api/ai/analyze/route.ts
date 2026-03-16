import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { analyzeUserBehavior } from "@/lib/ai/analysis/pattern-detector";

type SupportedLocale = "en" | "sr";

function normalizeLocale(value: unknown): SupportedLocale {
  return value === "sr" ? "sr" : "en";
}

function localizeInsights(
  insights: Array<{ message: string; level: "info" | "warning" | "risk" }>,
  locale: SupportedLocale
) {
  if (locale === "en") return insights;
  return insights;
}

async function handleRequest(locale: SupportedLocale) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: locale === "sr" ? "Niste prijavljeni." : "Not authenticated" },
        { status: 401 }
      );
    }

    const insights = await analyzeUserBehavior(session.user.id, locale);
    const localizedInsights = localizeInsights(insights, locale);

    return NextResponse.json(localizedInsights);
  } catch (error) {
    console.error("AI analyze error:", error);

    return NextResponse.json(
      {
        error:
          locale === "sr" ? "AI analiza nije uspela." : "AI analysis failed",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const locale = normalizeLocale(req.nextUrl.searchParams.get("locale"));
  return handleRequest(locale);
}

export async function POST(req: NextRequest) {
  let locale: SupportedLocale = "en";

  try {
    const body = await req.json();
    locale = normalizeLocale(body?.locale);
  } catch {
    locale = "en";
  }

  return handleRequest(locale);
}