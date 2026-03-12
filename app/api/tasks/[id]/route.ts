import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/session';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const authResult = await requireUser();
  if ('error' in authResult) return authResult.error;

  const existing = await db.task.findFirst({ where: { id: params.id, userId: authResult.userId } });
  if (!existing) return NextResponse.json({ error: 'Task nije pronađen.' }, { status: 404 });

  const json = await request.json().catch(() => ({}));
  const item = await db.task.update({
    where: { id: params.id },
    data: {
      done: typeof json.done === 'boolean' ? json.done : !existing.done,
      title: json.title ?? existing.title,
      description: json.description ?? existing.description,
      category: json.category ?? existing.category,
      priority: json.priority ?? existing.priority
    }
  });

  return NextResponse.json(item);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const authResult = await requireUser();
  if ('error' in authResult) return authResult.error;

  const existing = await db.task.findFirst({ where: { id: params.id, userId: authResult.userId } });
  if (!existing) return NextResponse.json({ error: 'Task nije pronađen.' }, { status: 404 });

  await db.task.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
