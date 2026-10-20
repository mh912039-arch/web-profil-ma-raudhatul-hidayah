'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  GraduationCap,
  Calendar,
  CheckCircle2,
  FileText,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  UserCheck,
  School,
  Building2,
} from 'lucide-react';
import { StitchNavbar } from '@/components/layout/StitchNavbar';
import { StitchFooter } from '@/components/layout/StitchFooter';

export type JenjangKurikulum = 'all' | 'sd' | 'smp' | 'sma';

export interface MapelDetail {
  code: string;
  name: string;
  teacher: string;
  classLevel: string;
  jenjang: 'sd' | 'smp' | 'sma';
  cluster: string;
  description: string;
}

// 1. Kurikulum Jenjang SD (9 Mata Pelajaran Pokok)
const sdMapelList: MapelDetail[] = [
  {
    code: 'SD-01',
    name: 'Pendidikan Agama Islam & Budi Pekerti',
    teacher: 'TAJUDIN, S.Pd.I',
    classLevel: 'Kelas I - VI SD',
    jenjang: 'sd',
    cluster: 'pai',
    description: 'Pembinaan aqidah tauhid dasar, hafalan doa harian, pengenalan rukun Islam dan iman, serta pembiasaan adab sopan santun sejak dini.',
  },
  {
    code: 'SD-02',
    name: 'Bahasa Indonesia',
    teacher: 'KUSTYANINGSIH, S.Pd',
    classLevel: 'Kelas I - VI SD',
    jenjang: 'sd',
    cluster: 'bahasa',
    description: 'Pengembangan literasi membaca, menulis permulaan, menyimak dongeng edukatif, dan kecakapan berkomunikasi santun.',
  },
  {
    code: 'SD-03',
    name: 'Matematika Berhitung Ceria',
    teacher: 'MADROSYID, S.Pd',
    classLevel: 'Kelas I - VI SD',
    jenjang: 'sd',
    cluster: 'mipa',
    description: 'Pembelajaran berhitung konseptual, pemahaman bangun ruang dan datar sederhana, penalaran numerasi, serta permainan logika angka.',
  },
  {
    code: 'SD-04',
    name: 'Pendidikan Pancasila (PPKn SD)',
    teacher: 'Drs. MULYADI',
    classLevel: 'Kelas I - VI SD',
    jenjang: 'sd',
    cluster: 'ips',
    description: 'Pengenalan simbol negara Garuda Pancasila, pengamalan nilai gotong royong, aturan hidup rukun di keluarga dan madrasah.',
  },
  {
    code: 'SD-05',
    name: 'Ilmu Pengetahuan Alam & Sosial (IPAS)',
    teacher: 'SARNAH, S.Pd.I',
    classLevel: 'Kelas III - VI SD',
    jenjang: 'sd',
    cluster: 'mipa',
    description: 'Eksplorasi alam sekitar, panca indra, siklus makhluk hidup, dan pengenalan keragaman budaya masyarakat pesisir Tangerang.',
  },
  {
    code: 'SD-06',
    name: 'Bahasa Inggris Dasar (Fun English)',
    teacher: 'SITI KHAERUNNISA, S.Pd.I',
    classLevel: 'Kelas I - VI SD',
    jenjang: 'sd',
    cluster: 'bahasa',
    description: 'Pengenalan kosakata bahasa Inggris dasar bertema keluarga, warna, hewan, dan percakapan interaktif menyenangkan.',
  },
  {
    code: 'SD-07',
    name: 'Seni Rupa & Keterampilan Prakarya',
    teacher: 'TISKA PUSPITA DEWI, S.Pd.I',
    classLevel: 'Kelas I - VI SD',
    jenjang: 'sd',
    cluster: 'seni-olahraga',
    description: 'Melatih motorik halus anak melalui menggambar imajinatif, kolase bahan alam, mewarnai, dan kerajinan tangan kreatif.',
  },
  {
    code: 'SD-08',
    name: 'PJOK (Pendidikan Jasmani & Olahraga)',
    teacher: 'AHMAD NURUL KAHFI, SE',
    classLevel: 'Kelas I - VI SD',
    jenjang: 'sd',
    cluster: 'seni-olahraga',
    description: 'Senam irama kebugaran jasmani, melatih koordinasi gerak lokomotor, permainan ketangkasan beregu, dan pola hidup sehat.',
  },
  {
    code: 'SD-09',
    name: 'Mulok (BTQ & Hafalan Juz 30)',
    teacher: 'JAKARIA, S.Pd.I',
    classLevel: 'Kelas I - VI SD',
    jenjang: 'sd',
    cluster: 'pai',
    description: 'Bimbingan baca tulis huruf hijaiyah, makharijul huruf tartil, serta pembiasaan setoran hafalan surah-surah pendek Juz Amma.',
  },
];

// 2. Kurikulum Jenjang SMP (15 Mata Pelajaran Pokok)
const smpMapelList: MapelDetail[] = [
  {
    code: 'SMP-01',
    name: "Al-Qur'an Hadits",
    teacher: 'TAJUDIN, S.Pd.I',
    classLevel: 'Kelas VII, VIII, IX',
    jenjang: 'smp',
    cluster: 'pai',
    description: 'Kajian ayat Al-Quran dan hadits tematik mengenai toleransi, cinta tanah air, etika menuntut ilmu, dan keutamaan adab pergaulan.',
  },
  {
    code: 'SMP-02',
    name: 'Aqidah Akhlak',
    teacher: 'JAKARIA, S.Pd.I',
    classLevel: 'Kelas VII, VIII, IX',
    jenjang: 'smp',
    cluster: 'pai',
    description: 'Penanaman aqidah Islamiah berhaluan Ahlussunnah wal Jama’ah, pembersihan hati (tazkiyatun nafs), serta pembiasaan akhlak karimah remaja.',
  },
  {
    code: 'SMP-03',
    name: 'Fiqih Ibadah & Muamalah',
    teacher: 'TAJUDIN, S.Pd.I',
    classLevel: 'Kelas VII, VIII, IX',
    jenjang: 'smp',
    cluster: 'pai',
    description: 'Pendalaman tata cara sholat sunnah, sujud sahwi, zakat, puasa, haji-umroh, serta prinsip dasar muamalah jual beli yang halal.',
  },
  {
    code: 'SMP-04',
    name: 'Sejarah Kebudayaan Islam (SKI)',
    teacher: 'YAHYA HIDAYATULLOH, S.Pd.I',
    classLevel: 'Kelas VII, VIII, IX',
    jenjang: 'smp',
    cluster: 'pai',
    description: 'Napak tilas dakwah Rasulullah SAW periode Makkah & Madinah, kepemimpinan Khulafaur Rasyidin, dan masuknya Islam ke Nusantara.',
  },
  {
    code: 'SMP-05',
    name: 'Bahasa Arab',
    teacher: 'SITI KHAERUNNISA, S.Pd.I',
    classLevel: 'Kelas VII, VIII, IX',
    jenjang: 'smp',
    cluster: 'bahasa',
    description: 'Penguasaan kosakata percakapan harian (muhadatsah), membaca teks bahasa Arab (qira’ah), dan kaidah tata bahasa dasar (nahwu shorof).',
  },
  {
    code: 'SMP-06',
    name: 'Pendidikan Pancasila (PPKn SMP)',
    teacher: 'Drs. MULYADI',
    classLevel: 'Kelas VII, VIII, IX',
    jenjang: 'smp',
    cluster: 'ips',
    description: 'Penegakan norma konstitusi, perumusan UUD 1945, keberagaman suku agama ras, dan bela negara dalam bingkai NKRI.',
  },
  {
    code: 'SMP-07',
    name: 'Bahasa Indonesia',
    teacher: 'KUSTYANINGSIH, S.Pd',
    classLevel: 'Kelas VII, VIII, IX',
    jenjang: 'smp',
    cluster: 'bahasa',
    description: 'Kecakapan menulis teks laporan hasil observasi, eksposisi, narasi cerpen, teks pidato persuasif, dan literasi membaca kritis.',
  },
  {
    code: 'SMP-08',
    name: 'Matematika',
    teacher: 'MADROSYID, S.Pd',
    classLevel: 'Kelas VII, VIII, IX',
    jenjang: 'smp',
    cluster: 'mipa',
    description: 'Operasi aljabar, persamaan linear, teorema pythagoras, lingkaran, bangun ruang sisi datar dan lengkung, serta statistika terapan.',
  },
  {
    code: 'SMP-09',
    name: 'Ilmu Pengetahuan Alam (IPA Terpadu)',
    teacher: 'SARNAH, S.Pd.I',
    classLevel: 'Kelas VII, VIII, IX',
    jenjang: 'smp',
    cluster: 'mipa',
    description: 'Eksperimen gerak dan gaya, kalor perpindahan energi, sistem organ tubuh manusia, zat aditif, kemagnetan, dan bioteknologi ramah lingkungan.',
  },
  {
    code: 'SMP-10',
    name: 'Ilmu Pengetahuan Sosial (IPS Terpadu)',
    teacher: 'AHMAD NURUL KAHFI, SE',
    classLevel: 'Kelas VII, VIII, IX',
    jenjang: 'smp',
    cluster: 'ips',
    description: 'Kajian kondisi geografis ASEAN, mobilitas sosial masyarakat, kegiatan ekonomi pasar uang, serta kronologi diplomasi kemerdekaan.',
  },
  {
    code: 'SMP-11',
    name: 'Bahasa Inggris',
    teacher: 'SITI KHAERUNNISA, S.Pd.I',
    classLevel: 'Kelas VII, VIII, IX',
    jenjang: 'smp',
    cluster: 'bahasa',
    description: 'Praktik komunikasi conversation aktif, memahami teks recount & narrative, greeting, serta keterampilan presentasi berbahasa Inggris.',
  },
  {
    code: 'SMP-12',
    name: 'Informatika & TIK',
    teacher: 'MADROSYID, S.Pd',
    classLevel: 'Kelas VII, VIII, IX',
    jenjang: 'smp',
    cluster: 'mipa',
    description: 'Berpikir komputasional, algoritma logika pemrograman blok, pengoperasian software lembar kerja, dan etika berinternet aman.',
  },
  {
    code: 'SMP-13',
    name: 'Penjasorkes (PJOK)',
    teacher: 'AHMAD NURUL KAHFI, SE',
    classLevel: 'Kelas VII, VIII, IX',
    jenjang: 'smp',
    cluster: 'seni-olahraga',
    description: 'Keterampilan teknik dasar bola voli, futsal, bulutangkis, lari atletik, senam lantai, dan pembinaan sportivitas generasi muda.',
  },
  {
    code: 'SMP-14',
    name: 'Seni Budaya & Prakarya',
    teacher: 'TISKA PUSPITA DEWI, S.Pd.I',
    classLevel: 'Kelas VII, VIII, IX',
    jenjang: 'smp',
    cluster: 'seni-olahraga',
    description: 'Berkarya seni lukis ornamen nusantara, menyanyi lagu daerah, kerajinan bahan keras lunak, dan pengolahan pangan sehat higienis.',
  },
  {
    code: 'SMP-15',
    name: "Mulok (BTQ & Tahfidz Al-Qur'an)",
    teacher: 'TISKA PUSPITA DEWI, S.Pd.I',
    classLevel: 'Kelas VII, VIII, IX',
    jenjang: 'smp',
    cluster: 'pai',
    description: 'Pendalaman hukum tajwid mad far’i dan waqaf, tilawah tartil nada bayyati, serta pendampingan hafalan juz 30 dan surah pilihan.',
  },
];

// 3. Kurikulum Jenjang SMA / MA (22 Mata Pelajaran Pokok)
const smaMapelList: MapelDetail[] = [
  {
    code: 'SMA-01',
    name: "Qur'an-Hadits",
    teacher: 'TAJUDIN, S.Pd.I',
    classLevel: 'Kelas X, XI, XII',
    jenjang: 'sma',
    cluster: 'pai',
    description: 'Pendalaman kaidah tafsir Al-Quran, metodologi pemahaman hadits tematik, dan pengamalan etika nubuwah dalam kehidupan sehari-hari.',
  },
  {
    code: 'SMA-02',
    name: 'Aqidah-Akhlak',
    teacher: 'JAKARIA, S.Pd.I',
    classLevel: 'Kelas X, XI, XII',
    jenjang: 'sma',
    cluster: 'pai',
    description: 'Penguatan tauhid berhaluan Ahlussunnah wal Jama’ah, pembersihan hati (tazkiyatun nafs), serta pembiasaan adab mulia kepada sesama.',
  },
  {
    code: 'SMA-03a',
    name: 'Fiqih (Kelas XI)',
    teacher: 'TAJUDIN, S.Pd.I',
    classLevel: 'Kelas XI',
    jenjang: 'sma',
    cluster: 'pai',
    description: 'Kajian hukum muamalah, munakahat, mawaris, dan fikih kontemporer berbasis kitab turots dan kompilasi hukum Islam.',
  },
  {
    code: 'SMA-03b',
    name: 'Fiqih (Kelas X & XII)',
    teacher: 'JAKARIA, S.Pd.I',
    classLevel: 'Kelas X & XII',
    jenjang: 'sma',
    cluster: 'pai',
    description: 'Pendalaman thaharah, ibadah praktis, ushul fikih dasar, serta kaidah ijtihad dalam merespons perkembangan zaman modern.',
  },
  {
    code: 'SMA-04',
    name: 'SKI (Sejarah Kebudayaan Islam)',
    teacher: 'YAHYA HIDAYATULLOH, S.Pd.I',
    classLevel: 'Kelas X, XI, XII',
    jenjang: 'sma',
    cluster: 'pai',
    description: 'Menelusuri jejak peradaban Islam sejak era Khulafaur Rasyidin, dinasti keemasan Islam, hingga syiar dakwah ulama nusantara.',
  },
  {
    code: 'SMA-05',
    name: 'Bahasa Arab',
    teacher: 'SITI KHAERUNNISA, S.Pd.I',
    classLevel: 'Kelas X, XI, XII',
    jenjang: 'sma',
    cluster: 'bahasa',
    description: 'Penguasaan gramatika nahwu-shorof aplikatif, muhadatsah aktif, serta kecakapan memahami teks kitab kuning dan wacana kontemporer.',
  },
  {
    code: 'SMA-06',
    name: 'Pendidikan Pancasila (PPKn)',
    teacher: 'Drs. MULYADI',
    classLevel: 'Kelas X, XI, XII',
    jenjang: 'sma',
    cluster: 'ips',
    description: 'Penanaman wawasan kebangsaan, nilai falsafah Pancasila, konstitusi UUD 1945, dan pembinaan kesadaran hukum warga negara.',
  },
  {
    code: 'SMA-07',
    name: 'Bahasa Indonesia',
    teacher: 'KUSTYANINGSIH, S.Pd',
    classLevel: 'Kelas X, XI, XII',
    jenjang: 'sma',
    cluster: 'bahasa',
    description: 'Pengasahan literasi membaca kritis, penulisan karya ilmiah, apresiasi sastra nusantara, dan keterampilan retorika publik.',
  },
  {
    code: 'SMA-08',
    name: 'Matematika',
    teacher: 'MADROSYID, S.Pd',
    classLevel: 'Kelas X, XI, XII',
    jenjang: 'sma',
    cluster: 'mipa',
    description: 'Penalaran aljabar, kalkulus, trigonometri, statistika terapan, serta penguatan logika numerasi untuk pemecahan masalah nyata.',
  },
  {
    code: 'SMA-09',
    name: 'Fisika',
    teacher: 'SARNAH, S.Pd.I',
    classLevel: 'Peminatan MIPA (Kelas X - XII)',
    jenjang: 'sma',
    cluster: 'mipa',
    description: 'Eksplorasi mekanika, termodinamika, gelombang optik, dan fisika modern melalui percobaan laboratorium kontekstual.',
  },
  {
    code: 'SMA-10',
    name: 'Biologi',
    teacher: 'SARNAH, S.Pd.I',
    classLevel: 'Peminatan MIPA (Kelas X - XII)',
    jenjang: 'sma',
    cluster: 'mipa',
    description: 'Kajian biosains terpadu, fisiologi organisme, ekosistem lingkungan hidup, bioteknologi, serta tadabbur ayat kauniyah alam semesta.',
  },
  {
    code: 'SMA-11',
    name: 'Sejarah (Kelas X & XI)',
    teacher: 'AHMAD NURUL KAHFI, SE',
    classLevel: 'Kelas X & XI',
    jenjang: 'sma',
    cluster: 'ips',
    description: 'Pengkajian kronik perjuangan kemerdekaan bangsa Indonesia, diplomasi nasional, dan dinamika transformasi sosial peradaban.',
  },
  {
    code: 'SMA-13',
    name: 'Ekonomi',
    teacher: 'AHMAD NURUL KAHFI, SE',
    classLevel: 'Peminatan IPS (Kelas X - XII)',
    jenjang: 'sma',
    cluster: 'ips',
    description: 'Analisis mikro-makro ekonomi, literasi keuangan syariah, perbankan, dan strategi kewirausahaan pasar modal.',
  },
  {
    code: 'SMA-14',
    name: 'Sejarah (Kelas XII)',
    teacher: 'SARNAH, S.Pd.I',
    classLevel: 'Kelas XII',
    jenjang: 'sma',
    cluster: 'ips',
    description: 'Pendalaman sejarah kontemporer dunia, geopolitik regional ASEAN, dan peran diplomatik Indonesia di panggung global.',
  },
  {
    code: 'SMA-15',
    name: 'Geografi',
    teacher: 'YAHYA HIDAYATULLOH, S.Pd.I',
    classLevel: 'Peminatan IPS (Kelas X - XII)',
    jenjang: 'sma',
    cluster: 'ips',
    description: 'Studi geosfer, pemetaan sistem informasi geografis (SIG), mitigasi bencana alam, dan tata kelola sumber daya berkelanjutan.',
  },
  {
    code: 'SMA-16',
    name: 'Bahasa Inggris',
    teacher: 'SITI KHAERUNNISA, S.Pd.I',
    classLevel: 'Kelas X, XI, XII',
    jenjang: 'sma',
    cluster: 'bahasa',
    description: 'Komunikasi internasional aktif, persiapan TOEFL/IELTS dasar, academic writing, dan public speech percaya diri.',
  },
  {
    code: 'SMA-17',
    name: 'Penjaskes (PJOK)',
    teacher: 'AHMAD NURUL KAHFI, SE',
    classLevel: 'Kelas X, XI, XII',
    jenjang: 'sma',
    cluster: 'seni-olahraga',
    description: 'Kebugaran jasmani, pembinaan cabang atletik, olahraga beregu (futsal & voli), serta penanaman pola hidup sehat sportivitas.',
  },
  {
    code: 'SMA-18',
    name: 'Seni-Budaya (Kelas XI & XII)',
    teacher: 'LILIS KASTIRI, S.Pd.I',
    classLevel: 'Kelas XI & XII',
    jenjang: 'sma',
    cluster: 'seni-olahraga',
    description: 'Eksplorasi seni lukis, musik rebana kontemporer, kriya ornamen islami, dan apresiasi karya kebudayaan nusantara.',
  },
  {
    code: 'SMA-19',
    name: 'Mulok (BTQ / Baca Tulis Al-Qur’an)',
    teacher: 'TISKA PUSPITA DEWI, S.Pd.I',
    classLevel: 'Kelas X, XI, XII',
    jenjang: 'sma',
    cluster: 'pai',
    description: 'Pembinaan kaidah makharijul huruf, tajwid musyafahah, tahsin tilawah, serta kaligrafi khat naskhi standar Kementerian Agama.',
  },
  {
    code: 'SMA-20',
    name: 'Prakarya & Kewirausahaan (PKWU)',
    teacher: 'TISKA PUSPITA DEWI, S.Pd.I',
    classLevel: 'Kelas X, XI, XII',
    jenjang: 'sma',
    cluster: 'seni-olahraga',
    description: 'Inovasi produk pangan lokal, kerajinan tangan bernilai ekonomi, pengemasan modern, dan simulasi pemasaran digital mandiri.',
  },
  {
    code: 'SMA-21',
    name: 'Seni Budaya (Kelas X)',
    teacher: 'TISKA PUSPITA DEWI, S.Pd.I',
    classLevel: 'Kelas X',
    jenjang: 'sma',
    cluster: 'seni-olahraga',
    description: 'Pengenalan dasar estetika visual, karya dua dimensi dan tiga dimensi, serta seni pertunjukan tradisional santri.',
  },
  {
    code: 'SMA-22',
    name: 'TIKOM (Informatika)',
    teacher: 'MADROSYID, S.Pd',
    classLevel: 'Kelas X, XI, XII',
    jenjang: 'sma',
    cluster: 'mipa',
    description: 'Literasi komputasi digital, algoritma pemrograman dasar, pengoperasian software perkantoran, dan etika siber internet sehat.',
  },
];

const allInitialMapel: MapelDetail[] = [
  ...sdMapelList,
  ...smpMapelList,
  ...smaMapelList,
];

export default function KurikulumPage() {
  const [selectedJenjang, setSelectedJenjang] = useState<JenjangKurikulum>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapelList, setMapelList] = useState<MapelDetail[]>(allInitialMapel);

  useEffect(() => {
    fetch('/api/teachers', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const dynamicMapel: MapelDetail[] = data.map((t: any, idx: number) => {
            // Determine jenjang
            let j: 'sd' | 'smp' | 'sma' = 'sma';
            if (t.jenjang === 'sd' || t.jenjang === 'smp' || t.jenjang === 'sma') {
              j = t.jenjang;
            } else {
              const codeStr = String(t.code || '').toLowerCase();
              const levelStr = String(t.class_level || '').toLowerCase();
              if (codeStr.startsWith('sd') || levelStr.includes('sd') || /kelas\s*[1-6]\b/i.test(levelStr)) {
                j = 'sd';
              } else if (codeStr.startsWith('smp') || levelStr.includes('smp') || /kelas\s*(vii|viii|ix)\b/i.test(levelStr)) {
                j = 'smp';
              } else {
                j = 'sma';
              }
            }

            // Determine cluster
            const cat = String(t.category_label || '').toLowerCase();
            const sub = String(t.subject_name || '').toLowerCase();
            let cluster: string = 'seni-olahraga';
            if (cat.includes('islam') || cat.includes('agama') || sub.includes('qur') || sub.includes('akhlak') || sub.includes('fiqih') || sub.includes('btq') || sub.includes('ski') || sub.includes('tahfidz')) {
              cluster = 'pai';
            } else if (cat.includes('mipa') || sub.includes('matematika') || sub.includes('ipa') || sub.includes('fisika') || sub.includes('kimia') || sub.includes('biologi') || sub.includes('tikom') || sub.includes('informatika')) {
              cluster = 'mipa';
            } else if (cat.includes('ips') || cat.includes('sosial') || cat.includes('kewarganegaraan') || sub.includes('pancasila') || sub.includes('ppkn') || sub.includes('sejarah') || sub.includes('geografi') || sub.includes('ekonomi') || sub.includes('sosiologi')) {
              cluster = 'ips';
            } else if (cat.includes('bahasa') || sub.includes('bahasa') || sub.includes('english') || sub.includes('arab') || sub.includes('sunda')) {
              cluster = 'bahasa';
            }

            // Find description from fallback list if available, or generate standard one
            const matched = allInitialMapel.find(
              (m) =>
                (t.code && m.code.toLowerCase() === String(t.code).toLowerCase()) ||
                (t.subject_name && m.name.toLowerCase() === String(t.subject_name).toLowerCase())
            );

            const description =
              t.description ||
              matched?.description ||
              `Pembelajaran resmi mata pelajaran ${t.subject_name || 'Mata Pelajaran'} yang dibimbing oleh ${t.name || 'Dewan Guru'} untuk tingkat ${t.class_level || 'Semua Kelas'}.`;

            return {
              code: String(t.code || idx + 1),
              name: t.subject_name || 'Mata Pelajaran',
              teacher: t.name || 'Guru Pengampu',
              classLevel: t.class_level || 'Semua Kelas',
              jenjang: j,
              cluster,
              description,
            };
          });

          setMapelList(dynamicMapel);
        }
      })
      .catch((err) => console.warn('Could not fetch dynamic teachers for kurikulum:', err));
  }, []);

  const counts = {
    all: mapelList.length,
    sd: mapelList.filter((m) => m.jenjang === 'sd').length,
    smp: mapelList.filter((m) => m.jenjang === 'smp').length,
    sma: mapelList.filter((m) => m.jenjang === 'sma').length,
  };

  const filteredMapel = mapelList.filter((m) => {
    const matchesJenjang = selectedJenjang === 'all' || m.jenjang === selectedJenjang;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesJenjang;
    const matchesQuery =
      m.name.toLowerCase().includes(q) ||
      m.teacher.toLowerCase().includes(q) ||
      m.code.toLowerCase().includes(q) ||
      m.classLevel.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q);
    return matchesJenjang && matchesQuery;
  });

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#fbfbfa] font-sans text-slate-800">
      <StitchNavbar />

      <main className="w-full pt-28 pb-16 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-[12px] font-medium text-slate-500 mb-6">
            <Link href="/" className="hover:text-blue-700 transition-colors">Beranda</Link>
            <span>/</span>
            <Link href="/akademik/ekstrakurikuler" className="hover:text-blue-700 transition-colors">Akademik</Link>
            <span>/</span>
            <span className="text-slate-800 font-bold">Kurikulum &amp; Mata Pelajaran</span>
          </div>

          {/* Page Hero Header */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm mb-10 relative overflow-hidden">
            <div className="relative z-10 max-w-3xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-[11.5px] font-bold uppercase tracking-wider mb-4">
                <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                <span>Struktur Kurikulum Yayasan Raudhatul Hidayah</span>
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-[1.15] mb-4">
                Daftar Mata Pelajaran Resmi &amp; Guru Pengampu
              </h1>
              <p className="font-sans text-[15px] sm:text-[16px] text-slate-600 leading-relaxed mb-6">
                Mengintegrasikan kurikulum madrasah nasional dan kajian kepesantrenan terpadu jenjang SD, SMP, dan SMA / MA yang dibimbing oleh dewan pendidik berkualifikasi di bidangnya.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/profil/guru-tendik"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-sans text-[13px] font-semibold hover:bg-slate-800 transition-all shadow-sm"
                >
                  <UserCheck className="w-4 h-4 text-amber-400" />
                  <span>Lihat Profil Dewan Guru</span>
                </Link>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-sans text-[13px] font-medium border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Tahun Ajaran Aktif 2026/2027</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar & Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-200">
            <span className="font-sans text-[13.5px] text-slate-500 font-medium">
              Menampilkan <strong className="text-slate-900">{filteredMapel.length}</strong> mata pelajaran resmi
              {selectedJenjang !== 'all' ? ` (Jenjang ${selectedJenjang.toUpperCase()})` : ''}
            </span>

            {/* Search Input */}
            <div className="w-full sm:w-80 relative shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari mata pelajaran, guru, kode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white font-sans text-[13.5px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 border border-slate-200 shadow-sm"
              />
            </div>
          </div>

          {/* Jenjang Filter Navbar ("Navbar Kepinggir") */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedJenjang('all')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-[13px] font-semibold whitespace-nowrap transition-all duration-200 active:scale-[0.98] ${
                selectedJenjang === 'all'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/90'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Semua Jenjang</span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                selectedJenjang === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {counts.all}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedJenjang('sd')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-[13px] font-semibold whitespace-nowrap transition-all duration-200 active:scale-[0.98] ${
                selectedJenjang === 'sd'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/90'
              }`}
            >
              <School className="w-4 h-4" />
              <span>Jenjang SD</span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                selectedJenjang === 'sd' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {counts.sd}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedJenjang('smp')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-[13px] font-semibold whitespace-nowrap transition-all duration-200 active:scale-[0.98] ${
                selectedJenjang === 'smp'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/90'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Jenjang SMP</span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                selectedJenjang === 'smp' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {counts.smp}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedJenjang('sma')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-[13px] font-semibold whitespace-nowrap transition-all duration-200 active:scale-[0.98] ${
                selectedJenjang === 'sma'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/90'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Jenjang SMA / MA</span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                selectedJenjang === 'sma' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {counts.sma}
              </span>
            </button>
          </div>

          {/* Grid of Mata Pelajaran Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMapel.map((mapel, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Badges: Jenjang & Class Level */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                      mapel.jenjang === 'sd'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : mapel.jenjang === 'smp'
                        ? 'bg-sky-50 text-sky-800 border border-sky-200'
                        : 'bg-blue-50 text-blue-800 border border-blue-200'
                    }`}>
                      {mapel.jenjang.toUpperCase()} • {mapel.classLevel}
                    </span>
                  </div>

                  {/* Subject Name */}
                  <h3 className="font-serif text-[19px] font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug mb-2">
                    {mapel.name}
                  </h3>

                  {/* Description */}
                  <p className="font-sans text-[13px] text-slate-600 leading-relaxed mb-4">
                    {mapel.description}
                  </p>
                </div>

                {/* Teacher Footer */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                  <div className="flex flex-col">
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                      Guru Pengampu:
                    </span>
                    <span className="text-[13px] font-bold text-slate-900">
                      {mapel.teacher}
                    </span>
                  </div>
                  <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
                    <BookOpen className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredMapel.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-sm">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-slate-800 mb-2">
                Mata Pelajaran Tidak Ditemukan
              </h3>
              <p className="font-sans text-sm text-slate-500 max-w-md mx-auto mb-6">
                Tidak ada mata pelajaran yang cocok dengan kata kunci &ldquo;{searchQuery}&rdquo; untuk filter jenjang yang dipilih.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedJenjang('all');
                }}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm"
              >
                Reset Filter &amp; Pencarian
              </button>
            </div>
          )}
        </div>
      </main>

      <StitchFooter />
    </div>
  );
}
