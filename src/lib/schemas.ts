import { z } from 'zod';

/**
 * Skema Validasi Pesan Formulir Kontak (/kontak)
 * Memastikan setiap data pertanyaan atau konsultasi dari pengunjung valid dan aman.
 */
export const contactFormSchema = z.object({
  name: z
    .string('Nama lengkap wajib diisi.')
    .trim()
    .min(2, 'Nama lengkap minimal terdiri dari 2 karakter.')
    .max(100, 'Nama lengkap maksimal 100 karakter.'),
  message: z
    .string('Isi pesan wajib diisi.')
    .trim()
    .min(5, 'Isi pesan minimal terdiri dari 5 karakter.')
    .max(2000, 'Isi pesan maksimal 2000 karakter.'),
  subject: z
    .string()
    .trim()
    .max(150, 'Subjek pesan maksimal 150 karakter.')
    .optional()
    .default('Pertanyaan Pengunjung'),
  contact: z.string().trim().max(100).optional(),
  email: z
    .string()
    .trim()
    .email('Format alamat email tidak valid.')
    .max(100)
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .trim()
    .max(30)
    .optional()
    .or(z.literal('')),
  // Cloudflare Turnstile CAPTCHA token
  turnstileToken: z.string().optional().nullable(),
  // Anti-Bot Honeypot fields
  hp_website: z.string().optional(),
  bot_field: z.string().optional(),
  website: z.string().optional(),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

/**
 * Skema Validasi Formulir Pendaftaran Siswa dan Siswi Baru (PPDB Online)
 * Memverifikasi integritas data calon peserta didik madrasah sebelum disimpan ke database.
 */
export const ppdbRegistrationSchema = z.object({
  full_name: z
    .string('Nama lengkap calon siswa dan siswi wajib diisi.')
    .trim()
    .min(3, 'Nama lengkap minimal 3 karakter.')
    .max(100, 'Nama lengkap maksimal 100 karakter.'),
  nisn: z
    .string()
    .trim()
    .regex(/^$|^\d{10}$/, 'NISN harus terdiri dari tepat 10 digit angka (atau kosongkan jika belum memiliki).')
    .optional()
    .nullable(),
  gender: z.enum(['L', 'P'], 'Pilihan jenis kelamin harus L (Laki-laki) atau P (Perempuan).'),
  birth_place: z
    .string()
    .trim()
    .max(80, 'Tempat lahir maksimal 80 karakter.')
    .optional()
    .default('Tangerang'),
  birth_date: z
    .string()
    .trim()
    .regex(/^$|^\d{4}-\d{2}-\d{2}$/, 'Format tanggal lahir harus YYYY-MM-DD.')
    .optional()
    .nullable(),
  previous_school: z
    .string()
    .trim()
    .max(120, 'Nama sekolah asal maksimal 120 karakter.')
    .optional()
    .nullable(),
  parent_name: z
    .string('Nama orang tua/wali wajib diisi.')
    .trim()
    .min(3, 'Nama orang tua/wali minimal 3 karakter.')
    .max(100, 'Nama orang tua/wali maksimal 100 karakter.'),
  parent_whatsapp: z.preprocess(
    (val) => (typeof val === 'string' ? val.replace(/[\s\-]/g, '') : val),
    z
      .string('Nomor WhatsApp orang tua/wali wajib diisi.')
      .trim()
      .regex(
        /^(\+62|62|08)[0-9]{8,14}$/,
        'Nomor WhatsApp tidak valid. Gunakan format Indonesia yang aktif (contoh: 08123456789 atau +628123456789).'
      )
  ),
  home_address: z
    .string()
    .trim()
    .max(300, 'Alamat domisili maksimal 300 karakter.')
    .optional()
    .nullable(),
  registration_path: z
    .enum(['domisili', 'afirmasi', 'prestasi', 'mutasi', 'reguler', 'tahfidz'])
    .optional()
    .default('domisili'),
  documents: z.record(z.string(), z.any()).optional().default({}),
  status: z
    .enum(['submitted', 'verified', 'accepted', 'rejected'])
    .optional()
    .default('submitted'),
  admin_notes: z.string().trim().max(500).optional().nullable(),
  // Cloudflare Turnstile CAPTCHA token
  turnstileToken: z.string().optional().nullable(),
  // Anti-Bot Honeypot fields
  hp_website: z.string().optional(),
  bot_field: z.string().optional(),
  website: z.string().optional(),
});

export type PpdbRegistrationInput = z.infer<typeof ppdbRegistrationSchema>;
