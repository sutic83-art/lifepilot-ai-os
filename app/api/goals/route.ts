import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Nisi prijavljen." }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "Korisnik nije pronađen." }, { status: 404 });
    }

    const goals = await db.goal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(goals);
  } catch (error) {
    console.error("GET /api/goals error:", error);
    return NextResponse.json(
      { error: "Greška pri učitavanju ciljeva." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Nisi prijavljen." }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "Korisnik nije pronađen." }, { status: 404 });
    }

    const body = await req.json();

    const title =
      typeof body?.title === "string" ? body.title.trim() : "";

    const description =
      typeof body?.description === "string" ? body.description.trim() : "";

    const area =
      typeof body?.area === "string" ? body.area.trim() : "";

    const progress =
      typeof body?.progress === "number" && body.progress >= 0
        ? body.progress
        : 0;

    const targetDate =
      typeof body?.targetDate === "string" && body.targetDate.trim() !== ""
        ? new Date(body.targetDate)
        : null;

    if (!title) {
      return NextResponse.json(
        { error: "Naslov cilja je obavezan." },
        { status: 400 }
      );
    }

    if (!area) {
      return NextResponse.json(
        { error: "Oblast cilja je obavezna." },
        { status: 400 }
      );
    }

    if (progress < 0 || progress > 100) {
      return NextResponse.json(
        { error: "Progress mora biti između 0 i 100." },
        { status: 400 }
      );
    }

    const goal = await db.goal.create({
      data: {
        title,
        description: description || null,
        area,
        progress,
        targetDate,
        userId: user.id,
      },
    });

    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    console.error("POST /api/goals error:", error);
    return NextResponse.json(
      {
        error: "Cilj nije sačuvan.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 400 }
    );
  }
}
