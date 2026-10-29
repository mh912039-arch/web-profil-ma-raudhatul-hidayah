import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { supabaseServer } from '@/lib/supabaseServer';
import { requireAuth } from '@/lib/auth';
import { deleteStorageFile } from '@/lib/storageHelper';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'articlesData.json');

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

// Interface for unified article structure
export interface UnifiedArticle {
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
  paragraphs?: string[];
  content?: string;
  tags?: string[];
  imageUrl: string;
  cover_image?: string;
  imageCaption?: string;
  is_featured?: boolean;
  is_published?: boolean;
  views_count?: number;
  created_at?: string;
}

export async function GET() {
  let localArticles: UnifiedArticle[] = [];

  // 1. Read local JSON file
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    localArticles = JSON.parse(fileContent);
  } catch (err) {
    console.warn('Could not read articlesData.json:', err);
  }

  // 2. Try fetching from Supabase (primary persistent store)
  try {
    const { data: supaArticles, error: supaErr } = await supabaseServer
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false });

    if (!supaErr && Array.isArray(supaArticles)) {
      // Map Supabase rows to unified format
      const supaMapped: UnifiedArticle[] = supaArticles.map((row: any) => ({
        id: row.id,
        slug: row.slug,
        title: row.title,
        category: row.category || 'Berita Sekolah',
        date: row.published_at ? new Date(row.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Terbaru',
        author: row.author || 'Humas MA Raudlatul Hidayah',
        summary: row.excerpt || (row.content ? row.content.slice(0, 150) + '...' : ''),
        lead: row.excerpt || row.title,
        paragraphs: row.content ? row.content.split('\n\n').filter((p: string) => p.trim()) : [row.title],
        content: row.content || '',
        imageUrl: row.cover_image || '/foto-juara.jpeg',
        cover_image: row.cover_image || '/foto-juara.jpeg',
        is_featured: Boolean(row.is_featured),
        is_published: Boolean(row.is_published ?? true),
        views_count: row.views_count || 0,
        created_at: row.created_at || new Date().toISOString(),
      }));

      // Synchronize local JSON file in background (safe on Vercel)
      try {
        await fs.writeFile(dataFilePath, JSON.stringify(supaMapped, null, 2), 'utf-8');
      } catch (_) {}

      return NextResponse.json(supaMapped, { headers: noCacheHeaders });
    }
  } catch (supaErr) {
    console.warn('Supabase fetch failed for articles:', supaErr);
  }

  // 3. Fallback to local articles normalized if Supabase is offline or empty
  const fallbackNormalized = localArticles.map((art: any) => ({
    ...art,
    id: art.id || art.slug,
    slug: art.slug,
    title: art.title || 'Warta Madrasah',
    category: art.category || 'Prestasi',
    date: art.date || 'Terbaru',
    author: art.author || 'Humas MA Raudlatul Hidayah',
    excerpt: art.excerpt || art.summary || (art.content ? art.content.slice(0, 160) : art.title),
    summary: art.summary || art.excerpt || (art.content ? art.content.slice(0, 160) : art.title),
    content: art.content || (Array.isArray(art.paragraphs) ? art.paragraphs.join('\n\n') : (art.summary || art.title || '')),
    imageUrl: art.imageUrl || art.cover_image || '/foto-juara.jpeg',
    cover_image: art.cover_image || art.imageUrl || '/foto-juara.jpeg',
    is_featured: Boolean(art.is_featured),
    is_published: Boolean(art.is_published ?? true),
    views_count: art.views_count || 0,
    created_at: art.created_at || new Date().toISOString(),
  }));

  return NextResponse.json(fallbackNormalized, { headers: noCacheHeaders });
}

export async function POST(request: Request) {
  // Hanya Admin dan Dewan Guru yang memiliki otorisasi menulis/mengedit warta berita
  const auth = await requireAuth(['admin', 'guru']);
  if (!auth.authorized) {
    return auth.response!;
  }

  try {
    const body = await request.json();

    if (!body.title || !body.title.trim()) {
      return NextResponse.json({ success: false, message: 'Judul berita wajib diisi.' }, { status: 400 });
    }

    const title = body.title.trim();
    const slug = body.slug?.trim() || title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
    const content = body.content?.trim() || body.summary?.trim() || title;
    const summary = body.summary?.trim() || body.excerpt?.trim() || content.slice(0, 160);
    const category = body.category?.trim() || 'Prestasi';
    const author = body.author?.trim() || 'Humas MA Raudlatul Hidayah';
    const imageUrl = body.imageUrl || body.cover_image || '/foto-juara.jpeg';
    const isFeatured = Boolean(body.is_featured ?? false);
    const isPublished = Boolean(body.is_published ?? true);

    const now = new Date();
    const formattedDate = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    const newArticle: UnifiedArticle = {
      id: body.id || `news-${Date.now()}`,
      slug,
      title,
      category,
      date: formattedDate,
      time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      author,
      authorRole: 'Biro Publikasi & Informasi Madrasah',
      readTime: '3 Menit Baca',
      summary,
      lead: summary,
      paragraphs: content.split('\n\n').filter((p: string) => p.trim()),
      content,
      tags: [category, 'MA Raudlatul Hidayah', 'Mauk'],
      imageUrl,
      cover_image: imageUrl,
      is_featured: isFeatured,
      is_published: isPublished,
      created_at: now.toISOString(),
    };

    // 1. Read existing local articles
    let articles: UnifiedArticle[] = [];
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf-8');
      articles = JSON.parse(fileContent);
    } catch (err) {
      console.warn('Initializing articlesData.json');
    }

    // 2. Sync to Supabase first (primary persistent store)
    let savedArticleId = body.id;
    try {
      if (body.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(body.id))) {
        // Try updating existing article by ID
        const { data: updatedRows, error: upErr } = await supabaseServer
          .from('articles')
          .update({
            title,
            slug,
            excerpt: summary,
            content,
            category,
            author,
            cover_image: imageUrl,
            is_featured: isFeatured,
            is_published: isPublished,
            published_at: now.toISOString(),
          })
          .eq('id', body.id)
          .select('id');

        if (!upErr && updatedRows && updatedRows.length > 0) {
          savedArticleId = updatedRows[0].id;
        } else {
          // If update didn't match, upsert
          const { data: insRows } = await supabaseServer
            .from('articles')
            .upsert({
              id: body.id,
              title,
              slug,
              excerpt: summary,
              content,
              category,
              author,
              cover_image: imageUrl,
              is_featured: isFeatured,
              is_published: isPublished,
              published_at: now.toISOString(),
            }, { onConflict: 'slug' })
            .select('id');
          if (insRows && insRows[0]) savedArticleId = insRows[0].id;
        }
      } else {
        const { data: insRows } = await supabaseServer
          .from('articles')
          .upsert({
            title,
            slug,
            excerpt: summary,
            content,
            category,
            author,
            cover_image: imageUrl,
            is_featured: isFeatured,
            is_published: isPublished,
            published_at: now.toISOString(),
          }, { onConflict: 'slug' })
          .select('id');
        if (insRows && insRows[0]) savedArticleId = insRows[0].id;
      }
    } catch (supaErr) {
      console.warn('Supabase articles upsert error:', supaErr);
    }

    if (savedArticleId) {
      newArticle.id = savedArticleId;
    }

    // 3. Best-effort local write (safe on Vercel read-only filesystem)
    try {
      const existingIndex = articles.findIndex((a) => a.slug === slug || (newArticle.id && a.id === newArticle.id));
      if (existingIndex >= 0) {
        articles[existingIndex] = { ...articles[existingIndex], ...newArticle };
      } else {
        articles.unshift(newArticle);
      }
      await fs.writeFile(dataFilePath, JSON.stringify(articles, null, 2), 'utf-8');
    } catch (localWriteErr) {
      // Ignored safely in production serverless environments
    }

    return NextResponse.json({ success: true, article: newArticle }, { headers: noCacheHeaders });
  } catch (error) {
    console.error('Error saving article:', error);
    return NextResponse.json({ success: false, message: 'Gagal menyimpan artikel' }, { status: 500, headers: noCacheHeaders });
  }
}

export async function DELETE(request: Request) {
  // Hanya Admin dan Dewan Guru yang memiliki otorisasi menghapus warta berita
  const auth = await requireAuth(['admin', 'guru']);
  if (!auth.authorized) {
    return auth.response!;
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');

    if (!id && !slug) {
      return NextResponse.json({ success: false, message: 'ID atau Slug wajib disertakan' }, { status: 400 });
    }

    // 1. Ambil artikel untuk dibersihkan foto cover-nya dari storage jika ada
    try {
      let targetArticle: any = null;
      if (slug) {
        const { data } = await supabaseServer.from('articles').select('cover_image, image_url').eq('slug', slug).maybeSingle();
        targetArticle = data;
      }
      if (!targetArticle && id) {
        const { data } = await supabaseServer.from('articles').select('cover_image, image_url').eq('id', id).maybeSingle();
        targetArticle = data;
      }
      const imageToClean = targetArticle?.cover_image || targetArticle?.image_url;
      if (imageToClean) {
        await deleteStorageFile(imageToClean);
      }
    } catch (cleanupErr) {
      console.warn('Notice: Article image cleanup skipped:', cleanupErr);
    }

    // 2. Delete from Supabase safely
    try {
      if (id) {
        await supabaseServer.from('articles').delete().eq('id', id);
      }
      if (slug) {
        await supabaseServer.from('articles').delete().eq('slug', slug);
      }
    } catch (supaErr) {
      console.warn('Supabase delete error:', supaErr);
    }

    // 3. Delete from local JSON (in sync)
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf-8');
      let articles: UnifiedArticle[] = JSON.parse(fileContent);
      articles = articles.filter((a) => {
        if (id && (a.id === id || a.slug === id)) return false;
        if (slug && (a.slug === slug || a.id === slug)) return false;
        return true;
      });
      await fs.writeFile(dataFilePath, JSON.stringify(articles, null, 2), 'utf-8');
    } catch (err) {
      console.warn('Error updating articlesData.json after deletion:', err);
    }

    return NextResponse.json({ success: true, id, slug }, { headers: noCacheHeaders });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json({ success: false, message: 'Gagal menghapus artikel' }, { status: 500, headers: noCacheHeaders });
  }
}
