export interface GeoIpInfo {
  ip: string;
  city: string;
  region: string;
  country: string;
  countryCode: string;
  isp: string;
  org: string;
  lat: number | null;
  lon: number | null;
  mapsUrl: string;
  isLocal: boolean;
}

/**
 * Deteksi apakah alamat IP merupakan localhost atau private network
 */
export function isPrivateIp(ip: string): boolean {
  const clean = ip.replace('::ffff:', '').trim();
  if (
    clean === '127.0.0.1' ||
    clean === '::1' ||
    clean === 'localhost' ||
    clean.startsWith('192.168.') ||
    clean.startsWith('10.') ||
    clean.startsWith('172.16.')
  ) {
    return true;
  }
  return false;
}

/**
 * Ambil informasi geolokasi dari IP publik dengan multi-provider fallback
 */
export async function getIpGeolocation(rawIp: string): Promise<GeoIpInfo> {
  const ip = (rawIp || '127.0.0.1').replace('::ffff:', '').trim();

  // 1. Tangani IP Lokal / Jaringan Internal
  if (isPrivateIp(ip)) {
    return {
      ip,
      city: 'Jaringan Lokal (Development)',
      region: 'Local Network',
      country: 'Indonesia',
      countryCode: 'ID',
      isp: 'Localhost / Internal Network',
      org: 'Pengembangan Mandiri',
      lat: -6.0489, // Koordinat perkiraan Mauk, Kab. Tangerang (MAS Raudhatul Hidayah)
      lon: 106.5292,
      mapsUrl: 'https://www.google.com/maps?q=-6.0489,106.5292',
      isLocal: true,
    };
  }

  // 2. Provider Utama: ip-api.com
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500); // Batas 3.5 detik

    const res = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,regionName,city,lat,lon,isp,org`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data.status === 'success') {
        const lat = typeof data.lat === 'number' ? data.lat : null;
        const lon = typeof data.lon === 'number' ? data.lon : null;
        const mapsUrl =
          lat !== null && lon !== null
            ? `https://www.google.com/maps?q=${lat},${lon}`
            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${data.city || ''}, ${data.country || ''}`
              )}`;

        return {
          ip,
          city: data.city || 'Tidak Diketahui',
          region: data.regionName || '-',
          country: data.country || 'Indonesia',
          countryCode: data.countryCode || 'ID',
          isp: data.isp || data.org || 'Penyedia Layanan Internet',
          org: data.org || data.isp || '-',
          lat,
          lon,
          mapsUrl,
          isLocal: false,
        };
      }
    }
  } catch (err) {
    // Lanjut ke fallback jika provider utama gagal
  }

  // 3. Provider Cadangan: ipwhois.app
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`https://ipwhois.app/json/${ip}`, { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data.success !== false) {
        const lat = typeof data.latitude === 'number' ? data.latitude : null;
        const lon = typeof data.longitude === 'number' ? data.longitude : null;
        const mapsUrl =
          lat !== null && lon !== null
            ? `https://www.google.com/maps?q=${lat},${lon}`
            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${data.city || ''}, ${data.country || ''}`
              )}`;

        return {
          ip,
          city: data.city || 'Tidak Diketahui',
          region: data.region || '-',
          country: data.country || 'Indonesia',
          countryCode: data.country_code || 'ID',
          isp: data.isp || data.org || 'Penyedia Layanan Internet',
          org: data.org || data.isp || '-',
          lat,
          lon,
          mapsUrl,
          isLocal: false,
        };
      }
    }
  } catch {
    // Abaikan
  }

  // Default Fallback jika lookup gagal
  return {
    ip,
    city: 'Lokasi Tidak Teridentifikasi',
    region: '-',
    country: 'Indonesia',
    countryCode: 'ID',
    isp: 'Penyedia Layanan Internet',
    org: '-',
    lat: null,
    lon: null,
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ip)}`,
    isLocal: false,
  };
}
