import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateRetrospective } from "@/lib/ai/retrospective/retrospective-intelligence";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const result = await generateRetrospective(session.user.id);

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/ai/retrospective error:", error);

    return NextResponse.json(
      {
        error: "Retrospective intelligence failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}