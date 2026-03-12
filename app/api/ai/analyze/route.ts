import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { analyzeUserBehavior } from "@/lib/ai/analysis/pattern-detector";

export async function GET() {

  try {

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const insights = await analyzeUserBehavior(session.user.id);

    return NextResponse.json(insights);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { error: "AI analysis failed" },
      { status: 500 }
    );
  }
}