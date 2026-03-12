import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();

    const goal = await db.goal.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!goal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    const updatedGoal = await db.goal.update({
      where: { id },
      data: {
        title: typeof body?.title === "string" ? body.title : goal.title,
        description:
          typeof body?.description === "string"
            ? body.description
            : goal.description,
        area: typeof body?.area === "string" ? body.area : goal.area,
        progress:
          typeof body?.progress === "number" ? body.progress : goal.progress,
        targetDate: body?.targetDate ? new Date(body.targetDate) : goal.targetDate,
      },
    });

    return NextResponse.json(updatedGoal);
  } catch (error) {
    console.error("PATCH /api/goals/[id] error:", error);

    return NextResponse.json(
      {
        error: "Failed to update goal",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await context.params;

    const goal = await db.goal.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!goal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    await db.goal.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/goals/[id] error:", error);

    return NextResponse.json(
      {
        error: "Failed to delete goal",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
