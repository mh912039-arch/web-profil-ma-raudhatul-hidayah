'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AdminSidebar, AdminTab } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { OverviewTab } from '@/components/admin/tabs/OverviewTab';
import { PpdbTab } from '@/components/admin/tabs/PpdbTab';
import { TeachersTab, TeacherRecord } from '@/components/admin/tabs/TeachersTab';
import { ArticlesTab, ArticleRecord } from '@/components/admin/tabs/ArticlesTab';
import { AchievementsTab, ChampionshipPhoto } from '@/components/admin/tabs/AchievementsTab';
import { HomepageTab, HomepageConfig } from '@/components/admin/tabs/HomepageTab';
import { ProfileTab, FullProfileData } from '@/components/admin/tabs/ProfileTab';
import { MessagesTab, ContactMessage } from '@/components/admin/tabs/MessagesTab';
import { RegistrationsTab, PpdbApplicant } from '@/components/admin/tabs/RegistrationsTab';
import { SchedulesTab } from '@/components/admin/tabs/SchedulesTab';
import { ClassesTab } from '@/components/admin/tabs/ClassesTab';
import { CalendarTab } from '@/components/admin/tabs/CalendarTab';
import { UsersTab } from '@/components/admin/tabs/UsersTab';
import { ExtracurricularTab } from '@/components/admin/tabs/ExtracurricularTab';
import { SchoolPortalLogin } from '@/components/auth/SchoolPortalLogin';
import { PpdbData } from '@/components/sections/PpdbSection';
import { supabase } from '@/lib/supabaseClient';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

// Default initial teachers (22 dewan guru resmi MA Raudlatul Hidayah)
const initial22Teachers: TeacherRecord[] = [
  { order_no: 1, code: '1', name: 'TAJUDIN, S.Pd.I', subject_name: "QUR'AN-HADITS", class_level: 'Semua Kelas', category_label: 'Pendidikan Agama Islam', image_url: '/halaman-sekolah.jpeg', is_active: true },
  { order_no: 2, code: '2', name: 'JAKARIA, S.Pd.I', subject_name: 'AQIDAH-AKHLAK', class_level: 'Semua Kelas', category_label: 'Pendidikan Agama Islam', image_url: '/halaman-sekolah.jpeg', is_active: true },
  { order_no: 3, code: '3', name: 'TAJUDIN, S.Pd.I', subject_name: 'FIQIH KLS 11', class_level: 'Kelas XI', category_label: 'Pendidikan Agama Islam', image_url: '/halaman-sekolah.jpeg', is_active: true },
  { order_no: 4, code: '3', name: 'JAKARIA, S.Pd.I', subject_name: 'FIQIH KLS 10 & 12', class_level: 'Kelas X & XII', category_label: 'Pendidikan Agama Islam', image_url: '/halaman-sekolah.jpeg', is_active: true },
  { order_no: 5, code: '4', name: 'YAHYA HIDAYATULLOH, S.Pd.I', subject_name: 'SKI', class_level: 'Semua Kelas', category_label: 'Sejarah Kebudayaan Islam', image_url: '/halaman-sekolah.jpeg', is_active: true },
  { order_no: 6, code: '5', name: 'SITI KHAERUNNISA, S.Pd.I', subject_name: 'BHS. ARAB', class_level: 'Semua Kelas', category_label: 'Bahasa Asing', image_url: '/halaman-sekolah.jpeg', is_active: true },
  { order_no: 7, code: '6', name: 'Drs. MULYADI', subject_name: 'PEND. PANCASILA', class_level: 'Semua Kelas', category_label: 'Pendidikan Kewarganegaraan', image_url: '/halaman-sekolah.jpeg', is_active: true },
  { order_no: 8, code: '7', name: 'KUSTYANINGSIH, S.Pd', subject_name: 'B. INDONESIA', class_level: 'Semua Kelas', category_label: 'Bahasa & Sastra', image_url: '/halaman-sekolah.jpeg', is_active: true },
  { order_no: 9, code: '8', name: 'MADROSYID, S.Pd', subject_name: 'MATEMATIKA', class_level: 'Semua Kelas', category_label: 'MIPA', image_url: '/halaman-sekolah.jpeg', is_active: true },
  { order_no: 10, code: '9', name: 'SARNAH, S.Pd.I', subject_name: 'FISIKA', class_level: 'Peminatan MIPA', category_label: 'MIPA', image_url: '/halaman-sekolah.jpeg', is_active: true },
  { order_no: 11, code: '10', name: 'SARNAH, S.Pd.I', subject_name: 'BIOLOGI', class_level: 'Peminatan MIPA', category_label: 'MIPA', image_url: '/halaman-sekolah.jpeg', is_active: true },
  { order_no: 12, code: '11', name: 'AHMAD NURUL KAHFI, SE', subject_name: 'SEJARAH KLS 10&11', class_level: 'Kelas X & XI', category_label: 'IPS', image_url: '/halaman-sekolah.jpeg', is_active: true },
  { order_no: 13, code: '13', name: 'AHMAD NURUL KAHFI, SE', subject_name: 'EKONOMI', class_level: 'Peminatan IPS', category_label: 'IPS', image_url: '/halaman-sekolah.jpeg', is_active: true },
  { order_no: 14, code: '14', name: 'SARNAH, S.Pd.I', subject_name: 'SEJARAH KLS 12', class_level: 'Kelas XII', category_label: 'IPS', image_url: '/halaman-sekolah.jpeg', is_active: true },
  { order_no: 15, code: '15', name: 'YAHYA HIDAYATULLOH, S.Pd.I', subject_name: 'GEOGRAFI', class_level: 'Peminatan IPS', category_label: 'IPS', image_url: '/halaman-sekolah.jpeg', is_active: true },
  { order_no: 16, code: '16', name: 'SITI KHAERUNNISA, S.Pd.I', subject_name: 'BHS. INGGRIS', class_level: 'Semua Kelas', category_label: 'Bahasa Asing', image_url: '/halaman-sekolah.jpeg', is_active: true },
  { order_no: 17, code: '17', name: 'AHMAD NURUL KAHFI, SE', subject_name: 'PENJASKES', class_level: 'Semua Kelas', category_label: 'Olahraga & Kesehatan', image_url: '/halaman-sekolah.jpeg', is_active: true },
  { order_no: 18, code: '18', name: 'LILIS KASTIRI, S.Pd.I', subject_name: 'SENI-BUDAYA 11 & 12', class_level: 'Kelas XI & XII', category_label: 'Seni & Budaya', image_url: '/halaman-sekolah.jpeg', is_active: true },
  { order_no: 19, code: '19', name: 'TISKA PUSPITA DEWI, S.Pd.I', subject_name: 'MULOK (BTQ)', class_level: 'Semua Kelas', category_label: 'Muatan Lokal', image_url: '/halaman-sekolah.jpeg', is_active: true },
  { order_no: 20, code: '20', name: 'TISKA PUSPITA DEWI, S.Pd.I', subject_name: 'PRAKARYA & WIRAUSAHA', class_level: 'Semua Kelas', category_label: 'Prakarya & Kewirausahaan', image_url: '/halaman-sekolah.jpeg', is_active: true },
  { order_no: 21, code: '21', name: 'TISKA PUSPITA DEWI, S.Pd.I', subject_name: 'SENI BUDAYA 10', class_level: 'Kelas X', category_label: 'Seni & Budaya', image_url: '/halaman-sekolah.jpeg', is_active: true },
  { order_no: 22, code: '22', name: 'MADROSYID, S.Pd', subject_name: 'TIKOM', class_level: 'Semua Kelas', category_label: 'Teknologi Informasi & Komunikasi', image_url: '/halaman-sekolah.jpeg', is_active: true },
];

// Tabs yang boleh diakses oleh Siswa / Santri (Hanya Baca)
const SISWA_ALLOWED_TABS: AdminTab[] = [
  'schedules',
  'classes',
  'calendar',
  'agenda',
];

// Tabs yang boleh diakses oleh Dewan Guru
const GURU_ALLOWED_TABS: AdminTab[] = [
  'schedules',
  'classes',
  'calendar',
  'agenda',
  'articles',
  'achievements',
  'gallery',
  'extracurricular',
];

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'guru' | 'siswa'>('admin');
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [supabaseConnected, setSupabaseConnected] = useState(true);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [targetRombelForSchedule, setTargetRombelForSchedule] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Verifikasi sesi server-side (HttpOnly cookie)
    fetch('/api/auth/session', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.role) {
          setIsAuthenticated(true);
          setUserRole(data.role);
          if (typeof window !== 'undefined') {
            localStorage.setItem('mrh_admin_auth', 'true');
            localStorage.setItem('mrh_user_role', data.role);
          }
          if (data.role === 'siswa') {
            setActiveTab((prev) => (SISWA_ALLOWED_TABS.includes(prev) ? prev : 'schedules'));
          } else if (data.role === 'guru') {
            setActiveTab((prev) => (GURU_ALLOWED_TABS.includes(prev) ? prev : 'schedules'));
          }
        } else {
          // Sesi server tidak valid atau belum login
          setIsAuthenticated(false);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('mrh_admin_auth');
            localStorage.removeItem('mrh_user_role');
          }
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, []);

  // Realtime Heartbeat: Jaga status online aktif selama sesi terbuka di browser
  useEffect(() => {
    if (!isAuthenticated) return;

    fetch('/api/auth/heartbeat', { method: 'POST' }).catch(() => {});

    const heartbeatInterval = setInterval(() => {
      fetch('/api/auth/heartbeat', { method: 'POST' }).catch(() => {});
    }, 45000);

    return () => clearInterval(heartbeatInterval);
  }, [isAuthenticated]);

  // Data states
  const [ppdbData, setPpdbData] = useState<PpdbData>({
    category: 'PENERIMAAN PESERTA DIDIK BARU (PPDB) • MA RAUDLATUL HIDAYAH',
    title: 'Membentuk Generasi Berkarakter, Cerdas & Berakhlak Mulia',
    academicYear: '2027/2028',
    badgeText: 'TELAH DIBUKA!',
    description: 'MA Raudlatul Hidayah hadir sebagai kawah candradimuka yang mendampingi setiap murid untuk bertumbuh menjadi generasi yang tangguh, unggul, dan berkarakter islami.',
    features: [
      'Kurikulum Merdeka Terpadu (Fase E & F)',
      'Pembentukan Karakter & Adab Islami',
      'Pembelajaran Kontekstual & Deep Learning',
      'Pengembangan Potensi, Minat & Bakat',
      'Program Bimbingan Prestasi KSM & Olahraga',
      'Biaya Pendidikan Terjangkau & Beasiswa Prestasi',
    ],
    contactWa: '628176614723',
    contactPhone: '0817-6614-723',
    registrationLink: 'https://wa.me/628176614723?text=Halo%20Panitia%20PPDB%20MA%20Raudlatul%20Hidayah,%20saya%20ingin%20mendaftar%20dan%20konsultasi%20PPDB%202027/2028',
    brochureLink: '/kontak',
    posterUrl: 'https://zzgobrlhnnqvspuwugkz.supabase.co/storage/v1/object/public/articles/img-1793069689752-1bguos.jpeg',
    isRegistrationOpen: true,
  });

  const [teachers, setTeachers] = useState<TeacherRecord[]>(initial22Teachers);
  const [articles, setArticles] = useState<ArticleRecord[]>([]);
  const [championshipPhotos, setChampionshipPhotos] = useState<ChampionshipPhoto[]>([]);
  const [applicants, setApplicants] = useState<PpdbApplicant[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [usersCount, setUsersCount] = useState<number>(8);
  const [homepageData, setHomepageData] = useState<HomepageConfig>({
    heroTitle: 'MA Raudlatul Hidayah',
    heroTagline: 'Membentuk Generasi Berkarakter, Beradab, dan Unggul Bernalar',
    heroBadge: 'Portal Resmi MA Raudlatul Hidayah',
    heroBackground: '/foto-semua.jpeg',
    heroBackgrounds: [
      '/foto-semua.jpeg',
      '/halaman-sekolah.jpeg',
      '/paskibra.jpeg',
    ],
    schoolLogo: '/school-logo.png',
    marqueeText1: 'PPDB (Penerimaan Peserta Didik Baru) MA Raudlatul Hidayah Tahun Ajaran 2027/2028 Telah Dibuka!',
    marqueeCta1: 'DAFTAR SEKARANG!',
    marqueeLink1: '/kontak',
    marqueeText2: 'Kuota Pendaftaran Terbatas • Pembinaan Berbasis Karakter & Kurikulum Merdeka • Mauk Tangerang',
    marqueeCta2: 'KONSULTASI WA',
    marqueeLink2: 'https://wa.me/628176614723',
    sambutanHeading: 'Sambutan Kepala Madrasah',
    sambutanSubtitle: 'Membina Integritas & Mutu Akademik',
    sambutanBadge: 'Pimpinan Satuan Pendidikan',
    headmasterName: 'A. Khutbi. AR, S.Pd',
    headmasterRole: 'Kepala Madrasah MA Raudlatul Hidayah',
    headmasterPhoto: '/kepala-madrasah.jpg',
    sambutanText1: 'Bismillah walhamdulillah. Assalamu’alaikum Warahmatullahi Wabarakatuh. Selamat datang di portal resmi MA Raudlatul Hidayah jenjang Madrasah Aliyah (MA). Kami meyakini bahwa pendidikan sejati tidak hanya mengasah kecerdasan kognitif, tetapi juga merawat adab, keteguhan akidah, serta budi pekerti luhur sejak usia transisi remaja.',
    sambutanText2: 'Melalui integrasi Kurikulum Merdeka yang kontekstual dan kultur pembiasaan Islami, kami berikhtiar membimbing seluruh santri agar aktif bernalar, mencintai ilmu pengetahuan, dan terlatih hidup berdisiplin dalam lingkungan yang aman, ramah anak, serta penuh kehangatan persaudaraan.',
    ctaText: 'Pelajari Profil & Budaya Sekolah',
    ctaLink: '/profil/visi-misi',
    stat1Value: '152',
    stat1Label: 'Santri Aktif MA',
    stat2Value: '22',
    stat2Label: 'Guru & Staf',
    stat3Value: '35+',
    stat3Label: 'Prestasi',
    teachersSectionTitle: 'Guru',
    teachersSectionSubtitle: 'Menyambut Anda ke Dunia Pembelajaran yang Dipandu Guru-guru Terbaik',
  });

  const [fullProfileData, setFullProfileData] = useState<FullProfileData>({
    profile: {
      name: 'MA Raudlatul Hidayah',
      formalName: 'Madrasah Aliyah Raudlatul Hidayah',
      level: 'Madrasah Aliyah (MA)',
      npsn: '6994888',
      nsm: '131236030045',
      accreditation: 'C',
      foundedYear: '2012',
      address: 'Jl. Raya Tanjung Kait No. 33, RT 02 / RW 01',
      district: 'Mauk',
      regency: 'Kabupaten Tangerang',
      province: 'Banten',
      postalCode: '15330',
      phone: '0817-6614-723',
      whatsapp: '628176614723',
      email: 'info@maraudlatulhidayah.sch.id',
      hoursWeekdays: '07.00 – 15.30 WIB',
      hoursSaturday: '07.00 – 12.30 WIB',
      hoursSunday: 'Tutup Layanan Fisik',
    },
    visionMission: {
      vision:
        'Terwujudnya generasi santri yang beriman dan bertakwa, berakhlak mulia, unggul dalam prestasi akademik dan non-akademik, serta berwawasan lingkungan dan keislaman yang moderat.',
      missionTitle: 'Misi Pokok Penyelenggaraan Sekolah',
      missionSubtitle:
        'Langkah konkret institusi dalam mengejawantahkan visi luhur ke dalam iklim pembelajaran, kultur madrasah, dan interaksi sosial harian peserta didik.',
      pageTitle: 'Visi & Misi Madrasah',
      pageSubtitle:
        'Arah haluan nilai pendidikan, visi kelembagaan, misi pembelajaran kontekstual, dan pilar keunggulan santri MA Raudlatul Hidayah.',
      missions: [
        'Menyelenggarakan proses pembelajaran integratif antara Kurikulum Nasional dan kurikulum kepesantrenan berhaluan Ahlussunnah wal Jama’ah.',
        'Mengembangkan budaya riset ilmiah, penalaran kritis, dan literasi digital yang berlandaskan etika Islam.',
      ],
      pillars: [],
    },
    history: {
      title: 'Dedikasi Membangun Generasi di Mauk',
      subtitle: 'Tonggak Sejarah',
      lead: 'Bermula dari kepedulian tulus para tokoh masyarakat terhadap masa depan pendidikan generasi muda di pesisir utara Kabupaten Tangerang...',
      milestones: [],
    },
    facilities: [],
  });

  const [isSaving, setIsSaving] = useState(false);

  // Show auto-dismissing toast
  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Load all initial data from Supabase & APIs
  const loadData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // 1. Load PPDB
      const ppdbRes = await fetch('/api/ppdb', { cache: 'no-store' });
      if (ppdbRes.ok) {
        const ppdbJson = await ppdbRes.json();
        setPpdbData(ppdbJson);
      }

      // 2. Load Teachers via unified API
      const teachRes = await fetch('/api/teachers', { cache: 'no-store' });
      if (teachRes.ok) {
        const teachJson = await teachRes.json();
        if (Array.isArray(teachJson) && teachJson.length > 0) {
          setTeachers(teachJson);
        }
      }

      // 3. Load Articles via API (merges Supabase + local JSON)
      const artRes = await fetch('/api/articles', { cache: 'no-store' });
      if (artRes.ok) {
        const artJson = await artRes.json();
        if (Array.isArray(artJson)) {
          setArticles(artJson);
        }
      }

      // 4. Load Championship Photos via unified API
      const photoRes = await fetch('/api/championships', { cache: 'no-store' });
      if (photoRes.ok) {
        const photoJson = await photoRes.json();
        if (Array.isArray(photoJson) && photoJson.length > 0) {
          setChampionshipPhotos(photoJson);
        }
      }

      // 5. Load Homepage & Full Profile via unified API
      const profRes = await fetch('/api/profile', { cache: 'no-store' });
      if (profRes.ok) {
        const profJson = await profRes.json();
        if (profJson.homepage) {
          setHomepageData((prev) => ({ ...prev, ...profJson.homepage }));
        }
        if (profJson.profile) {
          setFullProfileData((prev) => ({
            profile: { ...prev.profile, ...profJson.profile },
            visionMission: { ...prev.visionMission, ...(profJson.visionMission || {}) },
            history: { ...prev.history, ...(profJson.history || {}) },
            facilities: profJson.facilities || prev.facilities,
          }));
        }
      }

      // 6. Load PPDB Registrations via unified API
      const appRes = await fetch('/api/registrations', { cache: 'no-store' });
      if (appRes.ok) {
        const appJson = await appRes.json();
        if (Array.isArray(appJson)) {
          setApplicants(appJson);
        }
      }

      // 7. Load Contact Messages via unified API
      const msgRes = await fetch('/api/contact', { cache: 'no-store' });
      if (msgRes.ok) {
        const msgJson = await msgRes.json();
        if (Array.isArray(msgJson)) {
          setMessages(msgJson);
        }
      }

      // 8. Load Registered Users Count
      try {
        const userRes = await fetch('/api/users', { cache: 'no-store' });
        if (userRes.ok) {
          const userJson = await userRes.json();
          if (Array.isArray(userJson.users)) {
            setUsersCount(userJson.users.length);
          }
        }
      } catch {}

      setSupabaseConnected(true);
    } catch (err) {
      console.warn('Error loading admin data:', err);
      setSupabaseConnected(false);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Segarkan pesan masuk seketika saat admin membuka tab messages
  useEffect(() => {
    if (activeTab === 'messages') {
      fetch('/api/contact', { cache: 'no-store' })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (Array.isArray(data)) {
            setMessages(data);
          }
        })
        .catch(() => {});
    }
  }, [activeTab]);

  // Handler: Save PPDB
  const handleSavePpdb = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/ppdb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ppdbData),
      });
      if (res.ok) {
        showToast('success', 'Pengaturan PPDB 2027/2028 berhasil disimpan & disinkronkan ke Supabase!');
        localStorage.setItem('ppdb_updated', Date.now().toString());
        try {
          localStorage.setItem('cached_ppdb_data', JSON.stringify(ppdbData));
        } catch (_) {}
      } else {
        showToast('error', 'Gagal menyimpan pembaruan PPDB.');
      }
    } catch (err) {
      showToast('error', 'Terjadi kesalahan jaringan.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handler: Save / Update Teacher
  const handleSaveTeacher = async (teacher: TeacherRecord) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teacher),
      });
      const resJson = await res.json();
      if (res.ok && resJson.success) {
        const saved = resJson.data || teacher;
        let finalCount = teachers.length;
        setTeachers((prev) => {
          const index = prev.findIndex((t) => (t.id && t.id === saved.id) || t.order_no === saved.order_no);
          if (index >= 0) {
            const updated = [...prev];
            updated[index] = saved;
            finalCount = updated.length;
            return updated;
          }
          const updated = [...prev, saved];
          finalCount = updated.length;
          return updated;
        });

        // Automatically update homepage stat2Value (Guru & Staf count) to match new total
        const newTeacherCountStr = String(finalCount);
        setHomepageData((prev) => ({
          ...prev,
          stat2Value: newTeacherCountStr,
        }));

        // Persist updated teacher count to homepage configuration
        fetch('/api/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ homepage: { stat2Value: newTeacherCountStr } }),
        }).catch(() => {});

        showToast('success', `Data pendidik "${teacher.name}" berhasil disimpan & langsung aktif di web! Total: ${finalCount} guru.`);

        // Sinkronisasi ulang data terbaru dari server
        try {
          const freshRes = await fetch('/api/teachers', { cache: 'no-store' });
          if (freshRes.ok) {
            const freshList = await freshRes.json();
            if (Array.isArray(freshList)) setTeachers(freshList);
          }
        } catch {}
      } else {
        showToast('error', resJson.message || 'Gagal menyimpan data guru.');
      }
    } catch (err) {
      showToast('error', 'Gagal menyimpan data guru.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handler: Delete Teacher
  const handleDeleteTeacher = async (id: string | number) => {
    try {
      const res = await fetch(`/api/teachers?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        let finalCount = teachers.length - 1;
        setTeachers((prev) => {
          const filtered = prev.filter((t) => t.id !== id && t.order_no !== id);
          finalCount = filtered.length;
          return filtered;
        });

        // Automatically update homepage stat2Value on delete
        const newTeacherCountStr = String(Math.max(0, finalCount));
        setHomepageData((prev) => ({
          ...prev,
          stat2Value: newTeacherCountStr,
        }));

        fetch('/api/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ homepage: { stat2Value: newTeacherCountStr } }),
        }).catch(() => {});

        showToast('success', `Data guru berhasil dihapus. Total sekarang: ${finalCount} guru.`);

        // Sinkronisasi ulang data terbaru dari server
        try {
          const freshRes = await fetch('/api/teachers', { cache: 'no-store' });
          if (freshRes.ok) {
            const freshList = await freshRes.json();
            if (Array.isArray(freshList)) setTeachers(freshList);
          }
        } catch {}
      }
    } catch (err) {
      showToast('error', 'Gagal menghapus data guru.');
    }
  };

  // Handler: Save Article
  const handleSaveArticle = async (article: ArticleRecord) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article),
      });
      const resJson = await res.json();
      if (res.ok && resJson.success) {
        const savedArt = resJson.article || article;
        setArticles((prev) => {
          const idx = prev.findIndex((a) => (savedArt.id && a.id === savedArt.id) || a.slug === savedArt.slug);
          if (idx >= 0) {
            const updated = [...prev];
            updated[idx] = savedArt;
            return updated;
          }
          return [savedArt, ...prev];
        });
        showToast('success', `Artikel "${article.title}" berhasil disimpan & dipublikasikan!`);
      } else {
        showToast('error', resJson.message || 'Gagal menyimpan artikel.');
      }
    } catch (err) {
      showToast('error', 'Gagal menyimpan artikel.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handler: Delete Article
  const handleDeleteArticle = async (id: string | number, slug?: string) => {
    try {
      const url = new URL('/api/articles', window.location.origin);
      if (id) url.searchParams.set('id', String(id));
      if (slug) url.searchParams.set('slug', slug);

      const res = await fetch(url.toString(), { method: 'DELETE' });
      if (res.ok) {
        setArticles((prev) =>
          prev.filter(
            (a) =>
              (id ? a.id !== id && a.slug !== id : true) &&
              (slug ? a.slug !== slug && a.id !== slug : true)
          )
        );
        showToast('success', 'Artikel berhasil dihapus.');
      } else {
        const errJson = await res.json().catch(() => null);
        showToast('error', errJson?.message || 'Gagal menghapus artikel.');
      }
    } catch (err) {
      showToast('error', 'Gagal menghapus artikel.');
    }
  };

  // Handler: Save Championship Photo
  const handleSavePhoto = async (photo: ChampionshipPhoto) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/championships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(photo),
      });
      const resJson = await res.json();
      if (res.ok && resJson.success) {
        const savedPhoto = resJson.data || photo;
        setChampionshipPhotos((prev) => {
          const idx = prev.findIndex(
            (p) =>
              (p.id && String(p.id) === String(savedPhoto.id)) ||
              (photo.id && String(p.id) === String(photo.id))
          );
          if (idx >= 0) {
            const updated = [...prev];
            updated[idx] = savedPhoto;
            return updated;
          }
          return [savedPhoto, ...prev];
        });
        showToast('success', `Foto juara "${photo.title}" berhasil disimpan & langsung aktif di web!`);
      } else {
        showToast('error', resJson.message || 'Gagal menyimpan foto juara.');
      }
    } catch (err) {
      showToast('error', 'Gagal menyimpan foto juara.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handler: Delete Championship Photo
  const handleDeletePhoto = async (id: string | number) => {
    try {
      const res = await fetch(`/api/championships?id=${encodeURIComponent(String(id))}`, { method: 'DELETE' });
      if (res.ok) {
        setChampionshipPhotos((prev) => prev.filter((p) => String(p.id) !== String(id)));
        showToast('success', 'Foto juara berhasil dihapus.');
      } else {
        const errJson = await res.json().catch(() => null);
        showToast('error', errJson?.message || 'Gagal menghapus foto.');
      }
    } catch (err) {
      showToast('error', 'Gagal menghapus foto.');
    }
  };

  // Handler: Save Homepage Configuration
  const handleSaveHomepage = async (data: HomepageConfig) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ homepage: data }),
      });
      const resJson = await res.json();
      if (res.ok && resJson.success) {
        setHomepageData(data);
        showToast('success', 'Tampilan halaman depan berhasil disimpan & diperbarui langsung!');
      } else {
        showToast('error', resJson.message || 'Gagal menyimpan tampilan halaman depan.');
      }
    } catch (err) {
      showToast('error', 'Gagal menyimpan tampilan halaman depan.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handler: Save Full Profile Data
  const handleSaveFullProfile = async (data: FullProfileData) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const resJson = await res.json();
      if (res.ok && resJson.success) {
        setFullProfileData(data);
        showToast('success', 'Seluruh data profil madrasah berhasil disimpan & diterapkan!');
      } else {
        showToast('error', resJson.message || 'Gagal menyimpan data profil.');
      }
    } catch (err) {
      showToast('error', 'Gagal menyimpan data profil.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handler: Mark Message as Read
  const handleMarkMessageRead = async (id: string) => {
    try {
      await fetch('/api/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'read' }),
      });
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: 'read' } : m))
      );
    } catch (err) {
      console.warn('Error marking message read:', err);
    }
  };

  // Handler: Delete Message
  const handleDeleteMessage = async (id: string) => {
    try {
      await fetch(`/api/contact?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      setMessages((prev) => prev.filter((m) => m.id !== id));
      showToast('success', 'Pesan kontak berhasil dihapus.');
    } catch (err) {
      showToast('error', 'Gagal menghapus pesan.');
    }
  };

  // Handler: Save / Create Contact Message (Manual Entry)
  const handleSaveMessage = async (msg: Partial<ContactMessage>) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg),
      });
      const resJson = await res.json();
      if (res.ok && resJson.success) {
        const saved: ContactMessage = resJson.data || {
          id: `msg-${Date.now()}`,
          name: msg.name || 'Tamu Madrasah',
          email: msg.email,
          phone: msg.phone,
          subject: msg.subject || 'Aspirasi / Kunjungan Manual',
          message: msg.message || '',
          status: 'read',
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [saved, ...prev]);
        showToast('success', `Pesan/aspirasi dari "${saved.name}" berhasil dicatat.`);
      } else {
        showToast('error', resJson.message || 'Gagal mencatat pesan.');
      }
    } catch (err) {
      showToast('error', 'Gagal mencatat pesan.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handler: Save PPDB Applicant (Create)
  const handleSaveApplicant = async (app: PpdbApplicant) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(app),
      });
      const resJson = await res.json();
      if (res.ok && resJson.success) {
        const saved = resJson.applicant || app;
        setApplicants((prev) => [saved, ...prev]);
        showToast('success', `Calon santri ${app.full_name} berhasil didaftarkan (No: ${saved.registration_number}).`);
      } else {
        showToast('error', resJson.message || 'Gagal menyimpan data pendaftar.');
      }
    } catch (err) {
      showToast('error', 'Gagal menyimpan data pendaftar.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handler: Update PPDB Applicant Details (Edit)
  const handleUpdateApplicant = async (app: PpdbApplicant) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/registrations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(app),
      });
      const resJson = await res.json();
      if (res.ok && resJson.success) {
        const updated = resJson.applicant || app;
        setApplicants((prev) =>
          prev.map((a) =>
            (a.id && a.id === updated.id) || a.registration_number === updated.registration_number
              ? { ...a, ...updated }
              : a
          )
        );
        showToast('success', `Data calon santri "${app.full_name}" berhasil diperbarui.`);
      } else {
        showToast('error', resJson.message || 'Gagal memperbarui data pendaftar.');
      }
    } catch (err) {
      showToast('error', 'Gagal memperbarui data pendaftar.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handler: Delete PPDB Applicant (Delete)
  const handleDeleteApplicant = async (id: string) => {
    try {
      const res = await fetch(`/api/registrations?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const resJson = await res.json().catch(() => null);
      if (res.ok && (resJson?.success ?? true)) {
        setApplicants((prev) => prev.filter((a) => a.id !== id && a.registration_number !== id));
        showToast('success', 'Data pendaftar berhasil dihapus dari sistem.');
      } else {
        showToast('error', resJson?.message || 'Gagal menghapus data pendaftar.');
      }
    } catch (err) {
      showToast('error', 'Gagal menghapus data pendaftar.');
    }
  };

  // Handler: Update PPDB Applicant Status
  const handleUpdateApplicantStatus = async (id: string, newStatus: PpdbApplicant['status']) => {
    try {
      const res = await fetch('/api/registrations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setApplicants((prev) =>
          prev.map((a) => (a.id === id || a.registration_number === id ? { ...a, status: newStatus } : a))
        );
        showToast('success', `Status pendaftar berhasil diperbarui.`);
      } else {
        showToast('error', 'Gagal memperbarui status pendaftar.');
      }
    } catch (err) {
      showToast('error', 'Gagal memperbarui status pendaftar.');
    }
  };

  const unreadMessagesCount = messages.filter((m) => m.status === 'unread').length;

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="w-8 h-8 rounded-full border-2 border-blue-900 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <SchoolPortalLogin
        onLoginSuccess={(role) => {
          setIsAuthenticated(true);
          const r = role || 'admin';
          setUserRole(r);
          if (r === 'siswa') {
            setActiveTab('schedules');
          } else if (r === 'guru') {
            setActiveTab('schedules');
          }
        }}
      />
    );
  }

  const effectiveActiveTab: AdminTab =
    userRole === 'siswa' && !SISWA_ALLOWED_TABS.includes(activeTab)
      ? 'schedules'
      : userRole === 'guru' && !GURU_ALLOWED_TABS.includes(activeTab)
      ? 'schedules'
      : activeTab;

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mrh_admin_auth');
      localStorage.removeItem('mrh_user_role');
      window.location.href = '/masuk';
    }
    setIsAuthenticated(false);
    setUserRole('admin');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans flex">
      {/* 1. Left Sidebar */}
      <AdminSidebar
        activeTab={effectiveActiveTab}
        setActiveTab={(tab) => {
          if (userRole === 'siswa') {
            if (SISWA_ALLOWED_TABS.includes(tab)) {
              setActiveTab(tab);
            } else {
              setActiveTab('schedules');
            }
          } else if (userRole === 'guru') {
            if (GURU_ALLOWED_TABS.includes(tab)) {
              setActiveTab(tab);
            } else {
              setActiveTab('schedules');
            }
          } else {
            setActiveTab(tab);
          }
        }}
        unreadCount={unreadMessagesCount}
        teachersCount={teachers.length}
        usersCount={usersCount}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
        supabaseConnected={supabaseConnected}
        userRole={userRole}
        onLogout={handleLogout}
      />

      {/* 2. Main Body (Offset by Sidebar width on Desktop) */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0 max-w-full overflow-x-hidden min-h-screen">
        {/* Sticky Header */}
        <AdminHeader
          activeTab={effectiveActiveTab}
          setIsOpenMobile={setIsOpenMobile}
          onRefresh={loadData}
          isRefreshing={isRefreshing}
          supabaseConnected={supabaseConnected}
          userRole={userRole}
          onLogout={handleLogout}
        />

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-[13px] font-semibold border ${
                toastMessage.type === 'success'
                  ? 'bg-slate-900 text-white border-slate-800'
                  : 'bg-rose-900 text-white border-rose-800'
              }`}
            >
              {toastMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{toastMessage.text}</span>
              <button
                type="button"
                onClick={() => setToastMessage(null)}
                className="text-slate-400 hover:text-white ml-2"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Content View Tabs */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto min-w-0 overflow-x-hidden">
          {userRole === 'admin' && effectiveActiveTab === 'overview' && (
            <OverviewTab
              setActiveTab={setActiveTab}
              stats={{
                teachersCount: teachers.length,
                articlesCount: articles.length,
                championshipCount: championshipPhotos.length,
                unreadMessages: unreadMessagesCount,
                registrationsCount: applicants.length,
                academicYear: ppdbData.academicYear,
                isPpdbOpen: ppdbData.isRegistrationOpen,
              }}
              supabaseConnected={supabaseConnected}
              homepageData={homepageData}
              onSaveHomepage={handleSaveHomepage}
              isSaving={isSaving}
            />
          )}

          {effectiveActiveTab === 'schedules' && (
            <SchedulesTab
              teachers={teachers}
              initialRombel={targetRombelForSchedule}
              readOnly={userRole !== 'admin'}
              userRole={userRole}
            />
          )}

          {effectiveActiveTab === 'classes' && (
            <ClassesTab
              teachers={teachers}
              onSelectRombelForSchedule={(rombelName) => {
                setTargetRombelForSchedule(rombelName);
                setActiveTab('schedules');
              }}
              readOnly={userRole !== 'admin'}
            />
          )}

          {(effectiveActiveTab === 'calendar' || effectiveActiveTab === 'agenda') && (
            <CalendarTab readOnly={userRole !== 'admin'} />
          )}

          {userRole === 'admin' && (effectiveActiveTab === 'users' || effectiveActiveTab === 'activation') && (
            <UsersTab mode={effectiveActiveTab === 'activation' ? 'activation' : 'users'} />
          )}

          {userRole === 'admin' && effectiveActiveTab === 'homepage' && (
            <HomepageTab
              homepage={homepageData}
              onSaveHomepage={handleSaveHomepage}
              isSaving={isSaving}
            />
          )}

          {userRole === 'admin' && effectiveActiveTab === 'ppdb' && (
            <PpdbTab
              formData={ppdbData}
              setFormData={setPpdbData}
              onSave={handleSavePpdb}
              isSaving={isSaving}
            />
          )}

          {userRole === 'admin' && effectiveActiveTab === 'registrations' && (
            <RegistrationsTab
              applicants={applicants}
              onSaveApplicant={handleSaveApplicant}
              onUpdateApplicant={handleUpdateApplicant}
              onUpdateStatus={handleUpdateApplicantStatus}
              onDeleteApplicant={handleDeleteApplicant}
              isSaving={isSaving}
            />
          )}

          {userRole === 'admin' && (effectiveActiveTab === 'teachers' || effectiveActiveTab === 'website-teachers') && (
            <TeachersTab
              teachers={teachers}
              onSaveTeacher={handleSaveTeacher}
              onDeleteTeacher={handleDeleteTeacher}
              isSaving={isSaving}
              mode={effectiveActiveTab === 'website-teachers' ? 'website-teachers' : 'teachers'}
            />
          )}

          {(userRole === 'admin' || userRole === 'guru') && effectiveActiveTab === 'articles' && (
            <ArticlesTab
              articles={articles}
              onSaveArticle={handleSaveArticle}
              onDeleteArticle={handleDeleteArticle}
              isSaving={isSaving}
            />
          )}

          {(userRole === 'admin' || userRole === 'guru') &&
            (effectiveActiveTab === 'achievements' || effectiveActiveTab === 'gallery') && (
              <AchievementsTab
                photos={championshipPhotos}
                onSavePhoto={handleSavePhoto}
                onDeletePhoto={handleDeletePhoto}
                isSaving={isSaving}
              />
            )}

          {(userRole === 'admin' || userRole === 'guru') && effectiveActiveTab === 'extracurricular' && (
            <ExtracurricularTab teachers={teachers} readOnly={userRole !== 'admin'} showToast={showToast} />
          )}

          {userRole === 'admin' && (effectiveActiveTab === 'profile' || effectiveActiveTab === 'contact' || effectiveActiveTab === 'facilities') && (
            <ProfileTab
              data={fullProfileData}
              onSaveFullProfile={handleSaveFullProfile}
              isSaving={isSaving}
              activeTab={effectiveActiveTab === 'facilities' ? 'facilities' : effectiveActiveTab === 'contact' ? 'contact' : 'profile'}
            />
          )}

          {userRole === 'admin' && effectiveActiveTab === 'messages' && (
            <MessagesTab
              messages={messages}
              onMarkRead={handleMarkMessageRead}
              onDeleteMessage={handleDeleteMessage}
              onSaveMessage={handleSaveMessage}
              onRefresh={loadData}
              isSaving={isSaving}
            />
          )}
        </main>
      </div>
    </div>
  );
}
