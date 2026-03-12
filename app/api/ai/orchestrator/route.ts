import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateUnifiedOrchestrator } from "@/lib/ai/orchestrator/unified-orchestrator";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const result = await generateUnifiedOrchestrator(session.user.id);

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/ai/orchestrator error:", error);

    return NextResponse.json(
      { error: "Unified orchestrator failed" },
      { status: 500 }
    );
  }
}