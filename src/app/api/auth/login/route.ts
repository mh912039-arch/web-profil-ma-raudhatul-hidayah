import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { createSessionToken, COOKIE_NAME, UserRole } from '@/lib/auth';
import { parseUserAgent } from '@/lib/deviceParser';
import { supabase } from '@/lib/supabaseClient';

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

    // 1. Baca data akun pengguna dari usersData.json
    let users: any[] = [];
    try {
      const usersRaw = await fs.readFile(usersFilePath, 'utf-8');
      users = JSON.parse(usersRaw);
    } catch {}

    // Sinkronisasi data overrides dari Supabase (persisten di Vercel)
    try {
      const { data: supaAuth } = await supabase
        .from('teachers_staff')
        .select('education')
        .eq('code', 'SYS_AUTH')
        .maybeSingle();

      if (supaAuth && supaAuth.education) {
        const overrides: Record<string, any> = JSON.parse(supaAuth.education);
        const map = new Map<string, any>();
        users.forEach((u) => map.set(u.id, u));
        for (const [id, ovr] of Object.entries(overrides)) {
          if (map.has(id)) {
            map.set(id, { ...map.get(id), ...ovr });
          } else if (ovr && ovr.name && ovr.email) {
            map.set(id, ovr);
          }
        }
        users = Array.from(map.values());
      }
    } catch {}

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
            message: 'Akses ditolak: Akun Anda sedang dinonaktifkan oleh Administrator Madrasah.',
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

    const nowIso = new Date().toISOString();
    const formatter = new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'short',
    });
    const formattedLoginTime = `Hari ini, ${formatter.format(new Date())} WIB`;

    // Perbarui riwayat login pengguna di usersData.json
    if (matchedUser) {
      matchedUser.last_login = formattedLoginTime;
      matchedUser.last_device = deviceInfo.display;
      matchedUser.last_device_type = deviceInfo.deviceType;
      matchedUser.last_ip = clientIp;
      matchedUser.is_online = true;

      try {
        await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
      } catch {}
    }

    // Catat log sesi login baru di userSessionsData.json
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
