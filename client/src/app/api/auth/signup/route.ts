import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createUser } from '../../../../../../server/src/lib/db';  // Update this path based on your project structure

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(email, hashedPassword, name);
    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
  }
}