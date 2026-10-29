'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  date: string;
  image: string;
  excerpt: string;
  href: string;
}

const newsList: NewsItem[] = [
  {
    id: '1',
    title: 'Pekan Gelar Karya Projek Penguatan Profil Pelajar Pancasila (P5) dan Kewirausahaan Siswa',
    date: '18 Okt 2026',
    image: '/kelas.jpeg',
    excerpt: 'Santri jenjang kelas VII hingga IX memamerkan kreasi kolaboratif berbasis kearifan lokal pesisir Mauk dan kepedulian lingkungan hidup.',
    href: '/warta/gelar-karya-p5-ppra-kearifan-lokal',
  },
  {
    id: '2',
    title: 'Torehan Juara Kompetisi Sains Madrasah (KSM) dan Turnamen Olahraga Pelajar Tingkat Kabupaten',
    date: '12 Okt 2026',
    image: '/piala.jpeg',
    excerpt: 'Kebanggaan madrasah atas dedikasi dan kerja keras santri di bidang sains terapan, olimpiade matematika, dan turnamen futsal pelajar.',
    href: '/prestasi',
  },
  {
    id: '3',
    title: 'Pemberdayaan Perpustakaan Madrasah & Pojok Literasi Digital Remaja Menyongsong Kurikulum Merdeka',
    date: '05 Okt 2026',
    image: '/perpus2.jpeg',
    excerpt: 'Penambahan ratusan koleksi referensi Kurikulum Merdeka Fase D guna mengasah minat baca santri sejak usia dini.',
    href: '/warta',
  },
  {
    id: '4',
    title: 'Latihan Dasar Kepemimpinan Penggalang (LDKP) dan Kemah Bhakti Silaturahmi Warga Mauk',
    date: '28 Sep 2026',
    image: '/hero/slide-3.jpg',
    excerpt: 'Melatih kemandirian, ketangkasan regu, dan rasa peduli sosial melalui kegiatan perkemahan sabtu-minggu dan aksi bakti kebersihan lingkungan.',
    href: '/akademik/ekstrakurikuler',
  },
  {
    id: '5',
    title: 'Peringatan Maulid Nabi Muhammad SAW: Meneladani Adab dan Akhlak Rasulullah dalam Menuntut Ilmu',
    date: '16 Sep 2026',
    image: '/hero/slide-2.jpg',
    excerpt: 'Ratusan santri dan dewan guru larut dalam lantunan shalawat serta tausiyah pembinaan adab keseharian di lingkungan madrasah.',
    href: '/warta/peringatan-maulid-nabi-dan-pengajian-akbar',
  },
  {
    id: '6',
    title: 'Sosialisasi Persiapan Asesmen Akhir & Bimbingan Studi Lanjut ke Jenjang SMA / SMK / MA Favorit',
    date: '08 Sep 2026',
    image: '/hero/slide-1.jpg',
    excerpt: 'Pendampingan intensif bagi siswa kelas IX dalam pemetaan minat bakat jurusan, simulasi ujian, dan konsultasi pendaftaran sekolah favorit.',
    href: '/warta/sosialisasi-studi-lanjut-sma-smk-ma',
  },
];

export function NewsCarouselSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<NewsItem[]>(newsList);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    async function fetchLatestNews() {
      try {
        const res = await fetch('/api/articles', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json) && json.length > 0) {
            const mapped: NewsItem[] = json.map((art: any) => ({
              id: art.id || art.slug,
              title: art.title,
              date: art.date || 'Terbaru',
              image: art.imageUrl || art.cover_image || '/foto-juara.jpeg',
              excerpt: art.summary || art.excerpt || (art.content ? art.content.slice(0, 130) + '...' : ''),
              href: `/warta/${art.slug}`,
            }));
            setItems(mapped);
          }
        }
      } catch (err) {
        console.warn('Fallback to default news list:', err);
      }
    }
    fetchLatestNews();

    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const cardWidth = 380;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -cardWidth : cardWidth,
      behavior: 'smooth',
    });
  };

  // Mouse Drag to Scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsMouseDown(true);
    setHasDragged(false);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.4;
    if (Math.abs(walk) > 5) {
      setHasDragged(true);
    }
    scrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  return (
    <section className="py-20 sm:py-28 bg-[#fbfbfa] relative border-b border-slate-200/80 overflow-hidden" id="agenda">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with Navigation Controls */}
        <div className="mb-10 sm:mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="mb-1.5">
              <h2 className="font-serif text-[28px] sm:text-[38px] font-bold text-slate-900 tracking-tight leading-tight">
                Berita &amp; Agenda
              </h2>
            </div>
            <p className="font-sans text-[13.5px] text-slate-500 tracking-wide font-medium mt-1">
              Pusat informasi, warta prestasi, dan kabar kegiatan terbaru seputar MAS Raudhatul Hidayah
            </p>
          </div>

          {/* Slider Prev & Next Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="p-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white text-slate-700 hover:text-blue-700 transition-all shadow-2xs active:scale-95"
              aria-label="Geser ke Berita Sebelumnya"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="p-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white text-slate-700 hover:text-blue-700 transition-all shadow-2xs active:scale-95"
              aria-label="Geser ke Berita Berikutnya"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slidable News Cards Track (Scrollable & Draggable like Reference Image 1) */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex gap-6 overflow-x-auto scrollbar-none scroll-smooth snap-x snap-mandatory py-4 px-1 cursor-grab active:cursor-grabbing select-none`}
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="w-[300px] sm:w-[350px] lg:w-[370px] shrink-0 snap-start flex flex-col"
            >
              <Link
                href={item.href}
                onClick={(e) => {
                  if (hasDragged) e.preventDefault();
                }}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full overflow-hidden group"
              >
                {/* Photo Header (Aspect Ratio 16:10 with smooth zoom) */}
                <div className="relative overflow-hidden bg-slate-100 aspect-[16/10] w-full shrink-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Card Body (Calendar Icon + Date, Bold Sans-serif Title, Excerpt - Exactly as Reference 1) */}
                <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between bg-white">
                  <div>
                    {/* Date with Calendar Icon */}
                    <div className="flex items-center gap-2 text-slate-500 mb-2.5">
                      <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                      <span className="font-sans text-[12.5px] font-medium text-slate-500 tracking-wide">
                        {item.date}
                      </span>
                    </div>

                    {/* Bold Sans-Serif Title (Matching Image 1) */}
                    <h3 className="font-sans font-bold text-[16.5px] sm:text-[18px] text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-3 leading-snug">
                      {item.title}
                    </h3>

                    {/* Excerpt Snippet (Matching Image 1) */}
                    <p className="font-sans text-[13px] sm:text-[13.5px] text-slate-500 leading-relaxed line-clamp-3 mt-2.5">
                      {item.excerpt}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom Pill CTA Button: "Lihat Semua Berita ->" (Matching Image 1) */}
        <div className="flex justify-center mt-10">
          <Link
            href="/warta"
            className="inline-flex items-center gap-2.5 px-8 py-3 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50/80 text-[13.5px] font-semibold transition-all duration-200 group shadow-2xs active:scale-[0.98]"
          >
            <span>Lihat Semua Berita</span>
            <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
