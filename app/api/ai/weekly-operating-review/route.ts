import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateWeeklyOperatingReview } from "@/lib/ai/weekly-review/weekly-operating-review";

type SupportedLocale = "en" | "sr";

function normalizeLocale(value: unknown): SupportedLocale {
  return value === "sr" ? "sr" : "en";
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

    const result = await generateWeeklyOperatingReview(session.user.id, locale);

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI weekly operating review error:", error);

    return NextResponse.json(
      {
        error:
          locale === "sr"
            ? "Nedeljni operativni pregled nije uspeo."
            : "Weekly operating review failed",
        details: error instanceof Error ? error.message : String(error),
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