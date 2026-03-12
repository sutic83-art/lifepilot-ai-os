import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateDailyPlanForUser } from "@/lib/ai/brain";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const plan = await generateDailyPlanForUser(session.user.id);

    return NextResponse.json(plan);
  } catch (error) {
    console.error("GET /api/ai/daily-plan error:", error);

    return NextResponse.json(
      { error: "AI daily plan failed" },
      { status: 500 }
    );
  }
}