import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/session';

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const authResult = await requireUser();
  if ('error' in authResult) return authResult.error;
  const existing = await db.journal.findFirst({ where: { id: params.id, userId: authResult.userId } });
  if (!existing) return NextResponse.json({ error: 'Journal zapis nije pronađen.' }, { status: 404 });
  await db.journal.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
