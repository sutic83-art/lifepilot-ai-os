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

    const task = await db.task.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const updatedTask = await db.task.update({
      where: { id },
      data: {
        title: typeof body?.title === "string" ? body.title : task.title,
        description:
          typeof body?.description === "string"
            ? body.description
            : task.description,
        category:
          typeof body?.category === "string" ? body.category : task.category,
        priority:
          typeof body?.priority === "string" ? body.priority : task.priority,
        dueDate: body?.dueDate ? new Date(body.dueDate) : task.dueDate,
        done: typeof body?.done === "boolean" ? body.done : task.done,
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("PATCH /api/tasks/[id] error:", error);

    return NextResponse.json(
      {
        error: "Failed to update task",
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

    const task = await db.task.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    await db.task.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/tasks/[id] error:", error);

    return NextResponse.json(
      {
        error: "Failed to delete task",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
