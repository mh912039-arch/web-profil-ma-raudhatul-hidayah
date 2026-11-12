'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Navigation,
  Loader2,
} from 'lucide-react';
import { TurnstileWidget } from '@/components/ui/TurnstileWidget';
import { fetchPublicProfile } from '@/lib/publicProfileClient';

const defaultProfile = {
  contactTitle: 'Hubungi Layanan Kami',
  contactSubtitle:
    'Mempunyai pertanyaan seputar administrasi, sistem PPDB, atau kemitraan akademik? Tinggalkan pesan Anda.',
  address:
    'Jl. Raya Tanjung Kait No. 33, RT 02 / RW 01, Mauk, Kabupaten Tangerang, Banten 15330',
  phone: '0817-6614-723',
  whatsapp: '628176614723',
  email: 'info@maraudhatulhidayah.sch.id',
  mapsEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3967.6256247920387!2d106.53266297592476!3d-6.022493393963283!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6a077ff9292557%3A0xae9bc40d9fedd490!2sMA%20RAUDLATUL%20HIDAYAH!5e0!3m2!1sid!2sid!4v1728300000000!5m2!1sid!2sid',
  mapsDirectUrl: 'https://maps.app.goo.gl/4dKTkXuw5VBhmgACA',
};

export function HomeContactMapSection() {
  const [profile, setProfile] = useState(defaultProfile);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    hp_website: '',
  });
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [captchaError, setCaptchaError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchPublicProfile().then((data) => {
      if (data?.profile) {
        const p = data.profile;
        const fullAddr = [p.address, p.district, p.regency, p.province, p.postalCode]
          .filter(Boolean)
          .join(', ');
        setProfile((prev) => ({
          ...prev,
          contactTitle: p.contactTitle || prev.contactTitle,
          contactSubtitle: p.contactSubtitle || prev.contactSubtitle,
          address: fullAddr || p.address || prev.address,
          phone: p.phone || prev.phone,
          whatsapp: (p.whatsapp || prev.whatsapp).replace(/\D/g, ''),
          email: p.email || prev.email,
          mapsEmbedUrl: p.mapsEmbedUrl || prev.mapsEmbedUrl,
        }));
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!turnstileToken) {
      setCaptchaError(true);
      return;
    }

    if (!formData.name.trim() || !formData.message.trim()) {
      setErrorMessage('Harap isi nama lengkap dan pesan Anda.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim() || undefined,
          contact: formData.email.trim() || undefined,
          message: formData.message.trim(),
          turnstileToken,
          hp_website: formData.hp_website,
        }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.success) {
        throw new Error(json?.message || 'Gagal mengirim pesan. Silakan coba kembali.');
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', message: '', hp_website: '' });
      setTurnstileToken('');
      setCaptchaError(false);
    } catch (err: any) {
      console.warn('Error submitting contact form from homepage:', err);
      setErrorMessage(err.message || 'Terjadi kendala saat mengirim pesan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppDirect = () => {
    const waNumber = profile.whatsapp || '628176614723';
    const textMsg = encodeURIComponent(
      `Assalamu'alaikum Warahmatullahi Wabarakatuh.\n\nSaya ingin berkonsultasi mengenai MAS Raudlatul Hidayah.\nNama: ${
        formData.name || '-'
      }\nPesan: ${formData.message || 'Mohon informasi administrasi & PPDB.'}`
    );
    window.open(`https://wa.me/${waNumber}?text=${textMsg}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          
          {/* =========================================================
              KOLOM KIRI: Hubungi Layanan Kami & Formulir Kontak (7 Cols)
          ========================================================= */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Header Bagian */}
              <div className="mb-8">
                <h2 className="font-serif text-[30px] sm:text-[38px] font-bold text-slate-900 tracking-tight leading-tight">
                  {profile.contactTitle}
                </h2>
                <div className="w-12 h-1 bg-amber-400 rounded-full mt-2 mb-3" />
                <p className="font-sans text-[14.5px] sm:text-[15.5px] text-slate-600 leading-relaxed max-w-xl">
                  {profile.contactSubtitle}
                </p>
              </div>

              {/* 3 Item Kontak dengan Lambang Bulat Kuning */}
              <div className="space-y-4 mb-8">
                {/* 1. Alamat Sekolah */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#facc15] text-slate-950 flex items-center justify-center shrink-0 shadow-xs border border-amber-400/50">
                    <MapPin className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-sans text-[11.5px] font-semibold text-slate-500 uppercase tracking-wider">
                      Alamat Sekolah
                    </span>
                    <span className="font-sans text-[14.5px] sm:text-[15.5px] font-bold text-slate-900 leading-snug mt-0.5">
                      {profile.address}
                    </span>
                  </div>
                </div>

                {/* 2. Telepon Resmi */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#facc15] text-slate-950 flex items-center justify-center shrink-0 shadow-xs border border-amber-400/50">
                    <Phone className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-sans text-[11.5px] font-semibold text-slate-500 uppercase tracking-wider">
                      Telepon Resmi
                    </span>
                    <a
                      href={`tel:${profile.phone.replace(/\D/g, '')}`}
                      className="font-sans text-[15.5px] font-bold text-slate-900 hover:text-blue-900 transition-colors mt-0.5 block"
                    >
                      {profile.phone}
                    </a>
                  </div>
                </div>

                {/* 3. E-mail */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#facc15] text-slate-950 flex items-center justify-center shrink-0 shadow-xs border border-amber-400/50">
                    <Mail className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-sans text-[11.5px] font-semibold text-slate-500 uppercase tracking-wider">
                      E-mail
                    </span>
                    <a
                      href={`mailto:${profile.email}`}
                      className="font-sans text-[15px] sm:text-[15.5px] font-bold text-slate-900 hover:text-blue-900 transition-colors mt-0.5 break-all block"
                    >
                      {profile.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Garis Pemisah Halus */}
              <div className="border-t border-slate-200/80 mb-6" />

              {/* Formulir Pengiriman Pesan */}
              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center gap-2.5 text-emerald-800 font-bold text-[15px]">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Pesan Anda Berhasil Terkirim!</span>
                  </div>
                  <p className="text-[13.5px] text-emerald-700 leading-relaxed">
                    Terima kasih telah menghubungi MA Raudlatul Hidayah. Tim administrasi madrasah kami akan segera meninjau dan merespons pertanyaan Anda secepatnya.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-sans text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                    >
                      Kirim Pesan Lainnya
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* Anti-Bot Honeypot Protection */}
                  <div
                    style={{ display: 'none', position: 'absolute', left: '-9999px', opacity: 0 }}
                    aria-hidden="true"
                  >
                    <input
                      type="text"
                      name="hp_website"
                      value={formData.hp_website}
                      onChange={(e) => setFormData({ ...formData, hp_website: e.target.value })}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {/* Baris 1: Nama Lengkap & Alamat E-mail */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="home-contact-name" className="font-sans text-[13px] font-bold text-slate-900">
                        Nama Lengkap
                      </label>
                      <input
                        id="home-contact-name"
                        type="text"
                        required
                        placeholder="Nama Anda"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50/70 hover:bg-white focus:bg-white rounded-xl font-sans text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900/15 focus:border-slate-800 border border-slate-300 transition-all shadow-2xs"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="home-contact-email" className="font-sans text-[13px] font-bold text-slate-900">
                        Alamat E-mail
                      </label>
                      <input
                        id="home-contact-email"
                        type="email"
                        placeholder="johndoe@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50/70 hover:bg-white focus:bg-white rounded-xl font-sans text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900/15 focus:border-slate-800 border border-slate-300 transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Baris 2: Pesan */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="home-contact-message" className="font-sans text-[13px] font-bold text-slate-900">
                      Pesan
                    </label>
                    <textarea
                      id="home-contact-message"
                      required
                      rows={4}
                      placeholder="Tuliskan pertanyaan atau keperluan Anda di sini..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full p-3.5 bg-slate-50/70 hover:bg-white focus:bg-white rounded-xl font-sans text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900/15 focus:border-slate-800 border border-slate-300 transition-all shadow-2xs resize-y"
                    />
                  </div>

                  {/* Cloudflare Turnstile Smart CAPTCHA Widget */}
                  <div className="pt-0.5">
                    <TurnstileWidget
                      action="home_contact"
                      onVerify={(token) => {
                        setTurnstileToken(token);
                        setCaptchaError(false);
                      }}
                      onExpire={() => setTurnstileToken('')}
                      onError={() => setTurnstileToken('')}
                    />

                    {captchaError && (
                      <p className="text-[12px] text-rose-600 font-medium mt-1.5 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>Harap selesaikan verifikasi keamanan di atas sebelum mengirim pesan.</span>
                      </p>
                    )}

                    {errorMessage && (
                      <p className="text-[12px] text-rose-600 font-medium mt-1.5 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{errorMessage}</span>
                      </p>
                    )}
                  </div>

                  {/* Tombol Aksi */}
                  <div className="pt-1 flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-sans text-[13.5px] font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Mengirim...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Kirim Pesan</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleWhatsAppDirect}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#1ebc59] active:scale-[0.98] text-slate-950 font-sans text-[13px] font-bold transition-all shadow-sm cursor-pointer"
                    >
                      <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.777.784 2.791.784 3.181 0 5.767-2.587 5.768-5.766.001-3.181-2.585-5.77-5.768-5.77zm3.377 8.215c-.145.408-.838.777-1.157.828-.319.052-.734.075-2.383-.605-1.986-.818-3.256-2.839-3.355-2.971-.099-.133-.805-1.072-.805-2.046 0-.974.509-1.453.69-1.649.182-.196.398-.245.53-.245s.266.005.383.011c.124.006.29-.047.453.346.166.399.566 1.383.616 1.483.05.1.083.217.017.35-.067.133-.1.217-.199.333-.1.117-.209.261-.299.35-.1.1-.205.209-.089.408.117.2 0.518.855 1.11 1.382.763.679 1.405.889 1.605.989.2.1.317.083.433-.05.117-.133.5-.583.633-.783.133-.2.267-.167.45-.1.183.067 1.166.55 1.366.65.2.1.333.15.383.233.05.083.05.483-.095.891z"/>
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.98-1.393A9.953 9.953 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2a8.167 8.167 0 0 1-4.223-1.167l-.303-.18-3.132.875.836-3.05-.198-.315A8.166 8.166 0 0 1 3.8 12c0-4.522 3.678-8.2 8.2-8.2s8.2 3.678 8.2 8.2-3.678 8.2-8.2 8.2z" />
                      </svg>
                      <span>Chat WhatsApp</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* =========================================================
              KOLOM KANAN: Google Maps Interaktif (5 Cols)
          ========================================================= */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="relative w-full h-full min-h-[440px] sm:min-h-[520px] rounded-3xl overflow-hidden border border-slate-200/90 shadow-lg bg-slate-100 flex flex-col">
              
              {/* Iframe Google Maps */}
              <div className="relative w-full flex-grow min-h-[360px]">
                <iframe
                  title="Peta Lokasi Google Maps MA Raudlatul Hidayah"
                  src={profile.mapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 w-full h-full"
                />
              </div>

              {/* Footer Petunjuk Arah Singkat */}
              <div className="p-3 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-[11.5px] text-slate-600 shrink-0">
                <span className="truncate">Kawasan Jl. Raya Tanjung Kait No. 33, Tanjung Anom</span>
                <a
                  href={profile.mapsDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-blue-700 hover:text-blue-900 transition-colors shrink-0 flex items-center gap-1"
                >
                  <span>Petunjuk Arah</span>
                  <Navigation className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}