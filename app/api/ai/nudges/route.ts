import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateNudges } from "@/lib/ai/guidance/nudges";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const nudges = await generateNudges(session.user.id);

    return NextResponse.json(nudges);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "AI nudges failed" },
      { status: 500 }
    );
  }
}