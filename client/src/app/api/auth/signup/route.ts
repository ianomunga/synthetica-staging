// client/src/app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createUser } from '../../../../../../server/src/lib/db';

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await createUser(email, hashedPassword, name);
    return NextResponse.json({ user: { email: user.email, name: user.name } });
  } catch (error) {
    console.error('Detailed error:', error);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
      return NextResponse.json({ error: `Error creating user: ${error.message}`, stack: error.stack }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}