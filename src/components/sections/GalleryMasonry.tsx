'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { schoolData, GalleryItem } from '@/data/mockSchoolData';
import { LightboxGallery } from '@/components/ui/LightboxGallery';

export const GalleryMasonry: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  const categories = ['Semua', 'Akademik', 'Keagamaan', 'Kesiswaan', 'Fasilitas'];

  const filteredPhotos =
    activeCategory === 'Semua'
      ? schoolData.gallery
      : schoolData.gallery.filter((item) => item.category === activeCategory);

  return (
    <section id="galeri" className="py-12 sm:py-16 bg-surface-container-low border-b border-surface-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-secondary mb-1">
              <span className="material-symbols-outlined text-[16px]">photo_camera</span>
              <span>Dokumentasi Visual</span>
            </div>
            <h2 className="font-display text-[26px] sm:text-[34px] font-bold text-primary tracking-tight">
              Galeri Kehidupan Madrasah
            </h2>
            <p className="font-sans text-[14.5px] text-on-surface-variant mt-1">
              Merekam setiap langkah khidmah, keceriaan santri, serta kekhidmatan suasana belajar di sekolah.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                type="button"
                className={`text-[13px] px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-primary text-on-primary shadow-sm font-semibold'
                    : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface border border-surface-container'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="group relative rounded-xl overflow-hidden bg-primary-container border border-surface-container shadow-sm cursor-pointer aspect-[4/3]"
            >
              <Image
                src={photo.imageUrl}
                alt={photo.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              {/* Hover Dark Overlay & Caption */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-secondary text-white px-2.5 py-0.5 rounded-full">
                    {photo.category}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-[18px]">zoom_in</span>
                  </div>
                </div>

                <h4 className="font-display text-[16px] font-bold leading-snug mb-1">
                  {photo.title}
                </h4>

                <p className="font-sans text-[12.5px] text-primary-fixed-dim line-clamp-2">
                  {photo.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <LightboxGallery
        item={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />
    </section>
  );
};
