import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateTrendIntelligence } from "@/lib/ai/trends/trend-intelligence";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const result = await generateTrendIntelligence(session.user.id);

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/ai/trends error:", error);

    return NextResponse.json(
      {
        error: "Trend intelligence failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}