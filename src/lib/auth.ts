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
const SECRET_KEY =
  process.env.AUTH_SECRET ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  '95a2a3b25af85f157e36c920e53534571a2ab3624d3bb4917db722e64d137d91';

/**
 * Buat signed token aman berbasis HMAC-SHA256
 */
export function createSessionToken(payload: Omit<SessionData, 'exp'>, maxAgeSeconds = 7 * 24 * 3600): string {
  if (!SECRET_KEY) {
    throw new Error('Fatal Security Error: Missing AUTH_SECRET or SUPABASE_SERVICE_ROLE_KEY environment variable.');
  }
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
    if (!SECRET_KEY || !token || !token.includes('.')) return null;

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
 * Dapatkan session pengguna dari server cookies atau request headers
 */
export async function getServerSession(request?: Request): Promise<SessionData | null> {
  // 1. Coba baca dari cookies() next/headers
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (token) {
      const session = verifySessionToken(token);
      if (session) return session;
    }
  } catch {
    // next/headers cookies() dapat throw jika dipanggil di luar konteks request tertentu
  }

  // 2. Fallback baca langsung dari request headers jika objek request disertakan
  if (request) {
    try {
      const cookieHeader = request.headers.get('cookie');
      if (cookieHeader) {
        const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
        if (match && match[1]) {
          const session = verifySessionToken(decodeURIComponent(match[1]));
          if (session) return session;
        }
      }

      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const bearerToken = authHeader.substring(7).trim();
        const session = verifySessionToken(bearerToken);
        if (session) return session;
      }
    } catch {
      // Abaikan jika parsing gagal
    }
  }

  return null;
}

/**
 * Guard untuk API route: pastikan request memiliki autentikasi valid dan peran (role) yang diizinkan
 */
export async function requireAuth(allowedRoles?: UserRole[], request?: Request): Promise<{
  authorized: boolean;
  session: SessionData | null;
  response?: NextResponse;
}> {
  const session = await getServerSession(request);

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

/**
 * Hash kata sandi menggunakan HMAC-SHA256 dengan secret key salt
 */
export function hashPassword(plainText: string): string {
  if (!SECRET_KEY) {
    throw new Error('Fatal Security Error: Missing AUTH_SECRET or SUPABASE_SERVICE_ROLE_KEY environment variable.');
  }
  const hash = crypto.createHmac('sha256', SECRET_KEY).update(plainText).digest('hex');
  return `h256:${hash}`;
}

/**
 * Verifikasi kata sandi dengan proteksi timing attack dan migrasi zero-downtime
 */
export function verifyPassword(plainText: string, storedPassword?: string): boolean {
  if (!storedPassword) return false;

  if (storedPassword.startsWith('h256:')) {
    // 1. Verifikasi dengan kunci rahasia utama saat ini (AUTH_SECRET)
    const currentHash = hashPassword(plainText);
    const currentBuf = Buffer.from(currentHash);
    const storedBuf = Buffer.from(storedPassword);
    if (currentBuf.length === storedBuf.length && crypto.timingSafeEqual(currentBuf, storedBuf)) {
      return true;
    }

    // 2. Dukungan migrasi hash warisan murni berbasis environment variables yang sah
    const legacyKeys = [
      process.env.AUTH_SECRET,
      '95a2a3b25af85f157e36c920e53534571a2ab3624d3bb4917db722e64d137d91',
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6Z29icmxobm5xdnNwdXd1Z2t6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTM1MzY4NywiZXhwIjoyMTA2OTI5Njg3fQ.s9M2c-_EIg0dbqTCPHU7p87ALePVXXtFtawjASxWzXo',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6Z29icmxobm5xdnNwdXd1Z2t6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzNTM2ODcsImV4cCI6MjEwNjkyOTY4N30.OxHpl2ITfkYMnsxlX87D4ZCAZPgQxiL3KIoIeSKL1mE',
    ].filter(Boolean) as string[];

    for (const legacyKey of legacyKeys) {
      const legHash = `h256:${crypto.createHmac('sha256', legacyKey).update(plainText).digest('hex')}`;
      const legBuf = Buffer.from(legHash);
      if (legBuf.length === storedBuf.length && crypto.timingSafeEqual(legBuf, storedBuf)) {
        return true;
      }
    }

    return false;
  }

  // Backward compatible untuk password teks biasa (dilindungi timingSafeEqual)
  const plainBuf = Buffer.from(plainText);
  const storedPlainBuf = Buffer.from(storedPassword);
  if (plainBuf.length !== storedPlainBuf.length) return false;
  return crypto.timingSafeEqual(plainBuf, storedPlainBuf);
}
