import { NextResponse } from 'next/server';
import { getServerSession, validateSessionUser, COOKIE_NAME } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json(
      { authenticated: false, role: null, username: null },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  }

  // Verifikasi apakah akun masih aktif terdaftar atau sudah dihapus
  const validation = await validateSessionUser(session);
  if (!validation.valid) {
    const response = NextResponse.json(
      {
        authenticated: false,
        role: null,
        username: null,
        error:
          validation.reason === 'account_disabled'
            ? 'Akun Anda sedang dinonaktifkan oleh Administrator.'
            : 'Akun Anda telah dihapus dari direktori pengguna.',
        revoked: true,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
    try {
      response.cookies.delete(COOKIE_NAME);
    } catch {}
    return response;
  }

  return NextResponse.json(
    {
      authenticated: true,
      role: session.role,
      username: session.username,
      userId: session.userId,
      email: session.email,
      exp: session.exp,
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    }
  );
}
