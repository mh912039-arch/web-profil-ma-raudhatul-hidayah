import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { schoolData } from '@/data/mockSchoolData';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-900 text-stone-200 pt-16 pb-10 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Footer Grid matching Figma */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-navy-800/80">
          
          {/* Col 1: Identity & Official Info (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-white/10 p-2 border border-white/15 flex items-center justify-center flex-shrink-0">
                <img
                  src="/school-logo.png"
                  alt="Logo MA Raudlatul Hidayah"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-lg text-white tracking-wide">
                  MA RAUDLATUL HIDAYAH
                </span>
                <span className="text-[11px] text-stone-400 font-medium">
                  Kecamatan Mauk, Kabupaten Tangerang
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-sm">
              Lembaga pendidikan Islam tingkat Madrasah Aliyah (MA) yang memadukan Kurikulum Merdeka, pembentukan karakter dan adab islami, serta bimbingan kesiapan menuju perguruan tinggi dan kemandirian masa depan.
            </p>

            {/* Badges */}
            <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{schoolData.profile.accreditation}</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-stone-300 font-mono text-[11px]">
                NPSN: {schoolData.profile.npsn}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-stone-300 font-mono text-[11px]">
                NSM: {schoolData.profile.nsm}
              </span>
            </div>

            {/* Address & Contact Brief */}
            <div className="pt-3 space-y-2 text-xs text-stone-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {schoolData.profile.address}, {schoolData.profile.city}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{schoolData.profile.phone} (Telepon & WA)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{schoolData.profile.email}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Tentang Kami (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Tentang Kami
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-stone-300">
              <li>
                <Link href="/profil" className="hover:text-emerald-400 transition-colors">
                  Profil Sekolah
                </Link>
              </li>
              <li>
                <Link href="/profil#sambutan" className="hover:text-emerald-400 transition-colors">
                  Sambutan Kepala Sekolah
                </Link>
              </li>
              <li>
                <Link href="/profil#sejarah" className="hover:text-emerald-400 transition-colors">
                  Sejarah & Visi Misi
                </Link>
              </li>
              <li>
                <Link href="/profil#fasilitas" className="hover:text-emerald-400 transition-colors">
                  Sarana & Fasilitas
                </Link>
              </li>
              <li>
                <Link href="/profil#guru" className="hover:text-emerald-400 transition-colors">
                  Guru & Staf
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Program & Siswa (2.5 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Akademik & Siswa
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-stone-300">
              <li>
                <Link href="/akademik" className="hover:text-emerald-400 transition-colors">
                  Kurikulum Merdeka SMP
                </Link>
              </li>
              <li>
                <Link href="/akademik#program-smp" className="hover:text-emerald-400 transition-colors">
                  Projek Penguatan Karakter (P5)
                </Link>
              </li>
              <li>
                <Link href="/akademik#fasilitas" className="hover:text-emerald-400 transition-colors">
                  Perpustakaan & Khazanah Turots
                </Link>
              </li>
              <li>
                <Link href="/kesiswaan" className="hover:text-emerald-400 transition-colors">
                  Kesiswaan & Ekstrakurikuler
                </Link>
              </li>
              <li>
                <Link href="/prestasi" className="hover:text-emerald-400 transition-colors">
                  Prestasi Siswa
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Informasi & Bantuan (2.5 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Informasi
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-stone-300">
              <li>
                <Link href="/warta" className="hover:text-emerald-400 transition-colors">
                  Warta Berita Terkini
                </Link>
              </li>
              <li>
                <Link href="/galeri" className="hover:text-emerald-400 transition-colors">
                  Dokumentasi Foto
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="hover:text-emerald-400 transition-colors">
                  Peta Lokasi & Denah
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="hover:text-emerald-400 transition-colors">
                  Kontak Sekretariat
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar matching Figma */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>
            © {new Date().getFullYear()} MA Raudlatul Hidayah. Seluruh hak cipta dilindungi undang-undang.
          </p>
          <div className="flex items-center gap-6 text-stone-400">
            <span>Kementerian Agama RI</span>
            <span>•</span>
            <Link href="/kontak" className="hover:text-white transition-colors">
              Peta Lokasi Google Maps
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
