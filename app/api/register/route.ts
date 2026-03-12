import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/password';
import { signUpSchema } from '@/lib/validators';

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const input = signUpSchema.parse(json);

    const existing = await db.user.findUnique({ where: { email: input.email } });
    if (existing) return NextResponse.json({ error: 'Email već postoji.' }, { status: 409 });

    const passwordHash = await hashPassword(input.password);
    const user = await db.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
        subscriptions: {
          create: { status: 'inactive', plan: 'FREE' }
        }
      }
    });

    return NextResponse.json({ id: user.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Neispravni podaci za registraciju.' }, { status: 400 });
  }
}
