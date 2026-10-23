import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import {
  getActiveLockouts,
  unlockTarget,
  clearAllRateLimits,
} from '@/lib/rateLimiter';
import { sendSecurityAlertEmail } from '@/lib/securityMailer';

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
      targetEmail: process.env.ADMIN_ALERT_EMAIL || 'pkm28979@gmail.com',
      smtpConfigured: Boolean(
        process.env.SMTP_PASS || process.env.GMAIL_APP_PASS || process.env.SMTP_PASSWORD
      ),
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

    if (action === 'test_alert') {
      const cfIp = request.headers.get('cf-connecting-ip');
      const forwarded = request.headers.get('x-forwarded-for');
      const realIp = request.headers.get('x-real-ip');
      const clientIp = cfIp || forwarded?.split(',')[0].trim() || realIp || '180.252.164.21';

      const result = await sendSecurityAlertEmail({
        targetAccount: auth.session?.email || 'admin@raudhatulhidayah.sch.id',
        ipAddress: clientIp,
        userAgent: request.headers.get('user-agent') || '',
        deviceInfo: 'Pengujian Sistem Keamanan Mandiri (Admin CMS)',
        attemptCount: 5,
      });

      return NextResponse.json({
        success: true,
        message: result.success
          ? `Simulasi email peringatan keamanan berhasil dikirim ke ${result.recipient}.`
          : `Simulasi teruji: ${result.error || 'SMTP belum aktif'}.`,
        geoInfo: result.geoInfo,
        recipient: result.recipient,
        emailSent: result.success,
      });
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
