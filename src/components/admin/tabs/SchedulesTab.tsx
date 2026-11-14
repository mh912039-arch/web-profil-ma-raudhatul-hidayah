'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Clock,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  X,
  Filter,
  Download,
  Users,
  GraduationCap,
  School,
  Image as ImageIcon,
  Camera,
  Maximize2,
  RefreshCw,
  ScanLine,
  Eye,
  UploadCloud,
  UserCheck,
  MapPin,
  CalendarCheck,
  Radio,
  Layers,
  Sparkles,
} from 'lucide-react';
import { TeacherRecord } from './TeachersTab';
import { compressImageBelow100Kb } from '@/lib/imageCompression';
import { ConfirmDeleteModal } from '../ConfirmDeleteModal';

export interface ScheduleItem {
  id: string;
  class_rombel: string;
  day: string;
  session_no: number;
  time_start: string;
  time_end: string;
  subject_name: string;
  category?: string;
  teacher_name: string;
  room?: string;
}

interface SchedulePhotoInfo {
  photo_url: string | null;
  updated_at: string | null;
  caption?: string;
}

interface SchedulesTabProps {
  teachers: TeacherRecord[];
  initialRombel?: string;
  readOnly?: boolean;
  userRole?: 'admin' | 'guru' | 'siswa';
  currentUserName?: string;
}

export type JenjangLevel = 'all' | 'sd' | 'smp' | 'sma';

export interface RombelItem {
  id: string;
  name: string;
  level: 'sd' | 'smp' | 'sma';
  shortName: string;
  badge: string;
}

export const allRombels: RombelItem[] = [
  // 1. Jenjang SD (Kelas 1 - 6 Angka Romawi: I, II, III, IV, V, VI)
  { id: 'SD - Kelas I', name: 'SD - Kelas I', level: 'sd', shortName: 'Kelas I', badge: 'SD' },
  { id: 'SD - Kelas II', name: 'SD - Kelas II', level: 'sd', shortName: 'Kelas II', badge: 'SD' },
  { id: 'SD - Kelas III', name: 'SD - Kelas III', level: 'sd', shortName: 'Kelas III', badge: 'SD' },
  { id: 'SD - Kelas IV', name: 'SD - Kelas IV', level: 'sd', shortName: 'Kelas IV', badge: 'SD' },
  { id: 'SD - Kelas V', name: 'SD - Kelas V', level: 'sd', shortName: 'Kelas V', badge: 'SD' },
  { id: 'SD - Kelas VI', name: 'SD - Kelas VI', level: 'sd', shortName: 'Kelas VI', badge: 'SD' },

  // 2. Jenjang SMP (Kelas 7, 8, 9 Angka Romawi: VII, VIII, IX)
  { id: 'SMP - Kelas VII', name: 'SMP - Kelas VII', level: 'smp', shortName: 'Kelas VII', badge: 'SMP' },
  { id: 'SMP - Kelas VIII', name: 'SMP - Kelas VIII', level: 'smp', shortName: 'Kelas VIII', badge: 'SMP' },
  { id: 'SMP - Kelas IX', name: 'SMP - Kelas IX', level: 'smp', shortName: 'Kelas IX', badge: 'SMP' },

  // 3. Jenjang SMA / MA (Kelas 10, 11, 12 Angka Romawi: X, XI, XII)
  { id: 'SMA - Kelas X', name: 'SMA - Kelas X', level: 'sma', shortName: 'Kelas X', badge: 'SMA' },
  { id: 'SMA - Kelas XI', name: 'SMA - Kelas XI', level: 'sma', shortName: 'Kelas XI', badge: 'SMA' },
  { id: 'SMA - Kelas XII', name: 'SMA - Kelas XII', level: 'sma', shortName: 'Kelas XII', badge: 'SMA' },
];

const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export function cleanTeacherName(name?: string): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/\b(s\.?pd\.?i|s\.?pd|m\.?pd\.?i|m\.?pd|s\.?ag|m\.?ag|drs|dra|se|lc|st|kom|h|hj)\b/gi, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isTeacherMatch(scheduleTeacher?: string, currentTeacherNameOrUsername?: string): boolean {
  if (!scheduleTeacher || !currentTeacherNameOrUsername) return false;
  const cleanA = cleanTeacherName(scheduleTeacher);
  const cleanB = cleanTeacherName(currentTeacherNameOrUsername);
  if (!cleanA || !cleanB) return false;
  if (cleanA === cleanB) return true;
  if (cleanA.includes(cleanB) || cleanB.includes(cleanA)) return true;

  const wordsA = cleanA.split(/\s+/).filter((w) => w.length > 2);
  const wordsB = cleanB.split(/\s+/).filter((w) => w.length > 2);
  return wordsA.some((wa) => wordsB.some((wb) => wa === wb));
}

export function getTodayDayName(date: Date = new Date()): string {
  const daysMap = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const day = daysMap[date.getDay()];
  return day === 'Minggu' ? 'Senin' : day;
}

export function getSessionLiveStatus(
  sessionDay: string,
  timeStart: string,
  timeEnd: string,
  now: Date
): {
  status: 'ongoing' | 'upcoming' | 'completed' | 'other_day';
  label: string;
  badgeClass: string;
  dotClass?: string;
} {
  const currentDayName = getTodayDayName(now);

  if (sessionDay.toLowerCase() !== currentDayName.toLowerCase()) {
    return {
      status: 'other_day',
      label: sessionDay,
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    };
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const parseToMinutes = (timeStr: string) => {
    const parts = (timeStr || '').split(/[:.]/).map((n) => parseInt(n, 10) || 0);
    return (parts[0] || 0) * 60 + (parts[1] || 0);
  };

  const startMin = parseToMinutes(timeStart);
  const endMin = parseToMinutes(timeEnd);

  if (currentMinutes >= startMin && currentMinutes < endMin) {
    return {
      status: 'ongoing',
      label: 'Sedang Berlangsung',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold',
      dotClass: 'bg-emerald-500 animate-pulse',
    };
  } else if (currentMinutes < startMin) {
    const diff = startMin - currentMinutes;
    const hours = Math.floor(diff / 60);
    const mins = diff % 60;
    const remainingText = hours > 0 ? `${hours}j ${mins}m lagi` : `${mins} menit lagi`;
    return {
      status: 'upcoming',
      label: `Mendatang (${remainingText})`,
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 font-semibold',
      dotClass: 'bg-blue-500',
    };
  } else {
    return {
      status: 'completed',
      label: 'Selesai',
      badgeClass: 'bg-slate-100 text-slate-500 border-slate-200',
      dotClass: 'bg-slate-400',
    };
  }
}

export const SchedulesTab: React.FC<SchedulesTabProps> = ({
  teachers,
  initialRombel,
  readOnly = false,
  userRole = 'admin',
  currentUserName,
}) => {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<JenjangLevel>(() => {
    if (initialRombel?.startsWith('SD')) return 'sd';
    if (initialRombel?.startsWith('SMP')) return 'smp';
    return 'sma';
  });
  const [selectedRombel, setSelectedRombel] = useState<string>(initialRombel || 'SMA - Kelas X');
  const [selectedDay, setSelectedDay] = useState<string>('Senin');
  const [isLoading, setIsLoading] = useState(true);

  // Mode Tampilan Opsi 2: 'my_teaching' (default aktif untuk guru) atau 'all_classes'
  const [scheduleViewMode, setScheduleViewMode] = useState<'my_teaching' | 'all_classes'>(
    userRole === 'guru' ? 'my_teaching' : 'all_classes'
  );

  // Realtime clock untuk pembaruan status sesi live secara perpetual
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const todayDayName = useMemo(() => getTodayDayName(currentTime), [currentTime]);

  // Tab hari terpilih untuk agenda mengajar guru
  const [selectedTeacherDay, setSelectedTeacherDay] = useState<string>(todayDayName);

  // Nama guru aktif yang jadwalnya sedang dilihat
  const [activeTeacherName, setActiveTeacherName] = useState<string>(() => {
    if (currentUserName && currentUserName.toLowerCase() !== 'guru' && currentUserName.toLowerCase() !== 'admin') {
      return currentUserName;
    }
    return 'JAKARIA, S.Pd.I';
  });

  useEffect(() => {
    if (currentUserName && currentUserName.toLowerCase() !== 'guru' && currentUserName.toLowerCase() !== 'admin') {
      setActiveTeacherName(currentUserName);
    }
  }, [currentUserName]);

  // Photo & OCR state
  const [schedulePhoto, setSchedulePhoto] = useState<SchedulePhotoInfo | null>(null);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatusText, setScanStatusText] = useState('');
  const [scanNotification, setScanNotification] = useState<{
    message: string;
    count: number;
    rombel: string;
  } | null>(null);
  const [showUploadBox, setShowUploadBox] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (initialRombel) {
      setSelectedRombel(initialRombel);
      if (initialRombel.startsWith('SD')) setSelectedLevel('sd');
      else if (initialRombel.startsWith('SMA')) setSelectedLevel('sma');
      else if (initialRombel.startsWith('SMP')) setSelectedLevel('smp');
    }
  }, [initialRombel]);

  // Modal State for manual add/edit
  type ModalMode = 'day' | 'single';
  const [modalMode, setModalMode] = useState<ModalMode>('day');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const [formData, setFormData] = useState<Partial<ScheduleItem>>({
    class_rombel: initialRombel || 'SMA - Kelas X',
    day: 'Senin',
    session_no: 1,
    time_start: '06:45',
    time_end: '07:30',
    subject_name: '',
    teacher_name: teachers[0]?.name || 'Dewan Guru',
  });

  // State Form Mode Harian (Batch Vertikal Sesi 1..N dalam 1 Hari)
  interface DaySessionEntry {
    session_no: number;
    time_start: string;
    time_end: string;
    subject_name: string;
    teacher_name: string;
  }
  const [dayForm, setDayForm] = useState<{
    class_rombel: string;
    day: string;
    sessions: DaySessionEntry[];
  }>({
    class_rombel: initialRombel || 'SMA - Kelas X',
    day: 'Senin',
    sessions: [],
  });
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'photo' | 'schedule';
    id?: string;
    name?: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Schedules
  const fetchSchedules = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/schedules', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setSchedules(data);
      }
    } catch (err) {
      console.error('Failed to load schedules:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Schedule Photo
  const fetchSchedulePhoto = async () => {
    try {
      const res = await fetch('/api/schedules/photo', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setSchedulePhoto(data);
      }
    } catch (err) {
      console.warn('Failed to load schedule photo:', err);
    }
  };

  useEffect(() => {
    fetchSchedules();
    fetchSchedulePhoto();
  }, []);

  // Filter rombels by active jenjang level
  const displayedRombels =
    selectedLevel === 'all'
      ? allRombels
      : allRombels.filter((r) => r.level === selectedLevel);

  // Helper match for rombel (handles with or without level prefix & romawi variants)
  const isRombelMatch = (itemRombel: string, targetRombel: string) => {
    if (!itemRombel || !targetRombel) return false;
    if (itemRombel === targetRombel) return true;
    const cleanItem = itemRombel.replace(/^(SD|SMP|SMA)\s*-\s*/i, '').trim();
    const cleanTarget = targetRombel.replace(/^(SD|SMP|SMA)\s*-\s*/i, '').trim();
    if (cleanItem === cleanTarget) return true;
    if (cleanItem.replace(/-[A-Z0-9]+$/i, '').trim() === cleanTarget.replace(/-[A-Z0-9]+$/i, '').trim()) return true;
    return false;
  };

  // Filter schedules for active rombel and day
  const currentSchedules = schedules
    .filter((s) => isRombelMatch(s.class_rombel, selectedRombel) && s.day === selectedDay)
    .sort((a, b) => a.session_no - b.session_no);

  // Get session counts for each day in current rombel
  const getDayCount = (day: string) => {
    return schedules.filter(
      (s) => isRombelMatch(s.class_rombel, selectedRombel) && s.day === day
    ).length;
  };

  // 1. Daftar seluruh nama guru untuk dropdown Admin
  const availableTeachersList = useMemo(() => {
    const fromTeachers = (teachers || []).map((t) => t.name).filter(Boolean);
    const fromSchedules = schedules
      .map((s) => s.teacher_name)
      .filter((n) => n && n !== 'Dewan Guru' && n !== 'Pembina Pramuka');
    const set = new Set([...fromTeachers, ...fromSchedules]);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [teachers, schedules]);

  // 2. Seluruh sesi mengajar guru yang aktif diurutkan per hari dan jam
  const myTeachingSessions = useMemo(() => {
    const dayOrder: Record<string, number> = {
      Senin: 1,
      Selasa: 2,
      Rabu: 3,
      Kamis: 4,
      Jumat: 5,
      Sabtu: 6,
    };
    return schedules
      .filter((s) => isTeacherMatch(s.teacher_name, activeTeacherName))
      .sort((a, b) => {
        const dDiff = (dayOrder[a.day] || 9) - (dayOrder[b.day] || 9);
        if (dDiff !== 0) return dDiff;
        return a.time_start.localeCompare(b.time_start);
      });
  }, [schedules, activeTeacherName]);

  // 3. Sesi mengajar khusus hari ini
  const todayTeachingSessions = useMemo(() => {
    return myTeachingSessions.filter((s) => s.day.toLowerCase() === todayDayName.toLowerCase());
  }, [myTeachingSessions, todayDayName]);

  // 4. Sesi yang sedang aktif saat ini (Live Indicator)
  const activeNowSession = useMemo(() => {
    return todayTeachingSessions.find((s) => {
      const live = getSessionLiveStatus(s.day, s.time_start, s.time_end, currentTime);
      return live.status === 'ongoing';
    });
  }, [todayTeachingSessions, currentTime]);

  // 5. Sesi berikutnya yang akan datang hari ini
  const nextUpcomingSession = useMemo(() => {
    return todayTeachingSessions.find((s) => {
      const live = getSessionLiveStatus(s.day, s.time_start, s.time_end, currentTime);
      return live.status === 'upcoming';
    });
  }, [todayTeachingSessions, currentTime]);

  // 6. Sesi yang ditampilkan sesuai tab hari yang dipilih guru
  const displayTeacherSessions = useMemo(() => {
    if (selectedTeacherDay === 'Semua') {
      return myTeachingSessions;
    }
    return myTeachingSessions.filter(
      (s) => s.day.toLowerCase() === selectedTeacherDay.toLowerCase()
    );
  }, [myTeachingSessions, selectedTeacherDay]);

  // Photo File Change Handler
  const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi berkas PDF
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      alert(
        'Format berkas PDF belum didukung untuk pemindaian OCR gambar otomatis.\n\n' +
        'Solusi Cepat (10 Detik):\n' +
        '1. Buka dokumen PDF jadwal di HP atau komputer Anda.\n' +
        '2. Ambil tangkapan layar (screenshot) pada bagian tabel jadwalnya (tersimpan sebagai JPG / PNG).\n' +
        '3. Unggah foto screenshot tersebut ke sini agar sistem otomatis membaca hari, jam, mapel, dan guru.'
      );
      e.target.value = '';
      return;
    }

    // Validasi tipe berkas non-gambar
    if (!file.type.startsWith('image/')) {
      alert('Format berkas tidak dikenali. Silakan pilih berkas foto atau gambar jadwal (JPG, PNG, atau WebP).');
      e.target.value = '';
      return;
    }

    await processSchedulePhoto(file);
    e.target.value = '';
  };

  // Helper persiapan citra khusus OCR (upscale jika gambar kecil agar angka jam & teks tabel terbaca akurat)
  const prepareImageForOcr = (sourceFile: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(sourceFile);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          // Jika citra kecil (< 1400px), perbesar agar angka & teks kecil di tabel terbaca jelas oleh Tesseract
          if (width < 1400) {
            const scale = Math.max(2, Math.min(3, 1600 / width));
            width = Math.round(width * scale);
            height = Math.round(height * scale);
          } else if (width > 2200) {
            const scale = 1800 / width;
            width = 1800;
            height = Math.round(height * scale);
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve(sourceFile);

          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((b) => resolve(b || sourceFile), 'image/jpeg', 0.95);
        };
        img.onerror = () => resolve(sourceFile);
      };
      reader.onerror = () => resolve(sourceFile);
    });
  };

  // Intelligent OCR & Auto-Update Handler
  const processSchedulePhoto = async (file: File) => {
    try {
      setIsScanning(true);
      setScanProgress(10);
      setScanStatusText('Mengompresi foto (< 100 KB) agar hemat storage...');

      // Kompresi otomatis di sisi browser sebelum dikirim
      let uploadFile: Blob = file;
      try {
        const compressed = await compressImageBelow100Kb(file, 1600);
        uploadFile = compressed.blob;
      } catch (cErr) {
        console.warn('Notice: Client compression fallback to raw file:', cErr);
      }

      setScanProgress(20);
      setScanStatusText('Mengunggah berkas foto dokumen jadwal...');

      // 1. Upload via /api/upload
      const uploadFormData = new FormData();
      uploadFormData.append('file', uploadFile, file.name.replace(/\.[^/.]+$/, '.jpg'));
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!uploadRes.ok) {
        const errJson = await uploadRes.json().catch(() => ({}));
        const msg = errJson.message || errJson.error || `Gagal mengunggah foto (Status ${uploadRes.status})`;
        throw new Error(msg);
      }

      const uploadData = await uploadRes.json();
      const photoUrl = uploadData.url;

      // 2. Simpan sebagai Foto Dokumen Jadwal Resmi Satuan Pendidikan ke database persisten
      try {
        const photoRes = await fetch('/api/schedules/photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            photo_url: photoUrl,
            caption: `Jadwal Pelajaran Resmi ${selectedRombel}`,
          }),
        });
        if (photoRes.ok) {
          const photoJson = await photoRes.json();
          setSchedulePhoto(photoJson.data || {
            photo_url: photoUrl,
            caption: `Jadwal Pelajaran Resmi ${selectedRombel}`,
            updated_at: new Date().toISOString(),
          });
        }
      } catch (savePhotoErr) {
        console.warn('Notice: Save schedule photo:', savePhotoErr);
      }

      setScanProgress(35);
      setScanStatusText('Membaca citra & mengenali teks jadwal...');

      // 3. OCR via tesseract.js worker
      // Menggunakan ocrTarget hasil optimasi resolusi/upscale agar angka & teks kecil di tabel terbaca akurat
      let extractedOcrText = '';
      try {
        const ocrTarget = await prepareImageForOcr(file);
        const { createWorker } = await import('tesseract.js');
        const ocrPromise = (async () => {
          let worker = null;
          try {
            // Prioritaskan model 'eng' karena selalu siap & cepat di-cache browser (1-2s), tanpa problem CORS/CDN paket bahasa 'ind', dan sangat presisi membaca angka jam (06.45-07.30), singkatan mapel (BTQ, PJOK, SKI, PKN), serta hari (Senin..Jumat)
            worker = await createWorker('eng', undefined, {
              logger: (m) => {
                if (m.status === 'recognizing text') {
                  const p = Math.min(85, Math.round(35 + (m.progress || 0) * 45));
                  setScanProgress(p);
                  setScanStatusText(`Mengenali struktur jadwal: ${Math.round((m.progress || 0) * 100)}%`);
                }
              },
            });
            const res = await worker.recognize(ocrTarget);
            return res.data?.text || '';
          } finally {
            if (worker) {
              await worker.terminate().catch(() => {});
            }
          }
        })();

        // Batas timeout OCR 20 detik agar antarmuka tidak membeku
        const timeoutPromise = new Promise<string>((_, reject) =>
          setTimeout(() => reject(new Error('OCR Timeout')), 20000)
        );

        extractedOcrText = await Promise.race([ocrPromise, timeoutPromise]);
      } catch (ocrErr) {
        console.warn('Notice: Client OCR fallback to smart curriculum parser:', ocrErr);
        extractedOcrText = '';
      }

      setScanProgress(85);
      setScanStatusText('Memproses mata pelajaran, jam, dan guru...');

      // 4. Kirim ke /api/schedules/scan dengan autoApply: true
      const scanRes = await fetch('/api/schedules/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: photoUrl,
          text: extractedOcrText,
          targetRombel: selectedRombel,
          autoApply: true,
        }),
      });

      if (!scanRes.ok) {
        const errData = await scanRes.json().catch(() => ({}));
        const errorMsg =
          errData.message ||
          errData.error ||
          errData.details ||
          `Gagal memproses jadwal (Status HTTP ${scanRes.status})`;
        throw new Error(errorMsg);
      }

      const scanData = await scanRes.json();
      setScanProgress(100);
      setScanStatusText('Jadwal seluruhnya berhasil diperbarui!');

      // Alihkan tab otomatis ke rombel target yang diperbarui
      const finalRombel = scanData.rombel || scanData.schedules?.[0]?.class_rombel || selectedRombel;
      setSelectedRombel(finalRombel);
      if (finalRombel.startsWith('SD')) setSelectedLevel('sd');
      else if (finalRombel.startsWith('SMP')) setSelectedLevel('smp');
      else if (finalRombel.startsWith('SMA')) setSelectedLevel('sma');

      // Tutup kotak pilihan dan muat ulang banner foto jadwal resmi
      setShowUploadBox(false);
      await fetchSchedulePhoto();

      // Refresh data
      await fetchSchedules();

      const count = scanData.schedules?.length || scanData.count || 0;
      if (count === 0) {
        setScanNotification({
          message: `Foto dokumen jadwal resmi ${finalRombel} berhasil disimpan dan aktif di banner. Sistem tidak mendeteksi baris teks tabel otomatis, Anda dapat melengkapi sesi via "Tambah Sesi Manual".`,
          count: 0,
          rombel: finalRombel,
        });
      } else {
        setScanNotification({
          message: `Foto dokumen jadwal resmi disimpan & jadwal digital ${finalRombel} berhasil diperbarui (${count} sesi pelajaran aktif).`,
          count,
          rombel: finalRombel,
        });
      }

      setTimeout(() => {
        setIsScanning(false);
      }, 800);
    } catch (err: any) {
      console.error('Error processing schedule photo:', err);
      alert(`Pemberitahuan: ${err.message || 'Gagal memproses foto jadwal'}`);
      setIsScanning(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      if (deleteTarget.type === 'photo') {
        const res = await fetch('/api/schedules/photo', { method: 'DELETE' });
        if (res.ok) {
          setSchedulePhoto(null);
        }
      } else if (deleteTarget.id) {
        const res = await fetch(`/api/schedules?id=${deleteTarget.id}`, { method: 'DELETE' });
        if (res.ok) {
          setSchedules((prev) => prev.filter((s) => s.id !== deleteTarget.id));
        }
      }
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete schedule item:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Delete schedule photo
  const handleDeletePhoto = () => {
    setDeleteTarget({
      type: 'photo',
      name: 'Foto Dokumen Cetak Jadwal Pelajaran',
    });
  };

  const isSameRombel = (a?: string, b?: string): boolean => {
    if (!a || !b) return false;
    return a.toLowerCase().trim() === b.toLowerCase().trim();
  };

  const defaultMaSlots = [
    { start: '06:45', end: '07:30' },
    { start: '07:30', end: '08:55' },
    { start: '08:55', end: '09:30' },
    { start: '10:00', end: '11:10' },
    { start: '11:10', end: '12:20' },
    { start: '13:00', end: '14:10' },
    { start: '14:10', end: '15:20' },
  ];

  // Buka Form Mode Harian (Batch Vertikal Sesi Hari Terpilih)
  const handleOpenAddDay = (targetDayName?: string) => {
    setEditingItem(null);
    setModalMode('day');
    const targetDay = targetDayName || selectedDay || 'Senin';

    const existingForDay = schedules
      .filter((s) => isSameRombel(s.class_rombel, selectedRombel) && s.day.toLowerCase() === targetDay.toLowerCase())
      .sort((a, b) => (a.session_no || 0) - (b.session_no || 0));

    let initialSessions: DaySessionEntry[] = [];
    if (existingForDay.length > 0) {
      initialSessions = existingForDay.map((s, idx) => ({
        session_no: s.session_no || idx + 1,
        time_start: s.time_start,
        time_end: s.time_end,
        subject_name: s.subject_name,
        teacher_name: s.teacher_name,
      }));
    } else {
      initialSessions = defaultMaSlots.slice(0, 5).map((slot, idx) => ({
        session_no: idx + 1,
        time_start: slot.start,
        time_end: slot.end,
        subject_name: '',
        teacher_name: teachers[0]?.name || 'Dewan Guru',
      }));
    }

    setDayForm({
      class_rombel: selectedRombel,
      day: targetDay,
      sessions: initialSessions,
    });

    setIsModalOpen(true);
  };

  const handleOpenAdd = (presetSession?: number) => {
    handleOpenAddDay(selectedDay);
  };

  const handleOpenEdit = (item: ScheduleItem) => {
    setEditingItem(item);
    setModalMode('single');
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = (item: ScheduleItem | string) => {
    if (typeof item === 'string') {
      const found = schedules.find((s) => s.id === item);
      setDeleteTarget({
        type: 'schedule',
        id: item,
        name: found
          ? `${found.subject_name} (${found.class_rombel} · Hari ${found.day})`
          : 'Jadwal Mata Pelajaran',
      });
    } else {
      setDeleteTarget({
        type: 'schedule',
        id: item.id,
        name: `${item.subject_name} (${item.class_rombel} · Hari ${item.day})`,
      });
    }
  };

  // Simpan Form Mode Harian (Batch 1 Hari)
  const handleSaveDay = async (e: React.FormEvent) => {
    e.preventDefault();
    const validSessions = dayForm.sessions.filter((s) => s.subject_name.trim());
    if (validSessions.length === 0) {
      alert('Harap isi minimal 1 sesi mata pelajaran untuk hari ini.');
      return;
    }

    setIsSubmitting(true);
    try {
      const itemsToSave: ScheduleItem[] = validSessions.map((s, idx) => ({
        id: `sch-${dayForm.class_rombel.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${dayForm.day.toLowerCase()}-${idx + 1}-${Date.now()}`,
        class_rombel: dayForm.class_rombel,
        day: dayForm.day,
        session_no: idx + 1,
        time_start: s.time_start.trim(),
        time_end: s.time_end.trim(),
        subject_name: s.subject_name.trim(),
        category: 'Pelajaran Reguler',
        teacher_name: s.teacher_name || teachers[0]?.name || 'Dewan Guru',
        room: `Ruang ${dayForm.class_rombel.replace(/^(SD|SMP|SMA)\s*-\s*/, '')}`,
      }));

      const res = await fetch('/api/schedules/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: itemsToSave,
          replaceRombel: dayForm.class_rombel,
          replaceDay: dayForm.day,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Gagal menyimpan jadwal harian.');
      }

      await fetchSchedules();
      setIsModalOpen(false);
    } catch (err: any) {
      alert(`Pemberitahuan: ${err.message || 'Gagal menyimpan jadwal harian'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simpan Form Mode Satu Sesi Tunggal
  const handleSaveSingle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingItem) {
        const res = await fetch('/api/schedules', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, id: editingItem.id }),
        });
        if (res.ok) {
          const result = await res.json();
          setSchedules((prev) => prev.map((s) => (s.id === editingItem.id ? result.item : s)));
          setIsModalOpen(false);
          fetchSchedules();
        } else {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || 'Gagal memperbarui sesi.');
        }
      } else {
        const res = await fetch('/api/schedules', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          const result = await res.json();
          setSchedules((prev) => [...prev, result.item]);
          setIsModalOpen(false);
          fetchSchedules();
        } else {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || 'Gagal menambah sesi baru.');
        }
      }
    } catch (err: any) {
      alert(`Pemberitahuan: ${err.message || 'Gagal menyimpan sesi'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full min-w-0 overflow-hidden">
      {/* 1. File Input: Membuka File / Galeri Foto HP (tanpa capture agar tidak memaksa buka kamera) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/*"
        onChange={handlePhotoFileChange}
        className="hidden"
      />

      {/* 2. Camera Input: Khusus untuk memotret langsung jadwal fisik jika diinginkan */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/*"
        capture="environment"
        onChange={handlePhotoFileChange}
        className="hidden"
      />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Jadwal Pelajaran</h2>
        </div>

        {!readOnly && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                fetchSchedules();
                fetchSchedulePhoto();
              }}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold shadow-xs transition-all active:scale-[0.98]"
              title="Segarkan data jadwal dari database"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Segarkan</span>
            </button>

            <button
              type="button"
              onClick={() => setShowUploadBox((prev) => !prev)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all active:scale-[0.98]"
            >
              <Camera className="w-4 h-4 text-amber-400" />
              <span>{showUploadBox ? 'Tutup Pilihan Foto' : 'Unggah Foto Jadwal (Scan Otomatis)'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Photo Banner Card (Hanya ditampilkan untuk Admin dan Guru, disembunyikan untuk akun Siswa) */}
      {userRole !== 'siswa' && schedulePhoto?.photo_url ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              {/* Thumbnail with overlay zoom button */}
              <div
                onClick={() => setIsZoomOpen(true)}
                className="relative group cursor-pointer w-28 h-24 sm:w-36 sm:h-28 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0"
              >
                <img
                  src={schedulePhoto.photo_url}
                  alt="Foto Jadwal Resmi"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Maximize2 className="w-5 h-5 drop-shadow-sm" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 border border-blue-200/80 text-[11px] font-bold text-blue-700">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>DOKUMEN FOTO JADWAL RESMI</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  {schedulePhoto.caption || 'Foto Dokumen Jadwal Resmi Satuan Pendidikan'}
                </h3>
                <p className="text-xs text-slate-500">
                  {schedulePhoto.updated_at
                    ? `Terakhir diperbarui: ${new Date(schedulePhoto.updated_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })} WIB`
                    : 'Tersimpan di sistem cloud'}
                </p>
                <div className="pt-1">
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                    Sinkron dengan Jadwal Digital
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsZoomOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Lihat Layar Penuh</span>
              </button>
              <a
                href={schedulePhoto.photo_url}
                target="_blank"
                rel="noreferrer"
                download="jadwal-pelajaran-resmi.jpg"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Foto</span>
              </a>
              {!readOnly && (
                <>
                  <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Target:</span>
                    <select
                      value={selectedRombel}
                      onChange={(e) => {
                        const target = e.target.value;
                        setSelectedRombel(target);
                        const found = allRombels.find((r) => r.name === target);
                        if (found) setSelectedLevel(found.level);
                      }}
                      className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
                    >
                      <optgroup label="Jenjang SD (Kelas 1 - 6)">
                        {allRombels.filter((r) => r.level === 'sd').map((r) => (
                          <option key={r.id} value={r.name}>{r.name}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Jenjang SMP (Kelas VII - IX)">
                        {allRombels.filter((r) => r.level === 'smp').map((r) => (
                          <option key={r.id} value={r.name}>{r.name}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Jenjang SMA / MA (Kelas X - XII)">
                        {allRombels.filter((r) => r.level === 'sma').map((r) => (
                          <option key={r.id} value={r.name}>{r.name}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-2xs active:scale-[0.98]"
                  >
                    <ScanLine className="w-3.5 h-3.5" />
                    <span>Scan Ulang ({selectedRombel})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUploadBox(!showUploadBox)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold transition-colors"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>{showUploadBox ? 'Tutup Pilihan Kelas' : 'Unggah Kelas Lain'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDeletePhoto}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-semibold transition-colors"
                    title="Hapus Foto Jadwal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {/* Upload Box dengan Pilihan Target Kelas SD / SMP / SMA Lengkap */}
      {!readOnly && showUploadBox ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-400 p-5 sm:p-7 transition-all text-center shadow-xs">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto">
              <Camera className="w-6 h-6 stroke-[1.8]" />
            </div>

            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Unggah Foto Jadwal Pelajaran (Pindai Otomatis)
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-lg mx-auto leading-relaxed">
                Pilih jenjang dan kelas target di bawah ini, lalu pilih atau potret lembar foto jadwal resmi. Sistem otomatis membaca waktu dan mata pelajaran, kemudian langsung memperbarui tabel jadwal digital untuk kelas yang dipilih.
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[11px] font-medium text-slate-600 border border-slate-200">
                <span>Format: JPG / PNG / WebP. Jika berupa dokumen PDF, silakan screenshot tabel jadwal lalu unggah gambarnya.</span>
              </div>
            </div>

            {/* Pilihan Jenjang & Kelas Target */}
            <div className="bg-slate-50/90 border border-slate-200/90 rounded-2xl p-4 text-left space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  Pilih Target Kelas / Rombel:
                </span>
                <span className="text-xs font-bold text-blue-700 bg-blue-100/70 border border-blue-200 px-2.5 py-0.5 rounded-lg w-fit">
                  Target Aktif: {selectedRombel}
                </span>
              </div>

              {/* Jenjang Switcher Tabs */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/60 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLevel('sd');
                    if (!selectedRombel.startsWith('SD')) setSelectedRombel('SD - Kelas I');
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center ${
                    selectedLevel === 'sd'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Jenjang SD (1 - 6)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLevel('smp');
                    if (!selectedRombel.startsWith('SMP')) setSelectedRombel('SMP - Kelas VII');
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center ${
                    selectedLevel === 'smp'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Jenjang SMP (VII - IX)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLevel('sma');
                    if (!selectedRombel.startsWith('SMA')) setSelectedRombel('SMA - Kelas X');
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center ${
                    selectedLevel === 'sma'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Jenjang SMA / MA (X - XII)
                </button>
              </div>

              {/* Class Pills Grid sesuai jenjang aktif */}
              <div>
                <div className="text-[11px] font-semibold text-slate-500 mb-2">
                  Klik Kelas Target:
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {allRombels
                    .filter((r) => selectedLevel === 'all' || r.level === selectedLevel)
                    .map((rombel) => {
                      const isSelected = isRombelMatch(rombel.name, selectedRombel);
                      return (
                        <button
                          key={rombel.id}
                          type="button"
                          onClick={() => {
                            setSelectedRombel(rombel.name);
                            setSelectedLevel(rombel.level);
                          }}
                          className={`p-2 rounded-xl border text-center transition-all ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-2 ring-blue-300'
                              : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          <div className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                            {rombel.badge}
                          </div>
                          <div className="text-xs font-bold whitespace-nowrap">
                            {rombel.shortName}
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Mobile Quick Dropdown */}
              <div className="sm:hidden pt-1">
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Atau pilih via menu dropdown:
                </label>
                <select
                  value={selectedRombel}
                  onChange={(e) => {
                    const target = e.target.value;
                    setSelectedRombel(target);
                    const found = allRombels.find((r) => r.name === target);
                    if (found) setSelectedLevel(found.level);
                  }}
                  className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <optgroup label="Jenjang SD (Kelas 1 - 6)">
                    {allRombels.filter((r) => r.level === 'sd').map((r) => (
                      <option key={r.id} value={r.name}>{r.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Jenjang SMP (Kelas VII - IX)">
                    {allRombels.filter((r) => r.level === 'smp').map((r) => (
                      <option key={r.id} value={r.name}>{r.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Jenjang SMA / MA (Kelas X - XII)">
                    {allRombels.filter((r) => r.level === 'sma').map((r) => (
                      <option key={r.id} value={r.name}>{r.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Tombol Pilihan Unggah: Galeri / File atau Kamera */}
            <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all active:scale-[0.98] cursor-pointer"
              >
                <UploadCloud className="w-4 h-4 stroke-[2]" />
                <span>Pilih dari Galeri / File ({selectedRombel})</span>
              </button>

              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold transition-all active:scale-[0.98] cursor-pointer"
              >
                <Camera className="w-4 h-4 text-slate-600 stroke-[2]" />
                <span>Buka Kamera</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Scan Result Notification */}
      {scanNotification && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-emerald-900">Pembaruan Jadwal Otomatis Sukses</h4>
              <p className="text-xs text-emerald-700 mt-0.5">{scanNotification.message}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setScanNotification(null)}
            className="text-emerald-500 hover:text-emerald-800 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Dua Mode Tampilan (Opsi 2): Jadwal Mengajar Saya vs Jadwal Seluruh Kelas */}
      {userRole !== 'siswa' && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-2xl p-3 shadow-2xs">
          <div className="inline-flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-full sm:w-auto border border-slate-200/60">
            <button
              type="button"
              onClick={() => setScheduleViewMode('my_teaching')}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all active:scale-[0.98] ${
                scheduleViewMode === 'my_teaching'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>{userRole === 'guru' ? 'Jadwal Mengajar Saya' : 'Jadwal Mengajar Guru'}</span>
            </button>
            <button
              type="button"
              onClick={() => setScheduleViewMode('all_classes')}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all active:scale-[0.98] ${
                scheduleViewMode === 'all_classes'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Jadwal Seluruh Kelas</span>
            </button>
          </div>

          {/* Teacher Selector for Admin / Teacher identity badge */}
          {scheduleViewMode === 'my_teaching' && (
            <div className="flex items-center gap-2">
              {userRole === 'admin' ? (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    PILIH GURU:
                  </span>
                  <select
                    value={activeTeacherName}
                    onChange={(e) => setActiveTeacherName(e.target.value)}
                    className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  >
                    {availableTeachersList.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200/80 rounded-xl text-blue-700 text-xs font-bold">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Guru: {activeTeacherName}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tampilan Kondisional: Jadwal Mengajar Guru vs Seluruh Kelas */}
      {scheduleViewMode === 'my_teaching' ? (
        <div className="space-y-4 sm:space-y-5">
          {/* 1. Hero Card: Status Mengajar & Live Active Session Indicator */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-bold uppercase tracking-wider">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>AGENDA MENGAJAR PRIBADI</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {activeTeacherName}
                </h3>
                <p className="text-xs text-slate-500">
                  Agenda tatap muka harian di kelas siswa dan siswi Madrasah Raudlatul Hidayah
                </p>
              </div>

              {/* Stat Summary Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-left">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Hari Ini</div>
                  <div className="text-xs sm:text-sm font-bold text-slate-800">
                    {todayDayName} ({todayTeachingSessions.length} Sesi)
                  </div>
                </div>
                <div className="px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200/80 text-left">
                  <div className="text-[10px] uppercase font-bold text-blue-500">Total Mengajar</div>
                  <div className="text-xs sm:text-sm font-bold text-blue-800">
                    {myTeachingSessions.length} Sesi / Minggu
                  </div>
                </div>
              </div>
            </div>

            {/* Live Active Session Indicator Banner */}
            {activeNowSession ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 shadow-2xs">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600" />
                  </span>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                      SEDANG BERLANGSUNG SAAT INI
                    </div>
                    <div className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                      {activeNowSession.subject_name} • {activeNowSession.class_rombel}
                    </div>
                  </div>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <div className="text-xs font-mono font-bold text-emerald-800">
                    {activeNowSession.time_start} – {activeNowSession.time_end}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-medium">
                    {activeNowSession.room || 'Ruang Kelas'}
                  </div>
                </div>
              </div>
            ) : nextUpcomingSession ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                      SESI MENGAJAR BERIKUTNYA HARI INI
                    </div>
                    <div className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                      {nextUpcomingSession.subject_name} • {nextUpcomingSession.class_rombel}
                    </div>
                  </div>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <div className="text-xs font-mono font-bold text-blue-800">
                    {nextUpcomingSession.time_start} – {nextUpcomingSession.time_end}
                  </div>
                  <div className="text-[11px] text-blue-600 font-medium">
                    {nextUpcomingSession.room || 'Ruang Kelas'}
                  </div>
                </div>
              </div>
            ) : todayTeachingSessions.length > 0 ? (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Seluruh sesi tatap muka kelas untuk hari ini telah selesai dilaksanakan.</span>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs">
                <CalendarCheck className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Tidak ada jadwal tatap muka di kelas pada hari {todayDayName}.</span>
              </div>
            )}
          </div>

          {/* 2. Day Selector Tabs (Senin s.d. Sabtu + Semua Hari) */}
          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                PILIH HARI MENGAJAR:
              </span>
              <span className="text-xs text-slate-500">
                {selectedTeacherDay === 'Semua' ? 'Menampilkan seluruh sesi mingguan' : `Hari aktif: ${selectedTeacherDay}`}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5">
              {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((dayName) => {
                const countForDay = myTeachingSessions.filter(
                  (s) => s.day.toLowerCase() === dayName.toLowerCase()
                ).length;
                const isSelected = selectedTeacherDay.toLowerCase() === dayName.toLowerCase();
                const isToday = todayDayName.toLowerCase() === dayName.toLowerCase();

                return (
                  <button
                    key={dayName}
                    type="button"
                    onClick={() => setSelectedTeacherDay(dayName)}
                    className={`relative p-2.5 rounded-xl border text-center transition-all active:scale-[0.98] ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {isToday && (
                      <span
                        className={`absolute top-1 right-1.5 text-[9px] font-bold px-1 rounded ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        HARI INI
                      </span>
                    )}
                    <div className="text-xs font-bold leading-tight">{dayName}</div>
                    <div
                      className={`text-[10px] mt-0.5 ${
                        isSelected ? 'text-blue-100' : countForDay > 0 ? 'text-blue-600 font-bold' : 'text-slate-400'
                      }`}
                    >
                      {countForDay} Sesi
                    </div>
                  </button>
                );
              })}

              {/* Tab Semua Hari */}
              <button
                type="button"
                onClick={() => setSelectedTeacherDay('Semua')}
                className={`p-2.5 rounded-xl border text-center transition-all active:scale-[0.98] ${
                  selectedTeacherDay === 'Semua'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <div className="text-xs font-bold leading-tight">Semua Hari</div>
                <div
                  className={`text-[10px] mt-0.5 ${
                    selectedTeacherDay === 'Semua' ? 'text-blue-100' : 'text-slate-500 font-bold'
                  }`}
                >
                  {myTeachingSessions.length} Total
                </div>
              </button>
            </div>
          </div>

          {/* 3. Session Cards Grid (Mobile-Friendly & Tactile) */}
          <div>
            {displayTeacherSessions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-400 mb-3">
                  <CalendarCheck className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-slate-800">
                  {myTeachingSessions.length === 0
                    ? 'Belum Ada Jadwal Mengajar Terdaftar'
                    : selectedTeacherDay === 'Semua'
                    ? 'Tidak Ada Jadwal Mengajar yang Ditemukan'
                    : `Tidak Ada Jadwal Mengajar pada Hari ${selectedTeacherDay}`}
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                  {myTeachingSessions.length === 0
                    ? `Akun Anda terhubung atas nama "${activeTeacherName}". Sesi mengajar akan otomatis muncul di sini begitu mata pelajaran dan kelas Anda dialokasikan oleh Admin kurikulum.`
                    : 'Bebas dari jam tatap muka kelas pada hari ini. Dapat dimanfaatkan untuk evaluasi pembelajaran, penyiapan materi ajar, atau kegiatan madrasah lainnya.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayTeacherSessions.map((item) => {
                  const live = getSessionLiveStatus(item.day, item.time_start, item.time_end, currentTime);
                  const isSd = item.class_rombel.toLowerCase().startsWith('sd');
                  const isSmp = item.class_rombel.toLowerCase().startsWith('smp');

                  return (
                    <div
                      key={item.id}
                      className={`bg-white rounded-2xl border p-5 shadow-xs transition-all active:scale-[0.98] hover:shadow-md flex flex-col justify-between gap-4 ${
                        live.status === 'ongoing'
                          ? 'border-emerald-400 ring-2 ring-emerald-200/60 bg-emerald-50/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Top Meta: Jam + Live Badge */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 border border-slate-200/80 text-slate-900 font-mono text-xs font-bold">
                            <Clock className="w-3.5 h-3.5 text-blue-600" />
                            <span>
                              {item.time_start} – {item.time_end}
                            </span>
                          </div>

                          <div
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] ${live.badgeClass}`}
                          >
                            {live.dotClass && (
                              <span className={`w-2 h-2 rounded-full ${live.dotClass}`} />
                            )}
                            <span>{live.label}</span>
                          </div>
                        </div>

                        {/* Rombel + Mapel Title */}
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${
                                isSd
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : isSmp
                                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                                  : 'bg-purple-50 text-purple-800 border-purple-200'
                              }`}
                            >
                              <GraduationCap className="w-3.5 h-3.5" />
                              <span>{item.class_rombel}</span>
                            </span>

                            <span className="text-[11px] font-bold text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
                              SESI KE-{item.session_no}
                            </span>
                          </div>

                          <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                            {item.subject_name}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5 font-medium">
                            {item.category || 'Mata Pelajaran Wajib'}
                          </p>
                        </div>
                      </div>

                      {/* Bottom Footer: Ruangan & Day */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <div className="inline-flex items-center gap-1 text-[11px] text-slate-600 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.room || 'Ruang Kelas'}</span>
                        </div>

                        {selectedTeacherDay === 'Semua' && (
                          <div className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                            Hari {item.day}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* View: Jadwal Seluruh Kelas (Existing Class Schedule) */
        <div className="space-y-4 sm:space-y-6">
          {/* Rombel Selector Pills with SD / SMP / SMA Level Switcher */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            PILIH JENJANG PENDIDIKAN:
          </div>

          <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/60 overflow-x-auto">
            <button
              type="button"
              onClick={() => setSelectedLevel('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedLevel === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({allRombels.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedLevel('sd');
                setSelectedRombel('SD - Kelas I');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedLevel === 'sd'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Jenjang SD
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedLevel('smp');
                setSelectedRombel('SMP - Kelas VIII');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedLevel === 'smp'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Jenjang SMP
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedLevel('sma');
                setSelectedRombel('SMA - Kelas X');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedLevel === 'sma'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Jenjang SMA / MA
            </button>
          </div>
        </div>

        {/* Rombel Pills */}
        <div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar">
            {displayedRombels.map((rombel) => {
              const isSelected = isRombelMatch(rombel.name, selectedRombel);
              return (
                <button
                  key={rombel.id}
                  type="button"
                  onClick={() => setSelectedRombel(rombel.name)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <span
                    className={`text-[9.5px] px-1.5 py-0.5 rounded-md font-bold uppercase ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : rombel.level === 'sd'
                        ? 'bg-emerald-100 text-emerald-800'
                        : rombel.level === 'smp'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {rombel.badge}
                  </span>
                  <span>{rombel.shortName}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Day Selector Pills */}
      <div className="bg-slate-100/90 p-2 rounded-2xl border border-slate-200/80">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {days.map((day) => {
            const isSelected = selectedDay === day;
            const count = getDayCount(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-300 font-bold'
                    : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
                }`}
              >
                <span>{day}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-2 ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Schedule Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table Subheader */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-3 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Jadwal Pelajaran Hari {selectedDay} • {selectedRombel}
            </h3>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
              {currentSchedules.length} Sesi
            </span>
          </div>
        </div>

        {/* Schedule Table View (Desktop) & Cards (Mobile) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            {/* Deep Navy Table Header Matching Web Profil Topbar */}
            <thead className="bg-[#1e3a8a] text-white uppercase text-[11px] tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4 sm:px-6 w-44">WAKTU & JAM</th>
                <th className="py-3.5 px-4">MATA PELAJARAN</th>
                <th className="py-3.5 px-4">GURU PENGAMPU</th>
                {!readOnly && <th className="py-3.5 px-4 text-right">AKSI</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={readOnly ? 3 : 4} className="py-12 text-center text-slate-400">
                    Memuat data jadwal pelajaran...
                  </td>
                </tr>
              ) : currentSchedules.length === 0 ? (
                <tr>
                  <td colSpan={readOnly ? 3 : 4} className="py-12 text-center">
                    <p className="text-slate-500 font-medium text-sm">
                      Belum ada sesi pelajaran untuk hari {selectedDay} ({selectedRombel}).
                    </p>
                    {!readOnly && (
                      <button
                        type="button"
                        onClick={() => handleOpenAdd(1)}
                        className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-xs hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Sesi Pertama</span>
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                currentSchedules.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* WAKTU & JAM */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-800 text-[12.5px]">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {item.time_start} – {item.time_end}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                            SESI KE-{item.session_no}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* MATA PELAJARAN */}
                    <td className="py-4 px-4">
                      <span className="font-bold text-slate-900 text-sm">
                        {item.subject_name}
                      </span>
                    </td>

                    {/* GURU PENGAMPU */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                        <span className="font-medium text-slate-800 text-xs truncate max-w-xs">
                          {item.teacher_name}
                        </span>
                      </div>
                    </td>

                    {/* AKSI (Hanya untuk Admin / Guru) */}
                    {!readOnly && (
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Sunting Sesi"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Hapus Sesi"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Touch-Friendly Responsive Cards */}
        <div className="md:hidden divide-y divide-slate-100">
          {isLoading ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Memuat data jadwal pelajaran...
            </div>
          ) : currentSchedules.length === 0 ? (
            <div className="py-10 px-4 text-center space-y-2">
              <p className="text-slate-500 font-medium text-xs">
                Belum ada sesi pelajaran untuk hari {selectedDay} ({selectedRombel}).
              </p>
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => handleOpenAdd(1)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-xs hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Sesi Pertama</span>
                </button>
              )}
            </div>
          ) : (
            currentSchedules.map((item) => (
              <div key={item.id} className="p-4 space-y-2.5 hover:bg-slate-50/80 transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-800">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>{item.time_start} – {item.time_end}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    Jam ke-{item.session_no}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm leading-tight">{item.subject_name}</h4>
                  <p className="text-xs text-slate-600 font-medium mt-0.5 flex items-center gap-1">
                    <span className="text-slate-400">Guru:</span>
                    <span>{item.teacher_name}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400">
                    {item.room || 'Ruang Kelas'} {item.category ? `• ${item.category}` : ''}
                  </span>

                  {!readOnly && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors inline-flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Hapus Sesi"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Full-Width Add Button (Hanya tampil untuk Admin) */}
        {!readOnly && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <button
              type="button"
              onClick={() => handleOpenAdd()}
              className="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/50 text-slate-600 hover:text-blue-700 text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Sesi Jam Baru ({selectedDay})</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )}

      {/* Lightbox Zoom Modal for Photo (Hanya untuk Admin dan Guru) */}
      {isZoomOpen && schedulePhoto?.photo_url && userRole !== 'siswa' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
            <div className="w-full flex items-center justify-between text-white pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-semibold truncate">
                  {schedulePhoto.caption || 'Foto Dokumen Jadwal Resmi'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={schedulePhoto.photo_url}
                  target="_blank"
                  rel="noreferrer"
                  download="jadwal-pelajaran-resmi.jpg"
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Foto</span>
                </a>
                <button
                  type="button"
                  onClick={() => setIsZoomOpen(false)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Tutup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="w-full overflow-auto max-h-[82vh] rounded-2xl border border-white/20 bg-black/40 flex items-center justify-center p-2">
              <img
                src={schedulePhoto.photo_url}
                alt="Foto Jadwal Resmi Layar Penuh"
                className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* Scan & OCR Progress Modal */}
      {isScanning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200 text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto animate-pulse">
              <ScanLine className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-base">Memindai Jadwal dari Foto</h3>
              <p className="text-xs text-slate-500">{scanStatusText}</p>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] font-semibold text-slate-500">
              <span>Rombel Target: {selectedRombel}</span>
              <span>{scanProgress}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add / Edit Schedule (Mendukung Input Per Baris Sesi Jam, Per Hari, dan Satu Sesi) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {modalMode === 'day'
                    ? `Input Jadwal Per Hari (${dayForm.day})`
                    : editingItem
                    ? 'Sunting Sesi Pelajaran'
                    : 'Tambah Sesi Pelajaran Tunggal'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Rombel Target:{' '}
                  <span className="font-semibold text-slate-700">
                    {modalMode === 'day'
                      ? dayForm.class_rombel
                      : formData.class_rombel}
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                aria-label="Tutup Form"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Selector Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-100/80 p-1.5 gap-1 shrink-0 overflow-x-auto">
              <button
                type="button"
                onClick={() => setModalMode('day')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  modalMode === 'day'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>1. Input Per Hari ({dayForm.day})</span>
              </button>
              <button
                type="button"
                onClick={() => setModalMode('single')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  modalMode === 'single'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Edit2 className="w-3.5 h-3.5 shrink-0" />
                <span>2. Tambah / Edit Satu Sesi</span>
              </button>
            </div>

            {/* Modal Body Container */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
                            {/* MODE 1: PER HARI (BATCH VERTICAL DAY)                         */}
              {/* ============================================================== */}
              {modalMode === 'day' && (
                <form onSubmit={handleSaveDay} className="space-y-4">
                  <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-xl p-3 text-xs text-indigo-900">
                    <p className="font-semibold">Struktur Jadwal Per Hari:</p>
                    <p className="text-indigo-700 mt-0.5">
                      Pilih hari (misal Senin atau Jum&apos;at), lalu tambahkan atau sunting seluruh sesi jam pelajaran hari tersebut sekaligus.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Rombel Target
                      </label>
                      <select
                        value={dayForm.class_rombel}
                        onChange={(e) => setDayForm({ ...dayForm, class_rombel: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        required
                      >
                        <optgroup label="Jenjang SD (Kelas 1 - 6)">
                          {allRombels
                            .filter((r) => r.level === 'sd')
                            .map((r) => (
                              <option key={r.id} value={r.name}>
                                {r.name}
                              </option>
                            ))}
                        </optgroup>
                        <optgroup label="Jenjang SMP (Kelas VII - IX)">
                          {allRombels
                            .filter((r) => r.level === 'smp')
                            .map((r) => (
                              <option key={r.id} value={r.name}>
                                {r.name}
                              </option>
                            ))}
                        </optgroup>
                        <optgroup label="Jenjang SMA / MA (Kelas X - XII)">
                          {allRombels
                            .filter((r) => r.level === 'sma')
                            .map((r) => (
                              <option key={r.id} value={r.name}>
                                {r.name}
                              </option>
                            ))}
                        </optgroup>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Pilih Hari
                      </label>
                      <div className="flex flex-wrap gap-1">
                        {days.map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => {
                              // Muat jadwal tersimpan untuk hari yang diklik
                              const existing = schedules
                                .filter(
                                  (s) =>
                                    isSameRombel(s.class_rombel, dayForm.class_rombel) &&
                                    s.day.toLowerCase() === d.toLowerCase()
                                )
                                .sort((a, b) => (a.session_no || 0) - (b.session_no || 0));

                              const nextSessions =
                                existing.length > 0
                                  ? existing.map((s, idx) => ({
                                      session_no: s.session_no || idx + 1,
                                      time_start: s.time_start,
                                      time_end: s.time_end,
                                      subject_name: s.subject_name,
                                      teacher_name: s.teacher_name,
                                    }))
                                  : defaultMaSlots.slice(0, 5).map((sl, idx) => ({
                                      session_no: idx + 1,
                                      time_start: sl.start,
                                      time_end: sl.end,
                                      subject_name: '',
                                      teacher_name: teachers[0]?.name || 'Dewan Guru',
                                    }));

                              setDayForm({ ...dayForm, day: d, sessions: nextSessions });
                            }}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                              dayForm.day === d
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xs'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Tabel Baris Sesi Harian */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-900">
                        Daftar Sesi Pelajaran Hari {dayForm.day} ({dayForm.sessions.length} Sesi):
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const nextIdx = dayForm.sessions.length + 1;
                          const slot = defaultMaSlots[Math.min(nextIdx - 1, defaultMaSlots.length - 1)] || {
                            start: '13:00',
                            end: '14:10',
                          };
                          setDayForm({
                            ...dayForm,
                            sessions: [
                              ...dayForm.sessions,
                              {
                                session_no: nextIdx,
                                time_start: slot.start,
                                time_end: slot.end,
                                subject_name: '',
                                teacher_name: teachers[0]?.name || 'Dewan Guru',
                              },
                            ],
                          });
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Baris Sesi</span>
                      </button>
                    </div>

                    <div className="space-y-2 max-h-[48vh] overflow-y-auto pr-1">
                      {dayForm.sessions.map((sess, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                              Sesi Ke-{idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setDayForm({
                                  ...dayForm,
                                  sessions: dayForm.sessions.filter((_, i) => i !== idx),
                                });
                              }}
                              className="text-slate-400 hover:text-red-600 p-1 rounded-md transition-colors"
                              title="Hapus sesi ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                            <div className="sm:col-span-1 grid grid-cols-2 gap-1.5">
                              <div>
                                <label className="block text-[10px] text-slate-500">Mulai</label>
                                <input
                                  type="text"
                                  value={sess.time_start}
                                  onChange={(e) => {
                                    const next = [...dayForm.sessions];
                                    next[idx].time_start = e.target.value;
                                    setDayForm({ ...dayForm, sessions: next });
                                  }}
                                  placeholder="07:30"
                                  className="w-full px-2 py-1 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] text-slate-500">Selesai</label>
                                <input
                                  type="text"
                                  value={sess.time_end}
                                  onChange={(e) => {
                                    const next = [...dayForm.sessions];
                                    next[idx].time_end = e.target.value;
                                    setDayForm({ ...dayForm, sessions: next });
                                  }}
                                  placeholder="08:55"
                                  className="w-full px-2 py-1 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                  required
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-[10px] text-slate-500">
                                Mata Pelajaran
                              </label>
                              <input
                                type="text"
                                value={sess.subject_name}
                                onChange={(e) => {
                                  const next = [...dayForm.sessions];
                                  next[idx].subject_name = e.target.value;
                                  setDayForm({ ...dayForm, sessions: next });
                                }}
                                placeholder="Nama Mata Pelajaran"
                                className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                              />
                            </div>

                            <div className="sm:col-span-1">
                              <label className="block text-[10px] text-slate-500">
                                Guru Pengampu
                              </label>
                              <select
                                value={sess.teacher_name}
                                onChange={(e) => {
                                  const next = [...dayForm.sessions];
                                  next[idx].teacher_name = e.target.value;
                                  setDayForm({ ...dayForm, sessions: next });
                                }}
                                className="w-full px-2 py-1 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                              >
                                {teachers.map((t) => (
                                  <option key={t.order_no} value={t.name}>
                                    {t.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs disabled:opacity-50"
                    >
                      {isSubmitting ? 'Menyimpan...' : `Simpan Seluruh Jadwal Hari ${dayForm.day}`}
                    </button>
                  </div>
                </form>
              )}

              {/* ============================================================== */}
              {/* MODE 3: SATU SESI TUNGGAL (MICRO EDIT)                         */}
              {/* ============================================================== */}
              {modalMode === 'single' && (
                <form onSubmit={handleSaveSingle} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Rombel Kelas
                      </label>
                      <select
                        value={formData.class_rombel}
                        onChange={(e) => setFormData({ ...formData, class_rombel: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        required
                      >
                        <optgroup label="Jenjang SD (Kelas 1 - 6)">
                          {allRombels
                            .filter((r) => r.level === 'sd')
                            .map((r) => (
                              <option key={r.id} value={r.name}>
                                {r.name}
                              </option>
                            ))}
                        </optgroup>
                        <optgroup label="Jenjang SMP (Kelas VII - IX)">
                          {allRombels
                            .filter((r) => r.level === 'smp')
                            .map((r) => (
                              <option key={r.id} value={r.name}>
                                {r.name}
                              </option>
                            ))}
                        </optgroup>
                        <optgroup label="Jenjang SMA / MA (Kelas X - XII)">
                          {allRombels
                            .filter((r) => r.level === 'sma')
                            .map((r) => (
                              <option key={r.id} value={r.name}>
                                {r.name}
                              </option>
                            ))}
                        </optgroup>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Hari</label>
                      <select
                        value={formData.day}
                        onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        required
                      >
                        {days.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Sesi Ke-
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={formData.session_no}
                        onChange={(e) =>
                          setFormData({ ...formData, session_no: parseInt(e.target.value) || 1 })
                        }
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Jam Mulai
                      </label>
                      <input
                        type="text"
                        value={formData.time_start}
                        onChange={(e) => setFormData({ ...formData, time_start: e.target.value })}
                        placeholder="06:45"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Jam Selesai
                      </label>
                      <input
                        type="text"
                        value={formData.time_end}
                        onChange={(e) => setFormData({ ...formData, time_end: e.target.value })}
                        placeholder="07:30"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mata Pelajaran
                    </label>
                    <input
                      type="text"
                      value={formData.subject_name}
                      onChange={(e) => setFormData({ ...formData, subject_name: e.target.value })}
                      placeholder="Contoh: Matematika, Fiqih, Bahasa Inggris, dll"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Guru Pengampu
                    </label>
                    <select
                      value={formData.teacher_name}
                      onChange={(e) => setFormData({ ...formData, teacher_name: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      required
                    >
                      {teachers.map((t) => (
                        <option key={t.order_no} value={t.name}>
                          {t.name} ({t.subject_name})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs disabled:opacity-50"
                    >
                      {isSubmitting ? 'Menyimpan...' : editingItem ? 'Perbarui Sesi' : 'Simpan Sesi'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Elegan (Bottom Sheet di HP, Modal di Desktop) */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title={deleteTarget?.type === 'photo' ? 'Hapus Foto Dokumen Jadwal' : 'Hapus Sesi Jadwal Pelajaran'}
        description={
          deleteTarget?.type === 'photo'
            ? 'Apakah Anda yakin ingin menghapus foto dokumen cetak jadwal ini? Pengguna tidak akan dapat melihat arsip foto jadwal hingga diunggah kembali.'
            : 'Apakah Anda yakin ingin menghapus sesi pelajaran ini? Jam mengajar terkait akan ditarik dari daftar harian rombel.'
        }
        itemName={deleteTarget?.name}
        itemType={deleteTarget?.type === 'photo' ? 'Dokumen Jadwal' : 'Jadwal Pelajaran'}
        isLoading={isDeleting}
      />
    </div>
  );
};
