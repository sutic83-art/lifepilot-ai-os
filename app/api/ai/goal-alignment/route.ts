import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateGoalAlignment } from "@/lib/ai/alignment/goal-alignment";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const result = await generateGoalAlignment(session.user.id);

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/ai/goal-alignment error:", error);

    return NextResponse.json(
      {
        error: "Goal alignment failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}