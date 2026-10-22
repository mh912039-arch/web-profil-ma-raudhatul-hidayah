import { NextResponse } from 'next/server';
import { createSessionToken, COOKIE_NAME, UserRole } from '@/lib/auth';
import { parseUserAgent } from '@/lib/deviceParser';
import { readUsers, writeUsers, readSessions, writeSessions, UserSessionItem } from '@/lib/userStore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier = '', password = '' } = body;

    const idLower = String(identifier).trim().toLowerCase();
    const pass = String(password).trim();

    if (!idLower) {
      return NextResponse.json(
        { success: false, message: 'NISN, NIP, atau Email wajib diisi.' },
        { status: 400 }
      );
    }

    if (!pass) {
      return NextResponse.json(
        { success: false, message: 'Kata sandi wajib diisi.' },
        { status: 400 }
      );
    }

    // 1. Baca data akun pengguna (tersinkronisasi lokal & Supabase)
    const users = await readUsers();

    const matchedUser = users.find(
      (u) =>
        (u.email && u.email.toLowerCase() === idLower) ||
        (u.username && u.username.toLowerCase() === idLower)
    );

    let detectedRole: UserRole | null = null;
    let username = idLower;

    if (matchedUser) {
      // Periksa status aktif
      if (matchedUser.status === 'Nonaktif') {
        return NextResponse.json(
          {
            success: false,
            message: 'Akses belum aktif: Akun Anda sedang menunggu konfirmasi atau aktivasi dari Administrator Madrasah. Silakan hubungi TU/Administrator sekolah untuk persetujuan akun.',
          },
          { status: 403 }
        );
      }

      // Verifikasi kata sandi: HARUS SESUAI dengan kata sandi yang tersimpan di sistem admin
      const expectedPassword =
        matchedUser.password ||
        (matchedUser.role === 'admin'
          ? (process.env.ADMIN_PASSWORD || 'admin123')
          : matchedUser.role === 'guru'
          ? (process.env.GURU_PASSWORD || 'guru2026')
          : (process.env.SISWA_PASSWORD || 'siswa2026'));

      if (pass !== expectedPassword) {
        return NextResponse.json(
          {
            success: false,
            message: 'Kata sandi salah. Harap masukkan kata sandi yang sesuai.',
          },
          { status: 401 }
        );
      }

      detectedRole = matchedUser.role;
      username = matchedUser.name;
    } else {
      // 2. Akun tidak terdaftar di direktori pengguna
      return NextResponse.json(
        {
          success: false,
          message: 'Akun tidak terdaftar di sistem. Silakan periksa kembali email atau username Anda.',
        },
        { status: 401 }
      );
    }

    if (!detectedRole) {
      return NextResponse.json(
        {
          success: false,
          message: 'Identitas akun atau kata sandi tidak cocok. Pastikan data yang dimasukkan benar.',
        },
        { status: 401 }
      );
    }

    // Detect Device, Browser, OS & IP Client
    const cfIp = request.headers.get('cf-connecting-ip');
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const clientIp = cfIp || forwarded?.split(',')[0].trim() || realIp || '127.0.0.1';
    const userAgentStr = request.headers.get('user-agent') || '';
    const deviceInfo = parseUserAgent(userAgentStr);

    const timeFormatter = new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const timeStr = timeFormatter.format(new Date()).replace('.', ':');
    const formattedLoginTime = `Hari ini, ${timeStr} WIB`;

    // Perbarui riwayat login pengguna di Supabase & local
    if (matchedUser) {
      matchedUser.last_login = formattedLoginTime;
      matchedUser.last_device = deviceInfo.display;
      matchedUser.last_device_type = deviceInfo.deviceType;
      matchedUser.last_ip = clientIp;
      matchedUser.is_online = true;
      matchedUser.last_seen = new Date().toISOString();

      try {
        await writeUsers(users);
      } catch (err) {
        console.warn('Gagal menyimpan update pengguna saat login:', err);
      }
    }

    // Catat log sesi login baru di Supabase & local
    try {
      let sessions = await readSessions();

      const newSession: UserSessionItem = {
        id: `sess-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        user_id: matchedUser ? matchedUser.id : `usr-${detectedRole}`,
        user_name: username,
        email: matchedUser ? matchedUser.email : idLower,
        role: detectedRole,
        device_name: `${deviceInfo.os} (${deviceInfo.browser})`,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        device_type: deviceInfo.deviceType,
        ip_address: clientIp,
        login_time: new Date().toISOString(),
        status: 'active',
      };

      sessions.unshift(newSession);
      if (sessions.length > 100) sessions = sessions.slice(0, 100);

      await writeSessions(sessions);
    } catch (err) {
      console.warn('Gagal menyimpan sesi login:', err);
    }

    // Buat cryptographically signed session token (berlaku 7 hari)
    const maxAge = 7 * 24 * 3600;
    const token = createSessionToken(
      {
        role: detectedRole,
        username,
        userId: matchedUser ? matchedUser.id : undefined,
        email: matchedUser ? matchedUser.email : idLower,
      },
      maxAge
    );

    const response = NextResponse.json({
      success: true,
      message: `Login berhasil sebagai ${detectedRole.toUpperCase()}.`,
      role: detectedRole,
      username,
      device: deviceInfo.display,
      permissions: matchedUser ? matchedUser.permissions : undefined,
    });

    // Simpan ke HttpOnly Cookie
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan sistem saat proses login.' },
      { status: 500 }
    );
  }
}
