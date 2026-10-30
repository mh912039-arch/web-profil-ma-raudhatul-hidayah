'use client';

import React, { useState, useEffect, useRef } from 'react';
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
} from 'lucide-react';
import { TeacherRecord } from './TeachersTab';
import { compressImageBelow100Kb } from '@/lib/imageCompression';

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

export const SchedulesTab: React.FC<SchedulesTabProps> = ({
  teachers,
  initialRombel,
  readOnly = false,
  userRole = 'admin',
}) => {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<JenjangLevel>(() => {
    if (initialRombel?.startsWith('SD')) return 'sd';
    if (initialRombel?.startsWith('SMA')) return 'sma';
    return 'smp';
  });
  const [selectedRombel, setSelectedRombel] = useState<string>(initialRombel || 'SMP - Kelas VIII');
  const [selectedDay, setSelectedDay] = useState<string>('Rabu');
  const [isLoading, setIsLoading] = useState(true);

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

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (initialRombel) {
      setSelectedRombel(initialRombel);
      if (initialRombel.startsWith('SD')) setSelectedLevel('sd');
      else if (initialRombel.startsWith('SMA')) setSelectedLevel('sma');
      else if (initialRombel.startsWith('SMP')) setSelectedLevel('smp');
    }
  }, [initialRombel]);

  // Modal State for manual add/edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const [formData, setFormData] = useState<Partial<ScheduleItem>>({
    class_rombel: 'SMP - Kelas VIII',
    day: 'Rabu',
    session_no: 1,
    time_start: '07:30',
    time_end: '08:15',
    subject_name: '',
    teacher_name: teachers[0]?.name || 'Dewan Guru',
  });
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

  // Photo File Change Handler
  const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processSchedulePhoto(file);
    e.target.value = '';
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

      // 2. Simpan URL foto ke SYS_SCHIMG (best-effort)
      try {
        await fetch('/api/schedules/photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            photo_url: photoUrl,
            caption: `Foto Jadwal Resmi ${selectedRombel}`,
          }),
        });
      } catch (photoErr) {
        console.warn('Notice: Failed saving photo URL:', photoErr);
      }

      setSchedulePhoto({
        photo_url: photoUrl,
        updated_at: new Date().toISOString(),
        caption: `Foto Jadwal Resmi ${selectedRombel}`,
      });

      setScanProgress(35);
      setScanStatusText('Membaca citra & mengenali teks jadwal...');

      // 3. OCR via tesseract.js worker
      // Menggunakan file/uploadFile lokal in-memory untuk mencegah CORS blocking & download lag
      let extractedOcrText = '';
      try {
        const { createWorker } = await import('tesseract.js');
        const ocrPromise = (async () => {
          const worker = await createWorker('ind', undefined, {
            logger: (m) => {
              if (m.status === 'recognizing text') {
                const p = Math.min(85, Math.round(35 + (m.progress || 0) * 45));
                setScanProgress(p);
                setScanStatusText(`Mengenali struktur jadwal: ${Math.round((m.progress || 0) * 100)}%`);
              }
            },
          });
          const res = await worker.recognize(uploadFile || file);
          await worker.terminate();
          return res.data?.text || '';
        })();

        // Batas timeout OCR 15 detik agar antarmuka tidak membeku
        const timeoutPromise = new Promise<string>((_, reject) =>
          setTimeout(() => reject(new Error('OCR Timeout')), 15000)
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

      // Alihkan tab otomatis jika rombel terdeteksi spesifik (misal dari Kelas I ke Kelas II)
      const finalRombel = scanData.rombel || scanData.schedules?.[0]?.class_rombel || selectedRombel;
      if (finalRombel && finalRombel !== selectedRombel) {
        setSelectedRombel(finalRombel);
      }

      // Refresh data
      await fetchSchedules();
      await fetchSchedulePhoto();

      const count = scanData.schedules?.length || scanData.count || 0;
      setScanNotification({
        message: `Jadwal resmi untuk ${finalRombel} berhasil diperbarui dari foto (${count} sesi pelajaran aktif).`,
        count,
        rombel: finalRombel,
      });

      setTimeout(() => {
        setIsScanning(false);
      }, 800);
    } catch (err: any) {
      console.error('Error processing schedule photo:', err);
      alert(`Pemberitahuan: ${err.message || 'Gagal memproses foto jadwal'}`);
      setIsScanning(false);
    }
  };

  // Delete schedule photo
  const handleDeletePhoto = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus foto dokumen jadwal ini?')) return;
    try {
      const res = await fetch('/api/schedules/photo', { method: 'DELETE' });
      if (res.ok) {
        setSchedulePhoto(null);
      }
    } catch (err) {
      console.error('Failed to delete photo:', err);
    }
  };

  const handleOpenAdd = (presetSession?: number) => {
    setEditingItem(null);
    const nextSession = presetSession ?? (currentSchedules.length + 1);
    setFormData({
      class_rombel: selectedRombel,
      day: selectedDay,
      session_no: nextSession,
      time_start: '07:30',
      time_end: '08:15',
      subject_name: '',
      teacher_name: teachers[0]?.name || 'Dewan Guru',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ScheduleItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus jadwal mata pelajaran ini?')) return;
    try {
      const res = await fetch(`/api/schedules?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSchedules((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete schedule:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingItem) {
        // Edit existing
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
        }
      } else {
        // Create new
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
        }
      }
    } catch (err) {
      console.error('Failed to save schedule:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full min-w-0 overflow-hidden">
      {/* Hidden File Input for Photo Upload / Mobile Camera */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handlePhotoFileChange}
        className="hidden"
      />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Jadwal Pelajaran</h2>
          <p className="text-sm text-slate-600 mt-1">
            {readOnly
              ? 'Informasi jadwal mata pelajaran resmi seluruh rombel kelas (hanya akun Admin yang dapat mengubah jadwal).'
              : 'Susun jadwal mata pelajaran harian atau unggah foto jadwal untuk pembaruan otomatis.'}
          </p>
        </div>

        {!readOnly && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all active:scale-[0.98]"
            >
              <Camera className="w-4 h-4" />
              <span>Unggah Foto Jadwal (Scan Otomatis)</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenAdd()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Sesi Manual</span>
            </button>
          </div>
        )}
      </div>

      {/* Photo Banner Card */}
      {schedulePhoto?.photo_url ? (
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
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold transition-colors"
                  >
                    <ScanLine className="w-3.5 h-3.5" />
                    <span>Ganti Foto & Scan Ulang</span>
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
      ) : !readOnly ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-400 p-6 transition-all text-center">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Unggah Foto Jadwal Pelajaran (Pindai Otomatis)
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Pilih atau potret foto lembar jadwal resmi. Sistem otomatis membaca hari, jam, mata pelajaran, dan guru, lalu langsung memperbarui seluruh tabel jadwal kelas.
              </p>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all active:scale-[0.98]"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Pilih / Ambil Foto Jadwal</span>
            </button>
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

      {/* Rombel Selector Pills with SD / SMP / SMA Level Switcher */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        {/* Level Switcher (SD, SMP, SMA) */}
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
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5">
            PILIH ROMBEL KELAS ({displayedRombels.length} Rombel Tersedia):
          </div>
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
        <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Jadwal Pelajaran Hari {selectedDay} • {selectedRombel}
            </h3>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
              {currentSchedules.length} Sesi
            </span>
          </div>

          {!readOnly && (
            <button
              type="button"
              onClick={() => handleOpenAdd()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold border border-blue-200 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Tambah Jam Pelajaran</span>
            </button>
          )}
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

      {/* Lightbox Zoom Modal for Photo */}
      {isZoomOpen && schedulePhoto?.photo_url && (
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

      {/* Modal Add / Edit Schedule */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {editingItem ? 'Sunting Sesi Pelajaran' : 'Tambah Sesi Pelajaran Baru'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {formData.class_rombel} • Hari {formData.day}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rombel Kelas (SD, SMP, SMA)
                  </label>
                  <select
                    value={formData.class_rombel}
                    onChange={(e) => setFormData({ ...formData, class_rombel: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    Mulai
                  </label>
                  <input
                    type="text"
                    value={formData.time_start}
                    onChange={(e) => setFormData({ ...formData, time_start: e.target.value })}
                    placeholder="07:30"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Selesai
                  </label>
                  <input
                    type="text"
                    value={formData.time_end}
                    onChange={(e) => setFormData({ ...formData, time_end: e.target.value })}
                    placeholder="08:15"
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
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {teachers.map((t) => (
                    <option key={t.order_no} value={t.name}>
                      {t.name} ({t.subject_name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
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
          </div>
        </div>
      )}
    </div>
  );
};
