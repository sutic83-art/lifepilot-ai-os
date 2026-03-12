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

    const habit = await db.habit.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    const updatedHabit = await db.habit.update({
      where: { id },
      data: {
        title: typeof body?.title === "string" ? body.title : habit.title,
        frequency:
          typeof body?.frequency === "string" ? body.frequency : habit.frequency,
        streak:
          typeof body?.streak === "number" ? body.streak : habit.streak,
        status:
          typeof body?.status === "string" ? body.status : habit.status,
      },
    });

    return NextResponse.json(updatedHabit);
  } catch (error) {
    console.error("PATCH /api/habits/[id] error:", error);

    return NextResponse.json(
      {
        error: "Failed to update habit",
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

    const habit = await db.habit.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    await db.habit.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/habits/[id] error:", error);

    return NextResponse.json(
      {
        error: "Failed to delete habit",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
