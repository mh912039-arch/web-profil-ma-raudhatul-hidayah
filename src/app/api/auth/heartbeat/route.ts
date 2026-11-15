import { NextResponse } from 'next/server';
import { getServerSession, validateSessionUser, COOKIE_NAME } from '@/lib/auth';
import { readUsers, writeUsers } from '@/lib/userStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json(
        { success: false, authenticated: false },
        { status: 401 }
      );
    }

    // Pastikan akun belum dihapus
    const validation = await validateSessionUser(session);
    if (!validation.valid) {
      const res = NextResponse.json(
        { success: false, authenticated: false, message: 'Akun telah dihapus atau dinonaktifkan.' },
        { status: 401 }
      );
      try {
        res.cookies.delete(COOKIE_NAME);
      } catch {}
      return res;
    }

    let bodyUserId: string | null = null;
    try {
      const body = await request.json();
      if (body) bodyUserId = body.userId || null;
    } catch {}

    const targetUserId = session.userId || bodyUserId;
    const targetUsername = session.username;
    const targetEmail = session.email;

    const users = await readUsers();
    let matched = false;
    const nowIso = new Date().toISOString();

    for (const u of users) {
      const isMatch =
        (targetUserId && u.id === targetUserId) ||
        (targetEmail && u.email.toLowerCase() === targetEmail.toLowerCase()) ||
        (targetUsername && (u.username?.toLowerCase() === targetUsername.toLowerCase() || u.name === targetUsername));

      if (isMatch) {
        u.is_online = true;
        u.last_seen = nowIso;
        matched = true;
        break;
      }
    }

    if (matched) {
      await writeUsers(users);
    } else {
      // Jika akun tidak ditemukan sama sekali di daftar pengguna aktif
      const res = NextResponse.json(
        { success: false, authenticated: false, message: 'Akun tidak lagi terdaftar.' },
        { status: 401 }
      );
      try {
        res.cookies.delete(COOKIE_NAME);
      } catch {}
      return res;
    }

    return NextResponse.json({
      success: true,
      online: true,
      timestamp: nowIso,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Heartbeat error' },
      { status: 500 }
    );
  }
}
