import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/session';
import { habitSchema } from '@/lib/validators';

export async function GET() {
  const authResult = await requireUser();
  if ('error' in authResult) return authResult.error;
  const items = await db.habit.findMany({ where: { userId: authResult.userId }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const authResult = await requireUser();
  if ('error' in authResult) return authResult.error;
  try {
    const json = await request.json();
    const input = habitSchema.parse(json);
    const item = await db.habit.create({
      data: {
        title: input.title,
        frequency: input.frequency,
        streak: input.streak,
        status: input.status,
        userId: authResult.userId
      }
    });
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Navika nije sačuvana.' }, { status: 400 });
  }
}
