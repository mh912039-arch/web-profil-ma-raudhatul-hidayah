import fs from 'fs/promises';
import path from 'path';
import { supabase } from './supabaseClient';

export interface UserAccountItem {
  id: string;
  name: string;
  email: string;
  username: string;
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
  nip_nisn?: string;
  note?: string;
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

export const usersFilePath = path.join(process.cwd(), 'src', 'data', 'usersData.json');
export const sessionsFilePath = path.join(process.cwd(), 'src', 'data', 'userSessionsData.json');

export async function readUsers(): Promise<UserAccountItem[]> {
  let localList: UserAccountItem[] = [];
  try {
    const raw = await fs.readFile(usersFilePath, 'utf-8');
    localList = JSON.parse(raw);
  } catch {
    localList = [];
  }

  // Sinkronisasi data overrides dari Supabase (persisten di Vercel)
  try {
    const { data: supaAuth } = await supabase
      .from('teachers_staff')
      .select('education')
      .eq('code', 'SYS_AUTH')
      .maybeSingle();

    if (supaAuth && supaAuth.education) {
      const overrides: Record<string, Partial<UserAccountItem>> = JSON.parse(supaAuth.education);
      const listMap = new Map<string, UserAccountItem>();
      localList.forEach((u) => listMap.set(u.id, u));

      for (const [id, ovr] of Object.entries(overrides)) {
        if (listMap.has(id)) {
          const cur = listMap.get(id)!;
          listMap.set(id, { ...cur, ...ovr });
        } else if (ovr && (ovr as any).name && (ovr as any).email) {
          listMap.set(id, ovr as UserAccountItem);
        }
      }
      return Array.from(listMap.values());
    }
  } catch (err) {
    // Fallback ke localList jika Supabase error
  }

  return localList;
}

export async function writeUsers(data: UserAccountItem[]): Promise<void> {
  // 1. Simpan ke Supabase agar persisten di Vercel serverless
  try {
    const overrides: Record<string, Partial<UserAccountItem>> = {};
    for (const u of data) {
      overrides[u.id] = {
        id: u.id,
        name: u.name,
        email: u.email,
        username: u.username,
        password: u.password,
        role: u.role,
        status: u.status,
        permissions: u.permissions,
        created_at: u.created_at,
        last_login: u.last_login,
        last_device: u.last_device,
        last_device_type: u.last_device_type,
        last_ip: u.last_ip,
        is_online: u.is_online,
        nip_nisn: u.nip_nisn,
        note: u.note,
      };
    }
    const { data: updated, error: supaErr } = await supabase
      .from('teachers_staff')
      .update({ education: JSON.stringify(overrides) })
      .eq('code', 'SYS_AUTH')
      .select('id');

    if (supaErr || !updated || updated.length === 0) {
      await supabase.from('teachers_staff').insert({
        name: 'Sistem Autentikasi Pengguna',
        code: 'SYS_AUTH',
        category_label: 'Sistem',
        subject_name: 'Security Auth',
        education: JSON.stringify(overrides),
        order_no: 9999,
      });
    }
  } catch (err) {
    console.warn('Gagal sinkronisasi data pengguna ke Supabase:', err);
  }

  // 2. Best-effort write ke file lokal
  try {
    await fs.writeFile(usersFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    // EROFS safe on Vercel
  }
}

export async function readSessions(): Promise<UserSessionItem[]> {
  let localList: UserSessionItem[] = [];
  try {
    const raw = await fs.readFile(sessionsFilePath, 'utf-8');
    localList = JSON.parse(raw);
  } catch {
    localList = [];
  }

  try {
    const { data: supaSess } = await supabase
      .from('teachers_staff')
      .select('education')
      .eq('code', 'SYS_SESS')
      .maybeSingle();

    if (supaSess && supaSess.education) {
      const parsed = JSON.parse(supaSess.education);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    // Fallback ke localList jika Supabase error
  }

  return localList;
}

export async function writeSessions(data: UserSessionItem[]): Promise<void> {
  const limited = data.slice(0, 100);

  // 1. Simpan ke Supabase agar persisten di Vercel serverless
  try {
    const { data: updated, error: supaErr } = await supabase
      .from('teachers_staff')
      .update({ education: JSON.stringify(limited) })
      .eq('code', 'SYS_SESS')
      .select('id');

    if (supaErr || !updated || updated.length === 0) {
      await supabase.from('teachers_staff').insert({
        name: 'Sistem Sesi Pengguna',
        code: 'SYS_SESS',
        category_label: 'Sistem',
        subject_name: 'Security Sessions',
        education: JSON.stringify(limited),
        order_no: 9998,
      });
    }
  } catch (err) {
    console.warn('Gagal sinkronisasi data sesi ke Supabase:', err);
  }

  // 2. Best-effort write ke file lokal
  try {
    await fs.writeFile(sessionsFilePath, JSON.stringify(limited, null, 2), 'utf-8');
  } catch (err) {
    // EROFS safe on Vercel
  }
}
