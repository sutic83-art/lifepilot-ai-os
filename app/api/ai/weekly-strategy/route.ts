import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateWeeklyStrategy } from "@/lib/ai/guidance/weekly-strategy";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const strategy = await generateWeeklyStrategy(session.user.id);

    return NextResponse.json(strategy);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "AI weekly strategy failed" },
      { status: 500 }
    );
  }
}