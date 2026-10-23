import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import {
  getActiveLockouts,
  unlockTarget,
  clearAllRateLimits,
} from '@/lib/rateLimiter';

export async function GET() {
  const auth = await requireAuth(['admin']);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const lockouts = await getActiveLockouts();
    return NextResponse.json({
      success: true,
      data: lockouts,
      serverTime: Date.now(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Gagal memuat data rate limiter.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireAuth(['admin']);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const body = await request.json();
    const { action, key } = body;

    if (action === 'clear_all') {
      await clearAllRateLimits();
      return NextResponse.json({
        success: true,
        message: 'Seluruh pembatasan rate limit dan lockout berhasil direset.',
      });
    }

    if (action === 'unlock' && key) {
      const unlocked = await unlockTarget(key);
      if (unlocked) {
        return NextResponse.json({
          success: true,
          message: `Target ${key} berhasil dibuka dari pembatasan.`,
        });
      } else {
        return NextResponse.json({
          success: true,
          message: `Target ${key} tidak ditemukan atau telah kedaluwarsa secara otomatis.`,
        });
      }
    }

    return NextResponse.json(
      { success: false, message: 'Aksi tidak valid atau parameter tidak lengkap.' },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Gagal memproses pembukaan kunci rate limiter.' },
      { status: 500 }
    );
  }
}
