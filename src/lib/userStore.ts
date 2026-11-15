import fs from 'fs/promises';
import path from 'path';
import { supabaseAdmin } from './supabaseClient';

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
  last_seen?: string;
  nip_nisn?: string;
  note?: string;
}

export function isUserOnline(user: UserAccountItem): boolean {
  if (!user.is_online) return false;
  if (!user.last_seen) return true;
  const diffMinutes = (Date.now() - new Date(user.last_seen).getTime()) / (1000 * 60);
  return diffMinutes < 5;
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
export const revokedFilePath = path.join(process.cwd(), 'src', 'data', 'revokedUsersData.json');

/**
 * Membaca daftar identitas akun yang telah dicabut/dihapus (Tombstone Blacklist)
 * Memastikan akun yang sudah dihapus tidak akan pernah bisa login atau divalidasi kembali.
 */
export async function readRevokedUserKeys(): Promise<Set<string>> {
  const set = new Set<string>();

  // 1. Sinkronisasi daftar akun dicabut dari Supabase (persisten di Vercel cloud)
  try {
    const { data: supaRows } = await supabaseAdmin
      .from('teachers_staff')
      .select('education')
      .eq('code', 'SYS_REV')
      .order('updated_at', { ascending: false, nullsFirst: false })
      .limit(1);

    const supaRev = supaRows && supaRows.length > 0 ? supaRows[0] : null;
    if (supaRev && supaRev.education) {
      const parsed = JSON.parse(supaRev.education);
      if (Array.isArray(parsed)) {
        parsed.forEach((k: string) => {
          if (k && typeof k === 'string') set.add(k.toLowerCase().trim());
        });
      }
    }
  } catch (err) {
    console.warn('Gagal membaca data akun dicabut dari Supabase:', err);
  }

  // 2. Best-effort baca dari file lokal
  try {
    const raw = await fs.readFile(revokedFilePath, 'utf-8');
    const localList: string[] = JSON.parse(raw);
    if (Array.isArray(localList)) {
      localList.forEach((k: string) => {
        if (k && typeof k === 'string') set.add(k.toLowerCase().trim());
      });
    }
  } catch {
    // ignore
  }

  return set;
}

/**
 * Mencatat akun ke dalam daftar pencabutan permanen (Blacklist Tombstone)
 */
export async function revokeUserAccounts(keys: string[]): Promise<void> {
  if (!keys || keys.length === 0) return;

  const currentSet = await readRevokedUserKeys();
  let changed = false;

  for (const k of keys) {
    if (k && typeof k === 'string') {
      const cleaned = k.toLowerCase().trim();
      if (cleaned && !currentSet.has(cleaned)) {
        currentSet.add(cleaned);
        changed = true;
      }
    }
  }

  if (!changed) return;

  const arrayToStore = Array.from(currentSet);

  // 1. Simpan ke Supabase (SYS_REV)
  try {
    const { data: updated, error: supaErr } = await supabaseAdmin
      .from('teachers_staff')
      .update({
        education: JSON.stringify(arrayToStore),
        is_active: true,
        updated_at: new Date().toISOString(),
      })
      .eq('code', 'SYS_REV')
      .select('id');

    if (supaErr || !updated || updated.length === 0) {
      await supabaseAdmin.from('teachers_staff').insert({
        name: 'Sistem Pencabutan Akun',
        code: 'SYS_REV',
        category_label: 'Sistem',
        subject_name: 'Security Revocation',
        education: JSON.stringify(arrayToStore),
        order_no: 9997,
        role: 'system',
        is_active: true,
        updated_at: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.warn('Gagal sinkronisasi data akun dicabut ke Supabase:', err);
  }

  // 2. Best-effort simpan ke file lokal
  try {
    await fs.writeFile(revokedFilePath, JSON.stringify(arrayToStore, null, 2), 'utf-8');
  } catch {
    // EROFS safe on Vercel
  }
}

/**
 * Menghapus akun dari daftar pencabutan (jika Administrator secara sadar membuat ulang akun tersebut)
 */
export async function unrevokeUserAccounts(keys: string[]): Promise<void> {
  if (!keys || keys.length === 0) return;

  const currentSet = await readRevokedUserKeys();
  let changed = false;

  for (const k of keys) {
    if (k && typeof k === 'string') {
      const cleaned = k.toLowerCase().trim();
      if (currentSet.has(cleaned)) {
        currentSet.delete(cleaned);
        changed = true;
      }
    }
  }

  if (!changed) return;

  const arrayToStore = Array.from(currentSet);

  try {
    await supabaseAdmin
      .from('teachers_staff')
      .update({
        education: JSON.stringify(arrayToStore),
        is_active: true,
        updated_at: new Date().toISOString(),
      })
      .eq('code', 'SYS_REV');
  } catch (err) {
    console.warn('Gagal sinkronisasi unrevoke ke Supabase:', err);
  }

  try {
    await fs.writeFile(revokedFilePath, JSON.stringify(arrayToStore, null, 2), 'utf-8');
  } catch {
    // ignore
  }
}

export async function readUsers(): Promise<UserAccountItem[]> {
  const revokedKeys = await readRevokedUserKeys();

  // 1. Sinkronisasi data pengguna dari Supabase (persisten di Vercel serverless)
  try {
    const { data: supaRows } = await supabaseAdmin
      .from('teachers_staff')
      .select('education')
      .eq('code', 'SYS_AUTH')
      .order('updated_at', { ascending: false, nullsFirst: false })
      .limit(1);

    const supaAuth = supaRows && supaRows.length > 0 ? supaRows[0] : null;

    if (supaAuth && supaAuth.education) {
      const parsed = JSON.parse(supaAuth.education);
      let userList: UserAccountItem[] = [];

      if (Array.isArray(parsed)) {
        userList = parsed;
      } else if (parsed && typeof parsed === 'object') {
        userList = Object.values(parsed);
      }

      // Filter ketat: Jangan pernah kembalikan akun yang telah dicabut / dihapus
      userList = userList.filter((u) => {
        if (!u || !u.id) return false;
        if (revokedKeys.has(u.id.toLowerCase())) return false;
        if (u.email && revokedKeys.has(u.email.toLowerCase().trim())) return false;
        if (u.username && revokedKeys.has(u.username.toLowerCase().trim())) return false;
        return true;
      });

      // Pastikan akun Developer selalu ada demi keamanan akses sistem
      const hasDev = userList.some(
        (u) =>
          u.id === 'usr-1' ||
          u.username?.toLowerCase() === 'developer' ||
          (u.email && ['admin@raudhatulhidayah.sch.id', 'admin@raudlatulhidayah.sch.id'].includes(u.email.toLowerCase()))
      );

      if (!hasDev) {
        try {
          const raw = await fs.readFile(usersFilePath, 'utf-8');
          const localList: UserAccountItem[] = JSON.parse(raw);
          const dev = localList.find(
            (u) =>
              u.id === 'usr-1' ||
              u.username?.toLowerCase() === 'developer' ||
              (u.email && ['admin@raudhatulhidayah.sch.id', 'admin@raudlatulhidayah.sch.id'].includes(u.email.toLowerCase()))
          );
          if (dev) {
            userList.unshift(dev);
          }
        } catch {
          // ignore
        }
      }

      return userList;
    }
  } catch (err) {
    console.warn('Gagal membaca data akun pengguna dari Supabase:', err);
  }

  // 2. Fallback baca file lokal jika Supabase tidak tersedia
  try {
    const raw = await fs.readFile(usersFilePath, 'utf-8');
    const localList: UserAccountItem[] = JSON.parse(raw);
    return localList.filter((u) => {
      if (!u || !u.id) return false;
      if (revokedKeys.has(u.id.toLowerCase())) return false;
      if (u.email && revokedKeys.has(u.email.toLowerCase().trim())) return false;
      if (u.username && revokedKeys.has(u.username.toLowerCase().trim())) return false;
      return true;
    });
  } catch {
    return [];
  }
}

export async function writeUsers(data: UserAccountItem[]): Promise<void> {
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
      last_seen: u.last_seen,
      nip_nisn: u.nip_nisn,
      note: u.note,
    };
  }

  // 1. Simpan ke Supabase agar persisten di Vercel serverless
  try {
    const { data: updated, error: supaErr } = await supabaseAdmin
      .from('teachers_staff')
      .update({
        education: JSON.stringify(overrides),
        is_active: true,
        updated_at: new Date().toISOString(),
      })
      .eq('code', 'SYS_AUTH')
      .select('id');

    if (supaErr || !updated || updated.length === 0) {
      const { error: insertErr } = await supabaseAdmin.from('teachers_staff').insert({
        name: 'Sistem Autentikasi Pengguna',
        code: 'SYS_AUTH',
        category_label: 'Sistem',
        subject_name: 'Security Auth',
        education: JSON.stringify(overrides),
        order_no: 9999,
        role: 'system',
        is_active: true,
        updated_at: new Date().toISOString(),
      });
      if (insertErr) {
        console.error('Gagal insert data pengguna ke Supabase:', insertErr);
        throw new Error(`Gagal menyimpan akun ke basis data cloud: ${insertErr.message}`);
      }
    }
  } catch (err: any) {
    console.error('Gagal sinkronisasi data pengguna ke Supabase:', err);
    throw err;
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
    const { data: supaRows } = await supabaseAdmin
      .from('teachers_staff')
      .select('education')
      .eq('code', 'SYS_SESS')
      .order('updated_at', { ascending: false })
      .limit(1);

    const supaSess = supaRows && supaRows.length > 0 ? supaRows[0] : null;

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
    const { data: updated, error: supaErr } = await supabaseAdmin
      .from('teachers_staff')
      .update({
        education: JSON.stringify(limited),
        is_active: true,
        updated_at: new Date().toISOString(),
      })
      .eq('code', 'SYS_SESS')
      .select('id');

    if (supaErr || !updated || updated.length === 0) {
      await supabaseAdmin.from('teachers_staff').insert({
        name: 'Sistem Sesi Pengguna',
        code: 'SYS_SESS',
        category_label: 'Sistem',
        subject_name: 'Security Sessions',
        education: JSON.stringify(limited),
        order_no: 9998,
        role: 'system',
        is_active: true,
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
