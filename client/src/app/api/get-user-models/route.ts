// client/src/app/api/get-user-models/route.ts
import { NextResponse } from 'next/server';
import { getUserModels } from '../../../../../server/src/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const models = await getUserModels(email);
    return NextResponse.json({ models });
  } catch (error) {
    console.error('Error fetching user models:', error);
    return NextResponse.json({ error: 'Failed to fetch models' }, { status: 500 });
  }
}