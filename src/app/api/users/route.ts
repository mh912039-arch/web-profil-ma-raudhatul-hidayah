import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { requireAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';

const usersFilePath = path.join(process.cwd(), 'src', 'data', 'usersData.json');
const sessionsFilePath = path.join(process.cwd(), 'src', 'data', 'userSessionsData.json');

export interface UserAccountItem {
  id: string;
  name: string;
  email: string;
  username?: string;
  password?: string;
  role: 'admin' | 'guru' | 'siswa';
  status: 'Aktif' | 'Nonaktif';
  permissions: string[];
  created_at?: string;
  last_login?: string;
  last_device?: string;
  last_device_type?: 'desktop' | 'mobile' | 'tablet';
  last_ip?: string;
  is_online?: boolean;
}

export interface UserSessionItem {
  id: string;
  user_id: string;
  user_name: string;
  email: string;
  role: string;
  device_name: string;
  browser: string;
  os: string;
  device_type: 'desktop' | 'mobile' | 'tablet';
  ip_address: string;
  login_time: string;
  status: 'active' | 'expired';
}

async function readUsers(): Promise<UserAccountItem[]> {
  try {
    const raw = await fs.readFile(usersFilePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeUsers(data: UserAccountItem[]): Promise<void> {
  try {
    await fs.writeFile(usersFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    // EROFS safe on Vercel
  }
}

async function readSessions(): Promise<UserSessionItem[]> {
  try {
    const raw = await fs.readFile(sessionsFilePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeSessions(data: UserSessionItem[]): Promise<void> {
  try {
    await fs.writeFile(sessionsFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    // EROFS safe on Vercel
  }
}

export async function GET() {
  // Hanya Administrator yang berhak mengelola direktori pengguna dan melihat sesi login
  const auth = requireAuth(['admin']);
  if (!auth.authorized) {
    return auth.response!;
  }

  const users = await readUsers();
  const sessions = await readSessions();

  const totalUsers = users.length;
  const activeSessions = sessions.filter((s) => s.status === 'active').length;
  const activeUsers = users.filter((u) => u.is_online).length;

  return NextResponse.json({
    success: true,
    users,
    sessions,
    stats: {
      totalUsers,
      activeSessions,
      activeUsers,
    },
  });
}

export async function POST(request: Request) {
  const auth = requireAuth(['admin']);
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
      password: (body.password || defaultPass).trim(),
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
      user: newUser,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Gagal menambahkan akun pengguna.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const auth = requireAuth(['admin']);
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
      ...(password !== undefined ? { password: String(password).trim() } : {}),
      ...(Array.isArray(permissions) ? { permissions } : {}),
    };

    users[idx] = updatedUser;
    await writeUsers(users);

    return NextResponse.json({
      success: true,
      message: `Hak akses untuk "${updatedUser.name}" berhasil diperbarui.`,
      user: updatedUser,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Gagal memperbarui hak akses pengguna.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const auth = requireAuth(['admin']);
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
