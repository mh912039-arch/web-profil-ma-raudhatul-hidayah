'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  GraduationCap,
  ArrowLeft,
  AlertCircle,
  RefreshCw,
  UserPlus,
  CheckCircle2,
  Mail,
  BookOpen,
  Hash,
} from 'lucide-react';

interface SchoolPortalLoginProps {
  onLoginSuccess?: (role: 'admin' | 'guru' | 'siswa') => void;
  defaultRole?: 'admin' | 'guru' | 'siswa';
}

export const SchoolPortalLogin: React.FC<SchoolPortalLoginProps> = ({
  onLoginSuccess,
  defaultRole = 'admin',
}) => {
  const router = useRouter();

  // Mode: 'login' | 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // --- LOGIN STATES ---
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // --- REGISTER STATES ---
  const [regRole, setRegRole] = useState<'guru' | 'siswa'>('guru');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regNipNisn, setRegNipNisn] = useState('');
  const [regNote, setRegNote] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [isRegSubmitting, setIsRegSubmitting] = useState(false);
  const [regErrorMessage, setRegErrorMessage] = useState('');
  const [regSuccess, setRegSuccess] = useState<{
    name: string;
    roleLabel: string;
    email: string;
  } | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim()) {
      setErrorMessage('Silakan masukkan NISN, NIP, atau Email Anda.');
      return;
    }

    if (!password) {
      setErrorMessage('Kata sandi tidak boleh kosong.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || 'Identitas atau kata sandi tidak cocok.');
        return;
      }

      // Simpan role di localStorage untuk sinkronisasi state instan di browser
      if (typeof window !== 'undefined') {
        localStorage.setItem('mrh_admin_auth', 'true');
        localStorage.setItem('mrh_user_role', data.role);
      }

      if (onLoginSuccess) {
        onLoginSuccess(data.role);
      } else {
        router.push(data.role === 'admin' ? '/admin' : '/admin?tab=schedules');
      }
    } catch {
      setErrorMessage('Gagal menghubungi server. Periksa koneksi internet Anda.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegErrorMessage('');

    if (!regName.trim() || regName.trim().length < 3) {
      setRegErrorMessage('Nama lengkap wajib diisi minimal 3 karakter.');
      return;
    }

    if (!regEmail.trim() || !regEmail.includes('@')) {
      setRegErrorMessage('Format alamat email tidak valid.');
      return;
    }

    if (!regPassword || regPassword.trim().length < 4) {
      setRegErrorMessage('Kata sandi wajib diisi minimal 4 karakter.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegErrorMessage('Konfirmasi kata sandi tidak cocok dengan kata sandi di atas.');
      return;
    }

    setIsRegSubmitting(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName.trim(),
          email: regEmail.trim(),
          password: regPassword.trim(),
          role: regRole,
          nip_nisn: regNipNisn.trim(),
          note: regNote.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setRegErrorMessage(data.message || 'Gagal mengirim pengajuan akun.');
        return;
      }

      setRegSuccess({
        name: regName.trim(),
        roleLabel: regRole === 'guru' ? 'Dewan Guru' : 'Santri / Siswa',
        email: regEmail.trim(),
      });

      // Reset form fields
      setRegName('');
      setRegEmail('');
      setRegNipNisn('');
      setRegNote('');
      setRegPassword('');
      setRegConfirmPassword('');
    } catch {
      setRegErrorMessage('Gagal menghubungi server. Periksa koneksi internet Anda.');
    } finally {
      setIsRegSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col justify-center items-center bg-[#f8fafc] px-4 py-8 font-sans text-slate-800 selection:bg-blue-900 selection:text-white">
      {/* Top Header: Official School Emblem & Title */}
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-white p-2.5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-center mx-auto mb-3.5 transition-transform hover:scale-105 duration-200">
          <Image
            src="/school-logo.png"
            alt="Logo MA Raudhatul Hidayah"
            width={64}
            height={64}
            className="w-auto h-auto max-h-16 object-contain"
            priority
          />
        </div>

        <h1 className="font-serif text-[22px] sm:text-[24px] font-bold text-slate-900 tracking-tight uppercase leading-snug">
          MA RAUDHATUL HIDAYAH
        </h1>
      </div>

      {/* Main Authentication & Registration Card */}
      <div className="w-full max-w-[440px] bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 relative">
        {/* =========================================================================
            VIEW 1: REGISTER SUCCESS CONFIRMATION
        ========================================================================= */}
        {regSuccess ? (
          <div className="text-center py-2 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 shadow-2xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 mb-2.5">
                Menunggu Konfirmasi Administrator
              </span>
              <h2 className="font-serif text-2xl font-bold text-slate-900 tracking-tight">
                Pendaftaran Berhasil Dikirim
              </h2>
              <p className="text-[12.5px] text-slate-600 mt-2 leading-relaxed">
                Permohonan akun untuk{' '}
                <span className="font-bold text-slate-900">{regSuccess.name}</span> sebagai{' '}
                <span className="font-bold text-blue-900">{regSuccess.roleLabel}</span> telah masuk
                ke antrean verifikasi sistem madrasah.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Email Terdaftar:</span>
                <span className="font-mono font-bold text-slate-900">{regSuccess.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Status Akun:</span>
                <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                  Nonaktif (Menunggu Persetujuan)
                </span>
              </div>
            </div>

            <p className="text-[11.5px] text-slate-500 leading-relaxed">
              Administrator Madrasah akan meninjau dan mengaktifkan akun Anda. Setelah disetujui,
              Anda dapat langsung masuk menggunakan email dan kata sandi yang telah didaftarkan.
            </p>

            <button
              type="button"
              onClick={() => {
                setIdentifier(regSuccess.email);
                setRegSuccess(null);
                setAuthMode('login');
              }}
              className="w-full mt-2 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Halaman Masuk</span>
            </button>
          </div>
        ) : authMode === 'login' ? (
          /* =========================================================================
              VIEW 2: LOGIN FORM
          ========================================================================= */
          <div>
            <div className="text-center mb-6">
              <h2 className="font-serif text-2xl font-bold text-slate-900 tracking-tight">
                Masuk ke Sistem
              </h2>
              <p className="text-[13px] text-slate-500 mt-1">
                Silakan masukkan akun terdaftar Anda.
              </p>
            </div>

            {/* Error Alert */}
            {errorMessage && (
              <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Field 1: Identifier */}
              <div className="space-y-1.5">
                <label className="block text-[12px] font-bold text-slate-700">
                  Email / Username / NISN / NIP
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Masukkan NISN, NIP, atau Email"
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-slate-900 text-[13.5px] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Field 2: Password */}
              <div className="space-y-1.5">
                <label className="block text-[12px] font-bold text-slate-700">
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-slate-900 text-[13.5px] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800 transition-all font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 transition-colors p-0.5"
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 sm:py-3.5 rounded-xl bg-blue-900 hover:bg-blue-800 active:scale-[0.98] text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-xs transition-all duration-200 disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Memverifikasi Akun...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Registration Prompt Section */}
            <div className="mt-5 pt-4 border-t border-slate-100 text-center">
              <p className="text-[12px] text-slate-600 font-medium">
                Belum memiliki akses login portal?
              </p>
              <button
                type="button"
                onClick={() => {
                  setErrorMessage('');
                  setRegErrorMessage('');
                  setAuthMode('register');
                }}
                className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 hover:text-blue-700 transition-all cursor-pointer py-1.5 px-3 rounded-xl hover:bg-blue-50 active:scale-95"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Daftar Akun Guru / Siswa Baru</span>
              </button>
            </div>
          </div>
        ) : (
          /* =========================================================================
              VIEW 3: REGISTER FORM
          ========================================================================= */
          <div className="animate-in fade-in duration-200">
            <div className="text-center mb-5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                Registrasi Akun Baru
              </span>
              <h2 className="font-serif text-2xl font-bold text-slate-900 tracking-tight">
                Daftar Akses Portal
              </h2>
              <p className="text-[12px] text-slate-500 mt-1 leading-relaxed">
                Khusus Dewan Guru dan Santri/Siswa. Akun akan ditinjau dan dikonfirmasi langsung oleh Administrator.
              </p>
            </div>

            {/* Error Alert */}
            {regErrorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <span className="leading-relaxed">{regErrorMessage}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {/* Role Toggle */}
              <div className="space-y-1">
                <label className="block text-[11.5px] font-bold text-slate-700 uppercase tracking-wide">
                  Peran Akun Dimohon
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setRegRole('guru')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      regRole === 'guru'
                        ? 'bg-white text-blue-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Dewan Guru</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole('siswa')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      regRole === 'siswa'
                        ? 'bg-white text-blue-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Santri / Siswa</span>
                  </button>
                </div>
              </div>

              {/* Nama Lengkap */}
              <div className="space-y-1">
                <label className="block text-[11.5px] font-bold text-slate-700">
                  Nama Lengkap {regRole === 'guru' ? '& Gelar' : 'Santri/Siswa'}{' '}
                  <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder={
                      regRole === 'guru'
                        ? 'Contoh: H. Ahmad Subandi, S.Pd'
                        : 'Contoh: Muhammad Farhan Al-Ghifari'
                    }
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800 transition-all"
                  />
                </div>
              </div>

              {/* NIP / NISN & Info Tambahan */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-[11.5px] font-bold text-slate-700">
                    {regRole === 'guru' ? 'NIP / NUPTK' : 'NISN / NISM'}
                  </label>
                  <div className="relative">
                    <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={regNipNisn}
                      onChange={(e) => setRegNipNisn(e.target.value)}
                      placeholder={regRole === 'guru' ? 'Nomor NIP' : 'Nomor NISN'}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800 transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11.5px] font-bold text-slate-700">
                    {regRole === 'guru' ? 'Mata Pelajaran' : 'Kelas / Rombel'}
                  </label>
                  <div className="relative">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={regNote}
                      onChange={(e) => setRegNote(e.target.value)}
                      placeholder={regRole === 'guru' ? 'Mata Pelajaran' : 'Contoh: Kelas X'}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Email Resmi / Aktif */}
              <div className="space-y-1">
                <label className="block text-[11.5px] font-bold text-slate-700">
                  Email Akun Resmi <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="nama@raudhatulhidayah.sch.id atau email aktif"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800 transition-all font-mono"
                  />
                </div>
              </div>

              {/* Kata Sandi & Konfirmasi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-[11.5px] font-bold text-slate-700">
                    Kata Sandi <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min. 4 karakter"
                      className="w-full pl-8 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800 transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showRegPassword ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11.5px] font-bold text-slate-700">
                    Ulangi Sandi <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Konfirmasi sandi"
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800 transition-all font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Informational Banner */}
              <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-[11.5px] text-blue-900 flex items-start gap-2 leading-relaxed">
                <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <span>
                  Akun yang diajukan berstatus <strong>Menunggu Konfirmasi</strong> dan akan ditinjau
                  oleh Administrator Madrasah sebelum dapat digunakan untuk login.
                </span>
              </div>

              {/* Submit Register Button */}
              <button
                type="submit"
                disabled={isRegSubmitting}
                className="w-full py-3 rounded-xl bg-blue-900 hover:bg-blue-800 active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all duration-200 disabled:opacity-60 cursor-pointer"
              >
                {isRegSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Mengirim Permohonan Akun...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Kirim Pengajuan Akun</span>
                  </>
                )}
              </button>

              {/* Back to Login Link */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setRegErrorMessage('');
                    setAuthMode('login');
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-blue-900 transition-colors inline-flex items-center gap-1.5 py-1 px-3 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Sudah punya akun? Kembali ke Halaman Masuk</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Outbound Link back to website */}
      <div className="mt-6 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda Website Profil</span>
        </Link>
      </div>
    </div>
  );
};
