import { NextResponse } from 'next/server';
import { createSessionToken, COOKIE_NAME, UserRole, verifyPassword, hashPassword } from '@/lib/auth';
import { parseUserAgent } from '@/lib/deviceParser';
import { readUsers, writeUsers, readSessions, writeSessions, UserSessionItem } from '@/lib/userStore';
import { checkRateLimit, recordFailedAttempt, resetRateLimit } from '@/lib/rateLimiter';
import { sendSecurityAlertEmail } from '@/lib/securityMailer';

export async function POST(request: Request) {
  try {
    const cfIp = request.headers.get('cf-connecting-ip');
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const clientIp = cfIp || forwarded?.split(',')[0].trim() || realIp || '127.0.0.1';

    const userAgentStr = request.headers.get('user-agent') || '';
    const deviceInfo = parseUserAgent(userAgentStr);

    const body = await request.json().catch(() => ({}));
    const { identifier = '', password = '' } = body;

    const idLower = String(identifier).trim().toLowerCase();
    const pass = String(password).trim();

    // 1. Proteksi Anti-Brute Force Tingkat Lanjut (Dual Tracking: IP & Identifier)
    const rateCheck = await checkRateLimit(clientIp, idLower);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          locked: true,
          remainingSeconds: rateCheck.remainingSeconds,
          remainingMinutes: rateCheck.remainingMinutes,
          message: `Terlalu banyak percobaan masuk yang gagal. Demi keamanan portal, akses dibatasi sementara selama ${rateCheck.remainingMinutes} menit.`,
          details: rateCheck.lockedReason,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateCheck.remainingSeconds),
          },
        }
      );
    }

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

    // Helper: Catat audit & Kirim Email Peringatan Keamanan saat Terkunci
    const handleLockoutIncident = async (targetUser?: any) => {
      try {
        let sessions = await readSessions();
        const alertSession: UserSessionItem = {
          id: `sec-lock-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          user_id: targetUser ? targetUser.id : 'unauthorized',
          user_name: targetUser ? targetUser.name : `Target: ${idLower}`,
          email: targetUser ? targetUser.email : idLower,
          role: targetUser ? targetUser.role : 'siswa',
          device_name: 'Peringatan Keamanan: Terkunci Otomatis (Anti Brute-Force)',
          browser: `${deviceInfo.browser} (${deviceInfo.os})`,
          os: deviceInfo.os,
          device_type: deviceInfo.deviceType,
          ip_address: clientIp,
          login_time: new Date().toISOString(),
          status: 'expired',
        };
        sessions.unshift(alertSession);
        if (sessions.length > 100) sessions = sessions.slice(0, 100);
        await writeSessions(sessions);
      } catch {
        // non-blocking
      }

      // Kirim Notifikasi Email Darurat Asinkron dengan Koordinat Google Maps
      sendSecurityAlertEmail({
        targetAccount: idLower,
        ipAddress: clientIp,
        userAgent: userAgentStr,
        deviceInfo: `${deviceInfo.os} (${deviceInfo.browser})`,
        attemptCount: 5,
      }).catch((err) => {
        console.warn('[SECURITY] Gagal mengirim email alert insiden:', err);
      });
    };

    // 2. Baca data akun pengguna (tersinkronisasi lokal & Supabase)
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

      // Verifikasi kata sandi
      const expectedPassword =
        matchedUser.password ||
        (matchedUser.role === 'admin'
          ? (process.env.ADMIN_PASSWORD || 'admin123')
          : matchedUser.role === 'guru'
          ? (process.env.GURU_PASSWORD || 'guru2026')
          : (process.env.SISWA_PASSWORD || 'siswa2026'));

      if (!verifyPassword(pass, expectedPassword)) {
        const attempt = await recordFailedAttempt(clientIp, idLower);

        if (attempt.locked) {
          handleLockoutIncident(matchedUser);
        }

        return NextResponse.json(
          {
            success: false,
            locked: attempt.locked,
            remainingAttempts: attempt.remainingAttempts,
            remainingSeconds: attempt.remainingSeconds,
            remainingMinutes: attempt.remainingMinutes,
            message: attempt.feedbackMessage,
          },
          { status: attempt.locked ? 429 : 401 }
        );
      }

      // Auto-upgrade sandi plaintext atau kunci legacy menjadi hash kriptografis dengan AUTH_SECRET terbaru
      const currentExpectedHash = hashPassword(pass);
      if (matchedUser.password !== currentExpectedHash) {
        matchedUser.password = currentExpectedHash;
        writeUsers(users).catch((err) => console.warn('Could not auto-hash password:', err));
      }

      detectedRole = matchedUser.role;
      username = matchedUser.name;
    } else {
      // 3. Akun tidak terdaftar di direktori pengguna
      const attempt = await recordFailedAttempt(clientIp, idLower);

      if (attempt.locked) {
        handleLockoutIncident();
      }

      return NextResponse.json(
        {
          success: false,
          locked: attempt.locked,
          remainingAttempts: attempt.remainingAttempts,
          remainingSeconds: attempt.remainingSeconds,
          remainingMinutes: attempt.remainingMinutes,
          message: attempt.locked
            ? attempt.feedbackMessage
            : 'Akun tidak terdaftar di sistem. Silakan periksa kembali email atau username Anda.',
        },
        { status: attempt.locked ? 429 : 401 }
      );
    }

    if (!detectedRole) {
      const attempt = await recordFailedAttempt(clientIp, idLower);

      if (attempt.locked) {
        handleLockoutIncident();
      }

      return NextResponse.json(
        {
          success: false,
          locked: attempt.locked,
          remainingAttempts: attempt.remainingAttempts,
          remainingSeconds: attempt.remainingSeconds,
          remainingMinutes: attempt.remainingMinutes,
          message: attempt.locked
            ? attempt.feedbackMessage
            : 'Identitas akun atau kata sandi tidak cocok. Pastikan data yang dimasukkan benar.',
        },
        { status: attempt.locked ? 429 : 401 }
      );
    }

    // Login Berhasil: Reset seluruh catatan percobaan gagal untuk IP & Akun ini
    await resetRateLimit(clientIp, idLower);

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

    // Simpan ke HttpOnly Cookie (Strict, Secure, Lax)
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
