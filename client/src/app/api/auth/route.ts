// src/app/api/auth/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUser } from '../../../../../server/src/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    const user = await getUser(email);
    if (user && await bcrypt.compare(password, user.hashedPassword)) {
      const token = jwt.sign({ id: user.PK, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
      return NextResponse.json({ token, user: { id: user.PK, email: user.email, name: user.name } });
    }
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string, email: string };
    const user = await getUser(decoded.email);
    if (user) {
      return NextResponse.json({ user: { id: user.PK, email: user.email, name: user.name } });
    }
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}