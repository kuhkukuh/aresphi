import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
  process.env.ADMIN_SECRET || 'dev-secret-change-in-production'
);

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, SECRET_KEY);
    return true;
  } catch {
    return false;
  }
}

export async function createAdminToken(): Promise<string> {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(SECRET_KEY);
}

export async function getAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}

export async function setAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = await createAdminToken();
  cookieStore.set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
}

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  const validUsername = process.env.ADMIN_USERNAME;
  const validPassword = process.env.ADMIN_PASSWORD;
  
  if (!validUsername || !validPassword) {
    console.error('Admin credentials not configured in environment');
    return false;
  }
  
  return username === validUsername && password === validPassword;
}
