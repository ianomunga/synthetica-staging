// client/src/app/api/update-model-status/route.ts
import { NextResponse } from 'next/server';
import { updateModelStatus } from '../../../../../server/src/lib/db';

export async function POST(request: Request) {
  const { email, modelName, status } = await request.json();

  if (!email || !modelName || !status) {
    return NextResponse.json({ error: 'Email, modelName, and status are required' }, { status: 400 });
  }

  try {
    await updateModelStatus(email, modelName, status);
    return NextResponse.json({ message: 'Model status updated successfully' });
  } catch (error) {
    console.error('Error updating model status:', error);
    return NextResponse.json({ error: 'Failed to update model status' }, { status: 500 });
  }
}