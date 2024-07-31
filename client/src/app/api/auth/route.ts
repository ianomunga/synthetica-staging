import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  // In a real app, you'd check these credentials against a database
  if (email === 'admin@example.com' && password === 'password') {
    const token = jwt.sign({ id: '1', email }, JWT_SECRET, { expiresIn: '1h' });
    return NextResponse.json({ token, user: { id: '1', email, name: 'Admin' } });
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string, email: string };
    // In a real app, you'd fetch user data from a database here
    return NextResponse.json({ user: { id: decoded.id, email: decoded.email, name: 'Admin' } });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}