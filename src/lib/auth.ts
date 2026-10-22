import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export type UserRole = 'admin' | 'guru' | 'siswa';

export interface SessionData {
  role: UserRole;
  username: string;
  userId?: string;
  email?: string;
  exp: number;
}

const COOKIE_NAME = 'mrh_session';
const SECRET_KEY = process.env.AUTH_SECRET || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mrh-secret-key-2026-salt';

/**
 * Buat signed token aman berbasis HMAC-SHA256
 */
export function createSessionToken(payload: Omit<SessionData, 'exp'>, maxAgeSeconds = 7 * 24 * 3600): string {
  const exp = Math.floor(Date.now() / 1000) + maxAgeSeconds;
  const data: SessionData = { ...payload, exp };
  const jsonStr = JSON.stringify(data);
  const base64Data = Buffer.from(jsonStr, 'utf-8').toString('base64url');

  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(base64Data)
    .digest('base64url');

  return `${base64Data}.${signature}`;
}

/**
 * Verifikasi signed token
 */
export function verifySessionToken(token: string): SessionData | null {
  try {
    if (!token || !token.includes('.')) return null;

    const [base64Data, providedSig] = token.split('.');
    if (!base64Data || !providedSig) return null;

    const expectedSig = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(base64Data)
      .digest('base64url');

    const providedBuf = Buffer.from(providedSig);
    const expectedBuf = Buffer.from(expectedSig);

    if (providedBuf.length !== expectedBuf.length) return null;
    if (!crypto.timingSafeEqual(providedBuf, expectedBuf)) return null;

    const jsonStr = Buffer.from(base64Data, 'base64url').toString('utf-8');
    const data: SessionData = JSON.parse(jsonStr);

    const now = Math.floor(Date.now() / 1000);
    if (data.exp && data.exp < now) {
      return null; // Expired
    }

    return data;
  } catch (err) {
    return null;
  }
}

/**
 * Dapatkan session pengguna dari server cookies
 */
export async function getServerSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifySessionToken(token);
  } catch {
    return null;
  }
}

/**
 * Guard untuk API route: pastikan request memiliki autentikasi valid dan peran (role) yang diizinkan
 */
export async function requireAuth(allowedRoles?: UserRole[]): Promise<{
  authorized: boolean;
  session: SessionData | null;
  response?: NextResponse;
}> {
  const session = await getServerSession();

  if (!session) {
    return {
      authorized: false,
      session: null,
      response: NextResponse.json(
        {
          success: false,
          error: 'Akses Ditolak: Anda belum login atau sesi telah berakhir. Silakan login ke Portal Madrasah.',
        },
        { status: 401 }
      ),
    };
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(session.role)) {
    return {
      authorized: false,
      session,
      response: NextResponse.json(
        {
          success: false,
          error: `Akses Ditolak: Peran "${session.role}" tidak memiliki izin untuk tindakan ini.`,
        },
        { status: 403 }
      ),
    };
  }

  return { authorized: true, session };
}

export { COOKIE_NAME };
