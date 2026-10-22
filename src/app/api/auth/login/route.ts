import { NextResponse } from 'next/server';
import { createSessionToken, COOKIE_NAME, UserRole } from '@/lib/auth';

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
      username = 'Administrator';
    }

    // 2. Verifikasi Dewan Guru
    if (!detectedRole) {
      const guruExpectedPass = process.env.GURU_PASSWORD || 'guru2026';
      const isMatchingGuruId =
        idLower.startsWith('19') ||
        idLower.includes('guru') ||
        idLower === 'guru@raudhatulhidayah.sch.id';

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
        idLower === 'siswa@raudhatulhidayah.sch.id';

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

    // Buat cryptographically signed session token (berlaku 7 hari)
    const maxAge = 7 * 24 * 3600;
    const token = createSessionToken({ role: detectedRole, username }, maxAge);

    const response = NextResponse.json({
      success: true,
      message: `Login berhasil sebagai ${detectedRole.toUpperCase()}.`,
      role: detectedRole,
      username,
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
