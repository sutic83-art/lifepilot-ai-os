import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "OPENAI_API_KEY is missing in environment variables."
        },
        { status: 500 }
      );
    }

    const body = await req.json();
    const prompt =
      typeof body?.prompt === "string" ? body.prompt.trim() : "";

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required." },
        { status: 400 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content:
            "You are LifePilot AI Coach. Give practical, supportive, short coaching advice based on the user's current situation."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const text =
      response.output_text ||
      "No coaching response was generated.";

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error("POST /api/ai/coach error:", error);

    return NextResponse.json(
      {
        error: "AI coach failed",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
