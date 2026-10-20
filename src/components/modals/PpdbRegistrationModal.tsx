'use client';

import React, { useState } from 'react';
import {
  X,
  GraduationCap,
  CheckCircle2,
  Send,
  Calendar,
  User,
  Phone,
  MapPin,
  School,
  ExternalLink,
  FileText,
  Upload,
  Compass,
  Award,
  Users,
  ShieldCheck,
  Check,
  AlertCircle,
  Info,
} from 'lucide-react';

interface PpdbRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  academicYear?: string;
}

export const PpdbRegistrationModal: React.FC<PpdbRegistrationModalProps> = ({
  isOpen,
  onClose,
  academicYear = '2027/2028',
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);

  const [registeredData, setRegisteredData] = useState<{
    registration_number: string;
    full_name: string;
    parent_whatsapp: string;
    registration_path: string;
  } | null>(null);

  // 1 & 2. Identitas Siswa & Orang Tua
  const [formData, setFormData] = useState({
    full_name: '',
    nisn: '',
    gender: 'L',
    birth_place: 'Tangerang',
    birth_date: '2011-05-15',
    previous_school: '',
    parent_name: '',
    parent_whatsapp: '',
    home_address: '',
  });

  // 3. Jalur Pendaftaran
  const [registrationPath, setRegistrationPath] = useState<
    'domisili' | 'afirmasi' | 'prestasi' | 'mutasi'
  >('domisili');

  // 4. Dokumen & Persyaratan
  const [documents, setDocuments] = useState<{
    kk_url: string;
    akta_url: string;
    ijazah_url: string;
    afirmasi_url: string;
    prestasi_url: string;
  }>({
    kk_url: '',
    akta_url: '',
    ijazah_url: '',
    afirmasi_url: '',
    prestasi_url: '',
  });

  // Track document errors and file metadata (Minimal 100 KB requirement)
  const [docErrors, setDocErrors] = useState<Record<string, string>>({});
  const [docMeta, setDocMeta] = useState<
    Record<string, { filename: string; sizeKb: string }>
  >({});

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Upload single document with strict minimum 100 KB validation
  const handleFileUpload = async (
    field: keyof typeof documents,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clear previous error for this specific field
    setDocErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });

    const MIN_SIZE_BYTES = 100 * 1024; // 100 KB = 102,400 bytes
    const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

    // Strict validation: Minimal 100 KB
    if (file.size < MIN_SIZE_BYTES) {
      const actualSizeKb = (file.size / 1024).toFixed(1);
      setDocErrors((prev) => ({
        ...prev,
        [field]: `Ukuran berkas "${file.name}" terlalu kecil (${actualSizeKb} KB). Minimal ukuran berkas adalah 100 KB agar dokumen terbaca jelas dan tidak buram saat diverifikasi panitia.`,
      }));
      e.target.value = '';
      return;
    }

    // Maximum limit: 10 MB
    if (file.size > MAX_SIZE_BYTES) {
      const actualSizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setDocErrors((prev) => ({
        ...prev,
        [field]: `Ukuran berkas "${file.name}" terlalu besar (${actualSizeMb} MB). Maksimal ukuran berkas adalah 10 MB.`,
      }));
      e.target.value = '';
      return;
    }

    setUploadingDoc(field);
    try {
      const data = new FormData();
      data.append('file', file);
      data.append('minSize', '102400'); // Send minSize to backend

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setDocuments((prev) => ({ ...prev, [field]: json.url }));
        setDocMeta((prev) => ({
          ...prev,
          [field]: {
            filename: file.name,
            sizeKb: (file.size / 1024).toFixed(1),
          },
        }));
      } else {
        setDocErrors((prev) => ({
          ...prev,
          [field]: json.message || 'Gagal mengunggah berkas.',
        }));
      }
    } catch {
      setDocErrors((prev) => ({
        ...prev,
        [field]: 'Terjadi kesalahan saat mengunggah berkas. Silakan coba kembali.',
      }));
    } finally {
      setUploadingDoc(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        registration_path: registrationPath,
        documents,
      };

      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resJson = await res.json();
      if (res.ok && resJson.success) {
        setRegisteredData({
          registration_number: resJson.applicant.registration_number,
          full_name: resJson.applicant.full_name,
          parent_whatsapp: resJson.applicant.parent_whatsapp,
          registration_path: resJson.applicant.registration_path || registrationPath,
        });
      } else {
        setErrorMessage(resJson.message || 'Gagal mengirim formulir pendaftaran.');
      }
    } catch {
      setErrorMessage('Terjadi gangguan jaringan. Silakan periksa koneksi internet Anda.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setRegisteredData(null);
    setErrorMessage(null);
    onClose();
  };

  const jalurNameMap: Record<string, string> = {
    domisili: 'Jalur Domisili (Zonasi Wilayah)',
    afirmasi: 'Jalur Afirmasi (Keluarga Prasejahtera)',
    prestasi: 'Jalur Prestasi (Akademik & Non-Akademik)',
    mutasi: 'Jalur Mutasi (Tugas Orang Tua)',
  };

  const waPanitiaUrl = registeredData
    ? `https://wa.me/628176614723?text=${encodeURIComponent(
        `Assalamu'alaikum Panitia PPDB MA Raudhatul Hidayah,\nSaya orang tua/wali dari santri *${registeredData.full_name}* ingin konfirmasi pendaftaran online.\nNo. Registrasi: *${registeredData.registration_number}* (${jalurNameMap[registeredData.registration_path] || 'PPDB Online'}).\nMohon informasi tahapan verifikasi berkas selanjutnya. Terima kasih.`
      )}`
    : 'https://wa.me/628176614723';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 text-white p-5 sm:p-6 shrink-0 relative border-b-2 border-amber-500">
          <button
            type="button"
            onClick={handleResetAndClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Tutup formulir"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-blue-950 flex items-center justify-center shrink-0 shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest block">
                Formulir Pendaftaran Online • Tahun Ajaran {academicYear}
              </span>
              <h3 className="font-serif text-[19px] sm:text-[22px] font-bold text-white tracking-tight leading-snug">
                Penerimaan Peserta Didik Baru (PPDB)
              </h3>
            </div>
          </div>
          <p className="font-sans text-[12.5px] text-slate-300 max-w-2xl">
            MA Raudhatul Hidayah Mauk • Lengkapi identitas, pilih jalur seleksi, dan unggah berkas persyaratan calon santri.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
          {registeredData ? (
            /* SUCCESS STATE RECEIPT CARD */
            <div className="py-6 flex flex-col items-center text-center space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-[12px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-wider inline-block mb-2">
                  Pendaftaran Berhasil Dikirim
                </span>
                <h4 className="font-serif text-[22px] sm:text-[26px] font-bold text-slate-900">
                  Selamat Datang, {registeredData.full_name}!
                </h4>
                <p className="text-[13.5px] text-slate-600 max-w-md mx-auto mt-1 leading-relaxed">
                  Data pendaftaran dan berkas persyaratan telah tersimpan di sistem administrasi madrasah. Panitia akan memverifikasi berkas Anda.
                </p>
              </div>

              {/* Official Receipt Box */}
              <div className="w-full max-w-md bg-slate-50 border-2 border-amber-400/90 rounded-2xl p-5 text-left space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                  <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">
                    Nomor Registrasi Resmi
                  </span>
                  <span className="font-mono text-[16px] font-extrabold text-blue-900 bg-amber-100/90 px-3 py-0.5 rounded-lg border border-amber-300">
                    {registeredData.registration_number}
                  </span>
                </div>

                <div className="space-y-1.5 text-[13px] text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nama Calon Santri:</span>
                    <span className="font-bold text-slate-900">{registeredData.full_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Jalur Pendaftaran:</span>
                    <span className="font-bold text-blue-700">
                      {jalurNameMap[registeredData.registration_path] || 'Domisili'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">WhatsApp Terdaftar:</span>
                    <span className="font-mono font-medium text-slate-900">{registeredData.parent_whatsapp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status Seleksi:</span>
                    <span className="font-semibold text-emerald-700">Menunggu Verifikasi Berkas</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full max-w-md flex flex-col sm:flex-row items-center gap-3 pt-2">
                <a
                  href={waPanitiaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-bold tracking-wide transition-all shadow-sm active:scale-95"
                >
                  <Phone className="w-4 h-4" />
                  <span>Konfirmasi via WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[13px] font-semibold transition-colors"
                >
                  Selesai
                </button>
              </div>
            </div>
          ) : (
            /* REGISTRATION FORM */
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[13px] font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* =========================================================
                  1. IDENTITAS CALON SISWA / SANTRI
              ========================================================= */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-1.5">
                  <User className="w-4 h-4 text-blue-700" />
                  <span className="text-[12.5px] font-bold text-slate-900 uppercase tracking-wide">
                    1. Identitas Calon Siswa / Santri
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 flex flex-col gap-1">
                    <label className="text-[12px] font-bold text-slate-700">
                      Nama Lengkap Siswa <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      required
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="Contoh: Muhammad Raihan Pratama"
                      className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-bold text-slate-700">
                      Jenis Kelamin <span className="text-rose-500">*</span>
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-medium text-slate-900 focus:bg-white focus:outline-none"
                    >
                      <option value="L">Laki-laki (Putra)</option>
                      <option value="P">Perempuan (Putri)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-bold text-slate-700">NISN (Bila Ada)</label>
                    <input
                      type="text"
                      name="nisn"
                      value={formData.nisn}
                      onChange={handleChange}
                      placeholder="Nomor Induk Siswa Nasional"
                      className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-mono text-slate-900"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-bold text-slate-700">
                      Tempat Lahir <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="birth_place"
                      required
                      value={formData.birth_place}
                      onChange={handleChange}
                      placeholder="Contoh: Tangerang"
                      className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px] text-slate-900"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-bold text-slate-700">
                      Tanggal Lahir <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="birth_date"
                      required
                      value={formData.birth_date}
                      onChange={handleChange}
                      className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px] text-slate-900 font-sans"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-slate-700">
                    Asal Sekolah / Madrasah <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="previous_school"
                    required
                    value={formData.previous_school}
                    onChange={handleChange}
                    placeholder="Contoh: SD Negeri 1 Mauk / MI Al-Hikmah"
                    className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px] text-slate-900"
                  />
                </div>
              </div>

              {/* =========================================================
                  2. IDENTITAS ORANG TUA / WALI & KONTAK
              ========================================================= */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-1.5">
                  <Phone className="w-4 h-4 text-emerald-700" />
                  <span className="text-[12.5px] font-bold text-slate-900 uppercase tracking-wide">
                    2. Identitas Orang Tua / Wali &amp; Kontak
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-bold text-slate-700">
                      Nama Orang Tua / Wali <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="parent_name"
                      required
                      value={formData.parent_name}
                      onChange={handleChange}
                      placeholder="Nama lengkap ayah / ibu / wali"
                      className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px] text-slate-900"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-bold text-slate-700">
                      Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="parent_whatsapp"
                      required
                      value={formData.parent_whatsapp}
                      onChange={handleChange}
                      placeholder="Contoh: 08123456789"
                      className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-mono text-slate-900"
                    />
                    <span className="text-[11px] text-slate-500">
                      Panitia akan mengirimkan pengumuman resmi kelulusan via nomor ini.
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-slate-700">
                    Alamat Lengkap Tempat Tinggal <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    name="home_address"
                    required
                    value={formData.home_address}
                    onChange={handleChange}
                    placeholder="Contoh: Kp. Tanjung Kait RT 02 / RW 01, Desa Tanjung Anom, Kec. Mauk"
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-[13px] text-slate-900 leading-relaxed"
                  />
                </div>
              </div>

              {/* =========================================================
                  3. JALUR PENDAFTARAN
              ========================================================= */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-1.5">
                  <Compass className="w-4 h-4 text-amber-600" />
                  <span className="text-[12.5px] font-bold text-slate-900 uppercase tracking-wide">
                    3. Jalur Pendaftaran Calon Siswa
                  </span>
                </div>

                <p className="text-[12px] text-slate-500">
                  Pilih salah satu jalur pendaftaran yang sesuai dengan calon siswa / santri:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Jalur Domisili */}
                  <label
                    onClick={() => setRegistrationPath('domisili')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-1.5 ${
                      registrationPath === 'domisili'
                        ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[13.5px] text-slate-900 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        Jalur Domisili
                      </span>
                      <input
                        type="radio"
                        name="path_choice"
                        checked={registrationPath === 'domisili'}
                        onChange={() => setRegistrationPath('domisili')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <p className="text-[11.5px] text-slate-600 leading-relaxed">
                      Zonasi tempat tinggal / lingkungan sekitar madrasah di wilayah Mauk &amp; sekitarnya.
                    </p>
                  </label>

                  {/* Jalur Afirmasi */}
                  <label
                    onClick={() => setRegistrationPath('afirmasi')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-1.5 ${
                      registrationPath === 'afirmasi'
                        ? 'border-purple-600 bg-purple-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[13.5px] text-slate-900 flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-600" />
                        Jalur Afirmasi
                      </span>
                      <input
                        type="radio"
                        name="path_choice"
                        checked={registrationPath === 'afirmasi'}
                        onChange={() => setRegistrationPath('afirmasi')}
                        className="text-purple-600 focus:ring-purple-500"
                      />
                    </div>
                    <p className="text-[11.5px] text-slate-600 leading-relaxed">
                      Calon santri dari keluarga prasejahtera (pemegang KIP, PKH, KKS, atau SKTM).
                    </p>
                  </label>

                  {/* Jalur Prestasi */}
                  <label
                    onClick={() => setRegistrationPath('prestasi')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-1.5 ${
                      registrationPath === 'prestasi'
                        ? 'border-amber-500 bg-amber-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[13.5px] text-slate-900 flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-600" />
                        Jalur Prestasi
                      </span>
                      <input
                        type="radio"
                        name="path_choice"
                        checked={registrationPath === 'prestasi'}
                        onChange={() => setRegistrationPath('prestasi')}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                    </div>
                    <p className="text-[11.5px] text-slate-600 leading-relaxed">
                      Prestasi akademik, piagam kejuaraan olahraga/seni, atau sertifikat Tahfidz Al-Qur&apos;an.
                    </p>
                  </label>

                  {/* Jalur Mutasi */}
                  <label
                    onClick={() => setRegistrationPath('mutasi')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-1.5 ${
                      registrationPath === 'mutasi'
                        ? 'border-teal-600 bg-teal-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[13.5px] text-slate-900 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-teal-600" />
                        Jalur Mutasi
                      </span>
                      <input
                        type="radio"
                        name="path_choice"
                        checked={registrationPath === 'mutasi'}
                        onChange={() => setRegistrationPath('mutasi')}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                    </div>
                    <p className="text-[11.5px] text-slate-600 leading-relaxed">
                      Perpindahan domisili tugas orang tua/wali dari luar daerah ke wilayah Tangerang.
                    </p>
                  </label>
                </div>
              </div>

              {/* =========================================================
                  4. PERSYARATAN & DOKUMEN CALON SISWA
              ========================================================= */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-700" />
                    <span className="text-[12.5px] font-bold text-slate-900 uppercase tracking-wide">
                      4. Persyaratan &amp; Dokumen Calon Siswa
                    </span>
                  </div>
                  <span className="text-[10.5px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                    Syarat Min. 100 KB / Dokumen
                  </span>
                </div>

                {/* Requirement Info Box */}
                <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-2.5 text-[12px] text-blue-950">
                  <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <div className="space-y-0.5 leading-relaxed">
                    <p className="font-bold text-blue-900">
                      Ketentuan Ukuran &amp; Format Berkas:
                    </p>
                    <p className="text-blue-800 text-[11.5px]">
                      Format berkas yang diterima adalah <strong>PDF, JPG, atau PNG</strong> dengan ukuran <strong>minimal 100 KB</strong> (maksimal 10 MB). Berkas di bawah 100 KB ditolak secara otomatis untuk memastikan scan dokumen tidak buram/pecah dan dapat diverifikasi jelas oleh panitia madrasah.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Doc 1: Kartu Keluarga */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-bold text-slate-900">
                            1. Kartu Keluarga (KK)
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold">
                            Wajib
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 font-bold">
                            Min. 100 KB
                          </span>
                        </div>
                        <span className="text-[11.5px] text-slate-500 block mt-0.5">
                          Foto atau scan asli Kartu Keluarga calon santri.
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {documents.kk_url ? (
                          <div className="flex items-center gap-2">
                            <a
                              href={documents.kk_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200 hover:underline"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Lihat KK ({docMeta.kk_url?.sizeKb ? `${docMeta.kk_url.sizeKb} KB` : 'Terunggah'})</span>
                            </a>
                            <label className="cursor-pointer text-[11.5px] text-slate-500 hover:text-slate-800 underline">
                              Ganti
                              <input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={(e) => handleFileUpload('kk_url', e)}
                                className="hidden"
                              />
                            </label>
                          </div>
                        ) : (
                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-[12px] font-semibold cursor-pointer transition-colors shadow-2xs">
                            <Upload className="w-3.5 h-3.5 text-blue-600" />
                            <span>{uploadingDoc === 'kk_url' ? 'Mengunggah...' : 'Pilih Berkas KK'}</span>
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              onChange={(e) => handleFileUpload('kk_url', e)}
                              className="hidden"
                              disabled={uploadingDoc === 'kk_url'}
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Error Banner for KK */}
                    {docErrors.kk_url && (
                      <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11.5px] flex items-start gap-2 animate-in fade-in">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <span>{docErrors.kk_url}</span>
                      </div>
                    )}
                  </div>

                  {/* Doc 2: Akta Kelahiran */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-bold text-slate-900">
                            2. Akta Kelahiran
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold">
                            Wajib
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 font-bold">
                            Min. 100 KB
                          </span>
                        </div>
                        <span className="text-[11.5px] text-slate-500 block mt-0.5">
                          Foto atau scan asli Akta Kelahiran calon santri.
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {documents.akta_url ? (
                          <div className="flex items-center gap-2">
                            <a
                              href={documents.akta_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200 hover:underline"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Lihat Akta ({docMeta.akta_url?.sizeKb ? `${docMeta.akta_url.sizeKb} KB` : 'Terunggah'})</span>
                            </a>
                            <label className="cursor-pointer text-[11.5px] text-slate-500 hover:text-slate-800 underline">
                              Ganti
                              <input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={(e) => handleFileUpload('akta_url', e)}
                                className="hidden"
                              />
                            </label>
                          </div>
                        ) : (
                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-[12px] font-semibold cursor-pointer transition-colors shadow-2xs">
                            <Upload className="w-3.5 h-3.5 text-blue-600" />
                            <span>{uploadingDoc === 'akta_url' ? 'Mengunggah...' : 'Pilih Berkas Akta'}</span>
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              onChange={(e) => handleFileUpload('akta_url', e)}
                              className="hidden"
                              disabled={uploadingDoc === 'akta_url'}
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Error Banner for Akta */}
                    {docErrors.akta_url && (
                      <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11.5px] flex items-start gap-2 animate-in fade-in">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <span>{docErrors.akta_url}</span>
                      </div>
                    )}
                  </div>

                  {/* Doc 3: Ijazah / SKL */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-bold text-slate-900">
                            3. Ijazah atau Surat Keterangan Lulus (SKL)
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold">
                            Wajib / Menyusul
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 font-bold">
                            Min. 100 KB
                          </span>
                        </div>
                        <span className="text-[11.5px] text-slate-500 block mt-0.5">
                          Ijazah SD/MI atau Surat Keterangan Lulus sementara dari sekolah asal.
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {documents.ijazah_url ? (
                          <div className="flex items-center gap-2">
                            <a
                              href={documents.ijazah_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200 hover:underline"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Lihat Ijazah ({docMeta.ijazah_url?.sizeKb ? `${docMeta.ijazah_url.sizeKb} KB` : 'Terunggah'})</span>
                            </a>
                            <label className="cursor-pointer text-[11.5px] text-slate-500 hover:text-slate-800 underline">
                              Ganti
                              <input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={(e) => handleFileUpload('ijazah_url', e)}
                                className="hidden"
                              />
                            </label>
                          </div>
                        ) : (
                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-[12px] font-semibold cursor-pointer transition-colors shadow-2xs">
                            <Upload className="w-3.5 h-3.5 text-blue-600" />
                            <span>{uploadingDoc === 'ijazah_url' ? 'Mengunggah...' : 'Pilih Ijazah / SKL'}</span>
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              onChange={(e) => handleFileUpload('ijazah_url', e)}
                              className="hidden"
                              disabled={uploadingDoc === 'ijazah_url'}
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Error Banner for Ijazah */}
                    {docErrors.ijazah_url && (
                      <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11.5px] flex items-start gap-2 animate-in fade-in">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <span>{docErrors.ijazah_url}</span>
                      </div>
                    )}
                  </div>

                  {/* Doc 4: Bukti Afirmasi */}
                  <div className={`p-3.5 rounded-2xl border flex flex-col gap-2.5 transition-colors ${
                    registrationPath === 'afirmasi'
                      ? 'bg-purple-50/60 border-purple-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-bold text-slate-900">
                            4. Bukti Afirmasi
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                            registrationPath === 'afirmasi'
                              ? 'bg-purple-200 text-purple-900'
                              : 'bg-slate-200 text-slate-700'
                          }`}>
                            {registrationPath === 'afirmasi' ? 'Wajib untuk Jalur Afirmasi' : 'Opsional'}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 font-bold">
                            Min. 100 KB
                          </span>
                        </div>
                        <span className="text-[11.5px] text-slate-500 block mt-0.5">
                          Foto kartu KIP, PKH, KKS, atau Surat Keterangan Tidak Mampu (SKTM).
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {documents.afirmasi_url ? (
                          <div className="flex items-center gap-2">
                            <a
                              href={documents.afirmasi_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200 hover:underline"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Lihat Bukti ({docMeta.afirmasi_url?.sizeKb ? `${docMeta.afirmasi_url.sizeKb} KB` : 'Terunggah'})</span>
                            </a>
                            <label className="cursor-pointer text-[11.5px] text-slate-500 hover:text-slate-800 underline">
                              Ganti
                              <input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={(e) => handleFileUpload('afirmasi_url', e)}
                                className="hidden"
                              />
                            </label>
                          </div>
                        ) : (
                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-[12px] font-semibold cursor-pointer transition-colors shadow-2xs">
                            <Upload className="w-3.5 h-3.5 text-purple-600" />
                            <span>{uploadingDoc === 'afirmasi_url' ? 'Mengunggah...' : 'Pilih Bukti Afirmasi'}</span>
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              onChange={(e) => handleFileUpload('afirmasi_url', e)}
                              className="hidden"
                              disabled={uploadingDoc === 'afirmasi_url'}
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Error Banner for Afirmasi */}
                    {docErrors.afirmasi_url && (
                      <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11.5px] flex items-start gap-2 animate-in fade-in">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <span>{docErrors.afirmasi_url}</span>
                      </div>
                    )}
                  </div>

                  {/* Doc 5: Dokumen Prestasi */}
                  <div className={`p-3.5 rounded-2xl border flex flex-col gap-2.5 transition-colors ${
                    registrationPath === 'prestasi'
                      ? 'bg-amber-50/60 border-amber-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-bold text-slate-900">
                            5. Dokumen Prestasi
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                            registrationPath === 'prestasi'
                              ? 'bg-amber-200 text-amber-900'
                              : 'bg-slate-200 text-slate-700'
                          }`}>
                            {registrationPath === 'prestasi' ? 'Wajib untuk Jalur Prestasi' : 'Opsional'}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 font-bold">
                            Min. 100 KB
                          </span>
                        </div>
                        <span className="text-[11.5px] text-slate-500 block mt-0.5">
                          Foto piagam penghargaan juara lomba, sertifikat tahfidz, atau prestasi akademik.
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {documents.prestasi_url ? (
                          <div className="flex items-center gap-2">
                            <a
                              href={documents.prestasi_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200 hover:underline"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Lihat Sertifikat ({docMeta.prestasi_url?.sizeKb ? `${docMeta.prestasi_url.sizeKb} KB` : 'Terunggah'})</span>
                            </a>
                            <label className="cursor-pointer text-[11.5px] text-slate-500 hover:text-slate-800 underline">
                              Ganti
                              <input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={(e) => handleFileUpload('prestasi_url', e)}
                                className="hidden"
                              />
                            </label>
                          </div>
                        ) : (
                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-[12px] font-semibold cursor-pointer transition-colors shadow-2xs">
                            <Upload className="w-3.5 h-3.5 text-amber-600" />
                            <span>{uploadingDoc === 'prestasi_url' ? 'Mengunggah...' : 'Pilih Dokumen Prestasi'}</span>
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              onChange={(e) => handleFileUpload('prestasi_url', e)}
                              className="hidden"
                              disabled={uploadingDoc === 'prestasi_url'}
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Error Banner for Prestasi */}
                    {docErrors.prestasi_url && (
                      <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11.5px] flex items-start gap-2 animate-in fade-in">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <span>{docErrors.prestasi_url}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <span className="text-[11.5px] text-slate-500">
                  Data &amp; berkas terkirim langsung ke panitia PPDB madrasah.
                </span>

                <button
                  type="submit"
                  disabled={isSubmitting || Boolean(uploadingDoc)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-sans text-[13.5px] font-bold tracking-wide transition-all shadow-sm active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? 'Mengirim Formulir...'
                      : uploadingDoc
                      ? 'Menunggu Berkas...'
                      : 'Kirim Pendaftaran'}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
