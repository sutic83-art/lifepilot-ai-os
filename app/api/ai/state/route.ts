import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getRecentStateSnapshots,
  saveOrchestratorSnapshot,
} from "@/lib/ai/state-persistence/state-persistence";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const snapshots = await getRecentStateSnapshots(session.user.id);

    return NextResponse.json(snapshots);
  } catch (error) {
    console.error("GET /api/ai/state error:", error);

    return NextResponse.json(
      {
        error: "Failed to load state snapshots",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(_req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const snapshot = await saveOrchestratorSnapshot(session.user.id);

    return NextResponse.json(snapshot);
  } catch (error) {
    console.error("POST /api/ai/state error:", error);

    return NextResponse.json(
      {
        error: "Failed to save state snapshot",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}