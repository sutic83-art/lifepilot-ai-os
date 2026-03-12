import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { calculateBurnoutRisk } from "@/lib/ai/state/burnout-engine";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const result = await calculateBurnoutRisk(session.user.id);

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/ai/burnout error:", error);

    return NextResponse.json(
      { error: "Burnout engine failed" },
      { status: 500 }
    );
  }
}