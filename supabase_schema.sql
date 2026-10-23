-- ==============================================================================
-- SKEMA BASIS DATA SUPABASE — MAS RAUDHATUL HIDAYAH (WEBSITE PROFIL & CMS ADMIN)
-- ==============================================================================
-- Proyek: Website Resmi & Dashboard Admin CMS MAS Raudhatul Hidayah
-- Engine: PostgreSQL / Supabase
-- Fitur: RLS (Row Level Security), Timestamps Trigger, Storage Buckets, & Seed Data
-- ==============================================================================

-- 1. EKSTENSI BASIS DATA
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. FUNGSI OTOMATIS PEMBARUAN TIMESTAMP (updated_at)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 3. TABEL PROFIL PENGGUNA CMS (ADMIN & OPERATOR)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('super_admin', 'editor', 'admin_ppdb')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 4. TABEL IDENTITAS & PROFIL MADRASAH (SINGLETON: ID = 1)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.school_profile (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    name TEXT NOT NULL DEFAULT 'MAS Raudhatul Hidayah',
    formal_name TEXT NOT NULL DEFAULT 'Madrasah Aliyah Swasta Raudhatul Hidayah',
    level TEXT NOT NULL DEFAULT 'Madrasah Aliyah (MA)',
    npsn VARCHAR(20) DEFAULT '69980315',
    nsm VARCHAR(20) DEFAULT '131236030045',
    accreditation VARCHAR(5) DEFAULT 'A',
    founded_year VARCHAR(10) DEFAULT '2012',
    address TEXT NOT NULL DEFAULT 'Jl. Raya Tanjung Kait No. 33, RT 02 / RW 01',
    village TEXT NOT NULL DEFAULT 'Tanjung Anom',
    district TEXT NOT NULL DEFAULT 'Mauk',
    regency TEXT NOT NULL DEFAULT 'Kabupaten Tangerang',
    province TEXT NOT NULL DEFAULT 'Banten',
    postal_code VARCHAR(10) DEFAULT '15330',
    phone VARCHAR(30) DEFAULT '0817-6614-723',
    whatsapp VARCHAR(30) DEFAULT '628176614723',
    email VARCHAR(100) DEFAULT 'info@maraudhatulhidayah.sch.id',
    operating_hours TEXT DEFAULT 'Senin - Sabtu: 07.00 - 15.00 WIB',
    maps_embed_url TEXT,
    motto TEXT DEFAULT 'Membentuk Generasi Berkarakter, Cerdas & Berakhlak Mulia',
    vision TEXT DEFAULT 'Terwujudnya generasi yang beriman dan bertakwa, berakhlak mulia, unggul dalam prestasi akademik dan non-akademik, serta berwawasan lingkungan dan keislaman yang moderat.',
    missions JSONB DEFAULT '[
        "Menyelenggarakan proses pembelajaran yang inovatif, bermakna, dan berbasis Kurikulum Merdeka Terpadu.",
        "Membina kepribadian santri berlandaskan adab Islami dan nilai-nilai kepesantrenan.",
        "Mengembangkan bakat dan potensi peserta didik melalui kegiatan riset, sains, dan ekstrakurikuler unggulan.",
        "Menjalin sinergi kemitraan bersama orang tua murid dan masyarakat dalam menciptakan ekosistem belajar yang kondusif."
    ]'::jsonb,
    stats_active_students INT DEFAULT 350,
    stats_certified_teachers INT DEFAULT 22,
    stats_graduates_pass_rate NUMERIC(5,2) DEFAULT 100.00,
    stats_alumni_ptn NUMERIC(5,2) DEFAULT 88.50,
    logo_url TEXT DEFAULT '/school-logo.png',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 5. TABEL SAMBUTAN KEPALA MADRASAH (SINGLETON: ID = 1)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.headmaster_greeting (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    name TEXT NOT NULL DEFAULT 'Drs. H. Mulyadi',
    title TEXT NOT NULL DEFAULT 'Kepala Madrasah Aliyah Swasta Raudhatul Hidayah',
    degrees TEXT DEFAULT 'S.Pd.I, M.Pd',
    photo_url TEXT DEFAULT '/kepala-madrasah.jpg',
    greeting_title TEXT NOT NULL DEFAULT 'Menyiapkan Insan Kamil di Era Transformasi Digital',
    greeting_paragraphs JSONB DEFAULT '[
        "Assalamu’alaikum Warahmatullahi Wabarakatuh. Puji syukur senantiasa kita panjatkan ke hadirat Allah SWT atas segala limpahan rahmat, hidayah, dan inayah-Nya.",
        "Selamat datang di gerbang resmi website MAS Raudhatul Hidayah Mauk. Madrasah kami hadir sebagai kawah candradimuka pendidikan Islam modern yang mengintegrasikan keluhuran adab salaf dengan keunggulan sains masa kini.",
        "Melalui implementasi Kurikulum Merdeka Terpadu Fase E & F, kami berkomitmen mendampingi setiap santri agar tidak hanya cakap secara kognitif, melainkan teguh akidahnya dan santun pekertinya."
    ]'::jsonb,
    closing_quote TEXT DEFAULT 'Pendidikan sejati bukan sekadar menjejalkan pengetahuan ke benak murid, melainkan menyalakan lentera akhlak dan memandu mereka menemukan kebermaknaan hidup.',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 6. TABEL PENGATURAN PPDB (SINGLETON: ID = 1)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.ppdb_settings (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    category TEXT NOT NULL DEFAULT 'PENERIMAAN PESERTA DIDIK BARU (PPDB) • MAS RAUDHATUL HIDAYAH',
    title TEXT NOT NULL DEFAULT 'Membentuk Generasi Berkarakter, Cerdas & Berakhlak Mulia',
    academic_year VARCHAR(20) NOT NULL DEFAULT '2027/2028',
    badge_text VARCHAR(50) NOT NULL DEFAULT 'TELAH DIBUKA!',
    description TEXT NOT NULL DEFAULT 'MAS Raudhatul Hidayah hadir sebagai kawah candradimuka yang mendampingi setiap murid untuk bertumbuh menjadi generasi yang tangguh, unggul, dan berkarakter islami. Melalui pembelajaran kontekstual berbasis Kurikulum Merdeka yang bermakna serta pembiasaan adab luhur kepesantrenan, santri didorong untuk menemukan potensi, mengembangkan bakat, dan meraih prestasi terbaiknya.',
    features JSONB DEFAULT '[
        "Kurikulum Merdeka Terpadu (Fase E & F)",
        "Pembentukan Karakter & Adab Islami",
        "Pembelajaran Kontekstual & Deep Learning",
        "Pengembangan Potensi, Minat & Bakat",
        "Program Bimbingan Prestasi KSM & Olahraga",
        "Biaya Pendidikan Terjangkau & Beasiswa Prestasi"
    ]'::jsonb,
    contact_wa VARCHAR(30) DEFAULT '628176614723',
    contact_phone VARCHAR(30) DEFAULT '0817-6614-723',
    registration_link TEXT DEFAULT 'https://wa.me/628176614723?text=Halo%20Panitia%20PPDB%20MA%20Raudhatul%20Hidayah,%20saya%20ingin%20mendaftar%20dan%20konsultasi%20PPDB%202027/2028',
    brochure_link TEXT DEFAULT '/kontak',
    poster_url TEXT DEFAULT '/poster-ppdb.jpeg',
    is_registration_open BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 7. TABEL PENDAFTARAN SISWA BARU (PPDB ONLINE)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.ppdb_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_number VARCHAR(30) UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    nisn VARCHAR(20),
    nik VARCHAR(20),
    gender VARCHAR(10) CHECK (gender IN ('L', 'P')),
    birth_place TEXT,
    birth_date DATE,
    previous_school TEXT,
    parent_name TEXT NOT NULL,
    parent_whatsapp VARCHAR(30) NOT NULL,
    parent_email VARCHAR(100),
    home_address TEXT,
    major_choice TEXT DEFAULT 'Madrasah Aliyah Reguler (Fase E & F)',
    status VARCHAR(20) NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'verified', 'interview_scheduled', 'accepted', 'rejected')),
    documents JSONB DEFAULT '{}'::jsonb,
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 8. TABEL DEWAN GURU & TENAGA KEPENDIDIKAN (22 GURU RESMI)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.teachers_staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_no INT NOT NULL,
    code VARCHAR(10) NOT NULL,
    name TEXT NOT NULL,
    nip VARCHAR(30),
    role TEXT DEFAULT 'Dewan Guru',
    subject_name TEXT NOT NULL,
    class_level TEXT NOT NULL DEFAULT 'Semua Kelas',
    category_label TEXT NOT NULL,
    image_url TEXT NOT NULL DEFAULT '/hero/slide-1.jpg',
    education TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 9. TABEL KURIKULUM & MATA PELAJARAN
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.curriculum_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(10) NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- PAI, Bahasa, MIPA, IPS, dll.
    phase VARCHAR(20) DEFAULT 'Fase E & F',
    weekly_hours INT DEFAULT 2,
    teacher_name TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 10. TABEL WARTA, BERITA & ARTIKEL MADRASAH
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'Prestasi',
    author TEXT DEFAULT 'Humas MAS Raudhatul Hidayah',
    cover_image TEXT DEFAULT '/foto-juara.jpeg',
    image_caption TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    views_count INT DEFAULT 0,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 11. TABEL PRESTASI & PENGHARGAAN JUARA
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    event_name TEXT NOT NULL,
    level VARCHAR(30) NOT NULL CHECK (level IN ('Kecamatan', 'Kabupaten', 'Provinsi', 'Nasional', 'Internasional')),
    year VARCHAR(10) NOT NULL,
    recipient TEXT NOT NULL,
    category VARCHAR(30) NOT NULL CHECK (category IN ('Pramuka', 'Paskibra', 'Sains & KSM', 'Keagamaan', 'Seni & Olahraga', 'Umum')),
    description TEXT,
    image_url TEXT DEFAULT '/piala.jpeg',
    order_index INT DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 12. TABEL FOTO JUARA EKSTRAKURIKULER
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.championship_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    event_name TEXT NOT NULL,
    date_label VARCHAR(50),
    category VARCHAR(50) DEFAULT 'Pramuka Penegak',
    image_url TEXT NOT NULL,
    caption TEXT,
    order_index INT DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 13. TABEL EKSTRAKURIKULER
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.extracurriculars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(50) UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    schedule TEXT,
    coach TEXT,
    description TEXT,
    image_url TEXT DEFAULT '/paskibra.jpeg',
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 14. TABEL FASILITAS & SARANA MADRASAH
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'Sarana Pembelajaran',
    description TEXT,
    image_url TEXT NOT NULL DEFAULT '/kelas.jpeg',
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 15. TABEL GALERI VISUAL
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.gallery_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category VARCHAR(30) NOT NULL CHECK (category IN ('Akademik', 'Keagamaan', 'Kesiswaan', 'Fasilitas')),
    image_url TEXT NOT NULL,
    caption TEXT,
    date_label VARCHAR(30),
    order_index INT DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 16. TABEL BUKU TAMU / PESAN KONTAK MASUK
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(30),
    subject TEXT,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
    admin_reply TEXT,
    replied_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 17. TABEL KALENDER & AGENDA AKADEMIK
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.academic_calendar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    category VARCHAR(30) DEFAULT 'Akademik' CHECK (category IN ('Akademik', 'Ujian', 'Libur', 'Keagamaan', 'PPDB')),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 18. ATUR TRIGGER PEMBARUAN TIMESTAMP
-- ==============================================================================
DO $$
DECLARE
    tbl text;
BEGIN
    FOR tbl IN
        SELECT unnest(ARRAY[
            'admin_profiles', 'school_profile', 'headmaster_greeting',
            'ppdb_settings', 'ppdb_registrations', 'teachers_staff',
            'curriculum_subjects', 'articles', 'achievements',
            'championship_photos', 'extracurriculars', 'facilities',
            'gallery_items', 'academic_calendar'
        ])
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS trg_update_timestamp ON public.%I;
            CREATE TRIGGER trg_update_timestamp
            BEFORE UPDATE ON public.%I
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
        ', tbl, tbl);
    END LOOP;
END $$;

-- ==============================================================================
-- 19. ATURAN ROW LEVEL SECURITY (RLS) & KEBIJAKAN AKSES
-- ==============================================================================
-- Aktifkan RLS di seluruh tabel
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.headmaster_greeting ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ppdb_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ppdb_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curriculum_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.championship_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extracurriculars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_calendar ENABLE ROW LEVEL SECURITY;

-- A. KEBIJAKAN AKSES PUBLIK (SELECT) UNTUK TAMPILAN WEBSITE
CREATE POLICY "Public Read School Profile" ON public.school_profile FOR SELECT USING (true);
CREATE POLICY "Public Read Headmaster" ON public.headmaster_greeting FOR SELECT USING (true);
CREATE POLICY "Public Read PPDB Settings" ON public.ppdb_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Teachers" ON public.teachers_staff FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Curriculum" ON public.curriculum_subjects FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Articles" ON public.articles FOR SELECT USING (is_published = true);
CREATE POLICY "Public Read Achievements" ON public.achievements FOR SELECT USING (is_published = true);
CREATE POLICY "Public Read Championship Photos" ON public.championship_photos FOR SELECT USING (is_published = true);
CREATE POLICY "Public Read Extracurriculars" ON public.extracurriculars FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Facilities" ON public.facilities FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Gallery" ON public.gallery_items FOR SELECT USING (is_published = true);
CREATE POLICY "Public Read Academic Calendar" ON public.academic_calendar FOR SELECT USING (is_active = true);

-- B. KEBIJAKAN AKSES FORMULIR PUBLIK (INSERT)
CREATE POLICY "Public Insert Contact Message" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert PPDB Registration" ON public.ppdb_registrations FOR INSERT WITH CHECK (true);

-- C. KEBIJAKAN AKSES ADMIN (PENGGUNA TEROTENTIKASI MEMILIKI HAK AKSES PENUH CRUD)
DO $$
DECLARE
    tbl text;
BEGIN
    FOR tbl IN
        SELECT unnest(ARRAY[
            'admin_profiles', 'school_profile', 'headmaster_greeting',
            'ppdb_settings', 'ppdb_registrations', 'teachers_staff',
            'curriculum_subjects', 'articles', 'achievements',
            'championship_photos', 'extracurriculars', 'facilities',
            'gallery_items', 'contact_messages', 'academic_calendar'
        ])
    LOOP
        EXECUTE format('
            DROP POLICY IF EXISTS "Admin Full Access" ON public.%I;
            CREATE POLICY "Admin Full Access" ON public.%I
            FOR ALL
            TO authenticated
            USING (true)
            WITH CHECK (true);
        ', tbl, tbl);
    END LOOP;
END $$;

-- ==============================================================================
-- 20. BUCKET STORAGE SUPABASE (UNTUK UPLOAD FOTO & DOKUMEN CMS)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('school-media', 'school-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('ppdb-documents', 'ppdb-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Kebijakan Akses Storage: Publik dapat membaca school-media
CREATE POLICY "Public Read Media"
ON storage.objects FOR SELECT
USING (bucket_id = 'school-media');

-- Kebijakan Akses Storage: Admin terotentikasi dapat upload, edit, dan hapus media
CREATE POLICY "Admin Manage Media"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'school-media')
WITH CHECK (bucket_id = 'school-media');

-- ==============================================================================
-- 21. SEED DATA AWAL (DATA NYATA MAS RAUDHATUL HIDAYAH SIAP DIGUNAKAN)
-- ==============================================================================

-- 21.1 Profil Sekolah
INSERT INTO public.school_profile (id, name, formal_name, level, npsn, nsm, accreditation, founded_year, address, village, district, regency, province, postal_code, phone, whatsapp, email, maps_embed_url, stats_active_students, stats_certified_teachers)
VALUES (
    1,
    'MAS Raudhatul Hidayah',
    'Madrasah Aliyah Swasta Raudhatul Hidayah',
    'Madrasah Aliyah (MA)',
    '69980315',
    '131236030045',
    'A',
    '2012',
    'Jl. Raya Tanjung Kait No. 33, RT 02 / RW 01',
    'Tanjung Anom',
    'Mauk',
    'Kabupaten Tangerang',
    'Banten',
    '15330',
    '0817-6614-723',
    '628176614723',
    'info@maraudhatulhidayah.sch.id',
    'https://maps.google.com/?q=-6.0543,106.5298',
    350,
    22
)
ON CONFLICT (id) DO NOTHING;

-- 21.2 Sambutan Kepala Madrasah
INSERT INTO public.headmaster_greeting (id, name, title, degrees, photo_url, greeting_title)
VALUES (
    1,
    'Drs. H. Mulyadi',
    'Kepala Madrasah Aliyah Swasta Raudhatul Hidayah',
    'S.Pd.I, M.Pd',
    '/kepala-madrasah.jpg',
    'Menyiapkan Insan Kamil di Era Transformasi Digital'
)
ON CONFLICT (id) DO NOTHING;

-- 21.3 Pengaturan PPDB (Tahun Ajaran 2027/2028)
INSERT INTO public.ppdb_settings (id, category, title, academic_year, badge_text, description, contact_wa, contact_phone, registration_link, poster_url, is_registration_open)
VALUES (
    1,
    'PENERIMAAN PESERTA DIDIK BARU (PPDB) • MAS RAUDHATUL HIDAYAH',
    'Membentuk Generasi Berkarakter, Cerdas & Berakhlak Mulia',
    '2027/2028',
    'TELAH DIBUKA!',
    'MAS Raudhatul Hidayah hadir sebagai kawah candradimuka yang mendampingi setiap murid untuk bertumbuh menjadi generasi yang tangguh, unggul, dan berkarakter islami. Melalui pembelajaran kontekstual berbasis Kurikulum Merdeka yang bermakna serta pembiasaan adab luhur kepesantrenan, santri didorong untuk menemukan potensi, mengembangkan bakat, dan meraih prestasi terbaiknya.',
    '628176614723',
    '0817-6614-723',
    'https://wa.me/628176614723?text=Halo%20Panitia%20PPDB%20MA%20Raudhatul%20Hidayah,%20saya%20ingin%20mendaftar%20dan%20konsultasi%20PPDB%202027/2028',
    '/poster-ppdb.jpeg',
    true
)
ON CONFLICT (id) DO NOTHING;

-- 21.4 Data 22 Dewan Guru & Staf Resmi
INSERT INTO public.teachers_staff (order_no, code, name, subject_name, class_level, category_label, image_url)
VALUES
(1, '1', 'TAJUDIN, S.Pd.I', 'QUR''AN-HADITS', 'Semua Kelas', 'Pendidikan Agama Islam', '/hero/slide-3.jpg'),
(2, '2', 'JAKARIA, S.Pd.I', 'AQIDAH-AKHLAK', 'Semua Kelas', 'Pendidikan Agama Islam', '/kelas.jpeg'),
(3, '3', 'TAJUDIN, S.Pd.I', 'FIQIH KLS 11', 'Kelas XI', 'Pendidikan Agama Islam', '/hero/slide-3.jpg'),
(4, '3', 'JAKARIA, S.Pd.I', 'FIQIH KLS 10 & 12', 'Kelas X & XII', 'Pendidikan Agama Islam', '/kelas.jpeg'),
(5, '4', 'YAHYA HIDAYATULLOH, S.Pd.I', 'SKI', 'Semua Kelas', 'Sejarah Kebudayaan Islam', '/hero/slide-1.jpg'),
(6, '5', 'SITI KHAERUNNISA, S.Pd.I', 'BHS. ARAB', 'Semua Kelas', 'Bahasa Asing', '/perpus2.jpeg'),
(7, '6', 'Drs. MULYADI', 'PEND. PANCASILA', 'Semua Kelas', 'Pendidikan Kewarganegaraan', '/hero/slide-2.jpg'),
(8, '7', 'KUSTYANINGSIH, S.Pd', 'B. INDONESIA', 'Semua Kelas', 'Bahasa & Sastra', '/kelas.jpeg'),
(9, '8', 'MADROSYID, S.Pd', 'MATEMATIKA', 'Semua Kelas', 'MIPA', '/perpus2.jpeg'),
(10, '9', 'SARNAH, S.Pd.I', 'FISIKA', 'Peminatan MIPA', 'MIPA', '/hero/slide-1.jpg'),
(11, '10', 'SARNAH, S.Pd.I', 'BIOLOGI', 'Peminatan MIPA', 'MIPA', '/hero/slide-1.jpg'),
(12, '11', 'AHMAD NURUL KAHFI, SE', 'SEJARAH KLS 10&11', 'Kelas X & XI', 'IPS', '/hero/slide-2.jpg'),
(13, '13', 'AHMAD NURUL KAHFI, SE', 'EKONOMI', 'Peminatan IPS', 'IPS', '/hero/slide-2.jpg'),
(14, '14', 'SARNAH, S.Pd.I', 'SEJARAH KLS 12', 'Kelas XII', 'IPS', '/hero/slide-1.jpg'),
(15, '15', 'YAHYA HIDAYATULLOH, S.Pd.I', 'GEOGRAFI', 'Peminatan IPS', 'IPS', '/hero/slide-1.jpg'),
(16, '16', 'SITI KHAERUNNISA, S.Pd.I', 'BHS. INGGRIS', 'Semua Kelas', 'Bahasa Asing', '/perpus2.jpeg'),
(17, '17', 'AHMAD NURUL KAHFI, SE', 'PENJASKES', 'Semua Kelas', 'Olahraga & Kesehatan', '/hero/slide-2.jpg'),
(18, '18', 'LILIS KASTIRI, S.Pd.I', 'SENI-BUDAYA 11 & 12', 'Kelas XI & XII', 'Seni & Budaya', '/kelas.jpeg'),
(19, '19', 'TISKA PUSPITA DEWI, S.Pd.I', 'MULOK (BTQ)', 'Semua Kelas', 'Muatan Lokal', '/perpus2.jpeg'),
(20, '20', 'TISKA PUSPITA DEWI, S.Pd.I', 'PRAKARYA & WIRAUSAHA', 'Semua Kelas', 'Prakarya & Kewirausahaan', '/perpus2.jpeg'),
(21, '21', 'TISKA PUSPITA DEWI, S.Pd.I', 'SENI BUDAYA 10', 'Kelas X', 'Seni & Budaya', '/perpus2.jpeg'),
(22, '22', 'MADROSYID, S.Pd', 'TIKOM', 'Semua Kelas', 'Teknologi Informasi & Komunikasi', '/perpus2.jpeg')
ON CONFLICT DO NOTHING;

-- 21.5 Data Ekstrakurikuler
INSERT INTO public.extracurriculars (slug, name, category, schedule, coach, description, image_url, order_index)
VALUES
('pramuka-penegak', 'Pramuka Penegak Gugus Depan', 'Kepemimpinan', 'Jumat, 14.00 - 17.00 WIB', 'Kak Tajudin, S.Pd.I', 'Penggemblengan mental tangguh, survival, kedisiplinan, tali-temali pionering, dan juara umum lintas kwarran.', '/foto-juara-pramuka.jpeg', 1),
('paskibra-ma', 'Paskibra Madrasah Aliyah', 'Kepemimpinan', 'Sabtu, 08.00 - 11.00 WIB', 'Pelatih Purna Paskibraka', 'Kecakapan baris-berbaris presisi, pembentukan postur tegap, patriotisme, dan penugasan upacara hari besar.', '/paskibra.jpeg', 2),
('pmr-uks', 'Palang Merah Remaja (PMR)', 'Sosial & Kesehatan', 'Rabu, 15.30 - 17.00 WIB', 'Tim Medis Puskesmas Mauk', 'Pertolongan pertama, kesiapsiagaan bencana, donor darah, dan penyuluhan pola hidup bersih dan sehat.', '/foto-semua.jpeg', 3),
('hadroh-marawis', 'Seni Hadroh & Marawis El-Hidayah', 'Seni & Keagamaan', 'Kamis malam, 19.30 - 21.00 WIB', 'Ustadz Jakaria, S.Pd.I', 'Kesenian shalawat rebana klasik dan modern untuk mengisi majelis shalawat dan peringatan PHBI.', '/foto-semua-juara.jpeg', 4)
ON CONFLICT (slug) DO NOTHING;

-- 21.6 Data Foto Juara Ekstrakurikuler
INSERT INTO public.championship_photos (title, event_name, date_label, category, image_url, caption, order_index)
VALUES
('Kontingen Juara Umum Gebyar Ramadhan', 'Gebyar Ramadhan 1447 H Gerakan Pramuka Kwarran Mauk', '14 April 2026', 'Pramuka Penegak', '/foto-juara.jpeg', 'Kontingen Pramuka Penegak MAS Raudhatul Hidayah mengangkat trofi kejuaraan bersama seluruh jajaran panitia di panggung utama.', 1),
('Srikandi Pramuka Penegak Berprestasi', 'Malam Puncak Penganugerahan Kwarran Mauk', '14 April 2026', 'Pramuka Putri', '/foto-juara-pramuka.jpeg', 'Dua santriwati berprestasi didampingi pembina regu tersenyum bangga memegang piala penghargaan kategori ketangkasan kepramukaan.', 2),
('Penyerahan Trofi Bergilir Kehormatan', 'Prosesi Penganugerahan Pemenang Kwarran Mauk', '14 April 2026', 'Pramuka Putra & Putri', '/foto-semua-juara.jpeg', 'Momen khidmat penyerahan trofi bergilir juara oleh dewan juri kehormatan kepada perwakilan santri MAS Raudhatul Hidayah.', 3)
ON CONFLICT DO NOTHING;

-- 21.7 Data Sarana & Prasarana Fasilitas
INSERT INTO public.facilities (name, category, description, image_url, order_index)
VALUES
('Ruang Kelas Ber-AC & Multimedia', 'Ruang Belajar', 'Ruang kelas representatif berlantai keramik bersih, pencahayaan alami optimal, dan sarana proyektor interaktif.', '/kelas.jpeg', 1),
('Perpustakaan & Ruang Baca Turots', 'Pusat Sumber Belajar', 'Koleksi ribuan buku pelajaran, ensiklopedia umum, referensi sains, dan kitab kajian keislaman yang nyaman.', '/perpus2.jpeg', 2),
('Musholla As-Salam Madrasah', 'Sarana Ibadah', 'Tempat ibadah shalat berjamaah zhuhur-ashar, pembiasaan shalat dhuha, dan halaqah tahsin Al-Qur''an.', '/musholla.jpg', 3),
('Halaman & Lapangan Olahraga Serbaguna', 'Sarana Olahraga', 'Lapangan paving luas untuk upacara bendera, apel santri, latihan pramuka, futsal, dan bola voli.', '/halaman-sekolah.jpeg', 4)
ON CONFLICT DO NOTHING;

-- 21.8 Data Artikel & Warta Madrasah
INSERT INTO public.articles (slug, title, excerpt, content, category, author, cover_image, is_featured, is_published)
VALUES
(
    'kontingen-pramuka-ma-raudhatul-hidayah-sapu-bersih-juara-gebyar-ramadhan-1447-h',
    'Kontingen Pramuka MAS Raudhatul Hidayah Sapu Bersih Juara pada Gebyar Ramadhan 1447 H',
    'Prestasi membanggakan kembali ditorehkan santri MAS Raudhatul Hidayah dengan meraih juara umum pada ajang kepramukaan se-Kecamatan Mauk.',
    'Alhamdulillah, puji syukur ke hadirat Allah SWT. Kontingen Gugus Depan Pramuka Penegak MAS Raudhatul Hidayah berhasil membuktikan ketangguhan dan kekompakannya dalam ajang Gebyar Ramadhan 1447 H Gerakan Pramuka Kwartir Ranting Mauk. Dalam kompetisi yang diikuti oleh puluhan pangkalan sekolah dan madrasah se-Kabupaten Tangerang bagian utara ini, santri MAS Raudhatul Hidayah sukses memborong gelar juara di berbagai mata lomba kepramukaan dan ketangkasan regu.',
    'Prestasi',
    'Humas MAS Raudhatul Hidayah',
    '/foto-juara.jpeg',
    true,
    true
),
(
    'kekompakan-kontingen-pramuka-ma-raudhatul-hidayah-panggung-kehormatan-kwarran-mauk',
    'Kekompakan Kontingen Pramuka MAS Raudhatul Hidayah Memukau Panggung Kehormatan',
    'Semangat kebersamaan dan kedisiplinan santri membuahkan apresiasi tinggi dari para pembina dan dewan juri kehormatan.',
    'Pemandangan membanggakan tersaji di panggung kehormatan Kwarran Mauk saat santriwati MAS Raudhatul Hidayah melangkah dengan penuh percaya diri menerima trofi penghargaan. Latihan intensif selama berminggu-minggu di bawah arahan dewan pembina terbayar lunas dengan prestasi yang mengharumkan nama madrasah dan yayasan.',
    'Prestasi',
    'Humas MAS Raudhatul Hidayah',
    '/foto-juara-pramuka.jpeg',
    false,
    true
),
(
    'momen-khidmat-penyerahan-trofi-santri-ma-raudhatul-hidayah-panggung-utama-kwarran-mauk',
    'Momen Khidmat Penyerahan Trofi Kejuaraan Santri MAS Raudhatul Hidayah di Panggung Utama',
    'Dokumentasi resmi prosesi penganugerahan trofi kemenangan kontingen MAS Raudhatul Hidayah.',
    'Prosesi penyerahan piala berlangsung penuh keharuan dan kebanggaan. Dewan juri mengapresiasi tidak hanya keterampilan teknis kepramukaan para santri, melainkan adab santun dan ketertiban barisan yang ditunjukkan sepanjang perhelatan kompetisi.',
    'Prestasi',
    'Humas MAS Raudhatul Hidayah',
    '/foto-semua-juara.jpeg',
    false,
    true
)
ON CONFLICT (slug) DO NOTHING;
