import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateIntervention } from "@/lib/ai/intervention/intervention-layer";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const result = await generateIntervention(session.user.id);

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/ai/intervention error:", error);

    return NextResponse.json(
      {
        error: "Intervention layer failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}