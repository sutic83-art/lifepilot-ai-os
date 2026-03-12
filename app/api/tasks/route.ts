import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const ALLOWED_PRIORITIES = ["LOW", "MEDIUM", "HIGH"] as const;

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

    const tasks = await db.task.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("GET /api/tasks error:", error);
    return NextResponse.json(
      { error: "Greška pri učitavanju taskova." },
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

    const priority =
      typeof body?.priority === "string"
        ? body.priority.trim().toUpperCase()
        : "";

    const category =
      typeof body?.category === "string"
        ? body.category.trim()
        : "";

    const description =
      typeof body?.description === "string"
        ? body.description.trim()
        : "";

    if (!title) {
      return NextResponse.json(
        { error: "Naslov taska je obavezan." },
        { status: 400 }
      );
    }

    if (!ALLOWED_PRIORITIES.includes(priority as (typeof ALLOWED_PRIORITIES)[number])) {
      return NextResponse.json(
        { error: "Nevažeći prioritet." },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: "Kategorija je obavezna." },
        { status: 400 }
      );
    }

    const task = await db.task.create({
      data: {
        title,
        description: description || null,
        category,
        priority: priority as "LOW" | "MEDIUM" | "HIGH",
        done: false,
        userId: user.id,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("POST /api/tasks error:", error);
    return NextResponse.json(
      {
        error: "Task nije sačuvan.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 400 }
    );
  }
}