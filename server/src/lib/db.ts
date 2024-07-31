// server/src/lib/db.ts
import bcrypt from 'bcryptjs';

const hardcodedUser = {
  id: '1',
  email: 'admin@example.com',
  password: bcrypt.hashSync('password', 10),
  name: 'Admin User'
};

export async function query(text: string, params?: any[]) {
  console.log('Query:', text, params);
  // Implement mock query logic here
  return { rows: [] };
}

export async function getUser(email: string) {
  if (email === hardcodedUser.email) {
    return hardcodedUser;
  }
  // In a real database, you would query for the user here
  return null;
}

export async function createUser(email: string, hashedPassword: string, name: string) {
  // In a real database, you would insert the new user here
  console.log('Creating user:', { email, name });
  return { id: '2', email, password: hashedPassword, name };
}