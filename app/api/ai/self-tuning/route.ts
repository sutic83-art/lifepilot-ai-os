import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateSelfTuning } from "@/lib/ai/tuning/self-tuning";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const result = await generateSelfTuning(session.user.id);

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/ai/self-tuning error:", error);

    return NextResponse.json(
      { error: "Self-tuning failed" },
      { status: 500 }
    );
  }
}