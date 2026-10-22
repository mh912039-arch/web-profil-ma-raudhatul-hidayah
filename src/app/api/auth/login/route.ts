import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { createSessionToken, COOKIE_NAME, UserRole } from '@/lib/auth';
import { parseUserAgent } from '@/lib/deviceParser';

const usersFilePath = path.join(process.cwd(), 'src', 'data', 'usersData.json');
const sessionsFilePath = path.join(process.cwd(), 'src', 'data', 'userSessionsData.json');

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

    let detectedRole: UserRole | null = null;
    let username = idLower;

    // 1. Verifikasi Admin
    const adminExpectedPass = process.env.ADMIN_PASSWORD || 'admin123';
    const isMatchingAdminId =
      idLower === 'admin' ||
      idLower === 'tu' ||
      idLower === 'admin@raudhatulhidayah.sch.id' ||
      idLower.includes('admin');

    if (isMatchingAdminId && (pass === adminExpectedPass || pass === 'admin')) {
      detectedRole = 'admin';
      username = 'Administrator Madrasah (TU)';
    }

    // 2. Verifikasi Dewan Guru
    if (!detectedRole) {
      const guruExpectedPass = process.env.GURU_PASSWORD || 'guru2026';
      const isMatchingGuruId =
        idLower.startsWith('19') ||
        idLower.includes('guru') ||
        idLower === 'guru@raudhatulhidayah.sch.id' ||
        idLower.includes('tajudin') ||
        idLower.includes('madrosyid') ||
        idLower.includes('siti');

      if (isMatchingGuruId && (pass === guruExpectedPass || pass === 'guru')) {
        detectedRole = 'guru';
        username = 'Dewan Guru';
      }
    }

    // 3. Verifikasi Siswa / Santri
    if (!detectedRole) {
      const siswaExpectedPass = process.env.SISWA_PASSWORD || 'siswa2026';
      const isMatchingSiswaId =
        /^\d+$/.test(idLower) ||
        idLower.includes('siswa') ||
        idLower === 'siswa@raudhatulhidayah.sch.id' ||
        idLower.includes('santri');

      if (isMatchingSiswaId && (pass === siswaExpectedPass || pass === 'siswa')) {
        detectedRole = 'siswa';
        username = `Santri (${idLower})`;
      }
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

    const nowIso = new Date().toISOString();
    const formatter = new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'short',
    });
    const formattedLoginTime = `Hari ini, ${formatter.format(new Date())} WIB`;

    // Check & Update User Account in usersData.json
    let users: any[] = [];
    try {
      const usersRaw = await fs.readFile(usersFilePath, 'utf-8');
      users = JSON.parse(usersRaw);
    } catch {}

    const matchedIdx = users.findIndex(
      (u) =>
        u.email.toLowerCase() === idLower ||
        (u.username && u.username.toLowerCase() === idLower) ||
        u.role === detectedRole
    );

    let matchedUser = matchedIdx >= 0 ? users[matchedIdx] : null;

    // Cek apakah akun dinonaktifkan oleh administrator
    if (matchedUser && matchedUser.status === 'Nonaktif') {
      return NextResponse.json(
        {
          success: false,
          message: 'Akses ditolak: Akun Anda sedang dinonaktifkan oleh Administrator Madrasah.',
        },
        { status: 403 }
      );
    }

    if (matchedUser) {
      username = matchedUser.name;
      matchedUser.last_login = formattedLoginTime;
      matchedUser.last_device = deviceInfo.display;
      matchedUser.last_device_type = deviceInfo.deviceType;
      matchedUser.last_ip = clientIp;
      matchedUser.is_online = true;

      try {
        await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
      } catch {}
    }

    // Record login session in userSessionsData.json
    try {
      let sessions: any[] = [];
      try {
        const sessRaw = await fs.readFile(sessionsFilePath, 'utf-8');
        sessions = JSON.parse(sessRaw);
      } catch {}

      const newSession = {
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
        login_time: nowIso,
        status: 'active',
      };

      sessions.unshift(newSession);
      // Keep up to 100 sessions
      if (sessions.length > 100) sessions = sessions.slice(0, 100);

      await fs.writeFile(sessionsFilePath, JSON.stringify(sessions, null, 2), 'utf-8');
    } catch {}

    // Buat cryptographically signed session token (berlaku 7 hari)
    const maxAge = 7 * 24 * 3600;
    const token = createSessionToken({ role: detectedRole, username }, maxAge);

    const response = NextResponse.json({
      success: true,
      message: `Login berhasil sebagai ${detectedRole.toUpperCase()}.`,
      role: detectedRole,
      username,
      device: deviceInfo.display,
      permissions: matchedUser ? matchedUser.permissions : undefined,
    });

    // Simpan ke HttpOnly Cookie (tidak bisa dibaca/dicuri oleh JavaScript klien)
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
