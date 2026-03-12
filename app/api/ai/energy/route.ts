import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { calculateEnergy } from "@/lib/ai/state/energy-engine";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const result = await calculateEnergy(session.user.id);

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/ai/energy error:", error);

    return NextResponse.json(
      { error: "Energy engine failed" },
      { status: 500 }
    );
  }
}