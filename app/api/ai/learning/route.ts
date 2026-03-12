import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateAdaptiveLearning } from "@/lib/ai/learning/adaptive-learning";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const result = await generateAdaptiveLearning(session.user.id);

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/ai/learning error:", error);

    return NextResponse.json(
      { error: "Adaptive learning failed" },
      { status: 500 }
    );
  }
}