-- ====================================================================
-- SQL SINKRONISASI LENGKAP SUPABASE MA RAUDHATUL HIDAYAH
-- Salin dan jalankan script ini di:
-- Supabase Dashboard -> SQL Editor -> New query -> Run
-- ====================================================================

-- 1. Buka akses penuh (Disable RLS) agar Admin CMS dapat Insert, Update, Delete
ALTER TABLE IF EXISTS public.school_profile DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.teachers_staff DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.championship_photos DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.articles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.contact_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ppdb_registrations DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.facilities DISABLE ROW LEVEL SECURITY;

-- 2. Beri hak akses schema public ke role anon dan authenticated
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- 3. Lengkapi kolom pendukung pada tabel championship_photos
ALTER TABLE IF EXISTS public.championship_photos ADD COLUMN IF NOT EXISTS sub TEXT;
ALTER TABLE IF EXISTS public.championship_photos ADD COLUMN IF NOT EXISTS badge TEXT;
ALTER TABLE IF EXISTS public.championship_photos ADD COLUMN IF NOT EXISTS slug TEXT;

-- 4. Buat tabel homepage_config untuk tampilan halaman depan
CREATE TABLE IF NOT EXISTS public.homepage_config (
  id INT PRIMARY KEY DEFAULT 1,
  hero_title TEXT,
  hero_tagline TEXT,
  hero_badge TEXT,
  hero_background TEXT,
  school_logo TEXT,
  marquee_text1 TEXT,
  marquee_cta1 TEXT,
  marquee_link1 TEXT,
  marquee_text2 TEXT,
  marquee_cta2 TEXT,
  marquee_link2 TEXT,
  sambutan_heading TEXT,
  sambutan_subtitle TEXT,
  sambutan_badge TEXT,
  headmaster_name TEXT,
  headmaster_role TEXT,
  headmaster_photo TEXT,
  sambutan_text1 TEXT,
  sambutan_text2 TEXT,
  cta_text TEXT,
  cta_link TEXT,
  stat1_value TEXT,
  stat1_label TEXT,
  stat2_value TEXT,
  stat2_label TEXT,
  stat3_value TEXT,
  stat3_label TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE IF EXISTS public.homepage_config DISABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.homepage_config TO anon, authenticated;

-- 5. Pastikan Storage Bucket 'articles' bersifat public untuk foto/gambar
INSERT INTO storage.buckets (id, name, public)
VALUES ('articles', 'articles', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Berikan izin akses penuh ke storage bucket articles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Public Access Articles Storage'
  ) THEN
    CREATE POLICY "Public Access Articles Storage" ON storage.objects
    FOR ALL TO public
    USING (bucket_id = 'articles')
    WITH CHECK (bucket_id = 'articles');
  END IF;
END $$;

-- 6. Tabel visitor_logs untuk analitik pelacakan traffic kunjungan website
CREATE TABLE IF NOT EXISTS public.visitor_logs (
  id BIGSERIAL PRIMARY KEY,
  ip_hash TEXT,
  path TEXT,
  user_agent TEXT,
  referrer TEXT,
  visited_at TIMESTAMPTZ DEFAULT NOW(),
  visit_date DATE DEFAULT CURRENT_DATE
);

ALTER TABLE IF EXISTS public.visitor_logs DISABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.visitor_logs TO anon, authenticated;
CREATE INDEX IF NOT EXISTS idx_visitor_logs_date ON public.visitor_logs(visit_date);

-- 7. Kolom jalur pendaftaran & dokumen persyaratan pada ppdb_registrations
ALTER TABLE IF EXISTS public.ppdb_registrations ADD COLUMN IF NOT EXISTS registration_path TEXT DEFAULT 'domisili';
ALTER TABLE IF EXISTS public.ppdb_registrations ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '{}'::jsonb;
ALTER TABLE IF EXISTS public.ppdb_registrations ADD COLUMN IF NOT EXISTS kk_url TEXT;
ALTER TABLE IF EXISTS public.ppdb_registrations ADD COLUMN IF NOT EXISTS akta_url TEXT;
ALTER TABLE IF EXISTS public.ppdb_registrations ADD COLUMN IF NOT EXISTS ijazah_url TEXT;
ALTER TABLE IF EXISTS public.ppdb_registrations ADD COLUMN IF NOT EXISTS afirmasi_url TEXT;
ALTER TABLE IF EXISTS public.ppdb_registrations ADD COLUMN IF NOT EXISTS prestasi_url TEXT;


