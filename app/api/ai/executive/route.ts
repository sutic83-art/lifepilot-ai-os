import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateExecutiveDirection } from "@/lib/ai/executive/executive-layer";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const executive = await generateExecutiveDirection(session.user.id);

    return NextResponse.json(executive);
  } catch (error) {
    console.error("GET /api/ai/executive error:", error);

    return NextResponse.json(
      { error: "Executive layer failed" },
      { status: 500 }
    );
  }
}