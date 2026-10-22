import { NextResponse } from 'next/server';
import { COOKIE_NAME, getServerSession } from '@/lib/auth';
import { readUsers, writeUsers, readSessions, writeSessions } from '@/lib/userStore';

export async function POST(request: Request) {
  try {
    let bodyUserId: string | null = null;
    let bodyUsername: string | null = null;

    try {
      const body = await request.json();
      if (body) {
        bodyUserId = body.userId || null;
        bodyUsername = body.username || null;
      }
    } catch {}

    const session = getServerSession();
    const targetUserId = session?.userId || bodyUserId;
    const targetUsername = session?.username || bodyUsername;
    const targetEmail = session?.email;

    // 1. Perbarui status pengguna menjadi offline di Supabase & local
    try {
      const users = await readUsers();
      let updated = false;

      for (const u of users) {
        const match =
          (targetUserId && u.id === targetUserId) ||
          (targetEmail && u.email.toLowerCase() === targetEmail.toLowerCase()) ||
          (targetUsername && (u.username?.toLowerCase() === targetUsername.toLowerCase() || u.name === targetUsername));

        if (match) {
          u.is_online = false;
          u.last_seen = undefined;
          updated = true;
          break;
        }
      }

      if (updated) {
        await writeUsers(users);
      }
    } catch (err) {
      console.warn('Gagal memperbarui status offline pengguna:', err);
    }

    // 2. Tandai sesi pengguna sebagai kadaluarsa (expired) di Supabase & local
    try {
      const sessions = await readSessions();
      let sessUpdated = false;

      const newSessions = sessions.map((s) => {
        const match =
          (targetUserId && s.user_id === targetUserId) ||
          (targetEmail && s.email.toLowerCase() === targetEmail.toLowerCase()) ||
          (targetUsername && s.user_name === targetUsername);

        if (match && s.status === 'active') {
          sessUpdated = true;
          return { ...s, status: 'expired' as const };
        }
        return s;
      });

      if (sessUpdated) {
        await writeSessions(newSessions);
      }
    } catch (err) {
      console.warn('Gagal memperbarui status sesi:', err);
    }

    const response = NextResponse.json({
      success: true,
      message: 'Anda telah berhasil keluar (logout) dari sesi portal.',
    });

    // 3. Hapus cookie sesi portal
    response.cookies.set({
      name: COOKIE_NAME,
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Gagal memproses keluar sesi.' },
      { status: 500 }
    );
  }
}
