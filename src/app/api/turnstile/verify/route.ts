import { NextResponse } from 'next/server';
import { verifyTurnstileToken } from '@/lib/turnstile';

export const dynamic = 'force-dynamic';

/**
 * Endpoint Pengujian & Verifikasi Cloudflare Turnstile
 * POST: Memvalidasi token Turnstile dari browser pengunjung
 * GET: Memeriksa konektivitas dan status konfigurasi backend ke Cloudflare siteverify
 */

export async function GET() {
  const secretKey =
    process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY || '0x4AAAAAAF3MWFhDcP1uB5zA4gktcIPfD68';
  const siteKey =
    process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY || '0x4AAAAAAF3MWNHEzNkdoekl';

  try {
    // Ping Cloudflare siteverify dengan probe sintetis
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', 'probe_health_check');

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
      signal: AbortSignal.timeout(5000),
    });

    const data = await res.json().catch(() => ({}));
    const isSecretValid = !data['error-codes']?.includes('invalid-input-secret');

    return NextResponse.json({
      status: 'ok',
      service: 'Cloudflare Turnstile Verification API',
      siteKeyConfigured: Boolean(siteKey),
      secretKeyConfigured: Boolean(secretKey),
      cloudflareReachable: res.ok,
      secretKeyValid: isSecretValid,
      notes:
        'Endpoint siap memproses verifikasi token Turnstile untuk formulir kontak, PPDB, dan modul publik.',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Tidak dapat menjangkau server Cloudflare Turnstile',
        details: error?.message,
      },
      { status: 502 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cfIp = request.headers.get('cf-connecting-ip');
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const clientIp = cfIp || forwarded?.split(',')[0].trim() || realIp || '127.0.0.1';

    const body = await request.json().catch(() => ({}));
    const token = body?.token || body?.turnstileToken;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: 'Token Turnstile (token / turnstileToken) wajib disertakan.',
        },
        { status: 400 }
      );
    }

    const result = await verifyTurnstileToken(token, clientIp);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message || 'Verifikasi Turnstile gagal.',
          errorCodes: result.errorCodes,
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Token verifikasi Turnstile valid.',
      hostname: result.hostname,
      challengeTs: result.challengeTs,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan sistem saat memvalidasi Turnstile token.',
        details: error?.message,
      },
      { status: 500 }
    );
  }
}
