import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/session';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const authResult = await requireUser();
  if ('error' in authResult) return authResult.error;
  const existing = await db.habit.findFirst({ where: { id: params.id, userId: authResult.userId } });
  if (!existing) return NextResponse.json({ error: 'Navika nije pronađena.' }, { status: 404 });
  const json = await request.json();
  const item = await db.habit.update({
    where: { id: params.id },
    data: {
      title: json.title ?? existing.title,
      frequency: json.frequency ?? existing.frequency,
      streak: typeof json.streak === 'number' ? json.streak : existing.streak,
      status: json.status ?? existing.status
    }
  });
  return NextResponse.json(item);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const authResult = await requireUser();
  if ('error' in authResult) return authResult.error;
  const existing = await db.habit.findFirst({ where: { id: params.id, userId: authResult.userId } });
  if (!existing) return NextResponse.json({ error: 'Navika nije pronađena.' }, { status: 404 });
  await db.habit.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
