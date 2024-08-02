// client/src/app/api/user/route.ts
import { NextResponse } from 'next/server';
import { getUser, updateUser } from '../../../../../server/src/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const user = await getUser(email);
    if (user) {
      // Remove sensitive information
      const { hashedPassword, ...safeUser } = user;
      return NextResponse.json(safeUser);
    } else {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { email, name } = await request.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    await updateUser(email, { name });
    return NextResponse.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Failed to update user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}