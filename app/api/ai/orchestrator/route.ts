import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateUnifiedOrchestrator } from "@/lib/ai/orchestrator/unified-orchestrator";

type SupportedLocale = "en" | "sr";

function normalizeLocale(value: unknown): SupportedLocale {
  return value === "sr" ? "sr" : "en";
}

function localizeOrchestratorResult(
  result: any,
  locale: SupportedLocale
) {
  if (locale === "en") return result;
  return result;
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

    const result = await generateUnifiedOrchestrator(session.user.id);
    const localizedResult = localizeOrchestratorResult(result, locale);

    return NextResponse.json(localizedResult);
  } catch (error) {
    console.error("AI orchestrator error:", error);

    return NextResponse.json(
      {
        error:
          locale === "sr"
            ? "Unified orchestrator nije uspeo."
            : "Unified orchestrator failed",
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