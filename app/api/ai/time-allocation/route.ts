import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateTimeAllocation } from "@/lib/ai/time/time-allocation";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const result = await generateTimeAllocation(session.user.id);

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/ai/time-allocation error:", error);

    return NextResponse.json(
      {
        error: "Time allocation failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}