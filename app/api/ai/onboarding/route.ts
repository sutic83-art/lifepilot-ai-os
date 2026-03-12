import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserOnboarding, saveUserOnboarding } from "@/lib/ai/onboarding/onboarding";
import { saveUserPreferences } from "@/lib/ai/memory/preferences";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const onboarding = await getUserOnboarding(session.user.id);

    return NextResponse.json(onboarding);
  } catch (error) {
    console.error("GET /api/ai/onboarding error:", error);

    return NextResponse.json(
      {
        error: "Failed to load onboarding",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await req.json();

    if (
      !body?.primaryGoal ||
      !body?.workPace ||
      !body?.supportStyle ||
      !body?.overloadTendency ||
      !body?.focusArea
    ) {
      return NextResponse.json(
        { error: "Missing onboarding fields" },
        { status: 400 }
      );
    }

    const onboarding = await saveUserOnboarding(session.user.id, {
      primaryGoal: body.primaryGoal,
      workPace: body.workPace,
      supportStyle: body.supportStyle,
      overloadTendency: body.overloadTendency,
      focusArea: body.focusArea,
    });

    await saveUserPreferences(session.user.id, {
      planningMode: body.workPace,
      tone: body.supportStyle,
      workStyle: body.overloadTendency === "high" ? "flexible" : "focused",
    });

    return NextResponse.json(onboarding);
  } catch (error) {
    console.error("POST /api/ai/onboarding error:", error);

    return NextResponse.json(
      {
        error: "Failed to save onboarding",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}