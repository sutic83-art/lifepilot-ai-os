import { NextResponse } from "next/server";

function preview(value?: string | null) {
  if (!value) return null;
  if (value.length <= 20) return value;
  return `${value.slice(0, 20)}...`;
}

export async function GET() {
  const nextAuthUrl = process.env.NEXTAUTH_URL ?? null;
  const authUrl = process.env.AUTH_URL ?? null;
  const nextPublicAppUrl = process.env.NEXT_PUBLIC_APP_URL ?? null;

  return NextResponse.json({
    NEXTAUTH_URL: {
      exists: !!nextAuthUrl,
      preview: preview(nextAuthUrl),
      startsWithHttp: !!nextAuthUrl && /^https?:\/\//.test(nextAuthUrl),
    },
    AUTH_URL: {
      exists: !!authUrl,
      preview: preview(authUrl),
      startsWithHttp: !!authUrl && /^https?:\/\//.test(authUrl),
    },
    NEXT_PUBLIC_APP_URL: {
      exists: !!nextPublicAppUrl,
      preview: preview(nextPublicAppUrl),
      startsWithHttp:
        !!nextPublicAppUrl && /^https?:\/\//.test(nextPublicAppUrl),
    },
    NEXTAUTH_SECRET: {
      exists: !!process.env.NEXTAUTH_SECRET,
      length: process.env.NEXTAUTH_SECRET?.length ?? 0,
    },
    AUTH_SECRET: {
      exists: !!process.env.AUTH_SECRET,
      length: process.env.AUTH_SECRET?.length ?? 0,
    },
    DATABASE_URL: {
      exists: !!process.env.DATABASE_URL,
      startsWithPostgres:
        !!process.env.DATABASE_URL &&
        /^postgres(ql)?:\/\//.test(process.env.DATABASE_URL),
      preview: preview(process.env.DATABASE_URL),
    },
  });
}