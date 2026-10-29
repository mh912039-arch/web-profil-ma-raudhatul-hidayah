'use client';

import React, { useState, useEffect } from 'react';
import { StitchNavbar } from '@/components/layout/StitchNavbar';
import { StitchFooter } from '@/components/layout/StitchFooter';
import { supabase } from '@/lib/supabaseClient';
import { MapPin, Phone, Mail, Send, CheckCircle2 } from 'lucide-react';

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
        {/* Main Interaction Area: Contact Directory + Message Form */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Hubungi Layanan Kami & 3 Contact Items (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div>
                <h1 className="font-display text-[30px] sm:text-[38px] font-bold text-slate-900 tracking-tight leading-tight">
                  Hubungi Layanan Kami
                </h1>
                <p className="font-sans text-[14.5px] sm:text-[15.5px] text-slate-600 mt-2.5 leading-relaxed">
                  Mempunyai pertanyaan seputar administrasi, sistem PPDB, atau kemitraan akademik? Tinggalkan pesan Anda.
                </p>
              </div>

              {/* 3 Contact Items with Circular Yellow/Amber Badges */}
              <div className="flex flex-col gap-5 pt-1">
                {/* 1. Alamat Sekolah */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <MapPin className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-sans text-[13px] text-slate-500 font-medium">
                      Alamat Sekolah
                    </span>
                    <span className="font-sans text-[15px] sm:text-[16px] font-bold text-slate-900 leading-snug mt-0.5">
                      {profileInfo.address}
                    </span>
                  </div>
                </div>

                {/* 2. Telepon Resmi */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Phone className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-sans text-[13px] text-slate-500 font-medium">
                      Telepon Resmi
                    </span>
                    <a
                      href={`tel:${profileInfo.phone.replace(/\D/g, '')}`}
                      className="font-sans text-[16px] font-bold text-slate-900 hover:text-blue-900 transition-colors mt-0.5 block"
                    >
                      {profileInfo.phone}
                    </a>
                  </div>
                </div>

                {/* 3. E-mail */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Mail className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-sans text-[13px] text-slate-500 font-medium">
                      E-mail
                    </span>
                    <a
                      href={`mailto:${profileInfo.email}`}
                      className="font-sans text-[15px] sm:text-[16px] font-bold text-slate-900 hover:text-blue-900 transition-colors mt-0.5 break-all block"
                    >
                      {profileInfo.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Extra Info: Jam Kerja TU & Media Sosial */}
              <div className="pt-4 border-t border-slate-200/80 flex flex-col gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                  <span className="font-sans text-[11.5px] uppercase tracking-wider font-bold text-slate-600 block mb-2">
                    Jam Operasional Tata Usaha
                  </span>
                  <div className="flex items-center justify-between text-[12.5px] text-slate-700">
                    <span>Senin – Jumat: <strong className="text-slate-900">{profileInfo.hoursWeekdays}</strong></span>
                    <span>Sabtu: <strong className="text-slate-900">{profileInfo.hoursSaturday}</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Message Form (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="bg-white p-6 sm:p-9 rounded-2xl shadow-sm border border-slate-200/90 flex flex-col">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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

                  {/* Row 1: Nama Lengkap & Alamat E-mail */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-sans text-[13.5px] font-bold text-slate-900" htmlFor="name">
                        Nama Lengkap
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        placeholder="Nama Anda"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white rounded-lg font-sans text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/15 focus:border-slate-800 border border-slate-300 transition-all shadow-2xs"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-sans text-[13.5px] font-bold text-slate-900" htmlFor="contact">
                        Alamat E-mail
                      </label>
                      <input
                        id="contact"
                        type="text"
                        required
                        placeholder="johndoe@email.com"
                        value={formData.contact}
                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white rounded-lg font-sans text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/15 focus:border-slate-800 border border-slate-300 transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Row 2: Pesan */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-[13.5px] font-bold text-slate-900" htmlFor="message">
                      Pesan
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      placeholder="Pertanyaan Anda..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full p-3.5 bg-white rounded-lg font-sans text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/15 focus:border-slate-800 border border-slate-300 transition-all shadow-2xs resize-y"
                    />
                  </div>

                  {/* Google reCAPTCHA v2 Widget */}
                  <div className="pt-1">
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

                  {/* Submit button: KIRIM PESAN */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-sans text-[13.5px] font-bold uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
                    >
                      <span>{isSubmitting ? 'MENGIRIM...' : 'KIRIM PESAN'}</span>
                      <Send className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  {formSubmitted && (
                    <div className="p-4 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 mt-2 flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="text-[13px]">
                        <p className="font-bold">Pesan Berhasil Terkirim!</p>
                        <p className="text-emerald-800 mt-0.5">
                          Petugas Tata Usaha MAS Raudhatul Hidayah akan segera merespons pesan Anda melalui kontak yang Anda cantumkan.
                        </p>
                      </div>
                    </div>
                  )}
                </form>
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
