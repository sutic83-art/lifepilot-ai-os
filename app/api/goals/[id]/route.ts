import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/session';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const authResult = await requireUser();
  if ('error' in authResult) return authResult.error;
  const existing = await db.goal.findFirst({ where: { id: params.id, userId: authResult.userId } });
  if (!existing) return NextResponse.json({ error: 'Cilj nije pronađen.' }, { status: 404 });
  const json = await request.json();
  const item = await db.goal.update({
    where: { id: params.id },
    data: {
      title: json.title ?? existing.title,
      description: json.description ?? existing.description,
      area: json.area ?? existing.area,
      progress: typeof json.progress === 'number' ? json.progress : existing.progress
    }
  });
  return NextResponse.json(item);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const authResult = await requireUser();
  if ('error' in authResult) return authResult.error;
  const existing = await db.goal.findFirst({ where: { id: params.id, userId: authResult.userId } });
  if (!existing) return NextResponse.json({ error: 'Cilj nije pronađen.' }, { status: 404 });
  await db.goal.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
