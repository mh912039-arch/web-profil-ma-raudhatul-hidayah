import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, ShieldCheck, ExternalLink } from 'lucide-react';
import { schoolData } from '@/data/mockSchoolData';

export const EditorialFooter: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Identity & Official Info (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-white/10 p-2 border border-white/15 flex items-center justify-center flex-shrink-0">
                <img
                  src="/school-logo.png"
                  alt="Logo MAS Raudhatul Hidayah"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-lg text-white tracking-wide group-hover:text-amber-400 transition-colors">
                  MAS RAUDHATUL HIDAYAH
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  Kecamatan Mauk, Kabupaten Tangerang
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Lembaga pendidikan formal tingkat Madrasah Aliyah (MA) yang memadukan Kurikulum Merdeka nasional, pembinaan karakter & adab islami, serta bimbingan kesiapan menuju SMA/SMK/MA favorit.
            </p>

            {/* Badges */}
            <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{schoolData.profile.accreditation}</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 font-mono text-[11px]">
                NPSN: {schoolData.profile.npsn}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 font-mono text-[11px]">
                NSM: {schoolData.profile.nsm}
              </span>
            </div>

            {/* Contact Brief */}
            <div className="pt-2 space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {schoolData.profile.address}, {schoolData.profile.city}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>{schoolData.profile.phone} (Telepon & WA)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>{schoolData.profile.email}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Tentang Kami (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Tentang Kami
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <Link href="/profil" className="hover:text-amber-400 transition-colors">
                  Profil Sekolah
                </Link>
              </li>
              <li>
                <Link href="/profil#sambutan" className="hover:text-amber-400 transition-colors">
                  Sambutan Kepala Sekolah
                </Link>
              </li>
              <li>
                <Link href="/profil#sejarah" className="hover:text-amber-400 transition-colors">
                  Sejarah & Perjalanan
                </Link>
              </li>
              <li>
                <Link href="/profil#guru" className="hover:text-amber-400 transition-colors">
                  Guru & Staf
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Program & Siswa (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Akademik & Siswa
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <Link href="/akademik" className="hover:text-amber-400 transition-colors">
                  Kurikulum Merdeka SMP
                </Link>
              </li>
              <li>
                <Link href="/akademik#program-smp" className="hover:text-amber-400 transition-colors">
                  Projek Profil Pelajar (P5)
                </Link>
              </li>
              <li>
                <Link href="/akademik#fasilitas" className="hover:text-amber-400 transition-colors">
                  Perpustakaan & Khazanah Turots
                </Link>
              </li>
              <li>
                <Link href="/kesiswaan" className="hover:text-amber-400 transition-colors">
                  Kesiswaan & Ekstrakurikuler
                </Link>
              </li>
              <li>
                <Link href="/prestasi" className="hover:text-amber-400 transition-colors">
                  Prestasi Siswa
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Lokasi & Navigasi (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Peta Lokasi
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Kampus berlokasi strategis di Jl. Raya Tanjung Kait, Desa Tanjung Anom, Kec. Mauk.
            </p>
            <div className="pt-1">
              <a
                href="https://maps.app.goo.gl/4dKTkXuw5VBhmgACA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
              >
                <span>Buka Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="pt-2 text-[11px] text-slate-500 font-mono">
              Operasional: Senin - Sabtu (07.00 - 15.30 WIB)
            </div>
          </div>

        </div>

        {/* Bottom Institutional Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <div>
            &copy; {new Date().getFullYear()} MAS Raudhatul Hidayah. Seluruh hak cipta dilindungi.
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Kecamatan Mauk, Kabupaten Tangerang</span>
            <span>·</span>
            <span className="text-amber-400">Akreditasi A</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
