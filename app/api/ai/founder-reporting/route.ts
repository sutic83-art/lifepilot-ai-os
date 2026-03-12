import { auth } from "@/lib/auth";
import { generateFounderReporting } from "@/lib/ai/reporting/founder-reporting";
import { ok, fail } from "@/lib/api/responses";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return fail("Not authenticated", 401);
    }

    const result = await generateFounderReporting(session.user.id);

    return ok(result);
  } catch (error) {
    console.error("GET /api/ai/founder-reporting error:", error);

    return fail(
      "Founder reporting failed",
      500,
      error instanceof Error ? error.message : String(error)
    );
  }
}