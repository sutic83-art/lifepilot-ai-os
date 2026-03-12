import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { executeAction, generateActionProposals } from "@/lib/ai/actions/action-layer";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const actions = await generateActionProposals(session.user.id);

    return NextResponse.json(actions);
  } catch (error) {
    console.error("GET /api/ai/actions error:", error);

    return NextResponse.json(
      { error: "Action proposal generation failed" },
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

    if (!body?.type || !body?.title || !body?.description || !body?.reason) {
      return NextResponse.json(
        { error: "Invalid action payload" },
        { status: 400 }
      );
    }

    const result = await executeAction(session.user.id, body);

    return NextResponse.json(result);
  } catch (error) {
    console.error("POST /api/ai/actions error:", error);

    return NextResponse.json(
      { error: "Action execution failed" },
      { status: 500 }
    );
  }
}