/**
 * Modul Sanitasi Input Anti-XSS & Pembersihan Karakter Berbahaya
 * Digunakan untuk membersihkan data formulir publik (Kontak, PPDB, Pendaftaran)
 * sebelum disimpan ke database Supabase atau sistem file lokal.
 */

/**
 * Hapus tag HTML, skrip jahat, skema URI berbahaya, dan karakter kontrol null-byte
 */
export function sanitizeText(input: unknown, maxLength = 2000): string {
  if (typeof input !== 'string') return '';

  return input
    // 1. Hapus null-byte dan karakter kontrol ASCII tersembunyi
    .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F]/g, '')
    // 2. Hapus tag HTML berpasangan maupun tunggal (<script>...</script>, <iframe>, <img>, dll.)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    // 3. Netralkan skema URI berbahaya yang dapat mengeksekusi kode
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/data:\s*text\/html/gi, '')
    // 4. Hapus atribut event handler inline jika tersisa (onclick=, onerror=, onload=)
    .replace(/\bon\w+\s*=/gi, '')
    .trim()
    .slice(0, maxLength);
}

/**
 * Validasi dan pembersihan format email
 */
export function sanitizeEmail(input: unknown): string {
  if (typeof input !== 'string') return '';
  const cleaned = input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._%+-@]/g, '')
    .slice(0, 100);

  // Verifikasi pola dasar email
  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  return emailRegex.test(cleaned) ? cleaned : '';
}

/**
 * Pembersihan nomor telepon / WhatsApp (hanya izinkan angka, +, -, spasi)
 */
export function sanitizePhone(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[^0-9+\-\s]/g, '')
    .slice(0, 30);
}

/**
 * Sanitasi rekursif untuk seluruh properti string dalam sebuah objek payload formulir
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj;

  const result: any = Array.isArray(obj) ? [] : {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      if (key.toLowerCase().includes('email')) {
        result[key] = sanitizeEmail(value);
      } else if (key.toLowerCase().includes('phone') || key.toLowerCase().includes('wa') || key.toLowerCase().includes('telepon')) {
        result[key] = sanitizePhone(value);
      } else {
        result[key] = sanitizeText(value, 3000);
      }
    } else if (typeof value === 'object' && value !== null) {
      result[key] = sanitizeObject(value);
    } else {
      result[key] = value;
    }
  }

  return result as T;
}
