'use client';

import React from 'react';
import { X, Calendar, Tag } from 'lucide-react';
import { GalleryItem } from '@/data/mockSchoolData';

interface LightboxGalleryProps {
  item: GalleryItem | null;
  onClose: () => void;
}

export const LightboxGallery: React.FC<LightboxGalleryProps> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-stone-900 rounded-2xl overflow-hidden shadow-2xl border border-stone-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Tutup foto"
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 border border-white/20 transition-colors"
        >
          <X className="w-5 h-5" strokeWidth={2} />
        </button>

        {/* High Resolution Image Container */}
        <div className="relative max-h-[70vh] flex items-center justify-center bg-black">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-auto max-h-[70vh] object-contain"
          />
        </div>

        {/* Caption & Metadata Footer */}
        <div className="p-5 sm:p-6 bg-stone-950 text-white border-t border-stone-800">
          <div className="flex flex-wrap items-center gap-3 mb-2 text-xs text-stone-400">
            <span className="inline-flex items-center gap-1 text-gold-400 font-semibold bg-stone-900 px-2.5 py-0.5 rounded">
              <Tag className="w-3 h-3" />
              <span>{item.category}</span>
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-stone-500" />
              <span>{item.date}</span>
            </span>
          </div>

          <h3 className="font-display text-lg sm:text-xl font-bold tracking-tight mb-2">
            {item.title}
          </h3>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            {item.caption}
          </p>
        </div>
      </div>
    </div>
  );
};
