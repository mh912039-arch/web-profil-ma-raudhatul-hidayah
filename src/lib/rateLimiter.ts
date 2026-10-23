import { supabase } from './supabaseClient';
import fs from 'fs/promises';
import path from 'path';

export interface RateLimitEntry {
  key: string; // "ip:1.2.3.4" | "user:admin"
  type: 'ip' | 'user';
  target: string;
  attempts: number;
  firstAttemptAt: number;
  lastAttemptAt: number;
  lockedUntil: number; // Timestamp ms, 0 jika belum terkunci
}

export interface RateLimitCheckResult {
  allowed: boolean;
  locked: boolean;
  remainingAttempts: number;
  remainingSeconds: number;
  remainingMinutes: number;
  lockedReason?: string;
}

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 menit
const WINDOW_DURATION_MS = 15 * 60 * 1000;  // 15 menit jendela percobaan

// Layer 1: In-Memory cache (sub-millisecond)
const memoryCache = new Map<string, RateLimitEntry>();
let lastSyncTimestamp = 0;
const SYNC_INTERVAL_MS = 20 * 1000; // Sinkronisasi database tiap 20 detik atau saat update

const localFallbackPath = path.join(process.cwd(), 'src', 'data', 'rateLimitData.json');

/**
 * Sinkronisasi data rate limit dari Supabase PostgreSQL (Layer 2)
 */
async function syncFromStorage(): Promise<void> {
  const now = Date.now();
  if (now - lastSyncTimestamp < SYNC_INTERVAL_MS && memoryCache.size > 0) {
    return;
  }

  try {
    const { data: row } = await supabase
      .from('teachers_staff')
      .select('education')
      .eq('code', 'SYS_RATE_LIMIT')
      .maybeSingle();

    if (row && row.education) {
      const parsed: RateLimitEntry[] = JSON.parse(row.education);
      if (Array.isArray(parsed)) {
        memoryCache.clear();
        for (const entry of parsed) {
          // Hanya masukkan entri yang belum kedaluwarsa
          if (entry.lockedUntil > now || now - entry.lastAttemptAt < WINDOW_DURATION_MS) {
            memoryCache.set(entry.key, entry);
          }
        }
      }
    }
    lastSyncTimestamp = now;
  } catch (err) {
    // Fallback baca lokal jika offline
    try {
      const raw = await fs.readFile(localFallbackPath, 'utf-8');
      const parsed: RateLimitEntry[] = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        for (const entry of parsed) {
          if (entry.lockedUntil > now || now - entry.lastAttemptAt < WINDOW_DURATION_MS) {
            memoryCache.set(entry.key, entry);
          }
        }
      }
    } catch {
      // Abaikan jika berkas belum ada
    }
  }
}

/**
 * Simpan data rate limit ke Supabase PostgreSQL & file lokal
 */
async function syncToStorage(): Promise<void> {
  const now = Date.now();
  const activeEntries: RateLimitEntry[] = [];

  for (const entry of memoryCache.values()) {
    // Bersihkan entri kedaluwarsa
    if (entry.lockedUntil > now || now - entry.lastAttemptAt < WINDOW_DURATION_MS) {
      activeEntries.push(entry);
    }
  }

  // 1. Simpan ke Supabase
  try {
    const { data: updated, error: supaErr } = await supabase
      .from('teachers_staff')
      .update({ education: JSON.stringify(activeEntries) })
      .eq('code', 'SYS_RATE_LIMIT')
      .select('id');

    if (supaErr || !updated || updated.length === 0) {
      await supabase.from('teachers_staff').insert({
        name: 'Sistem Proteksi Rate Limit',
        code: 'SYS_RATE_LIMIT',
        category_label: 'Sistem',
        subject_name: 'Security Rate Limit',
        education: JSON.stringify(activeEntries),
        order_no: 9997,
      });
    }
  } catch (err) {
    console.warn('Gagal menyimpan rate limit ke Supabase:', err);
  }

  // 2. Best-effort simpan lokal
  try {
    await fs.writeFile(localFallbackPath, JSON.stringify(activeEntries, null, 2), 'utf-8');
  } catch {
    // Safe on serverless read-only filesystem
  }
}

/**
 * Normalisasi IP & Identifier
 */
function cleanIp(ip: string): string {
  const trimmed = (ip || '127.0.0.1').trim();
  return trimmed.startsWith('::ffff:') ? trimmed.replace('::ffff:', '') : trimmed;
}

function cleanId(identifier?: string): string {
  return (identifier || '').trim().toLowerCase();
}

/**
 * Periksa apakah IP atau Akun sedang dibatasi / dikunci
 */
export async function checkRateLimit(
  rawIp: string,
  rawIdentifier?: string
): Promise<RateLimitCheckResult> {
  await syncFromStorage();

  const now = Date.now();
  const ip = cleanIp(rawIp);
  const identifier = cleanId(rawIdentifier);

  const ipKey = `ip:${ip}`;
  const userKey = identifier ? `user:${identifier}` : null;

  const ipRecord = memoryCache.get(ipKey);
  const userRecord = userKey ? memoryCache.get(userKey) : null;

  // 1. Cek apakah IP terkunci
  if (ipRecord && ipRecord.lockedUntil > now) {
    const remainingSeconds = Math.ceil((ipRecord.lockedUntil - now) / 1000);
    return {
      allowed: false,
      locked: true,
      remainingAttempts: 0,
      remainingSeconds,
      remainingMinutes: Math.ceil(remainingSeconds / 60),
      lockedReason: `Perangkat atau jaringan (IP: ${ip}) dibatasi sementara karena 5 kali percobaan gagal berturut-turut.`,
    };
  }

  // 2. Cek apakah Akun/Username pengguna terkunci (Anti Distributed Brute-Force)
  if (userRecord && userRecord.lockedUntil > now) {
    const remainingSeconds = Math.ceil((userRecord.lockedUntil - now) / 1000);
    return {
      allowed: false,
      locked: true,
      remainingAttempts: 0,
      remainingSeconds,
      remainingMinutes: Math.ceil(remainingSeconds / 60),
      lockedReason: `Akun "${identifier}" sedang dikunci sementara karena terdeteksi percobaan masuk tidak sah dari berbagai sumber.`,
    };
  }

  // 3. Hitung sisa percobaan yang tersisa
  const ipAttempts = ipRecord && now - ipRecord.lastAttemptAt < WINDOW_DURATION_MS ? ipRecord.attempts : 0;
  const userAttempts = userRecord && now - userRecord.lastAttemptAt < WINDOW_DURATION_MS ? userRecord.attempts : 0;
  const highestAttempts = Math.max(ipAttempts, userAttempts);
  const remaining = Math.max(0, MAX_FAILED_ATTEMPTS - highestAttempts);

  return {
    allowed: true,
    locked: false,
    remainingAttempts: remaining,
    remainingSeconds: 0,
    remainingMinutes: 0,
  };
}

/**
 * Catat percobaan login yang gagal (Increment IP dan Akun)
 */
export async function recordFailedAttempt(
  rawIp: string,
  rawIdentifier?: string
): Promise<{
  allowed: boolean;
  locked: boolean;
  remainingAttempts: number;
  remainingSeconds: number;
  remainingMinutes: number;
  feedbackMessage: string;
}> {
  await syncFromStorage();

  const now = Date.now();
  const ip = cleanIp(rawIp);
  const identifier = cleanId(rawIdentifier);

  const ipKey = `ip:${ip}`;
  const userKey = identifier ? `user:${identifier}` : null;

  // Helper pembaruan entri
  const updateEntry = (key: string, type: 'ip' | 'user', target: string): RateLimitEntry => {
    let entry = memoryCache.get(key);
    if (!entry || now - entry.lastAttemptAt > WINDOW_DURATION_MS) {
      entry = {
        key,
        type,
        target,
        attempts: 1,
        firstAttemptAt: now,
        lastAttemptAt: now,
        lockedUntil: 0,
      };
    } else {
      entry.attempts += 1;
      entry.lastAttemptAt = now;
    }

    if (entry.attempts >= MAX_FAILED_ATTEMPTS) {
      entry.lockedUntil = now + LOCKOUT_DURATION_MS;
    }

    memoryCache.set(key, entry);
    return entry;
  };

  const updatedIp = updateEntry(ipKey, 'ip', ip);
  const updatedUser = userKey ? updateEntry(userKey, 'user', identifier) : null;

  // Simpan perubahan ke storage
  await syncToStorage();

  const isLocked = updatedIp.lockedUntil > now || (updatedUser !== null && updatedUser.lockedUntil > now);
  const maxAttempts = Math.max(updatedIp.attempts, updatedUser ? updatedUser.attempts : 0);
  const remaining = Math.max(0, MAX_FAILED_ATTEMPTS - maxAttempts);

  let remainingSeconds = 0;
  let remainingMinutes = 0;

  if (isLocked) {
    const lockedUntil = Math.max(
      updatedIp.lockedUntil,
      updatedUser ? updatedUser.lockedUntil : 0
    );
    remainingSeconds = Math.ceil((lockedUntil - now) / 1000);
    remainingMinutes = Math.ceil(remainingSeconds / 60);

    return {
      allowed: false,
      locked: true,
      remainingAttempts: 0,
      remainingSeconds,
      remainingMinutes,
      feedbackMessage: `Batas percobaan tercapai (5 kali salah). Demi keamanan sistem madrasah, akses dibatasi sementara selama ${remainingMinutes} menit.`,
    };
  }

  // Pesan peringatan bertahap
  let feedbackMessage = 'Kata sandi salah. Harap periksa kembali sandi Anda.';
  if (remaining === 1) {
    feedbackMessage = 'Peringatan Keamanan: Tersisa 1 kali kesempatan lagi. Akses akan dibekukan selama 15 menit jika sandi kembali salah.';
  } else if (remaining === 2) {
    feedbackMessage = 'Kata sandi salah. Tersisa 2 kali percobaan sebelum akun/perangkat dikunci sementara.';
  }

  return {
    allowed: true,
    locked: false,
    remainingAttempts: remaining,
    remainingSeconds: 0,
    remainingMinutes: 0,
    feedbackMessage,
  };
}

/**
 * Reset catatan percobaan gagal setelah berhasil login
 */
export async function resetRateLimit(rawIp: string, rawIdentifier?: string): Promise<void> {
  const ip = cleanIp(rawIp);
  const identifier = cleanId(rawIdentifier);

  const ipKey = `ip:${ip}`;
  const userKey = identifier ? `user:${identifier}` : null;

  let hasChanges = false;
  if (memoryCache.has(ipKey)) {
    memoryCache.delete(ipKey);
    hasChanges = true;
  }
  if (userKey && memoryCache.has(userKey)) {
    memoryCache.delete(userKey);
    hasChanges = true;
  }

  if (hasChanges) {
    await syncToStorage();
  }
}

/**
 * Ambil daftar entri yang sedang aktif / terkunci (Untuk Admin CMS)
 */
export async function getActiveLockouts(): Promise<RateLimitEntry[]> {
  await syncFromStorage();
  const now = Date.now();
  const results: RateLimitEntry[] = [];

  for (const entry of memoryCache.values()) {
    if (entry.lockedUntil > now || now - entry.lastAttemptAt < WINDOW_DURATION_MS) {
      results.push(entry);
    }
  }

  return results.sort((a, b) => b.lastAttemptAt - a.lastAttemptAt);
}

/**
 * Buka kunci secara manual oleh Administrator
 */
export async function unlockTarget(key: string): Promise<boolean> {
  await syncFromStorage();
  if (memoryCache.has(key)) {
    memoryCache.delete(key);
    await syncToStorage();
    return true;
  }
  return false;
}

/**
 * Reset seluruh status pembatasan (Darurat / Maintenance)
 */
export async function clearAllRateLimits(): Promise<void> {
  memoryCache.clear();
  await syncToStorage();
}
