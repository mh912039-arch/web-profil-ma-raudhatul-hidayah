import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_NAME = 'mrh_session';
const SECRET_KEY =
  process.env.AUTH_SECRET ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'mrh-secret-key-2026-salt';

/**
 * Verifikasi Cryptographic HMAC-SHA256 Token di Edge Runtime
 */
async function verifyEdgeSession(token: string): Promise<any | null> {
  try {
    if (!token || !token.includes('.')) return null;
    const [base64Data, providedSig] = token.split('.');
    if (!base64Data || !providedSig) return null;

    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(SECRET_KEY),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    // Konversi base64url providedSig ke Uint8Array
    const base64 = providedSig.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const sigBytes = Uint8Array.from(atob(pad), (c) => c.charCodeAt(0));

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes,
      enc.encode(base64Data)
    );

    if (!isValid) return null;

    const jsonStr = atob(base64Data.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(jsonStr);

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Edge Guard: Proteksi Akses Halaman Panel Admin (/admin dan sub-path)
  if (pathname.startsWith('/admin')) {
    const sessionCookie = request.cookies.get(COOKIE_NAME)?.value;
    const session = sessionCookie ? await verifyEdgeSession(sessionCookie) : null;

    if (!session) {
      // Tolak akses tanpa izin di Edge sebelum komponen React diunduh
      const loginUrl = new URL('/masuk', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl, 307);
    }
  }

  // 2. Proteksi Akses API Pengguna & Hak Akses (/api/users)
  if (pathname.startsWith('/api/users')) {
    const sessionCookie = request.cookies.get(COOKIE_NAME)?.value;
    const session = sessionCookie ? await verifyEdgeSession(sessionCookie) : null;

    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          error: 'Akses ditolak: Hanya Administrator yang berhak mengakses direktori pengguna.',
        },
        { status: 401 }
      );
    }
  }

  // 3. Proteksi Mutasi Data API dari Serangan Cross-Site (CSRF / Origin Check)
  if (
    request.method !== 'GET' &&
    request.method !== 'HEAD' &&
    pathname.startsWith('/api/') &&
    !pathname.startsWith('/api/auth/') &&
    !pathname.startsWith('/api/contact') &&
    !pathname.startsWith('/api/upload') &&
    !pathname.startsWith('/api/registrations') &&
    !pathname.startsWith('/api/visitors')
  ) {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    const secFetchSite = request.headers.get('sec-fetch-site');

    if (secFetchSite && secFetchSite === 'cross-site') {
      return NextResponse.json(
        { success: false, error: 'Akses Ditolak: Permintaan Cross-Site diblokir.' },
        { status: 403 }
      );
    }

    if (origin && host) {
      const cleanOrigin = origin.replace(/^https?:\/\//, '');
      if (cleanOrigin !== host && !cleanOrigin.endsWith('.vercel.app')) {
        return NextResponse.json(
          { success: false, error: 'Akses Ditolak: Origin tidak valid.' },
          { status: 403 }
        );
      }
    }
  }

  const response = NextResponse.next();

  // 4. Injeksi Header Keamanan Maksimal (Standard A+ & Sucuri Minimal Risk)
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  );
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=(), usb=()'
  );
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.delete('x-powered-by');

  return response;
}

export const config = {
  matcher: [
    /*
     * Terapkan middleware ke rute /admin, /api, dan halaman publik
     * Kecuali static assets (_next/static, _next/image, favicon.ico, images)
     */
    '/admin/:path*',
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
