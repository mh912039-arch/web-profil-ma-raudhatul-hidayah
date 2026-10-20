'use client';

import React, { useState } from 'react';
import {
  UserCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  X,
  Save,
  Phone,
  Calendar,
  MessageSquare,
  Send,
  Copy,
  ExternalLink,
  AlertCircle,
  FileText,
  MapPin,
  Users,
  Award,
  ShieldCheck,
  Eye,
  FileCheck,
} from 'lucide-react';

export interface PpdbApplicant {
  id?: string;
  registration_number: string;
  full_name: string;
  nisn?: string;
  gender: 'L' | 'P';
  birth_place?: string;
  birth_date?: string;
  previous_school?: string;
  parent_name: string;
  parent_whatsapp: string;
  home_address?: string;
  status: 'submitted' | 'verified' | 'accepted' | 'rejected';
  registration_path?: 'domisili' | 'afirmasi' | 'prestasi' | 'mutasi' | string;
  documents?: {
    kk_url?: string;
    akta_url?: string;
    ijazah_url?: string;
    afirmasi_url?: string;
    prestasi_url?: string;
  };
  admin_notes?: string;
  created_at?: string;
}

interface RegistrationsTabProps {
  applicants: PpdbApplicant[];
  onSaveApplicant: (applicant: PpdbApplicant) => Promise<void>;
  onUpdateStatus: (id: string, newStatus: PpdbApplicant['status']) => Promise<void>;
  isSaving: boolean;
}

// Helper: Sanitize Indonesian WhatsApp phone number
export function sanitizeWhatsAppPhone(phone: string): string {
  let clean = (phone || '').replace(/[^0-9]/g, '');
  if (clean.startsWith('0')) {
    clean = '62' + clean.slice(1);
  } else if (!clean.startsWith('62') && clean.length > 0) {
    clean = '62' + clean;
  }
  return clean;
}

export const jalurLabelMap: Record<string, string> = {
  domisili: 'Jalur Domisili',
  afirmasi: 'Jalur Afirmasi',
  prestasi: 'Jalur Prestasi',
  mutasi: 'Jalur Mutasi',
};

// Helper: Generate formal WhatsApp official notice template
export function generatePpdbWhatsAppMessage(
  applicant: PpdbApplicant,
  status: PpdbApplicant['status']
): string {
  const candidateName = applicant.full_name || 'Calon Santri';
  const regNum = applicant.registration_number || '-';
  const parentName = applicant.parent_name || 'Bapak/Ibu';
  const schoolOrigin = applicant.previous_school || '-';
  const jalur = jalurLabelMap[applicant.registration_path || 'domisili'] || 'Jalur Reguler';

  if (status === 'accepted') {
    return `*PEMBERITAHUAN HASIL SELEKSI PPDB ONLINE*
*MA RAUDHATUL HIDAYAH MAUK*
Tahun Ajaran 2027/2028

Assalamu'alaikum Warahmatullahi Wabarakatuh.

Yth. Bapak/Ibu *${parentName}*,
Orang Tua / Wali dari ananda:

• Nama Calon Santri: *${candidateName}*
• No. Registrasi: *${regNum}*
• Jalur Pendaftaran: *${jalur}*
• Asal Sekolah: ${schoolOrigin}

Alhamdulillah, setelah melalui tahapan seleksi dan verifikasi berkas, panitia Penerimaan Peserta Didik Baru (PPDB) MA Raudhatul Hidayah menyatakan bahwa ananda dinyatakan:

*DITERIMA (LULUS SELEKSI)*
Sebagai Calon Santri Baru MA Raudhatul Hidayah Tahun Ajaran 2027/2028.

*Tahapan Selanjutnya (Daftar Ulang):*
1. Membawa bukti cetak formulir pendaftaran ini ke sekretariat madrasah.
2. Melengkapi berkas fisik (Fotokopi KK, Akta Kelahiran, dan Ijazah/Surat Keterangan Lulus).
3. Jadwal verifikasi berkas & daftar ulang: Setiap hari kerja (08.00 - 14.00 WIB) di Kantor Sekretariat MA Raudhatul Hidayah Mauk.

Untuk informasi dan pertanyaan lebih lanjut, Bapak/Ibu dapat membalas pesan ini atau menghubungi panitia PPDB.

Selamat kepada ananda, semoga kelak menjadi generasi yang sholeh, cerdas, dan berakhlaqul karimah.

Wassalamu'alaikum Warahmatullahi Wabarakatuh.

_Panitia SPMB PPDB MA Raudhatul Hidayah Mauk, Kab. Tangerang_`;
  }

  if (status === 'rejected') {
    return `*PEMBERITAHUAN HASIL SELEKSI PPDB ONLINE*
*MA RAUDHATUL HIDAYAH MAUK*
Tahun Ajaran 2027/2028

Assalamu'alaikum Warahmatullahi Wabarakatuh.

Yth. Bapak/Ibu *${parentName}*,
Orang Tua / Wali dari ananda:

• Nama Calon Santri: *${candidateName}*
• No. Registrasi: *${regNum}*
• Jalur Pendaftaran: *${jalur}*
• Asal Sekolah: ${schoolOrigin}

Kami mengucapkan terima kasih yang sebesar-besarnya atas kepercayaan Bapak/Ibu yang telah mendaftarkan ananda pada PPDB MA Raudhatul Hidayah.

Berdasarkan hasil seleksi berkas dan mempertimbangkan keterbatasan kapasitas kuota rombongan belajar tahun ajaran ini, dengan berat hati kami menyampaikan bahwa ananda:

*BELUM DAPAT DITERIMA*
Pada penerimaan santri baru MA Raudhatul Hidayah Tahun Ajaran 2027/2028.

Kami senantiasa mendoakan ananda agar selalu diberikan kelancaran, kemudahan, dan kesuksesan dalam melanjutkan pendidikan di madrasah/sekolah pilihan terbaik lainnya.

Terima kasih atas perhatian dan kerja sama Bapak/Ibu.

Wassalamu'alaikum Warahmatullahi Wabarakatuh.

_Panitia SPMB PPDB MA Raudhatul Hidayah Mauk, Kab. Tangerang_`;
  }

  if (status === 'verified') {
    return `*PEMBERITAHUAN VERIFIKASI BERKAS PPDB*
*MA RAUDHATUL HIDAYAH MAUK*

Assalamu'alaikum Warahmatullahi Wabarakatuh.
Yth. Bapak/Ibu *${parentName}*, berkas formulir pendaftaran ananda *${candidateName}* (No. Registrasi: *${regNum}*, ${jalur}) saat ini telah *TERVERIFIKASI*. 

Mohon menunggu informasi pengumuman hasil seleksi akhir yang akan disampaikan panitia melalui nomor ini. Terima kasih.

Wassalamu'alaikum Warahmatullahi Wabarakatuh.
_Panitia PPDB MA Raudhatul Hidayah_`;
  }

  return `*INFORMASI PPDB MA RAUDHATUL HIDAYAH*

Assalamu'alaikum Wr. Wb. Yth. Bapak/Ibu *${parentName}*, formulir pendaftaran ananda *${candidateName}* (No: *${regNum}*) telah tercatat dalam sistem kami dan sedang dalam antrean verifikasi panitia. Terima kasih.`;
}

export const RegistrationsTab: React.FC<RegistrationsTabProps> = ({
  applicants,
  onSaveApplicant,
  onUpdateStatus,
  isSaving,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [pathFilter, setPathFilter] = useState('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailApplicant, setDetailApplicant] = useState<PpdbApplicant | null>(null);

  // WhatsApp Notification Dialog State
  const [waModal, setWaModal] = useState<{
    isOpen: boolean;
    applicant: PpdbApplicant | null;
    status: PpdbApplicant['status'];
    message: string;
    copied: boolean;
  }>({
    isOpen: false,
    applicant: null,
    status: 'accepted',
    message: '',
    copied: false,
  });

  // Form for manual registration
  const [formData, setFormData] = useState<PpdbApplicant>({
    registration_number: `RH-${new Date().getFullYear()}-${String(applicants.length + 1).padStart(3, '0')}`,
    full_name: '',
    nisn: '',
    gender: 'L',
    birth_place: 'Tangerang',
    birth_date: '2011-05-10',
    previous_school: 'MTs / SMP Asal',
    parent_name: '',
    parent_whatsapp: '628',
    home_address: '',
    status: 'submitted',
    registration_path: 'domisili',
    documents: {
      kk_url: '',
      akta_url: '',
      ijazah_url: '',
      afirmasi_url: '',
      prestasi_url: '',
    },
  });

  const filteredApplicants = applicants.filter((a) => {
    const matchesSearch =
      a.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.nisn && a.nisn.includes(searchQuery)) ||
      a.parent_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.registration_number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'Semua' || a.status === statusFilter;
    const matchesPath = pathFilter === 'Semua' || (a.registration_path || 'domisili') === pathFilter;
    return matchesSearch && matchesStatus && matchesPath;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveApplicant(formData);
    setIsModalOpen(false);
  };

  // Open WhatsApp notification dialog
  const openWhatsAppNotice = (applicant: PpdbApplicant, status: PpdbApplicant['status']) => {
    const defaultMsg = generatePpdbWhatsAppMessage(applicant, status);
    setWaModal({
      isOpen: true,
      applicant,
      status,
      message: defaultMsg,
      copied: false,
    });
  };

  // Dispatch message to WhatsApp Web / App
  const handleSendWhatsApp = () => {
    if (!waModal.applicant) return;
    const cleanPhone = sanitizeWhatsAppPhone(waModal.applicant.parent_whatsapp);
    const encoded = encodeURIComponent(waModal.message);
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
  };

  // Copy message text to clipboard
  const handleCopyWhatsAppMessage = () => {
    if (!waModal.message) return;
    navigator.clipboard.writeText(waModal.message);
    setWaModal((prev) => ({ ...prev, copied: true }));
    setTimeout(() => {
      setWaModal((prev) => ({ ...prev, copied: false }));
    }, 2500);
  };

  const statusBadge = (st: PpdbApplicant['status']) => {
    switch (st) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Diterima
          </span>
        );
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 shrink-0">
            <UserCheck className="w-3.5 h-3.5" />
            Terverifikasi
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 shrink-0">
            <XCircle className="w-3.5 h-3.5" />
            Ditolak
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 shrink-0">
            <Clock className="w-3.5 h-3.5" />
            Menunggu
          </span>
        );
    }
  };

  const jalurBadge = (path?: string) => {
    switch (path) {
      case 'afirmasi':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200 shrink-0">
            <Users className="w-3 h-3 text-purple-600" />
            Afirmasi
          </span>
        );
      case 'prestasi':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-300 shrink-0">
            <Award className="w-3 h-3 text-amber-600" />
            Prestasi
          </span>
        );
      case 'mutasi':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200 shrink-0">
            <ShieldCheck className="w-3 h-3 text-teal-600" />
            Mutasi
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 shrink-0">
            <MapPin className="w-3 h-3 text-blue-600" />
            Domisili
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-[18px] font-bold text-slate-900">
            Pendaftar PPDB Online
          </h3>
          <p className="text-[13px] text-slate-500">
            Verifikasi berkas persyaratan (KK, Akta, Ijazah), biodata, dan status seleksi ({applicants.length} pendaftar)
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setFormData({
              registration_number: `RH-${new Date().getFullYear()}-${String(applicants.length + 1).padStart(3, '0')}`,
              full_name: '',
              nisn: '',
              gender: 'L',
              birth_place: 'Tangerang',
              birth_date: '2011-05-10',
              previous_school: '',
              parent_name: '',
              parent_whatsapp: '628',
              home_address: '',
              status: 'submitted',
              registration_path: 'domisili',
              documents: {
                kk_url: '',
                akta_url: '',
                ijazah_url: '',
                afirmasi_url: '',
                prestasi_url: '',
              },
            });
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-sans text-[13px] font-bold transition-all shadow-xs active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Input Pendaftar Manual</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari nomor registrasi, nama santri, NISN, atau orang tua..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        {/* Filter Jalur */}
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={pathFilter}
            onChange={(e) => setPathFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[12.5px] font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            <option value="Semua">Semua Jalur</option>
            <option value="domisili">Jalur Domisili</option>
            <option value="afirmasi">Jalur Afirmasi</option>
            <option value="prestasi">Jalur Prestasi</option>
            <option value="mutasi">Jalur Mutasi</option>
          </select>
        </div>

        {/* Filter Status */}
        <div className="flex items-center gap-2 shrink-0">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[12.5px] font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            <option value="Semua">Semua Status</option>
            <option value="submitted">Menunggu Verifikasi</option>
            <option value="verified">Terverifikasi</option>
            <option value="accepted">Diterima</option>
            <option value="rejected">Ditolak</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {filteredApplicants.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-2">
            <UserCheck className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-serif text-[16px] font-bold text-slate-700">
              Belum Ada Pendaftar
            </h4>
            <p className="text-[13px] text-slate-500 max-w-sm mx-auto">
              Data pendaftaran online atau formulir manual calon santri baru akan tercatat dan ditampilkan di sini.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11.5px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">No. Registrasi</th>
                  <th className="py-3.5 px-4">Nama Calon Santri</th>
                  <th className="py-3.5 px-4">Jalur Pendaftaran</th>
                  <th className="py-3.5 px-4">Asal Sekolah</th>
                  <th className="py-3.5 px-4">Orang Tua &amp; Kontak</th>
                  <th className="py-3.5 px-4">Status Seleksi</th>
                  <th className="py-3.5 px-4 text-right">Berkas &amp; Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[13px]">
                {filteredApplicants.map((app) => {
                  const cleanPhone = sanitizeWhatsAppPhone(app.parent_whatsapp);
                  const docCount = Object.values(app.documents || {}).filter(Boolean).length;

                  return (
                    <tr key={app.id || app.registration_number} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                        {app.registration_number}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div>
                          <span>{app.full_name}</span>
                          <span className="block text-[11px] font-mono text-slate-500 font-normal">
                            NISN: {app.nisn || '-'} ({app.gender === 'P' ? 'Putri' : 'Putra'})
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {jalurBadge(app.registration_path)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {app.previous_school || '-'}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-800">{app.parent_name}</span>
                          <a
                            href={`https://wa.me/${cleanPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[12px] text-emerald-700 hover:underline inline-flex items-center gap-1 font-mono"
                            title="Buka Chat WhatsApp"
                          >
                            <Phone className="w-3 h-3" />
                            {app.parent_whatsapp}
                          </a>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {statusBadge(app.status)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Button to view all 4 sections & documents */}
                          <button
                            type="button"
                            onClick={() => setDetailApplicant(app)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[11.5px] font-bold transition-all active:scale-95 shadow-2xs"
                            title="Lihat Rincian Formulir & Dokumen Persyaratan"
                          >
                            <FileText className="w-3.5 h-3.5 text-blue-600" />
                            <span>Berkas ({docCount})</span>
                          </button>

                          {/* Status Selector Dropdown */}
                          <select
                            value={app.status}
                            onChange={(e) => {
                              const newStatus = e.target.value as PpdbApplicant['status'];
                              const targetId = app.id || app.registration_number;
                              if (targetId) {
                                onUpdateStatus(targetId, newStatus);
                                // If changed to accepted or rejected, automatically prompt WhatsApp notification
                                if (newStatus === 'accepted' || newStatus === 'rejected') {
                                  openWhatsAppNotice(app, newStatus);
                                }
                              }
                            }}
                            className="px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-[12px] font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                          >
                            <option value="submitted">Menunggu</option>
                            <option value="verified">Verifikasi</option>
                            <option value="accepted">Diterima</option>
                            <option value="rejected">Tolak</option>
                          </select>

                          {/* Direct WhatsApp Action Button */}
                          <button
                            type="button"
                            onClick={() => openWhatsAppNotice(app, app.status)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300/80 text-[11.5px] font-bold transition-all active:scale-95 shadow-2xs group"
                            title="Kirim Pemberitahuan WhatsApp ke Nomor Orang Tua"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                            <span>Kirim WA</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ====================================================================
          DETAIL & DOKUMEN MODAL (Lihat Berkas KK, Akta, Ijazah, Afirmasi, Prestasi)
      ==================================================================== */}
      {detailApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
              <div>
                <span className="text-[11px] font-bold text-blue-700 uppercase tracking-widest block font-mono">
                  {detailApplicant.registration_number}
                </span>
                <h4 className="font-serif text-[18px] sm:text-[20px] font-bold text-slate-900">
                  Rincian Formulir &amp; Berkas: {detailApplicant.full_name}
                </h4>
              </div>

              <button
                type="button"
                onClick={() => setDetailApplicant(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 pr-1">
              {/* 1. Identitas Calon Siswa */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  1. Identitas Calon Siswa
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[12.5px]">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Nama Lengkap:</span>
                    <span className="font-bold text-slate-900">{detailApplicant.full_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">NISN / Gender:</span>
                    <span className="font-mono text-slate-800">{detailApplicant.nisn || '-'} ({detailApplicant.gender})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Tempat, Tgl Lahir:</span>
                    <span className="text-slate-800">{detailApplicant.birth_place || '-'}, {detailApplicant.birth_date || '-'}</span>
                  </div>
                  <div className="sm:col-span-3">
                    <span className="text-slate-400 block text-[11px]">Asal Sekolah / Madrasah:</span>
                    <span className="font-semibold text-slate-800">{detailApplicant.previous_school || '-'}</span>
                  </div>
                </div>
              </div>

              {/* 2. Identitas Orang Tua */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  2. Identitas Orang Tua / Wali &amp; Alamat
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[12.5px]">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Nama Orang Tua / Wali:</span>
                    <span className="font-bold text-slate-900">{detailApplicant.parent_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Kontak WhatsApp:</span>
                    <span className="font-mono text-emerald-700 font-bold">{detailApplicant.parent_whatsapp}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block text-[11px]">Alamat Tempat Tinggal:</span>
                    <span className="text-slate-800">{detailApplicant.home_address || '-'}</span>
                  </div>
                </div>
              </div>

              {/* 3. Jalur Pendaftaran */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  3. Jalur Pendaftaran Terpilih
                </span>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-serif text-[15px] font-bold text-slate-900 block">
                      {jalurLabelMap[detailApplicant.registration_path || 'domisili'] || 'Jalur Domisili'}
                    </span>
                    <span className="text-[12px] text-slate-500">
                      Terdaftar melalui sistem PPDB Online MA Raudhatul Hidayah
                    </span>
                  </div>
                  <div>{jalurBadge(detailApplicant.registration_path)}</div>
                </div>
              </div>

              {/* 4. Berkas & Dokumen yang Diunggah */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  4. Dokumen &amp; Berkas Persyaratan
                </span>

                <div className="space-y-2.5">
                  {/* Doc 1: KK */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 text-[12.5px]">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="font-semibold text-slate-900">Kartu Keluarga (KK)</span>
                    </div>
                    {detailApplicant.documents?.kk_url ? (
                      <a
                        href={detailApplicant.documents.kk_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[11.5px] hover:bg-blue-100 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Buka Berkas KK</span>
                      </a>
                    ) : (
                      <span className="text-[11.5px] text-slate-400 italic">Belum Diunggah</span>
                    )}
                  </div>

                  {/* Doc 2: Akta */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 text-[12.5px]">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="font-semibold text-slate-900">Akta Kelahiran</span>
                    </div>
                    {detailApplicant.documents?.akta_url ? (
                      <a
                        href={detailApplicant.documents.akta_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[11.5px] hover:bg-blue-100 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Buka Berkas Akta</span>
                      </a>
                    ) : (
                      <span className="text-[11.5px] text-slate-400 italic">Belum Diunggah</span>
                    )}
                  </div>

                  {/* Doc 3: Ijazah / SKL */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 text-[12.5px]">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                      <span className="font-semibold text-slate-900">Ijazah / Surat Keterangan Lulus (SKL)</span>
                    </div>
                    {detailApplicant.documents?.ijazah_url ? (
                      <a
                        href={detailApplicant.documents.ijazah_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-300 font-bold text-[11.5px] hover:bg-amber-100 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Buka Berkas Ijazah</span>
                      </a>
                    ) : (
                      <span className="text-[11.5px] text-slate-400 italic">Belum Diunggah</span>
                    )}
                  </div>

                  {/* Doc 4: Bukti Afirmasi */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 text-[12.5px]">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-purple-600 shrink-0" />
                      <span className="font-semibold text-slate-900">Bukti Afirmasi (KIP / PKH / KKS / SKTM)</span>
                    </div>
                    {detailApplicant.documents?.afirmasi_url ? (
                      <a
                        href={detailApplicant.documents.afirmasi_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-50 text-purple-800 border border-purple-200 font-bold text-[11.5px] hover:bg-purple-100 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Buka Bukti Afirmasi</span>
                      </a>
                    ) : (
                      <span className="text-[11.5px] text-slate-400 italic">Tidak Ada Berkas</span>
                    )}
                  </div>

                  {/* Doc 5: Dokumen Prestasi */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 text-[12.5px]">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                      <span className="font-semibold text-slate-900">Dokumen Prestasi (Sertifikat / Piagam)</span>
                    </div>
                    {detailApplicant.documents?.prestasi_url ? (
                      <a
                        href={detailApplicant.documents.prestasi_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-300 font-bold text-[11.5px] hover:bg-amber-100 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Buka Sertifikat Prestasi</span>
                      </a>
                    ) : (
                      <span className="text-[11.5px] text-slate-400 italic">Tidak Ada Berkas</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions at bottom of Detail Modal */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const targetId = detailApplicant.id || detailApplicant.registration_number;
                    onUpdateStatus(targetId, 'accepted');
                    openWhatsAppNotice(detailApplicant, 'accepted');
                    setDetailApplicant(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[12.5px] transition-all active:scale-95 shadow-xs"
                >
                  Terima Santri &amp; Kirim WA
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const targetId = detailApplicant.id || detailApplicant.registration_number;
                    onUpdateStatus(targetId, 'rejected');
                    openWhatsAppNotice(detailApplicant, 'rejected');
                    setDetailApplicant(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-[12.5px] transition-all active:scale-95 shadow-xs"
                >
                  Tolak Santri &amp; Kirim WA
                </button>
              </div>

              <button
                type="button"
                onClick={() => setDetailApplicant(null)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[12.5px] font-semibold"
              >
                Tutup Rincian
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          WHATSAPP NOTIFICATION MODAL (Instant Pemberitahuan Diterima / Ditolak)
      ==================================================================== */}
      {waModal.isOpen && waModal.applicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    waModal.status === 'accepted'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : waModal.status === 'rejected'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}
                >
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-[17px] sm:text-[18px] font-bold text-slate-900 leading-tight">
                    Pemberitahuan WhatsApp ke Wali Murid
                  </h4>
                  <p className="text-[12.5px] text-slate-500">
                    Kirim pengumuman resmi hasil seleksi PPDB langsung ke kontak WhatsApp orang tua.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setWaModal((prev) => ({ ...prev, isOpen: false }))}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Candidate & Parent Badge Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12.5px]">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Calon Santri
                </span>
                <span className="font-bold text-slate-900 block mt-0.5">
                  {waModal.applicant.full_name}{' '}
                  <span className="font-mono text-blue-700 font-semibold text-[11.5px]">
                    ({waModal.applicant.registration_number})
                  </span>
                </span>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Penerima WhatsApp
                </span>
                <span className="font-bold text-slate-900 block mt-0.5">
                  {waModal.applicant.parent_name}{' '}
                  <span className="font-mono text-emerald-700 font-semibold text-[11.5px]">
                    (+{sanitizeWhatsAppPhone(waModal.applicant.parent_whatsapp)})
                  </span>
                </span>
              </div>

              <div className="sm:col-span-2 pt-1 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-slate-500 text-[12px]">Status yang Dikirim:</span>
                <div>{statusBadge(waModal.status)}</div>
              </div>
            </div>

            {/* Editable Message Box */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-bold text-slate-700">
                  Isi Pesan Notifikasi (Dapat Diedit):
                </label>
                <span className="text-[11px] text-slate-400">Format Resmi MA Raudhatul Hidayah</span>
              </div>

              <textarea
                rows={9}
                value={waModal.message}
                onChange={(e) => setWaModal((prev) => ({ ...prev, message: e.target.value }))}
                className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[12.5px] font-sans leading-relaxed text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleCopyWhatsAppMessage}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[12.5px] font-semibold transition-all active:scale-95"
              >
                <Copy className="w-4 h-4 text-slate-500" />
                <span>{waModal.copied ? 'Teks Tersalin!' : 'Salin Pesan'}</span>
              </button>

              <div className="w-full sm:w-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setWaModal((prev) => ({ ...prev, isOpen: false }))}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[12.5px] transition-all"
                >
                  Tutup
                </button>

                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[13px] shadow-sm shadow-emerald-900/20 transition-all active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Buka WhatsApp &amp; Kirim Pesan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Manual Input */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150 my-auto max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
              <h4 className="font-serif text-[18px] font-bold text-slate-900">
                Pendaftaran Calon Santri Baru (Manual)
              </h4>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 overflow-y-auto pr-1 flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-slate-700">No. Pendaftaran</label>
                  <input
                    type="text"
                    value={formData.registration_number}
                    onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[12.5px] font-mono font-bold"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-slate-700">Jalur Pendaftaran</label>
                  <select
                    value={formData.registration_path || 'domisili'}
                    onChange={(e) => setFormData({ ...formData, registration_path: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[12.5px] font-semibold"
                  >
                    <option value="domisili">Jalur Domisili</option>
                    <option value="afirmasi">Jalur Afirmasi</option>
                    <option value="prestasi">Jalur Prestasi</option>
                    <option value="mutasi">Jalur Mutasi</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-slate-700">Nama Lengkap Santri</label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Nama calon santri..."
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[12.5px]"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-slate-700">Jenis Kelamin</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'L' | 'P' })}
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[12.5px]"
                  >
                    <option value="L">Laki-Laki (Putra)</option>
                    <option value="P">Perempuan (Putri)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-slate-700">NISN (Opsional)</label>
                  <input
                    type="text"
                    value={formData.nisn}
                    onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                    placeholder="10 digit NISN..."
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[12.5px] font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-slate-700">Asal Sekolah</label>
                  <input
                    type="text"
                    value={formData.previous_school}
                    onChange={(e) => setFormData({ ...formData, previous_school: e.target.value })}
                    placeholder="SD / MI Asal..."
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[12.5px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-slate-700">Nama Orang Tua / Wali</label>
                  <input
                    type="text"
                    value={formData.parent_name}
                    onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                    placeholder="Nama wali murid..."
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[12.5px]"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-slate-700">Nomor WhatsApp Wali</label>
                  <input
                    type="text"
                    value={formData.parent_whatsapp}
                    onChange={(e) => setFormData({ ...formData, parent_whatsapp: e.target.value })}
                    placeholder="08... atau 628..."
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[12.5px] font-mono"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-bold text-slate-700">Alamat Rumah Lengkap</label>
                <textarea
                  rows={2}
                  value={formData.home_address}
                  onChange={(e) => setFormData({ ...formData, home_address: e.target.value })}
                  placeholder="Alamat domisili..."
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[12.5px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-[13px]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[13px] disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan Pendaftar'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
