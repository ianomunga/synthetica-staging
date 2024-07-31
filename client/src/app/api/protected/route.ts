// src/app/api/protected/route.ts
import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];

  try {
    verify(token, JWT_SECRET);
    return NextResponse.json({ message: 'This is a protected route' });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}