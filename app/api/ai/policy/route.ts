import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generatePersonalPolicy } from "@/lib/ai/policy/personal-policy";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const result = await generatePersonalPolicy(session.user.id);

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/ai/policy error:", error);

    return NextResponse.json(
      { error: "Personal policy generation failed" },
      { status: 500 }
    );
  }
}