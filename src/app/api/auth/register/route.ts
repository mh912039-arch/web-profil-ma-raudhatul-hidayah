import { NextResponse } from 'next/server';
import { readUsers, writeUsers, UserAccountItem } from '@/lib/userStore';

export async function POST(request: Request) {
  try {
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

    // Periksa apakah email atau username sudah terdaftar
    const existing = users.find(
      (u) => (u.email && u.email.toLowerCase() === cleanEmail) ||
             (u.username && u.username.toLowerCase() === cleanEmail)
    );

    if (existing) {
      if (existing.status === 'Nonaktif') {
        return NextResponse.json(
          {
            success: false,
            message: 'Email ini sudah terdaftar dan saat ini sedang dalam antrean verifikasi Administrator.',
          },
          { status: 409 }
        );
      }
      return NextResponse.json(
        {
          success: false,
          message: 'Email ini sudah terdaftar sebagai akun aktif. Silakan langsung masuk di halaman login.',
        },
        { status: 409 }
      );
    }

    // Default permissions berdasarkan peran
    const permissions =
      role === 'guru'
        ? ['schedules', 'classes', 'calendar', 'articles', 'achievements', 'extracurricular']
        : ['schedules', 'classes', 'calendar'];

    // Ambil client IP
    const cfIp = request.headers.get('cf-connecting-ip');
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const clientIp = cfIp || forwarded?.split(',')[0].trim() || realIp || '127.0.0.1';

    const newUser: UserAccountItem = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      username: cleanEmail.split('@')[0],
      password: password.trim(),
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
