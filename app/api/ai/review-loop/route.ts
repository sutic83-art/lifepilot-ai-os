import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateReviewSummary, saveReviewFeedback } from "@/lib/ai/review/review-loop";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const review = await generateReviewSummary(session.user.id);

    return NextResponse.json(review);
  } catch (error) {
    console.error("GET /api/ai/review-loop error:", error);

    return NextResponse.json(
      { error: "Review loop failed" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await req.json();

    if (!body?.actionType || !body?.outcome) {
      return NextResponse.json(
        { error: "Invalid review feedback payload" },
        { status: 400 }
      );
    }

    if (!["helpful", "neutral", "unhelpful"].includes(body.outcome)) {
      return NextResponse.json(
        { error: "Invalid outcome value" },
        { status: 400 }
      );
    }

    const saved = await saveReviewFeedback({
      userId: session.user.id,
      actionType: body.actionType,
      outcome: body.outcome,
      note: typeof body.note === "string" ? body.note : "",
    });

    return NextResponse.json(saved);
  } catch (error) {
    console.error("POST /api/ai/review-loop error:", error);

    return NextResponse.json(
      { error: "Saving review feedback failed" },
      { status: 500 }
    );
  }
}