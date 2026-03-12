import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await context.params;

    const journal = await db.journal.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!journal) {
      return NextResponse.json({ error: "Journal entry not found" }, { status: 404 });
    }

    await db.journal.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/journal/[id] error:", error);

    return NextResponse.json(
      {
        error: "Failed to delete journal entry",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
