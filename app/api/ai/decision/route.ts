import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateDecision } from "@/lib/ai/decision/decision-engine";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const decision = await generateDecision(session.user.id);

    return NextResponse.json(decision);
  } catch (error) {
    console.error("GET /api/ai/decision error:", error);

    return NextResponse.json(
      { error: "AI decision failed" },
      { status: 500 }
    );
  }
}