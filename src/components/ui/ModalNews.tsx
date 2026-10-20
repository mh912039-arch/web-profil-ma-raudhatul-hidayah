'use client';

import React from 'react';
import Link from 'next/link';
import { X, Calendar, User, Clock, Share2, ArrowRight } from 'lucide-react';
import { NewsItem } from '@/data/mockSchoolData';

interface ModalNewsProps {
  article: NewsItem | null;
  onClose: () => void;
}

export const ModalNews: React.FC<ModalNewsProps> = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Tutup jendela berita"
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 text-stone-700 hover:text-black hover:bg-white shadow-sm border border-stone-200 transition-colors"
        >
          <X className="w-5 h-5" strokeWidth={2} />
        </button>

        {/* Featured Image */}
        <div className="relative h-64 sm:h-80 w-full bg-stone-100">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="inline-block px-2.5 py-1 rounded bg-madrasah-800 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-2">
              {article.category}
            </span>
          </div>
        </div>

        {/* Article Content Body */}
        <div className="p-6 sm:p-8">
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 pb-4 mb-4 border-b border-stone-100">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-madrasah-600" />
              <span>{article.date}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-madrasah-600" />
              <span>{article.author}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-madrasah-600" />
              <span>{article.readTime}</span>
            </span>
          </div>

          {/* Title */}
          <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-madrasah-950 leading-tight mb-4">
            {article.title}
          </h2>

          {/* Lead Summary */}
          <p className="text-base text-stone-700 font-medium leading-relaxed mb-6 bg-stone-50 p-4 rounded-xl border border-stone-200/60">
            {article.summary}
          </p>

          {/* Full Paragraphs */}
          <div className="text-stone-600 text-sm sm:text-base leading-relaxed space-y-4">
            {article.paragraphs?.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          {/* Footer note & Go to dedicated page */}
          <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <Link
              href={`/warta/${article.slug}`}
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-madrasah-900 font-bold hover:text-madrasah-700 bg-madrasah-50 px-3 py-2 rounded-lg border border-madrasah-200 transition-colors"
            >
              <span>Buka Halaman Penuh Berita</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/warta/${article.slug}`
                  );
                  alert('Tautan berita berhasil disalin!');
                }
              }}
              className="inline-flex items-center gap-1.5 text-stone-600 font-semibold hover:text-stone-900"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Salin Tautan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
