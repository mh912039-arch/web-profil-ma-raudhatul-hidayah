import { NextResponse } from 'next/server';
import { readUsers, writeUsers, UserAccountItem } from '@/lib/userStore';
import { hashPassword } from '@/lib/auth';
import { checkEndpointRateLimit } from '@/lib/rateLimiter';

export async function POST(request: Request) {
  try {
    // 1. Ambil client IP untuk proteksi laju request (Rate Limiting)
    const cfIp = request.headers.get('cf-connecting-ip');
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const clientIp = cfIp || forwarded?.split(',')[0].trim() || realIp || '127.0.0.1';

    // Batasan aman: maksimal 5 kali pendaftaran akun per 15 menit per IP
    const rateCheck = checkEndpointRateLimit(clientIp, 'register', 5, 15 * 60);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Terlalu banyak permintaan pendaftaran dari jaringan Anda. Demi keamanan, silakan coba lagi dalam ${Math.ceil(rateCheck.retryAfterSeconds / 60)} menit.`,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) },
        }
      );
    }

    const body = await request.json();
    const { name, email, password, role, nip_nisn, note } = body;

    if (!name || typeof name !== 'string' || name.trim().length < 3) {
      return NextResponse.json(
        { success: false, message: 'Nama lengkap wajib diisi minimal 3 karakter.' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Format alamat email tidak valid.' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.trim().length < 4) {
      return NextResponse.json(
        { success: false, message: 'Kata sandi wajib diisi minimal 4 karakter.' },
        { status: 400 }
      );
    }

    if (role !== 'guru' && role !== 'siswa') {
      return NextResponse.json(
        {
          success: false,
          message: 'Pendaftaran publik hanya diperuntukkan bagi Dewan Guru atau Santri/Siswa. Peran Administrator hanya dapat dibuat oleh pengelola sekolah.',
        },
        { status: 403 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const users = await readUsers();

    // Periksa apakah email atau username sudah terdaftar (Pesan dinetralisasi demi mencegah User Enumeration)
    const existing = users.find(
      (u) => (u.email && u.email.toLowerCase() === cleanEmail) ||
             (u.username && u.username.toLowerCase() === cleanEmail)
    );

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: 'Alamat email atau username ini telah terdaftar di sistem. Jika Anda belum dapat masuk, silakan hubungi Administrator sekolah.',
        },
        { status: 409 }
      );
    }

    // Default permissions berdasarkan peran
    const permissions =
      role === 'guru'
        ? ['schedules', 'classes', 'calendar', 'articles', 'achievements', 'extracurricular']
        : ['schedules', 'classes', 'calendar'];

    const newUser: UserAccountItem = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      username: cleanEmail.split('@')[0],
      password: hashPassword(password.trim()), // Sandi selalu di-hash kriptografis dengan AUTH_SECRET
      role,
      status: 'Nonaktif', // Selalu Nonaktif agar dikonfirmasi oleh Admin terlebih dahulu
      permissions,
      created_at: new Date().toISOString(),
      last_login: 'Belum pernah login',
      last_device: 'Pendaftaran Mandiri Portal',
      last_device_type: 'desktop',
      last_ip: clientIp,
      is_online: false,
      nip_nisn: nip_nisn ? String(nip_nisn).trim() : '-',
      note: note ? String(note).trim() : '-',
    };

    users.unshift(newUser);
    await writeUsers(users);

    return NextResponse.json({
      success: true,
      message: `Pendaftaran berhasil dikirim. Akun untuk "${newUser.name}" telah masuk ke antrean verifikasi dengan status Menunggu Konfirmasi Administrator.`,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Terjadi kesalahan saat memproses pendaftaran akun.' },
      { status: 500 }
    );
  }
}
