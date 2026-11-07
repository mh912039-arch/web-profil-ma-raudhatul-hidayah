/**
 * Cloudflare Turnstile Server-side Token Verification Helper
 * Endpoint: https://challenges.cloudflare.com/turnstile/v0/siteverify
 *
 * Memvalidasi token respons Turnstile yang dikirim dari browser pengunjung
 * untuk memastikan formulir dikirim oleh manusia asli, bukan bot atau script otomatis.
 */

export interface TurnstileVerificationResult {
  success: boolean;
  message?: string;
  hostname?: string;
  challengeTs?: string;
  errorCodes?: string[];
}

export async function verifyTurnstileToken(
  token?: string | null,
  remoteIp?: string | null
): Promise<TurnstileVerificationResult> {
  const secretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;

  // Jika kunci rahasia belum dikonfigurasi di local dev dan bukan produksi, loloskan dengan peringatan
  if (!secretKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[Turnstile] CLOUDFLARE_TURNSTILE_SECRET_KEY belum dikonfigurasi. Melewati verifikasi CAPTCHA di lingkungan dev.'
      );
      return { success: true };
    }
    return {
      success: false,
      message: 'Konfigurasi verifikasi keamanan server belum lengkap.',
    };
  }

  // Token wajib ada jika secret key telah dikonfigurasi
  if (!token || typeof token !== 'string' || token.trim() === '') {
    return {
      success: false,
      message: 'Verifikasi keamanan (Cloudflare Turnstile) wajib diselesaikan.',
    };
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token.trim());
    if (remoteIp) {
      formData.append('remoteip', remoteIp);
    }

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      console.error('[Turnstile] Cloudflare siteverify HTTP error:', response.status);
      return {
        success: false,
        message: 'Gagal menghubungi server verifikasi Cloudflare.',
      };
    }

    const data = await response.json();

    if (data.success) {
      return {
        success: true,
        hostname: data.hostname,
        challengeTs: data.challenge_ts,
      };
    }

    console.warn('[Turnstile] Verification rejected by Cloudflare:', data['error-codes']);
    return {
      success: false,
      message: 'Verifikasi keamanan tidak valid atau telah kedaluwarsa. Silakan lakukan verifikasi ulang.',
      errorCodes: data['error-codes'],
    };
  } catch (error: any) {
    console.error('[Turnstile] Verification exception:', error);
    return {
      success: false,
      message: 'Terjadi kendala saat memeriksa verifikasi keamanan. Silakan coba kembali.',
    };
  }
}
