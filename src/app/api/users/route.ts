import { NextResponse } from 'next/server';
import { requireAuth, hashPassword } from '@/lib/auth';
import {
  readUsers,
  writeUsers,
  readSessions,
  writeSessions,
  isUserOnline,
  UserAccountItem,
  UserSessionItem,
} from '@/lib/userStore';

export type { UserAccountItem, UserSessionItem };

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Sanitasi data akun pengguna: jangan pernah kembalikan kolom hash/teks password ke antarmuka klien
 */
function sanitizeUser(u: UserAccountItem) {
  const { password: _pwd, ...sanitized } = u;
  return sanitized;
}

export async function GET() {
  // Hanya Administrator yang berhak mengelola direktori pengguna dan melihat sesi login
  const auth = await requireAuth(['admin']);
  if (!auth.authorized) {
    return auth.response!;
  }

  const rawUsers = await readUsers();
  const sessions = await readSessions();

  let hasStatusChange = false;
  const users = rawUsers.map((u) => {
    const online = isUserOnline(u);
    if (u.is_online && !online) {
      hasStatusChange = true;
      return { ...u, is_online: false };
    }
    return { ...u, is_online: online };
  });

  if (hasStatusChange) {
    writeUsers(users).catch(() => {});
  }

  const totalUsers = users.length;
  const activeSessions = sessions.filter((s) => s.status === 'active').length;
  const activeUsers = users.filter((u) => u.is_online).length;

  return NextResponse.json({
    success: true,
    users: users.map(sanitizeUser),
    sessions,
    stats: {
      totalUsers,
      activeSessions,
      activeUsers,
    },
  });
}

export async function POST(request: Request) {
  const auth = await requireAuth(['admin']);
  if (!auth.authorized) {
    return auth.response!;
  }

  try {
    const body = await request.json();

    if (!body.name || !body.email) {
      return NextResponse.json(
        { success: false, message: 'Nama lengkap dan email wajib diisi.' },
        { status: 400 }
      );
    }

    const users = await readUsers();

    const defaultPass = body.role === 'admin' ? 'admin123' : body.role === 'siswa' ? 'siswa2026' : 'guru2026';
    const newUser: UserAccountItem = {
      id: body.id || `usr-${Date.now()}`,
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      username: body.username?.trim().toLowerCase() || body.email.split('@')[0],
      password: hashPassword((body.password || defaultPass).trim()),
      role: body.role || 'guru',
      status: body.status || 'Aktif',
      permissions: Array.isArray(body.permissions)
        ? body.permissions
        : body.role === 'admin'
        ? [
            'overview',
            'ppdb',
            'registrations',
            'teachers',
            'articles',
            'achievements',
            'extracurricular',
            'schedules',
            'classes',
            'calendar',
            'messages',
            'profile',
            'homepage',
            'users',
          ]
        : ['schedules', 'classes', 'calendar', 'articles', 'achievements'],
      created_at: new Date().toISOString(),
      last_login: 'Belum pernah login',
      last_device: 'Belum ada data',
      last_device_type: 'desktop',
      last_ip: '-',
      is_online: false,
    };

    users.unshift(newUser);
    await writeUsers(users);

    return NextResponse.json({
      success: true,
      message: `Akun "${newUser.name}" berhasil ditambahkan dengan peran ${newUser.role.toUpperCase()}.`,
      user: sanitizeUser(newUser),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Gagal menambahkan akun pengguna.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const auth = await requireAuth(['admin']);
  if (!auth.authorized) {
    return auth.response!;
  }

  try {
    const body = await request.json();

    // 1. Aksi Cabut Sesi Login (Revoke Session)
    if (body.action === 'revoke_session' && body.session_id) {
      const sessions = await readSessions();
      const updatedSessions = sessions.map((s) =>
        s.id === body.session_id ? { ...s, status: 'expired' as const } : s
      );
      await writeSessions(updatedSessions);

      return NextResponse.json({
        success: true,
        message: 'Sesi login perangkat berhasil diputuskan.',
      });
    }

    // 2. Aksi Update Akun Pengguna & Hak Akses
    const { id, role, status, permissions, name, email, password } = body;
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID pengguna wajib disertakan.' },
        { status: 400 }
      );
    }

    const users = await readUsers();
    const idx = users.findIndex((u) => u.id === id);

    if (idx === -1) {
      return NextResponse.json(
        { success: false, message: 'Pengguna tidak ditemukan.' },
        { status: 404 }
      );
    }

    const updatedUser: UserAccountItem = {
      ...users[idx],
      ...(name ? { name: name.trim() } : {}),
      ...(email ? { email: email.trim().toLowerCase() } : {}),
      ...(role ? { role } : {}),
      ...(status ? { status } : {}),
      ...(password && String(password).trim() !== '' && !String(password).startsWith('h256:')
        ? { password: hashPassword(String(password).trim()) }
        : {}),
      ...(Array.isArray(permissions) ? { permissions } : {}),
    };

    users[idx] = updatedUser;
    await writeUsers(users);

    return NextResponse.json({
      success: true,
      message: `Hak akses untuk "${updatedUser.name}" berhasil diperbarui.`,
      user: sanitizeUser(updatedUser),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Gagal memperbarui hak akses pengguna.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const auth = await requireAuth(['admin']);
  if (!auth.authorized) {
    return auth.response!;
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID pengguna diperlukan.' },
        { status: 400 }
      );
    }

    let users = await readUsers();
    const beforeCount = users.length;
    users = users.filter((u) => u.id !== id);

    if (users.length === beforeCount) {
      return NextResponse.json(
        { success: false, message: 'Pengguna tidak ditemukan.' },
        { status: 404 }
      );
    }

    await writeUsers(users);

    return NextResponse.json({
      success: true,
      message: 'Akun pengguna berhasil dihapus.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Gagal menghapus akun pengguna.' },
      { status: 500 }
    );
  }
}
