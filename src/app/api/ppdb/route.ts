import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { supabase } from '@/lib/supabaseClient';
import { requireAuth } from '@/lib/auth';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'ppdbData.json');

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

const defaultData = {
  category: "MA RAUDLATUL HIDAYAH",
  title: "Membentuk Generasi Berkarakter, Cerdas & Berakhlak Mulia",
  academicYear: "2027/2028",
  badgeText: "TELAH DIBUKA!",
  description: "MA Raudlatul Hidayah hadir sebagai kawah candradimuka yang mendampingi setiap murid untuk bertumbuh menjadi generasi yang tangguh, unggul, dan berkarakter islami. Melalui pembelajaran kontekstual berbasis Kurikulum Merdeka yang bermakna serta pembiasaan adab luhur kepesantrenan, santri didorong untuk menemukan potensi, mengembangkan bakat, dan meraih prestasi terbaiknya.",
  features: [
    "Kurikulum Merdeka Terpadu (Fase E & F)",
    "Pembentukan Karakter & Adab Islami",
    "Pembelajaran Kontekstual & Deep Learning",
    "Pengembangan Potensi, Minat & Bakat",
    "Program Bimbingan Prestasi KSM & Olahraga",
    "Biaya Pendidikan Terjangkau & Beasiswa Prestasi"
  ],
  contactWa: "628176614723",
  contactPhone: "0817-6614-723",
  registrationLink: "https://wa.me/628176614723?text=Halo%20Panitia%20PPDB%20MA%20Raudlatul%20Hidayah,%20saya%20ingin%20mendaftar%20dan%20konsultasi%20PPDB%202027/2028",
  brochureLink: "/kontak",
  posterUrl: "https://zzgobrlhnnqvspuwugkz.supabase.co/storage/v1/object/public/articles/img-1793069689752-1bguos.jpeg",
  isRegistrationOpen: true
};

export async function GET() {
  try {
    // 1. Try reading from Supabase
    const { data: supaData, error: supaError } = await supabase
      .from('ppdb_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (!supaError && supaData) {
      const mapped = {
        category: supaData.category || defaultData.category,
        title: supaData.title || defaultData.title,
        academicYear: supaData.academic_year || defaultData.academicYear,
        badgeText: supaData.badge_text || defaultData.badgeText,
        description: supaData.description || defaultData.description,
        features: Array.isArray(supaData.features) ? supaData.features : defaultData.features,
        contactWa: supaData.contact_wa || defaultData.contactWa,
        contactPhone: supaData.contact_phone || defaultData.contactPhone,
        registrationLink: supaData.registration_link || defaultData.registrationLink,
        brochureLink: supaData.brochure_link || defaultData.brochureLink,
        posterUrl: supaData.poster_url || defaultData.posterUrl,
        isRegistrationOpen: Boolean(supaData.is_registration_open ?? true),
      };
      return NextResponse.json(mapped, { headers: noCacheHeaders });
    }
  } catch (err) {
    console.warn('Supabase fetch failed, falling back to local file:', err);
  }

  // 2. Fallback to local ppdbData.json
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    const data = JSON.parse(fileContent);
    return NextResponse.json({ ...defaultData, ...data }, { headers: noCacheHeaders });
  } catch (error) {
    console.error('Error reading ppdbData.json, returning default data:', error);
    return NextResponse.json(defaultData);
  }
}

export async function POST(request: Request) {
  // Hanya Administrator yang berhak mengubah informasi dan alur PPDB
  const auth = await requireAuth(['admin']);
  if (!auth.authorized) {
    return auth.response!;
  }

  try {
    const body = await request.json();

    const updatedData = {
      category: typeof body.category === 'string' && body.category.trim() ? body.category.trim() : defaultData.category,
      title: typeof body.title === 'string' && body.title.trim() ? body.title.trim() : defaultData.title,
      academicYear: typeof body.academicYear === 'string' && body.academicYear.trim() ? body.academicYear.trim() : defaultData.academicYear,
      badgeText: typeof body.badgeText === 'string' && body.badgeText.trim() ? body.badgeText.trim() : defaultData.badgeText,
      description: typeof body.description === 'string' && body.description.trim() ? body.description.trim() : defaultData.description,
      features: Array.isArray(body.features) && body.features.length > 0 ? body.features.filter((f: unknown) => typeof f === 'string' && (f as string).trim()) : defaultData.features,
      contactWa: typeof body.contactWa === 'string' && body.contactWa.trim() ? body.contactWa.trim() : defaultData.contactWa,
      contactPhone: typeof body.contactPhone === 'string' && body.contactPhone.trim() ? body.contactPhone.trim() : defaultData.contactPhone,
      registrationLink: typeof body.registrationLink === 'string' && body.registrationLink.trim() ? body.registrationLink.trim() : defaultData.registrationLink,
      brochureLink: typeof body.brochureLink === 'string' && body.brochureLink.trim() ? body.brochureLink.trim() : defaultData.brochureLink,
      posterUrl: typeof body.posterUrl === 'string' && body.posterUrl.trim() ? body.posterUrl.trim() : defaultData.posterUrl,
      isRegistrationOpen: Boolean(body.isRegistrationOpen ?? true),
    };

    // 1. Sync to Supabase ppdb_settings first (primary persistent store)
    try {
      await supabase
        .from('ppdb_settings')
        .upsert({
          id: 1,
          category: updatedData.category,
          title: updatedData.title,
          academic_year: updatedData.academicYear,
          badge_text: updatedData.badgeText,
          description: updatedData.description,
          features: updatedData.features,
          contact_wa: updatedData.contactWa,
          contact_phone: updatedData.contactPhone,
          registration_link: updatedData.registrationLink,
          brochure_link: updatedData.brochureLink,
          poster_url: updatedData.posterUrl,
          is_registration_open: updatedData.isRegistrationOpen,
          updated_at: new Date().toISOString(),
        });
    } catch (supaErr) {
      console.warn('Failed syncing to Supabase:', supaErr);
    }

    // 2. Best-effort local file write
    try {
      await fs.writeFile(dataFilePath, JSON.stringify(updatedData, null, 2), 'utf-8');
    } catch (fsErr) {
      // Safely ignore EROFS in serverless environment
    }

    return NextResponse.json({ success: true, data: updatedData }, { headers: noCacheHeaders });
  } catch (error) {
    console.error('Error saving PPDB data:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menyimpan data PPDB' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}
