import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateWeeklyOperatingReview } from "@/lib/ai/weekly-review/weekly-operating-review";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const result = await generateWeeklyOperatingReview(session.user.id);

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/ai/weekly-operating-review error:", error);

    return NextResponse.json(
      {
        error: "Weekly operating review failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}