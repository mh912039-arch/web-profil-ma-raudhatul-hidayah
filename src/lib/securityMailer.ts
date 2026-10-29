import nodemailer from 'nodemailer';
import { getIpGeolocation, GeoIpInfo } from './geoIp';
import { supabase } from './supabaseClient';

export interface SecurityIncidentData {
  targetAccount: string;
  ipAddress: string;
  userAgent?: string;
  deviceInfo?: string;
  attemptCount?: number;
  timestamp?: string;
}

export interface SecurityAlertResult {
  success: boolean;
  messageId?: string;
  recipient: string;
  geoInfo: GeoIpInfo;
  error?: string;
}

/**
 * Buat template HTML email resmi peringatan keamanan insiden brute-force
 */
function buildSecurityAlertHtml(
  data: SecurityIncidentData,
  geo: GeoIpInfo,
  timeFormatted: string
): string {
  const coordText =
    geo.lat !== null && geo.lon !== null ? `${geo.lat}, ${geo.lon}` : 'Perkiraan Wilayah Kota';

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Peringatan Keamanan Insiden Brute-Force</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; line-height: 1.6;">
  <div style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 16px rgba(15, 23, 42, 0.06);">
    
    <!-- Header -->
    <div style="background-color: #1e3a8a; padding: 28px 32px; border-bottom: 3px solid #172554;">
      <p style="margin: 0 0 6px 0; color: #93c5fd; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;">
        Sistem Keamanan Portal &bull; MA Raudlatul Hidayah
      </p>
      <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 800; letter-spacing: -0.3px;">
        Peringatan Percobaan Masuk Tidak Sah
      </h1>
    </div>

    <!-- Alert Banner -->
    <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px 24px; margin: 24px 32px 0 32px; border-radius: 8px;">
      <p style="margin: 0; color: #991b1b; font-size: 13px; font-weight: 700;">
        Status: Akses Telah Diblokir Otomatis (5 Kali Sandi Salah)
      </p>
      <p style="margin: 4px 0 0 0; color: #7f1d1d; font-size: 12.5px;">
        Sistem pertahanan anti-brute force mendeteksi aktivitas mencurigakan yang mencoba mengakses akun portal madrasah Anda. Perangkat penyerang telah dibekukan selama 15 menit.
      </p>
    </div>

    <!-- Main Content -->
    <div style="padding: 24px 32px 32px 32px;">
      <p style="margin: 0 0 18px 0; font-size: 13.5px; color: #334155;">
        Berikut adalah rincian data teknis dan lokasi geografis dari upaya masuk yang dicegat oleh sistem keamanan:
      </p>

      <!-- Technical Details Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 12.5px;">
        <tbody>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 12px; color: #64748b; font-weight: 600; width: 36%;">Akun Target</td>
            <td style="padding: 10px 12px; color: #0f172a; font-weight: 700; font-family: monospace;">${data.targetAccount}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9; background-color: #f8fafc;">
            <td style="padding: 10px 12px; color: #64748b; font-weight: 600;">Waktu Insiden</td>
            <td style="padding: 10px 12px; color: #0f172a; font-weight: 600;">${timeFormatted}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 12px; color: #64748b; font-weight: 600;">Alamat IP Pelaku</td>
            <td style="padding: 10px 12px; color: #1e3a8a; font-weight: 800; font-family: monospace;">${geo.ip}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9; background-color: #f8fafc;">
            <td style="padding: 10px 12px; color: #64748b; font-weight: 600;">Perkiraan Lokasi</td>
            <td style="padding: 10px 12px; color: #0f172a; font-weight: 700;">${geo.city}, ${geo.region}, ${geo.country}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 12px; color: #64748b; font-weight: 600;">Koordinat Geografis</td>
            <td style="padding: 10px 12px; color: #0f172a; font-weight: 600; font-family: monospace;">${coordText}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9; background-color: #f8fafc;">
            <td style="padding: 10px 12px; color: #64748b; font-weight: 600;">Penyedia Jaringan (ISP)</td>
            <td style="padding: 10px 12px; color: #0f172a; font-weight: 600;">${geo.isp}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 12px; color: #64748b; font-weight: 600;">Perangkat &amp; Browser</td>
            <td style="padding: 10px 12px; color: #0f172a; font-weight: 600;">${data.deviceInfo || 'Tidak Teridentifikasi'}</td>
          </tr>
        </tbody>
      </table>

      <!-- Google Maps CTA Button -->
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
        <p style="margin: 0 0 12px 0; font-size: 13px; font-weight: 700; color: #0f172a;">
          Tinjau Titik Lokasi Penyerang di Peta:
        </p>
        <a href="${geo.mapsUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #1e3a8a; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; padding: 12px 28px; border-radius: 8px; box-shadow: 0 2px 4px rgba(30, 58, 138, 0.2);">
          Buka Lokasi di Google Maps
        </a>
        <p style="margin: 10px 0 0 0; font-size: 11px; color: #64748b;">
          Akurasi koordinat bergantung pada node jaringan publik yang disediakan oleh operator ISP bersangkutan.
        </p>
      </div>

      <!-- Action Recommendation -->
      <div style="background-color: #f1f5f9; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px;">
        <p style="margin: 0 0 8px 0; font-size: 12.5px; font-weight: 700; color: #0f172a;">
          Rekomendasi Tindakan untuk Administrator:
        </p>
        <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #475569;">
          <li style="margin-bottom: 4px;">Jika ini bukan percobaan masuk dari Anda, pastikan kata sandi akun madrasah tetap kuat dan unik.</li>
          <li style="margin-bottom: 4px;">Anda dapat meninjau log sesi aktif atau membuka blokir jika diperlukan melalui panel Admin CMS.</li>
          <li>Sistem akan tetap memantau secara real-time dan menolak seluruh lalu lintas dari IP tersebut selama masa penangguhan.</li>
        </ul>
      </div>

      <!-- Admin Portal CTA Link -->
      <div style="text-align: center;">
        <a href="https://web-profil-ma-raudlatul-hidayah.vercel.app/admin" style="font-size: 12px; color: #1e3a8a; text-decoration: underline; font-weight: 600;">
          Kunjungi Panel Admin CMS MA Raudlatul Hidayah
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #64748b;">
      <p style="margin: 0 0 4px 0;">
        Pemberitahuan Otomatis dari Security Daemon &bull; MA Raudlatul Hidayah Mauk, Kab. Tangerang
      </p>
      <p style="margin: 0;">
        Email ini dikirimkan ke alamat darurat terdaftar: <strong style="color: #334155;">pkm28979@gmail.com</strong>
      </p>
    </div>

  </div>
</body>
</html>`;
}

/**
 * Inisialisasi Transporter Nodemailer (Mendukung Gmail SMTP, Vercel Env, dan Supabase Database Fallback)
 */
async function createEmailTransporter() {
  let host = process.env.SMTP_HOST || 'smtp.gmail.com';
  let port = Number(process.env.SMTP_PORT || 465);
  let user = process.env.SMTP_USER || process.env.GMAIL_USER || 'pkm28979@gmail.com';
  let pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASS || process.env.SMTP_PASSWORD;

  // Jika env variable di Vercel belum disetel, ambil dari Supabase database
  if (!pass) {
    try {
      const { data } = await supabase
        .from('teachers_staff')
        .select('education')
        .eq('code', 'SYS_SMTP')
        .maybeSingle();

      if (data && data.education) {
        const parsed = JSON.parse(data.education);
        if (parsed && parsed.pass) {
          pass = parsed.pass;
          user = parsed.user || user;
          host = parsed.host || host;
          port = Number(parsed.port || port);
        }
      }
    } catch {
      // non-blocking
    }
  }

  if (!pass) {
    return null; // SMTP belum dikonfigurasi kata sandi aplikasinya
  }

  // Jika Gmail
  if (host.includes('gmail.com')) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
      },
    });
  }

  // Generic SMTP
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465 || process.env.SMTP_SECURE === 'true',
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Kirim email notifikasi keamanan insiden brute-force secara asinkron
 */
export async function sendSecurityAlertEmail(
  data: SecurityIncidentData
): Promise<SecurityAlertResult> {
  const recipient =
    process.env.ADMIN_ALERT_EMAIL || 'pkm28979@gmail.com';

  // 1. Ambil informasi geolokasi IP
  const geoInfo = await getIpGeolocation(data.ipAddress);

  // 2. Format waktu Indonesia Barat
  const timeFormatter = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const timeFormatted = `${timeFormatter.format(new Date()).replace('.', ':')} WIB`;

  // 3. Bangun HTML Email
  const htmlContent = buildSecurityAlertHtml(data, geoInfo, timeFormatted);

  // 4. Periksa transporter SMTP (Mendukung async Supabase fallback)
  const transporter = await createEmailTransporter();

  if (!transporter) {
    // Mode Simulasi / Logging jika SMTP_PASS belum dimasukkan ke .env
    console.warn(
      `[SECURITY NOTIFICATION] Upaya brute-force terdeteksi untuk akun ${data.targetAccount} dari IP ${geoInfo.ip} (${geoInfo.city}, ${geoInfo.country}). Peta: ${geoInfo.mapsUrl}. (SMTP belum dikonfigurasi)`
    );

    return {
      success: false,
      recipient,
      geoInfo,
      error: 'SMTP_PASS belum dikonfigurasi di environment variables (.env.local). Laporan dicatat di log sistem.',
    };
  }

  // 5. Kirim Email melalui Nodemailer
  try {
    const fromAddress =
      process.env.SMTP_FROM ||
      `"Keamanan Portal MA Raudlatul Hidayah" <${process.env.SMTP_USER || process.env.GMAIL_USER || 'no-reply@raudlatulhidayah.sch.id'}>`;

    const info = await transporter.sendMail({
      from: fromAddress,
      to: recipient,
      subject: `[PERINGATAN KEAMANAN] Percobaan Masuk Tidak Sah Terdeteksi (${geoInfo.city || 'Indonesia'})`,
      text: `PERINGATAN KEAMANAN MA RAUDLATUL HIDAYAH\n\nUpaya masuk tidak sah terdeteksi pada akun ${data.targetAccount}.\nAlamat IP: ${geoInfo.ip}\nLokasi: ${geoInfo.city}, ${geoInfo.region}, ${geoInfo.country}\nKoordinat: ${geoInfo.lat}, ${geoInfo.lon}\nPeta Google Maps: ${geoInfo.mapsUrl}\nPenyedia Jaringan: ${geoInfo.isp}\nWaktu: ${timeFormatted}\nStatus: Akses telah DIBLOKIR sementara selama 15 menit.`,
      html: htmlContent,
    });

    console.log(`[SECURITY NOTIFICATION] Email peringatan terkirim ke ${recipient}. MessageId: ${info.messageId}`);

    return {
      success: true,
      messageId: info.messageId,
      recipient,
      geoInfo,
    };
  } catch (err: any) {
    console.error('[SECURITY NOTIFICATION] Gagal mengirim email alert:', err);
    return {
      success: false,
      recipient,
      geoInfo,
      error: err.message || 'Gagal menghubungi server email SMTP',
    };
  }
}
