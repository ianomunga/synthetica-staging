// client/src/app/api/user/route.ts
import { NextResponse } from 'next/server';
import { getUser, executeQuery } from '../../../../../server/src/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const user = await getUser(email);
    if (user) {
      const { password, ...safeUser } = user;
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
  const { email, ...updateData } = await request.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const query = `
      UPDATE users
      SET name = @param1
      WHERE username = @param0
    `;
    await executeQuery(query, [email, updateData.name]);
    return NextResponse.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Failed to update user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}