import { NextResponse } from "next/server";

export function ok(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function fail(
  error: string,
  status = 500,
  details?: string
) {
  return NextResponse.json(
    {
      error,
      ...(details ? { details } : {}),
    },
    { status }
  );
}