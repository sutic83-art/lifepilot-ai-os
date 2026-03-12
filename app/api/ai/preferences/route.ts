import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserPreferences, saveUserPreferences } from "@/lib/ai/memory/preferences";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const preferences = await getUserPreferences(session.user.id);

    return NextResponse.json(preferences);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load preferences" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();

    const planningMode = body?.planningMode;
    const tone = body?.tone;
    const workStyle = body?.workStyle;

    if (!["gentle", "balanced", "ambitious"].includes(planningMode)) {
      return NextResponse.json({ error: "Invalid planning mode" }, { status: 400 });
    }

    if (!["direct", "supportive"].includes(tone)) {
      return NextResponse.json({ error: "Invalid tone" }, { status: 400 });
    }

    if (!["focused", "flexible"].includes(workStyle)) {
      return NextResponse.json({ error: "Invalid work style" }, { status: 400 });
    }

    const saved = await saveUserPreferences(session.user.id, {
      planningMode,
      tone,
      workStyle,
    });

    return NextResponse.json(saved);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save preferences" }, { status: 500 });
  }
}