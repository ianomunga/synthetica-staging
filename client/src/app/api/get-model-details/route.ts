// client/src/app/api/get-model-details/route.ts
import { NextResponse } from 'next/server';
import { getModelDetails } from '../../../../../server/src/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const modelName = searchParams.get('modelName');

  if (!email || !modelName) {
    return NextResponse.json({ error: 'Email and modelName are required' }, { status: 400 });
  }

  try {
    const modelDetails = await getModelDetails(email, modelName);
    if (modelDetails) {
      return NextResponse.json(modelDetails);
    } else {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching model details:', error);
    return NextResponse.json({ error: 'Failed to fetch model details' }, { status: 500 });
  }
}