// src/app/api/user/route.ts
import { NextResponse } from 'next/server';
import { query, getUser } from '../../../../../server/src/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    // For now, we'll use getUser instead of query since we're using a mock database
    const user = await getUser(id);
    if (user) {
      // Remove sensitive information like password before sending
      const { password, ...safeUser } = user;
      return NextResponse.json(safeUser);
    } else {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { id, ...updateData } = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    // In a real database, you would update the user here
    // For now, we'll just log the update
    console.log('Updating user:', { id, ...updateData });
    return NextResponse.json({ message: 'User updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}