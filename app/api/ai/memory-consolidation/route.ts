import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateMemoryConsolidation } from "@/lib/ai/memory-consolidation/memory-consolidation";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const result = await generateMemoryConsolidation(session.user.id);

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/ai/memory-consolidation error:", error);

    return NextResponse.json(
      {
        error: "Memory consolidation failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}