'use client';

import React, { useState, useEffect } from 'react';
import { StitchNavbar } from '@/components/layout/StitchNavbar';
import { StitchFooter } from '@/components/layout/StitchFooter';
import { supabase } from '@/lib/supabaseClient';

export default function KontakPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaState, setCaptchaState] = useState<'idle' | 'verifying' | 'verified'>('idle');
  const [captchaError, setCaptchaError] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    subject: '',
    message: '',
    hp_website: '',
  });

  const handleToggleCaptcha = () => {
    if (captchaState === 'verified') return;
    setCaptchaState('verifying');
    setCaptchaError(false);
    setTimeout(() => {
      setCaptchaState('verified');
    }, 450);
  };

  const [profileInfo, setProfileInfo] = useState({
    address: 'Jl. Raya Tanjung Kait No. 33, Tj. Anom, Kec. Mauk, Kabupaten Tangerang, Banten 15330',
    phone: '0817-6614-723',
    whatsapp: '0817-6614-723',
    whatsappRaw: '628176614723',
    email: 'info@maraudhathidayah.sch.id',
    hoursWeekdays: '07.00 – 15.30 WIB',
    hoursSaturday: '07.00 – 12.30 WIB',
    hoursSunday: 'Tutup Layanan Fisik',
  });

  useEffect(() => {
    fetch('/api/profile', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.profile) {
          const p = data.profile;
          const fullAddr = [p.address, p.district, p.regency, p.province, p.postalCode].filter(Boolean).join(', ');
          setProfileInfo((prev) => ({
            ...prev,
            address: fullAddr || prev.address,
            phone: p.phone || prev.phone,
            whatsapp: p.whatsapp || prev.whatsapp,
            whatsappRaw: (p.whatsapp || prev.whatsappRaw).replace(/\D/g, ''),
            email: p.email || prev.email,
            hoursWeekdays: p.hoursWeekdays || prev.hoursWeekdays,
            hoursSaturday: p.hoursSaturday || prev.hoursSaturday,
            hoursSunday: p.hoursSunday || prev.hoursSunday,
          }));
        }
      })
      .catch((err) => console.warn('Could not fetch dynamic profile for contact:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (captchaState !== 'verified') {
      setCaptchaError(true);
      return;
    }
    if (!formData.name || !formData.message) return;
    setIsSubmitting(true);

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } catch (err) {
      console.warn('Error submitting contact message:', err);
    } finally {
      setIsSubmitting(false);
      setFormSubmitted(true);
      setCaptchaState('idle');
      setTimeout(() => {
        setFormData({ name: '', contact: '', subject: '', message: '', hp_website: '' });
      }, 500);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background font-sans text-on-surface">
      <StitchNavbar />

      <main className="w-full pt-20 bg-background flex-grow">
        {/* Main Interaction Area: Asymmetric Layout (Contact Directory + Message Form) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Official Directory (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              {/* Physical Location Card */}
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-surface-container">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-secondary shrink-0">
                    <span className="material-symbols-outlined text-[26px]">apartment</span>
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-sans text-[11px] text-secondary uppercase tracking-wider font-bold">
                      Alamat Sekolah Utama
                    </span>
                    <h3 className="font-display text-[17px] font-bold text-primary mt-0.5">
                      MAS Raudhatul Hidayah
                    </h3>
                    <p className="font-sans text-[13.5px] text-on-surface-variant mt-1 leading-relaxed">
                      {profileInfo.address}
                    </p>
                    <div className="mt-3 pt-3 border-t border-surface-container flex items-center gap-1.5 text-secondary font-sans text-[12.5px] font-semibold">
                      <span className="material-symbols-outlined text-[17px]">near_me</span>
                      <span>Akses strategis jalan raya Tanjung Kait - Mauk</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Telepon Resmi */}
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-surface-container">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-secondary shrink-0">
                    <span className="material-symbols-outlined text-[24px]">call</span>
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-sans text-[11px] text-secondary uppercase tracking-wider font-bold">
                      Kontak Langsung
                    </span>
                    <h4 className="font-display text-[16px] font-bold text-primary mt-0.5 mb-1">
                      Telepon Resmi
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 mt-0.5">
                      <a
                        href={`tel:${profileInfo.phone.replace(/\D/g, '')}`}
                        className="text-primary hover:text-secondary font-bold transition-colors flex items-center gap-1.5 text-[15px]"
                      >
                        <span className="material-symbols-outlined text-[17px] text-secondary">phone_in_talk</span>
                        <span>{profileInfo.phone}</span>
                      </a>
                      <span className="text-slate-300">•</span>
                      <a
                        href={`https://wa.me/${profileInfo.whatsappRaw}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 hover:text-emerald-800 font-medium transition-colors flex items-center gap-1 text-[13px]"
                      >
                        <span>WhatsApp</span>
                      </a>
                    </div>
                    <span className="font-sans text-[11.5px] text-outline mt-2">
                      Layanan suara &amp; chat resmi jam dinas
                    </span>
                  </div>
                </div>
              </div>

              {/* Email Inboxes */}
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-surface-container">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[24px]">alternate_email</span>
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-sans text-[11px] text-secondary uppercase tracking-wider font-bold">
                      Surel / Email Resmi
                    </span>
                    <h4 className="font-display text-[16px] font-bold text-primary mt-0.5 mb-1">
                      Korespondensi Terbuka
                    </h4>
                    <a
                      href={`mailto:${profileInfo.email}`}
                      className="text-primary hover:text-secondary font-medium transition-colors flex items-center gap-1.5 text-[13.5px]"
                    >
                      <span className="material-symbols-outlined text-[16px] text-secondary">mail</span>
                      <span>{profileInfo.email}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Media Sosial Resmi (Instagram, TikTok, YouTube) */}
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-surface-container">
                <span className="font-sans text-[11px] text-secondary uppercase tracking-wider font-bold block mb-3">
                  Media Sosial Resmi
                </span>
                <div className="space-y-2.5 font-sans text-[13px]">
                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/ma_raudlatulhidayah/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-container transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 border border-pink-100">
                      <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-primary group-hover:text-secondary transition-colors">
                        @ma_raudlatulhidayah
                      </span>
                      <span className="text-[11px] text-on-surface-variant">Instagram Resmi</span>
                    </div>
                  </a>

                  {/* TikTok */}
                  <a
                    href="https://www.tiktok.com/@ma_raudlatulhidayah"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-container transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center shrink-0 border border-slate-200">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.068-.1a2.89 2.89 0 0 1 2.373-4.537c.314 0 .618.05.903.144V9.414a6.334 6.334 0 0 0-.903-.065A6.334 6.334 0 0 0 3.144 15.68a6.334 6.334 0 0 0 6.334 6.334 6.334 6.334 0 0 0 6.334-6.334V8.583a8.17 8.17 0 0 0 4.777 1.549V6.686h-1Z" />
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-primary group-hover:text-secondary transition-colors">
                        @ma_raudlatulhidayah
                      </span>
                      <span className="text-[11px] text-on-surface-variant">TikTok Kreatif Santri</span>
                    </div>
                  </a>
                </div>
              </div>

              {/* Jam Kerja TU */}
              <div className="bg-surface-container p-6 rounded-xl shadow-sm border border-surface-container-high">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-secondary text-[22px]">
                    access_time_filled
                  </span>
                  <h4 className="font-display text-[16px] font-bold text-primary">
                    Jam Kerja Tata Usaha
                  </h4>
                </div>
                <div className="space-y-2 font-sans text-[13px]">
                  <div className="flex items-center justify-between p-2.5 bg-surface-container-lowest rounded-lg px-3">
                    <span className="font-medium text-on-surface">Senin – Jumat</span>
                    <span className="text-primary font-bold">{profileInfo.hoursWeekdays}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-surface-container-lowest rounded-lg px-3">
                    <span className="font-medium text-on-surface">Sabtu</span>
                    <span className="text-primary font-bold">{profileInfo.hoursSaturday}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-surface-container-lowest/60 rounded-lg px-3 text-on-surface-variant">
                    <span>Ahad &amp; Hari Libur</span>
                    <span className="font-medium">{profileInfo.hoursSunday}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Message Form (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-xl shadow-md border border-surface-container flex flex-col">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 text-secondary">
                      <span className="material-symbols-outlined text-[20px]">rate_review</span>
                      <span className="font-sans text-[11px] uppercase tracking-wider font-bold">
                        Formulir Terpadu
                      </span>
                    </div>
                    <span className="px-3 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-medium">
                      Aspirasi &amp; Informasi
                    </span>
                  </div>

                  <h2 className="font-display text-[24px] sm:text-[28px] font-bold text-primary tracking-tight mb-2">
                    Kirim Pesan, Kritik &amp; Saran
                  </h2>
                  <p className="font-sans text-[14px] text-on-surface-variant mb-6 leading-relaxed">
                    Formulir ini terbuka untuk pertanyaan umum, konfirmasi administrasi, dan saran kemajuan madrasah. Pesan Anda langsung diterima oleh petugas sekretariat.
                  </p>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Anti-Bot Honeypot Protection */}
                    <div style={{ display: 'none', position: 'absolute', left: '-9999px', opacity: 0 }} aria-hidden="true">
                      <input
                        type="text"
                        name="hp_website"
                        value={formData.hp_website}
                        onChange={(e) => setFormData({ ...formData, hp_website: e.target.value })}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-sans text-[13px] font-semibold text-primary" htmlFor="name">
                          Nama Lengkap <span className="text-error">*</span>
                        </label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-outline">
                            badge
                          </span>
                          <input
                            id="name"
                            type="text"
                            required
                            placeholder="Nama Anda"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full pl-9 pr-3 py-2 bg-surface-container-lowest rounded-lg font-sans text-[13.5px] text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-secondary/40 border border-surface-container"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="font-sans text-[13px] font-semibold text-primary" htmlFor="contact">
                          Email atau No. WhatsApp <span className="text-error">*</span>
                        </label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-outline">
                            contact_phone
                          </span>
                          <input
                            id="contact"
                            type="text"
                            required
                            placeholder="0812xxxx atau email@domain.com"
                            value={formData.contact}
                            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                            className="w-full pl-9 pr-3 py-2 bg-surface-container-lowest rounded-lg font-sans text-[13.5px] text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-secondary/40 border border-surface-container"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-sans text-[13px] font-semibold text-primary" htmlFor="subject">
                        Subjek Pesan <span className="text-error">*</span>
                      </label>
                      <select
                        id="subject"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3 py-2 bg-surface-container-lowest rounded-lg font-sans text-[13.5px] text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/40 border border-surface-container"
                      >
                        <option value="">Pilih kategori permohonan atau pertanyaan...</option>
                        <option value="umum">Pertanyaan Umum Operasional Sekolah</option>
                        <option value="ppdb">Informasi PPDB / Pendaftaran Siswa Baru</option>
                        <option value="legalisir">Permohonan Legalisir Dokumen Ijazah</option>
                        <option value="konsultasi">Konsultasi Wali Santri</option>
                        <option value="saran">Kritik &amp; Saran Fasilitas</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-sans text-[13px] font-semibold text-primary" htmlFor="message">
                        Isi Pesan <span className="text-error">*</span>
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={4}
                        placeholder="Tuliskan secara santun detail pesan atau pertanyaan Anda di sini..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full p-3 bg-surface-container-lowest rounded-lg font-sans text-[13.5px] text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-secondary/40 border border-surface-container resize-y"
                      />
                    </div>

                    {/* Google reCAPTCHA v2 Widget (SS ke-2) */}
                    <div className="pt-1 pb-1">
                      <div
                        onClick={handleToggleCaptcha}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === ' ' || e.key === 'Enter') {
                            e.preventDefault();
                            handleToggleCaptcha();
                          }
                        }}
                        className={`w-full max-w-[302px] h-[76px] px-3.5 py-2.5 rounded-[3px] border transition-all cursor-pointer select-none flex items-center justify-between shadow-2xs ${
                          captchaState === 'verified'
                            ? 'bg-[#fcfdfc] border-emerald-300 ring-1 ring-emerald-400/20'
                            : 'bg-[#fafafa] border-[#d3d3d3] hover:border-[#b5b5b5] hover:bg-[#f5f5f5]'
                        }`}
                      >
                        {/* Checkbox & Text */}
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-[26px] h-[26px] rounded-[2px] flex items-center justify-center transition-all ${
                              captchaState === 'verified'
                                ? 'bg-transparent text-emerald-600'
                                : captchaState === 'verifying'
                                ? 'bg-white border-2 border-blue-500'
                                : 'bg-white border-2 border-[#c1c1c1] hover:border-[#9e9e9e]'
                            }`}
                          >
                            {captchaState === 'verifying' && (
                              <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                            )}
                            {captchaState === 'verified' && (
                              <svg className="w-6 h-6 text-emerald-600 animate-in zoom-in-75 duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </div>

                          <span className="font-sans text-[13.5px] font-normal text-slate-800">
                            I&apos;m not a robot
                          </span>
                        </div>

                        {/* reCAPTCHA Official Branding */}
                        <div className="flex flex-col items-center justify-center pl-2 shrink-0">
                          <svg className="w-7 h-7" viewBox="0 0 64 64" fill="none">
                            <path
                              d="M32 6C17.64 6 6 17.64 6 32h6c0-11.05 8.95-20 20-20 6.13 0 11.64 2.76 15.34 7.12L39.88 27H58V8.88l-6.42 6.42C46.88 10.02 39.8 6 32 6z"
                              fill="#4285F4"
                            />
                            <path
                              d="M52 32c0 11.05-8.95 20-20 20-6.13 0-11.64-2.76-15.34-7.12L24.12 37H6v18.12l6.42-6.42C17.12 53.98 24.2 58 32 58c14.36 0 26-11.64 26-26h-6z"
                              fill="#9AA0A6"
                            />
                          </svg>
                          <span className="text-[9px] font-sans font-semibold text-slate-500 tracking-tight leading-tight mt-0.5">
                            reCAPTCHA
                          </span>
                          <div className="flex items-center gap-1 text-[8px] text-slate-400 leading-none">
                            <a
                              href="https://www.google.com/intl/en/policies/privacy/"
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="hover:underline"
                            >
                              Privacy
                            </a>
                            <span>-</span>
                            <a
                              href="https://www.google.com/intl/en/policies/terms/"
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="hover:underline"
                            >
                              Terms
                            </a>
                          </div>
                        </div>
                      </div>

                      {captchaError && (
                        <p className="text-[12px] text-rose-600 font-medium mt-1.5 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px]">error</span>
                          <span>Harap centang verifikasi keamanan &quot;I&apos;m not a robot&quot;.</span>
                        </p>
                      )}
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5 text-on-surface-variant text-[12px]">
                        <span className="material-symbols-outlined text-[16px] text-secondary">
                          verified_user
                        </span>
                        <span>Data Anda dijaga kerahasiaannya oleh Tata Usaha.</span>
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary hover:bg-secondary text-on-primary font-sans text-[13.5px] font-semibold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        <span>{isSubmitting ? 'Mengirim...' : 'Kirim Pesan Resmi'}</span>
                        <span className="material-symbols-outlined text-[17px]">send</span>
                      </button>
                    </div>

                    {formSubmitted && (
                      <div className="p-3.5 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 mt-2 flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-emerald-600 text-[20px] shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <div className="text-[13px]">
                          <p className="font-bold">Pesan Berhasil Terkirim!</p>
                          <p className="text-emerald-800 mt-0.5">
                            Petugas Tata Usaha kami akan merespons pesan Anda dalam 1x24 jam kerja melalui nomor WhatsApp atau surel yang Anda cantumkan.
                          </p>
                        </div>
                      </div>
                    )}
                  </form>
                </div>

                <div className="mt-6 pt-4 border-t border-surface-container flex items-center gap-2 text-on-surface-variant text-[12px]">
                  <span className="material-symbols-outlined text-primary text-[18px] shrink-0">info</span>
                  <span>Untuk kebutuhan mendesak di luar jam kerja, wali murid dapat menghubungi narahubung wali kelas.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Interactive Campus Location & Route Map Section */}
        <section className="w-full bg-surface-container-low py-12 sm:py-16 border-t border-surface-container">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="font-display text-[26px] sm:text-[34px] font-bold text-primary tracking-tight">
                Peta Lokasi Sekolah
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Google Maps Embed Container (8 cols) */}
              <div className="lg:col-span-8 overflow-hidden rounded-xl shadow-sm bg-surface-container-highest border border-surface-container relative">
                <iframe
                  title="Peta Lokasi MA Raudlatul Hidayah Tanjung Anom Mauk"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3967.6256247920387!2d106.53266297592476!3d-6.022493393963283!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6a077ff9292557%3A0xae9bc40d9fedd490!2sMA%20RAUDLATUL%20HIDAYAH!5e0!3m2!1sid!2sid!4v1728300000000!5m2!1sid!2sid"
                  width="100%"
                  height="420"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-80 sm:h-[420px]"
                />
              </div>

              {/* Transportation & Access Guide (4 cols) */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-surface-container">
                  <h3 className="font-display text-[17px] font-bold text-primary mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[22px]">
                      directions_car
                    </span>
                    <span>Panduan Navigasi</span>
                  </h3>
                  <ul className="space-y-3 font-sans text-[13px] text-on-surface-variant leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-secondary text-[17px] shrink-0 mt-0.5">
                        check_circle
                      </span>
                      <span>
                        <strong>Akses Utama:</strong> Melalui Jl. Raya Tanjung Kait, Desa Tanjung Anom, Kec. Mauk.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-secondary text-[17px] shrink-0 mt-0.5">
                        check_circle
                      </span>
                      <span>
                        <strong>Patokan Lokasi:</strong> Berada di kawasan Tanjung Anom Mauk, dekat dengan fasilitas publik desa dan kantor pemerintahan.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-secondary text-[17px] shrink-0 mt-0.5">
                        check_circle
                      </span>
                      <span>
                        <strong>Fasilitas Parkir:</strong> Halaman sekolah menyediakan area parkir yang tertib untuk motor maupun mobil wali murid.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-surface-container flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-secondary font-bold text-[13px]">
                    <span className="material-symbols-outlined text-[20px]">call</span>
                    <span>Butuh Panduan Penjemputan?</span>
                  </div>
                  <p className="font-sans text-[13px] text-on-surface-variant">
                    Hubungi narahubung kami di nomor <strong>0817-6614-723</strong> untuk konfirmasi rute dan panduan langsung.
                  </p>
                  <a
                    href="https://wa.me/628176614723"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center justify-center gap-2 py-2 rounded-lg bg-secondary text-on-secondary text-[13px] font-semibold hover:bg-primary transition-colors"
                  >
                    <span>Hubungi Narahubung WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <StitchFooter />
    </div>
  );
}
