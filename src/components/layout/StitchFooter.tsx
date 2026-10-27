'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Award,
  BookOpen,
  Instagram,
  Building2,
} from 'lucide-react';

interface FooterProfile {
  name: string;
  formalName?: string;
  level?: string;
  npsn: string;
  nsm?: string;
  accreditation: string;
  foundedYear?: string;
  address: string;
  district?: string;
  regency?: string;
  province?: string;
  phone: string;
  whatsapp?: string;
  email: string;
}

const defaultProfile: FooterProfile = {
  name: 'MAS Raudhatul Hidayah',
  formalName: 'Madrasah Aliyah Swasta Raudhatul Hidayah',
  level: 'Madrasah Aliyah (MA)',
  npsn: '6994888',
  nsm: '131236030045',
  accreditation: 'C',
  foundedYear: '2012',
  address: 'Jl. Raya Tanjung Kait No. 33, RT 02 / RW 01, Mauk, Kabupaten Tangerang, Banten 15330',
  district: 'Mauk',
  regency: 'Kabupaten Tangerang',
  province: 'Banten',
  phone: '0817-6614-723',
  whatsapp: '628176614723',
  email: 'info@maraudhatulhidayah.sch.id',
};

export function StitchFooter() {
  const [profile, setProfile] = useState<FooterProfile>(defaultProfile);

  useEffect(() => {
    fetch('/api/profile', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.profile) {
          setProfile((prev) => ({
            ...prev,
            ...data.profile,
            accreditation: data.profile.accreditation || prev.accreditation,
            npsn: data.profile.npsn || prev.npsn,
          }));
        }
      })
      .catch((err) => console.warn('Could not fetch footer profile:', err));
  }, []);

  return (
    <footer className="w-full bg-[#1e4ed8] text-white border-t-[4px] border-[#facc15] relative overflow-hidden">
      {/* Decorative ambient glow for spatial depth */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-white/15">
          {/* Kolom 1: Profil Lembaga (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <div className="flex items-center gap-3.5">
              <div className="relative w-12 h-12 shrink-0 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-1.5 flex items-center justify-center transition-transform duration-200 hover:scale-105 shadow-sm">
                <Image
                  src="/school-logo.png"
                  alt="Logo MAS Raudhatul Hidayah"
                  width={42}
                  height={42}
                  className="object-contain drop-shadow-sm"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-[20px] font-bold text-white tracking-wide leading-tight">
                  {profile.name}
                </span>
                <span className="text-[11px] text-[#facc15] uppercase tracking-widest font-bold">
                  {profile.formalName || 'Madrasah Aliyah Swasta Raudhatul Hidayah'}
                </span>
              </div>
            </div>

            <p className="font-sans text-[13.5px] text-white/80 leading-relaxed max-w-sm">
              Lembaga pendidikan formal terpadu yang membina generasi remaja usia transisi dengan perpaduan adab luhur, nilai kepesantrenan, dan Kurikulum Merdeka yang adaptif.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#eab308]/20 text-[#facc15] border border-[#facc15]/40 rounded-full text-[11.5px] font-bold backdrop-blur-sm shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#facc15]" />
                <span>{profile.accreditation.startsWith('Akreditasi') ? profile.accreditation : `Akreditasi ${profile.accreditation}`}</span>
              </span>
              <span className="inline-flex items-center px-3 py-1 bg-white/10 text-white border border-white/20 rounded-full text-[11.5px] font-semibold font-mono backdrop-blur-sm shadow-2xs">
                NPSN: {profile.npsn}
              </span>
              {profile.nsm && (
                <span className="inline-flex items-center px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 rounded-full text-[11.5px] font-semibold font-mono backdrop-blur-sm shadow-2xs">
                  NSM: {profile.nsm}
                </span>
              )}
            </div>
          </div>

          {/* Kolom 2: Profil & Akademik (3 Cols) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div>
              <h4 className="font-sans font-extrabold text-[15px] text-[#facc15] uppercase tracking-wider inline-block">
                Profil &amp; Akademik
              </h4>
              <div className="w-8 h-[2.5px] bg-[#facc15] rounded-full mt-1.5" />
            </div>
            <ul className="flex flex-col gap-2.5 font-sans text-[13px]">
              <li>
                <Link
                  href="/profil/visi-misi"
                  className="text-white/80 hover:text-white transition-all flex items-center justify-between group"
                >
                  <span className="group-hover:text-amber-200 group-hover:translate-x-1 transition-all">Visi &amp; Misi Sekolah</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#facc15]" />
                </Link>
              </li>
              <li>
                <Link
                  href="/profil/guru-tendik"
                  className="text-white/80 hover:text-white transition-all flex items-center justify-between group"
                >
                  <span className="group-hover:text-amber-200 group-hover:translate-x-1 transition-all">Guru &amp; Staf</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#facc15]" />
                </Link>
              </li>
              <li>
                <Link
                  href="/akademik/kurikulum"
                  className="text-white/80 hover:text-white transition-all flex items-center justify-between group"
                >
                  <span className="group-hover:text-amber-200 group-hover:translate-x-1 transition-all">Kurikulum &amp; Mata Pelajaran</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#facc15]" />
                </Link>
              </li>
              <li>
                <Link
                  href="#agenda"
                  className="text-white/80 hover:text-white transition-all flex items-center justify-between group"
                >
                  <span className="group-hover:text-amber-200 group-hover:translate-x-1 transition-all">Kalender &amp; Agenda Akademik</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#facc15]" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Kesiswaan & Prestasi (2 Cols) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div>
              <h4 className="font-sans font-extrabold text-[15px] text-[#facc15] uppercase tracking-wider inline-block">
                Kesiswaan
              </h4>
              <div className="w-8 h-[2.5px] bg-[#facc15] rounded-full mt-1.5" />
            </div>
            <ul className="flex flex-col gap-2.5 font-sans text-[13px]">
              <li>
                <Link href="/akademik/ekstrakurikuler" className="text-white/80 hover:text-amber-200 hover:translate-x-1 transition-all inline-block">
                  Pramuka Penegak
                </Link>
              </li>
              <li>
                <Link href="/akademik/ekstrakurikuler" className="text-white/80 hover:text-amber-200 hover:translate-x-1 transition-all inline-block">
                  PMR &amp; UKS
                </Link>
              </li>
              <li>
                <Link href="/akademik/ekstrakurikuler" className="text-white/80 hover:text-amber-200 hover:translate-x-1 transition-all inline-block">
                  Paskibra MA
                </Link>
              </li>
              <li>
                <Link href="/prestasi" className="text-white/80 hover:text-amber-200 hover:translate-x-1 transition-all inline-block">
                  Galeri Prestasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Sekretariat & Lokasi (3 Cols) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div>
              <h4 className="font-sans font-extrabold text-[15px] text-[#facc15] uppercase tracking-wider inline-block">
                Sekretariat Sekolah
              </h4>
              <div className="w-8 h-[2.5px] bg-[#facc15] rounded-full mt-1.5" />
            </div>
            <div className="flex flex-col gap-3 font-sans text-[13px] text-white/85">
              {/* 1. WhatsApp */}
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-emerald-300 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.777.784 2.791.784 3.181 0 5.767-2.587 5.768-5.766.001-3.181-2.585-5.77-5.768-5.77zm3.377 8.215c-.145.408-.838.777-1.157.828-.319.052-.734.075-2.383-.605-1.986-.818-3.256-2.839-3.355-2.971-.099-.133-.805-1.072-.805-2.046 0-.974.509-1.453.69-1.649.182-.196.398-.245.53-.245s.266.005.383.011c.124.006.29-.047.453.346.166.399.566 1.383.616 1.483.05.1.083.217.017.35-.067.133-.1.217-.199.333-.1.117-.209.261-.299.35-.1.1-.205.209-.089.408.117.2 0.518.855 1.11 1.382.763.679 1.405.889 1.605.989.2.1.317.083.433-.05.117-.133.5-.583.633-.783.133-.2.267-.167.45-.1.183.067 1.166.55 1.366.65.2.1.333.15.383.233.05.083.05.483-.095.891z"/>
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.98-1.393A9.953 9.953 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2a8.167 8.167 0 0 1-4.223-1.167l-.303-.18-3.132.875.836-3.05-.198-.315A8.166 8.166 0 0 1 3.8 12c0-4.522 3.678-8.2 8.2-8.2s8.2 3.678 8.2 8.2-3.678 8.2-8.2 8.2z" />
                  </svg>
                </div>
                <a
                  href={`https://wa.me/${profile.whatsapp || '628176614723'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#facc15] transition-colors text-white font-bold"
                >
                  {profile.phone}
                </a>
              </div>

              {/* 2. Alamat */}
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#facc15]" />
                </div>
                <a
                  href="https://maps.app.goo.gl/4dKTkXuw5VBhmgACA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="leading-relaxed hover:text-[#facc15] transition-colors text-white/80"
                >
                  {profile.address.includes('Mauk') ? profile.address : `${profile.address}, ${profile.district || 'Mauk'}, ${profile.regency || 'Kabupaten Tangerang'}, ${profile.province || 'Banten'}`}
                </a>
              </div>

              {/* 3. Email */}
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                  <Mail className="w-3.5 h-3.5 text-[#facc15]" />
                </div>
                <a
                  href={`mailto:${profile.email}`}
                  className="hover:text-[#facc15] transition-colors text-white/80"
                >
                  {profile.email}
                </a>
              </div>

              {/* 4. Instagram */}
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-pink-500/20 border border-pink-400/30 flex items-center justify-center shrink-0">
                  <Instagram className="w-3.5 h-3.5 text-pink-300" />
                </div>
                <a
                  href="https://instagram.com/maraudhatulhidayah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#facc15] transition-colors text-white/80"
                >
                  maraudhatulhidayah
                </a>
              </div>

              {/* 5. TikTok */}
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-white fill-current" viewBox="0 0 24 24">
                    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.068-.1a2.89 2.89 0 0 1 2.373-4.537c.314 0 .618.05.903.144V9.414a6.334 6.334 0 0 0-.903-.065A6.334 6.334 0 0 0 3.144 15.68a6.334 6.334 0 0 0 6.334 6.334 6.334 6.334 0 0 0 6.334-6.334V8.583a8.17 8.17 0 0 0 4.777 1.549V6.686h-1Z" />
                  </svg>
                </div>
                <a
                  href="https://tiktok.com/@maraudhatulhidayah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#facc15] transition-colors text-white/80"
                >
                  MAS Raudhatul Hidayah
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-[12.5px] text-white/70">
          <p>© 2026 MAS Raudhatul Hidayah. Seluruh Hak Cipta Dilindungi.</p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link
              href="/admin"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 rounded-lg bg-[#facc15] text-slate-950 font-bold hover:bg-amber-300 transition-colors shadow-2xs"
            >
              Portal Masuk
            </Link>
            <span className="text-white/20">|</span>
            <Link href="/profil" className="hover:text-white transition-colors">
              Profil
            </Link>
            <a
              href="https://maps.app.goo.gl/4dKTkXuw5VBhmgACA"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Peta Lokasi Google Maps
            </a>
            <span className="text-white/20">|</span>
            <span className="text-white/60">Kabupaten Tangerang, Banten</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
