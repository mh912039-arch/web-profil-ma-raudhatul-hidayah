import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import { StitchNavbar } from '@/components/layout/StitchNavbar';
import { StitchFooter } from '@/components/layout/StitchFooter';
import { schoolData } from '@/data/mockSchoolData';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

interface NewsDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  time?: string;
  author: string;
  authorRole?: string;
  readTime?: string;
  summary: string;
  lead?: string;
  paragraphs: string[];
  tags: string[];
  imageUrl: string;
  imageCaption?: string;
  quote?: { text: string; speaker: string; role: string };
  keyPoints?: string[];
  additionalImages?: { url: string; caption: string }[];
  [key: string]: any;
}

async function getAllArticles(): Promise<ArticleItem[]> {
  let list: ArticleItem[] = [];

  // 1. Try local articlesData.json
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'articlesData.json');
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      list = JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Error reading articlesData.json in detail page:', e);
  }

  // 2. Try Supabase
  try {
    const { data: supaArticles } = await supabase
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false });

    if (supaArticles && supaArticles.length > 0) {
      const supaMapped: ArticleItem[] = supaArticles.map((row: any) => ({
        id: row.id,
        slug: row.slug,
        title: row.title,
        category: row.category || 'Berita Sekolah',
        date: row.published_at
          ? new Date(row.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
          : 'Terbaru',
        time: 'WIB',
        author: row.author || 'Humas MA Raudhatul Hidayah',
        authorRole: 'Biro Publikasi & Informasi Madrasah',
        readTime: '3 Menit Baca',
        summary: row.excerpt || (row.content ? row.content.slice(0, 160) : row.title),
        lead: row.excerpt || row.title,
        paragraphs: row.content
          ? row.content.split('\n\n').filter((p: string) => p.trim())
          : [row.excerpt || row.title],
        imageUrl: row.cover_image || '/foto-juara.jpeg',
        imageCaption: row.image_caption || row.title,
        tags: [row.category || 'Berita', 'Madrasah', 'MA Raudhatul Hidayah'],
      }));

      const localSlugs = new Set(list.map((l) => l.slug));
      list = [...list, ...supaMapped.filter((s) => !localSlugs.has(s.slug))];
    }
  } catch (e) {
    // fallback
  }

  if (list.length === 0) {
    list = schoolData.news.map((item) => ({
      ...item,
      paragraphs: item.paragraphs || [],
      tags: item.tags || [],
    }));
  }
  return list;
}

async function getArticleBySlug(slug: string): Promise<ArticleItem | null> {
  // 1. Direct Supabase query for slug
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (data && !error) {
      return {
        id: data.id,
        slug: data.slug,
        title: data.title,
        category: data.category || 'Pengumuman',
        date: data.published_at
          ? new Date(data.published_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
          : 'Terbaru',
        time: 'WIB',
        author: data.author || 'Humas MA Raudhatul Hidayah',
        authorRole: 'Biro Publikasi & Informasi Madrasah',
        readTime: '3 Menit Baca',
        summary: data.excerpt || (data.content ? data.content.slice(0, 160) : data.title),
        lead: data.excerpt || data.title,
        paragraphs: data.content
          ? data.content.split('\n\n').filter((p: string) => p.trim())
          : [data.excerpt || data.title],
        imageUrl: data.cover_image || '/foto-juara.jpeg',
        imageCaption: data.image_caption || data.title,
        tags: [data.category || 'Berita', 'Madrasah', 'MA Raudhatul Hidayah'],
      };
    }
  } catch (e) {
    console.warn('Supabase getArticleBySlug warning:', e);
  }

  // 2. Fallback to getAllArticles list
  const all = await getAllArticles();
  const found = all.find((a) => a.slug === slug);
  if (found) return found;

  // 3. Fallback to mockSchoolData
  const mockFound = schoolData.news.find((n) => n.slug === slug);
  if (mockFound) {
    return {
      ...mockFound,
      paragraphs: mockFound.paragraphs || [],
      tags: mockFound.tags || [],
    };
  }

  return null;
}

export async function generateMetadata({
  params,
}: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: 'Warta Tidak Ditemukan' };

  return {
    title: `${article.title} — Warta MA Raudhatul Hidayah`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      images: [article.imageUrl || article.cover_image || '/foto-juara.jpeg'],
    },
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const rawArticle = await getArticleBySlug(slug);
  if (!rawArticle) notFound();

  const articles = await getAllArticles();

  const article: ArticleItem = {
    ...rawArticle,
    id: rawArticle.id || rawArticle.slug,
    title: rawArticle.title,
    slug: rawArticle.slug,
    author: rawArticle.author || 'Humas MA Raudhatul Hidayah',
    authorRole: rawArticle.authorRole || 'Biro Publikasi & Informasi Madrasah',
    date: rawArticle.date || 'Terbaru',
    time: rawArticle.time || 'WIB',
    readTime: rawArticle.readTime || '3 Menit Baca',
    category: rawArticle.category || 'Berita Sekolah',
    imageUrl: rawArticle.imageUrl || rawArticle.cover_image || '/foto-juara.jpeg',
    imageCaption: rawArticle.imageCaption || rawArticle.title,
    summary: rawArticle.summary || rawArticle.title,
    lead: rawArticle.lead || rawArticle.summary || rawArticle.title,
    paragraphs: Array.isArray(rawArticle.paragraphs) && rawArticle.paragraphs.length > 0
      ? rawArticle.paragraphs
      : (rawArticle.content ? rawArticle.content.split('\n\n').filter((p: string) => p.trim()) : [rawArticle.summary || rawArticle.title]),
    tags: Array.isArray(rawArticle.tags) && rawArticle.tags.length > 0 ? rawArticle.tags : ['Berita', 'Madrasah'],
    quote: rawArticle.quote,
    keyPoints: rawArticle.keyPoints,
    additionalImages: rawArticle.additionalImages,
  };

  const otherNews = articles.filter((n) => n.slug !== article.slug);
  const currentIndex = articles.findIndex((n) => n.slug === article.slug);
  const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;
  const nextArticle =
    currentIndex >= 0 && currentIndex < articles.length - 1
      ? articles[currentIndex + 1]
      : null;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background font-sans text-on-surface">
      <StitchNavbar />

      <main className="w-full pt-20 bg-background flex-grow">
        {/* Breadcrumb Navigation Bar */}
        <div className="bg-surface-container-lowest border-b border-surface-container py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-2 text-[12px] text-on-surface-variant">
              <Link href="/" className="hover:text-primary flex items-center gap-1 transition-colors">
                <span className="material-symbols-outlined text-[16px]">home</span>
                <span>Beranda</span>
              </Link>
              <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
              <Link href="/warta" className="hover:text-primary transition-colors">
                <span>Warta &amp; Berita</span>
              </Link>
              <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
              <span className="text-secondary font-medium">{article.category}</span>
              <span className="material-symbols-outlined text-[14px] text-outline hidden sm:inline">chevron_right</span>
              <span className="text-on-surface font-medium truncate max-w-xs hidden sm:inline">
                {article.title}
              </span>
            </nav>
          </div>
        </div>

        {/* Editorial Article Content */}
        <article className="py-8 sm:py-12 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Article Header */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-secondary-container/20 text-secondary text-[11px] font-bold uppercase tracking-wider">
                  {article.category}
                </span>
                <span className="text-[11px] text-outline font-sans uppercase">
                  Rilis Resmi Madrasah
                </span>
              </div>

              <h1 className="font-display text-[26px] sm:text-[34px] md:text-[40px] font-bold text-primary tracking-tight leading-[1.2] mb-6">
                {article.title}
              </h1>

              {/* Author Meta */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-3.5 border-y border-surface-container text-[12px] text-on-surface-variant">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold font-display shrink-0">
                    RH
                  </div>
                  <div>
                    <p className="font-bold text-primary text-[13px]">{article.author}</p>
                    <p className="text-[11px] text-on-surface-variant">{article.authorRole}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-[12px] text-on-surface-variant">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">calendar_today</span>
                    <span>{article.date} • {article.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">schedule</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="max-w-5xl mx-auto mb-8">
              <div className="relative rounded-2xl overflow-hidden bg-surface-container aspect-[16/9] sm:aspect-[21/9] border border-surface-container">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="mt-2 px-1 flex items-center justify-between text-[12px] text-on-surface-variant italic">
                <span>{article.imageCaption}</span>
                <span className="not-italic text-[11px] text-outline">
                  Dokumentasi Humas MA Raudhatul Hidayah
                </span>
              </div>
            </div>

            {/* Content Two-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto items-start">
              {/* Main Body */}
              <div className="lg:col-span-8 space-y-6">
                <div className="p-5 rounded-xl bg-surface-container-low border-l-4 border-secondary border-y border-r border-surface-container">
                  <p className="text-[16px] text-on-surface font-medium leading-relaxed">
                    {article.lead}
                  </p>
                </div>

                <div className="space-y-4 text-on-surface text-[15.5px] leading-[1.8]">
                  {article.paragraphs.map((para: string, idx: number) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>

                {article.quote && (
                  <div className="my-6 p-6 rounded-xl bg-secondary-container/10 border border-secondary/20 relative">
                    <span className="material-symbols-outlined text-[36px] text-secondary/30 absolute top-2 left-2">
                      format_quote
                    </span>
                    <p className="font-serif italic text-[16px] text-primary leading-relaxed relative z-10 mb-3 pl-6">
                      &quot;{article.quote.text}&quot;
                    </p>
                    <div className="flex items-center gap-2 text-[12px] font-semibold text-secondary pl-6">
                      <span>— {article.quote.speaker}</span>
                      <span className="text-on-surface-variant">({article.quote.role})</span>
                    </div>
                  </div>
                )}

                {article.keyPoints && article.keyPoints.length > 0 && (
                  <div className="p-5 rounded-xl bg-surface-container-lowest border border-surface-container shadow-sm">
                    <h3 className="font-display text-[14px] font-bold uppercase tracking-wider text-primary mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-secondary">check_circle</span>
                      <span>Poin Penting Warta</span>
                    </h3>
                    <ul className="space-y-2">
                      {article.keyPoints.map((point: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-[13.5px] text-on-surface">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Additional Gallery Images */}
                {article.additionalImages && article.additionalImages.length > 0 && (
                  <div className="my-8 pt-6 border-t border-surface-container">
                    <h3 className="font-display text-[15px] font-bold uppercase tracking-wider text-primary mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px] text-secondary">photo_library</span>
                      <span>Dokumentasi Foto Terkait</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {article.additionalImages.map((img: any, idx: number) => (
                        <div key={idx} className="rounded-xl overflow-hidden border border-surface-container bg-surface-container-lowest flex flex-col group">
                          <div className="relative aspect-[16/11] w-full overflow-hidden bg-surface-container">
                            <Image
                              src={img.url}
                              alt={img.caption}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="p-3 text-[12px] text-on-surface-variant leading-snug">
                            {img.caption}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div className="pt-4 border-t border-surface-container">
                  <div className="flex items-center gap-1.5 text-[12px] text-on-surface-variant mb-2">
                    <span className="material-symbols-outlined text-[15px]">label</span>
                    <span>Topik Terkait:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-[12px] px-3 py-1 rounded-lg bg-surface-container text-on-surface font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Navigation Previous / Next */}
                <div className="pt-6 border-t border-surface-container grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {prevArticle ? (
                    <Link
                      href={`/warta/${prevArticle.slug}`}
                      className="p-4 rounded-xl border border-surface-container bg-surface-container-lowest hover:border-secondary transition-colors flex flex-col text-left group"
                    >
                      <span className="text-[11px] text-outline flex items-center gap-1 mb-1">
                        <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                        <span>Artikel Sebelumnya</span>
                      </span>
                      <span className="font-display text-[13px] font-bold text-primary group-hover:text-secondary line-clamp-2">
                        {prevArticle.title}
                      </span>
                    </Link>
                  ) : (
                    <div />
                  )}

                  {nextArticle ? (
                    <Link
                      href={`/warta/${nextArticle.slug}`}
                      className="p-4 rounded-xl border border-surface-container bg-surface-container-lowest hover:border-secondary transition-colors flex flex-col text-right group"
                    >
                      <span className="text-[11px] text-outline flex items-center justify-end gap-1 mb-1">
                        <span>Artikel Berikutnya</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </span>
                      <span className="font-display text-[13px] font-bold text-primary group-hover:text-secondary line-clamp-2">
                        {nextArticle.title}
                      </span>
                    </Link>
                  ) : (
                    <div />
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-4 space-y-5">
                <div className="bg-surface-container-lowest rounded-xl p-5 border border-surface-container shadow-sm">
                  <h4 className="font-display text-[14px] font-bold uppercase tracking-wider text-primary pb-2 mb-3 border-b border-surface-container flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[17px] text-secondary">bookmark</span>
                    <span>Warta Lainnya</span>
                  </h4>
                  <div className="space-y-3.5">
                    {otherNews.slice(0, 3).map((n: any) => (
                      <Link
                        key={n.id}
                        href={`/warta/${n.slug}`}
                        className="group flex gap-3 items-start"
                      >
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-primary-container shrink-0 relative">
                          <Image
                            src={n.imageUrl}
                            alt={n.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-bold text-secondary bg-surface-container px-1.5 py-0.5 rounded">
                            {n.category}
                          </span>
                          <h5 className="font-display text-[12.5px] font-bold text-primary group-hover:text-secondary line-clamp-2 mt-1 leading-snug">
                            {n.title}
                          </h5>
                          <p className="text-[11px] text-outline mt-0.5">{n.date}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="bg-primary text-on-primary rounded-xl p-5 border border-primary-container shadow-md">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-secondary-fixed block mb-1">
                    Sekretariat Humas
                  </span>
                  <h4 className="font-display text-[15px] font-bold text-white mb-2">
                    Layanan Informasi &amp; Media
                  </h4>
                  <p className="font-sans text-[12.5px] text-on-primary-container leading-relaxed mb-4">
                    Untuk konfirmasi pengumuman, permohonan peliputan, atau koordinasi kemitraan sekolah.
                  </p>
                  <a
                    href="https://wa.me/628176614723"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-secondary text-white font-semibold text-[12.5px] hover:bg-white hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">chat</span>
                    <span>WhatsApp 0817-6614-723</span>
                  </a>
                </div>
              </aside>
            </div>
          </div>
        </article>
      </main>

      <StitchFooter />
    </div>
  );
}
