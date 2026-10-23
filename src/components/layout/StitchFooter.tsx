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
  level: 'Sekolah Menengah Pertama (SMP) / MA',
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
    <footer className="w-full bg-[#f8fafc] text-slate-600 border-t-[5px] border-amber-500 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-slate-200/80">
          {/* Kolom 1: Profil Lembaga (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <div className="flex items-center gap-3.5">
              <div className="relative w-12 h-12 shrink-0 flex items-center justify-center transition-transform duration-200 hover:scale-105">
                <Image
                  src="/school-logo.png"
                  alt="Logo MAS Raudhatul Hidayah"
                  width={46}
                  height={46}
                  className="object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-[20px] font-bold text-slate-900 tracking-wide leading-tight">
                  {profile.name}
                </span>
                <span className="text-[11px] text-blue-700 uppercase tracking-widest font-semibold">
                  {profile.formalName || 'Madrasah Aliyah Swasta Raudhatul Hidayah'}
                </span>
              </div>
            </div>

            <p className="font-sans text-[13.5px] text-slate-600 leading-relaxed max-w-sm">
              Lembaga pendidikan formal terpadu yang membina generasi remaja usia transisi dengan perpaduan adab luhur, nilai kepesantrenan, dan Kurikulum Merdeka yang adaptif.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-300/80 rounded-full text-[11.5px] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>{profile.accreditation.startsWith('Akreditasi') ? profile.accreditation : `Akreditasi ${profile.accreditation}`}</span>
              </span>
              <span className="inline-flex items-center px-3 py-1 bg-white text-slate-700 border border-slate-200 rounded-full text-[11.5px] font-semibold shadow-2xs font-mono">
                NPSN: {profile.npsn}
              </span>
              {profile.nsm && (
                <span className="inline-flex items-center px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded-full text-[11.5px] font-semibold font-mono">
                  NSM: {profile.nsm}
                </span>
              )}
            </div>
          </div>

          {/* Kolom 2: Profil & Akademik (3 Cols) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div>
              <h4 className="font-serif text-[15px] font-bold text-slate-900 uppercase tracking-wider inline-block">
                Profil &amp; Akademik
              </h4>
              <div className="w-8 h-[2.5px] bg-amber-500 rounded-full mt-1.5" />
            </div>
            <ul className="flex flex-col gap-2.5 font-sans text-[13px]">
              <li>
                <Link
                  href="/profil/visi-misi"
                  className="text-slate-600 hover:text-blue-700 transition-colors flex items-center justify-between group"
                >
                  <span>Visi &amp; Misi Sekolah</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600" />
                </Link>
              </li>
              <li>
                <Link
                  href="/profil/guru-tendik"
                  className="text-slate-600 hover:text-blue-700 transition-colors flex items-center justify-between group"
                >
                  <span>Guru &amp; Staf</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600" />
                </Link>
              </li>
              <li>
                <Link
                  href="/akademik/kurikulum"
                  className="text-slate-600 hover:text-blue-700 transition-colors flex items-center justify-between group"
                >
                  <span>Kurikulum &amp; Mata Pelajaran</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600" />
                </Link>
              </li>
              <li>
                <Link
                  href="#agenda"
                  className="text-slate-600 hover:text-blue-700 transition-colors flex items-center justify-between group"
                >
                  <span>Kalender &amp; Agenda Akademik</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Kesiswaan & Prestasi (2 Cols) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div>
              <h4 className="font-serif text-[15px] font-bold text-slate-900 uppercase tracking-wider inline-block">
                Kesiswaan
              </h4>
              <div className="w-8 h-[2.5px] bg-amber-500 rounded-full mt-1.5" />
            </div>
            <ul className="flex flex-col gap-2.5 font-sans text-[13px]">
              <li>
                <Link href="/akademik/ekstrakurikuler" className="text-slate-600 hover:text-blue-700 transition-colors">
                  Pramuka Penegak
                </Link>
              </li>
              <li>
                <Link href="/akademik/ekstrakurikuler" className="text-slate-600 hover:text-blue-700 transition-colors">
                  PMR &amp; UKS
                </Link>
              </li>
              <li>
                <Link href="/akademik/ekstrakurikuler" className="text-slate-600 hover:text-blue-700 transition-colors">
                  Paskibra MA
                </Link>
              </li>
              <li>
                <Link href="/prestasi" className="text-slate-600 hover:text-blue-700 transition-colors">
                  Galeri Prestasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Sekretariat & Lokasi (3 Cols) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div>
              <h4 className="font-serif text-[15px] font-bold text-slate-900 uppercase tracking-wider inline-block">
                Sekretariat Sekolah
              </h4>
              <div className="w-8 h-[2.5px] bg-amber-500 rounded-full mt-1.5" />
            </div>
            <div className="flex flex-col gap-2.5 font-sans text-[13px] text-slate-600">
              {/* 1. WhatsApp */}
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-emerald-600 shrink-0 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.777.784 2.791.784 3.181 0 5.767-2.587 5.768-5.766.001-3.181-2.585-5.77-5.768-5.77zm3.377 8.215c-.145.408-.838.777-1.157.828-.319.052-.734.075-2.383-.605-1.986-.818-3.256-2.839-3.355-2.971-.099-.133-.805-1.072-.805-2.046 0-.974.509-1.453.69-1.649.182-.196.398-.245.53-.245s.266.005.383.011c.124.006.29-.047.453.346.166.399.566 1.383.616 1.483.05.1.083.217.017.35-.067.133-.1.217-.199.333-.1.117-.209.261-.299.35-.1.1-.205.209-.089.408.117.2 0.518.855 1.11 1.382.763.679 1.405.889 1.605.989.2.1.317.083.433-.05.117-.133.5-.583.633-.783.133-.2.267-.167.45-.1.183.067 1.166.55 1.366.65.2.1.333.15.383.233.05.083.05.483-.095.891z"/>
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.98-1.393A9.953 9.953 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2a8.167 8.167 0 0 1-4.223-1.167l-.303-.18-3.132.875.836-3.05-.198-.315A8.166 8.166 0 0 1 3.8 12c0-4.522 3.678-8.2 8.2-8.2s8.2 3.678 8.2 8.2-3.678 8.2-8.2 8.2z" />
                </svg>
                <a
                  href={`https://wa.me/${profile.whatsapp || '628176614723'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-700 transition-colors text-slate-800 font-semibold"
                >
                  {profile.phone}
                </a>
              </div>

              {/* 2. Alamat */}
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <a
                  href="https://maps.app.goo.gl/4dKTkXuw5VBhmgACA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="leading-relaxed hover:text-blue-700 transition-colors"
                >
                  {profile.address.includes('Mauk') ? profile.address : `${profile.address}, ${profile.district || 'Mauk'}, ${profile.regency || 'Kabupaten Tangerang'}, ${profile.province || 'Banten'}`}
                </a>
              </div>

              {/* 3. Email */}
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                <a
                  href={`mailto:${profile.email}`}
                  className="hover:text-blue-700 transition-colors"
                >
                  {profile.email}
                </a>
              </div>

              {/* 4. Instagram */}
              <div className="flex items-center gap-2.5">
                <Instagram className="w-4 h-4 text-pink-600 shrink-0" />
                <a
                  href="https://instagram.com/maraudhatulhidayah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-700 transition-colors"
                >
                  maraudhatulhidayah
                </a>
              </div>

              {/* 5. TikTok */}
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-slate-900 shrink-0 fill-current" viewBox="0 0 24 24">
                  <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.068-.1a2.89 2.89 0 0 1 2.373-4.537c.314 0 .618.05.903.144V9.414a6.334 6.334 0 0 0-.903-.065A6.334 6.334 0 0 0 3.144 15.68a6.334 6.334 0 0 0 6.334 6.334 6.334 6.334 0 0 0 6.334-6.334V8.583a8.17 8.17 0 0 0 4.777 1.549V6.686h-1Z" />
                </svg>
                <a
                  href="https://tiktok.com/@maraudhatulhidayah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-700 transition-colors"
                >
                  MAS Raudhatul Hidayah
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-[12.5px] text-slate-500">
          <p>© 2026 MAS Raudhatul Hidayah. Seluruh Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 font-semibold hover:underline transition-colors"
            >
              Portal Masuk
            </Link>
            <span className="text-slate-300">|</span>
            <Link href="/profil" className="hover:text-slate-800 transition-colors">
              Profil
            </Link>
            <a
              href="https://maps.app.goo.gl/4dKTkXuw5VBhmgACA"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-800 transition-colors"
            >
              Peta Lokasi Google Maps
            </a>
            <span className="text-slate-300">|</span>
            <span>Kabupaten Tangerang, Banten</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
