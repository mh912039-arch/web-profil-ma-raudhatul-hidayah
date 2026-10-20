'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { StitchNavbar } from '@/components/layout/StitchNavbar';
import { StitchFooter } from '@/components/layout/StitchFooter';
import { schoolData } from '@/data/mockSchoolData';

export default function WartaPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const itemsPerPage = 6;
  const [allArticles, setAllArticles] = useState(schoolData.news);

  useEffect(() => {
    async function fetchLiveArticles() {
      try {
        const res = await fetch('/api/articles', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json) && json.length > 0) {
            setAllArticles(json);
          }
        }
      } catch (err) {
        console.warn('Fallback to mock articles:', err);
      }
    }
    fetchLiveArticles();
  }, []);

  // Track scroll position for floating back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Categories dynamically calculated from articles
  const categoriesList = [
    { name: 'Semua Kategori', filterKey: 'Semua', count: allArticles.length },
    { name: 'Berita Utama', filterKey: 'Berita Utama', count: allArticles.filter((a) => a.category === 'Berita Utama').length },
    { name: 'Berita Sekolah', filterKey: 'Berita Sekolah', count: allArticles.filter((a) => a.category === 'Berita Sekolah').length },
    { name: 'Artikel', filterKey: 'Artikel', count: allArticles.filter((a) => a.category === 'Artikel').length },
    { name: 'Kegiatan', filterKey: 'Kegiatan', count: allArticles.filter((a) => a.category.toLowerCase() === 'kegiatan').length },
    { name: 'Prestasi', filterKey: 'Prestasi', count: allArticles.filter((a) => a.category === 'Prestasi').length },
  ];

  // Popular tags
  const popularTags = [
    'Berita Utama',
    'Prestasi',
    'Kurikulum Merdeka',
    'Santri Berkarakter',
    'LDK OSIS',
    'Tahfidz',
    'P5-PPRA',
    'Literasi Era AI',
    'Kemenag Banten',
    'Ekstrakurikuler',
  ];

  // Filter articles based on category, tag, and search query
  const filteredArticles = allArticles.filter((article) => {
    // Category match
    const matchesCategory =
      selectedCategory === 'Semua' ||
      (article.category && article.category.toLowerCase() === selectedCategory.toLowerCase());

    // Tag match
    const matchesTag =
      !selectedTag ||
      (Array.isArray(article.tags) && article.tags.some((t) => t.toLowerCase().includes(selectedTag.toLowerCase()))) ||
      (article.category && article.category.toLowerCase().includes(selectedTag.toLowerCase()));

    // Search query match
    const matchesQuery =
      !searchQuery.trim() ||
      (article.title && article.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (article.summary && article.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (article.category && article.category.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesTag && matchesQuery;
  });

  // Calculate pagination numbers
  const totalDisplayResults = filteredArticles.length;
  const totalPages = Math.max(1, Math.ceil(totalDisplayResults / itemsPerPage));

  // Determine current page items
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentArticles = filteredArticles.slice(startIndex, startIndex + itemsPerPage);

  const displayedStart = totalDisplayResults === 0 ? 0 : startIndex + 1;
  const displayedEnd = Math.min(startIndex + itemsPerPage, totalDisplayResults);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 350, behavior: 'smooth' });
    }
  };

  const handleCategorySelect = (catKey: string) => {
    setSelectedCategory(catKey);
    setSelectedTag(null);
    setCurrentPage(1);
  };

  const handleTagSelect = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tag);
      setSelectedCategory('Semua');
    }
    setCurrentPage(1);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#f8fafc] font-sans text-slate-800">
      <StitchNavbar />

      <main className="w-full pt-20 flex-grow">
        {/* Header Section */}
        <section className="relative w-full bg-white border-b border-slate-200/90 py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="font-serif text-[30px] sm:text-[42px] font-bold text-slate-900 tracking-tight leading-tight">
                Portal Berita &amp; Artikel
              </h1>
              <p className="font-sans text-[15px] sm:text-[16px] text-slate-600 mt-2 leading-relaxed">
                Publikasi berkala seputar dinamika madrasah, prestasi santri, agenda kegiatan keislaman, dan siaran pengumuman resmi kelembagaan.
              </p>
            </div>
          </div>
        </section>

        {/* 2-Column Main Layout: News Grid (Left) + Sidebar (Right) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: News Card Grid & Pagination (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-10">
              
              {/* News Grid (2 columns on tablet/desktop) */}
              {currentArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentArticles.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-lg border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                    >
                      <div>
                        {/* Image Container with Badges */}
                        <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100">
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          />
                          {/* Category Badge: Blue Pill Top-Left */}
                          <div className="absolute top-3 left-3 bg-blue-600 text-white text-[12px] font-bold px-3 py-1 rounded shadow-sm tracking-wide">
                            {item.category === 'Artikel' ? 'Artikel' : 'Berita'}
                          </div>

                          {/* Subtle Date Overlay in Image Bottom-Right */}
                          <div className="absolute bottom-2.5 right-3 text-white text-[11px] font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]">
                            {item.date}
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-5 pb-2">
                          {/* Meta Row: Date & Administrator */}
                          <div className="flex items-center gap-2 text-[12px] text-slate-500 font-medium mb-2.5">
                            <span className="flex items-center gap-1.5">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="shrink-0 text-slate-400"
                              >
                                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                                <line x1="16" x2="16" y1="2" y2="6" />
                                <line x1="8" x2="8" y1="2" y2="6" />
                                <line x1="3" x2="21" y1="10" y2="10" />
                              </svg>
                              <span>{item.date}</span>
                            </span>
                            <span className="text-slate-300">|</span>
                            <span className="flex items-center gap-1.5">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="shrink-0 text-slate-400"
                              >
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                              </svg>
                              <span>{item.author || 'Administrator'}</span>
                            </span>
                          </div>

                          {/* Title in Vibrant Blue */}
                          <Link href={`/warta/${item.slug}`}>
                            <h3 className="font-sans text-[17px] font-bold text-blue-600 hover:text-blue-800 transition-colors leading-snug line-clamp-3 hover:underline">
                              {item.title}
                            </h3>
                          </Link>
                        </div>
                      </div>

                      {/* Card Footer: Baca Selengkapnya in Amber */}
                      <div className="px-5 pb-5 pt-2">
                        <Link
                          href={`/warta/${item.slug}`}
                          className="inline-flex items-center gap-1.5 text-amber-500 hover:text-amber-600 font-bold text-[13.5px] transition-colors group-hover:translate-x-0.5"
                        >
                          <span>Baca Selengkapnya</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="transition-transform group-hover:translate-x-1"
                          >
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-12 rounded-xl border border-slate-200 text-center">
                  <p className="text-slate-600 font-medium text-[15px] mb-4">
                    Tidak ada berita atau artikel yang sesuai dengan filter pencarian.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('Semua');
                      setSelectedTag(null);
                      setCurrentPage(1);
                    }}
                    className="px-5 py-2 rounded-lg bg-blue-600 text-white text-[13.5px] font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Reset Filter
                  </button>
                </div>
              )}

              {/* Pagination Bar Matching Screenshot 1 */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
                {/* Result Count Info */}
                <div className="text-slate-500 text-[12.5px] font-normal">
                  Showing <span className="font-semibold text-slate-700">{displayedStart}</span> to{' '}
                  <span className="font-semibold text-slate-700">{displayedEnd}</span> of{' '}
                  <span className="font-semibold text-slate-700">{totalDisplayResults}</span> results
                </div>

                {/* Boxed Pagination Control */}
                <div className="inline-flex items-center rounded-md border border-slate-200 divide-x divide-slate-200 bg-white overflow-hidden text-[13px] shadow-2xs">
                  {/* Prev Button */}
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    aria-label="Previous Page"
                    className="px-3 py-2 text-blue-600 hover:bg-blue-50 font-bold transition-colors disabled:opacity-30 disabled:pointer-events-none"
                  >
                    &lsaquo;
                  </button>

                  {/* Dynamic Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    const isActive = currentPage === pageNum;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 font-medium transition-colors ${
                          isActive
                            ? 'bg-blue-600 text-white font-bold'
                            : 'text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    aria-label="Next Page"
                    className="px-3 py-2 text-blue-600 hover:bg-blue-50 font-bold transition-colors disabled:opacity-30 disabled:pointer-events-none"
                  >
                    &rsaquo;
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Sidebar Widgets (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Widget 1: Pencarian Berita */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs">
                <h2 className="font-sans text-[18px] font-bold text-blue-600">
                  Pencarian Berita
                </h2>
                <div className="w-12 h-0.5 bg-amber-400 mt-2 mb-5 rounded-full" />
                
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Masukkan kata kunci..."
                    className="w-full px-3.5 py-2.5 rounded-l-md border border-r-0 border-slate-300 text-[13.5px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 bg-slate-50/40"
                  />
                  <button
                    type="submit"
                    aria-label="Cari Berita"
                    className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-4 py-2.5 rounded-r-md font-bold flex items-center justify-center transition-colors shrink-0"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" x2="21" y1="21" y2="16.65" />
                    </svg>
                  </button>
                </form>
              </div>

              {/* Widget 2: Kategori */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs">
                <h2 className="font-sans text-[18px] font-bold text-blue-600">
                  Kategori
                </h2>
                <div className="w-12 h-0.5 bg-amber-400 mt-2 mb-5 rounded-full" />

                <div className="flex flex-col divide-y divide-slate-100">
                  {categoriesList.map((cat, idx) => {
                    const isSelected = selectedCategory === cat.filterKey;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleCategorySelect(cat.filterKey)}
                        className={`flex items-center justify-between py-3 text-left transition-colors group ${
                          isSelected ? 'font-bold text-blue-600' : 'text-slate-700 hover:text-blue-600'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-amber-500 font-bold text-[14px]">
                            &rsaquo;
                          </span>
                          <span className="text-[14px]">
                            {cat.name}
                          </span>
                        </div>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-600 text-white group-hover:bg-blue-600 transition-colors'
                        }`}>
                          {cat.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Widget 3: Tags Populer */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs">
                <h2 className="font-sans text-[18px] font-bold text-blue-600">
                  Tags Populer
                </h2>
                <div className="w-12 h-0.5 bg-amber-400 mt-2 mb-5 rounded-full" />

                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag, idx) => {
                    const isActive = selectedTag === tag;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleTagSelect(tag)}
                        className={`px-3 py-1.5 rounded text-[12.5px] font-medium border transition-colors ${
                          isActive
                            ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                            : 'bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border-slate-200/80'
                        }`}
                      >
                        #{tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Widget 4: Instagram Utama */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#e1306c"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  <h2 className="font-sans text-[18px] font-bold text-blue-600">
                    Instagram Utama
                  </h2>
                </div>
                <div className="w-12 h-0.5 bg-amber-400 mt-2 mb-5 rounded-full" />

                <div className="border border-dashed border-slate-200 rounded-xl p-6 text-center bg-slate-50/50 flex flex-col items-center">
                  {/* Instagram Logo */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white mb-3 shadow-xs">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </div>

                  <span className="font-sans text-[15px] font-bold text-slate-900">
                    @maraudhatulhidayah
                  </span>
                  <p className="font-sans text-[12px] text-slate-500 mt-1 mb-4 leading-relaxed max-w-xs">
                    Ikuti galeri aktivitas instan kami di Instagram
                  </p>

                  <a
                    href="https://instagram.com/maraudhatulhidayah"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-[#e1306c] hover:bg-[#c13584] text-white font-bold text-[13px] px-7 py-2 rounded-full transition-all duration-200 shadow-sm active:scale-95"
                  >
                    Ikuti Kami
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* Floating Scroll-to-Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Kembali ke atas"
          className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-lg flex items-center justify-center transition-all duration-200 active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m18 15-6-6-6 6" />
          </svg>
        </button>
      )}

      <StitchFooter />
    </div>
  );
}
