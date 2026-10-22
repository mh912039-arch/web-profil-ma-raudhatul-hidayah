import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { supabase } from '@/lib/supabaseClient';
import { requireAuth } from '@/lib/auth';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'ppdbRegistrationsData.json');

export interface PpdbApplicantItem {
  id?: string;
  registration_number: string;
  full_name: string;
  nisn?: string;
  gender: 'L' | 'P';
  birth_place?: string;
  birth_date?: string;
  previous_school?: string;
  parent_name: string;
  parent_whatsapp: string;
  home_address?: string;
  status: 'submitted' | 'verified' | 'accepted' | 'rejected';
  registration_path?: 'domisili' | 'afirmasi' | 'prestasi' | 'mutasi' | string;
  documents?: {
    kk_url?: string;
    akta_url?: string;
    ijazah_url?: string;
    afirmasi_url?: string;
    prestasi_url?: string;
  };
  admin_notes?: string;
  created_at?: string;
}

export async function GET() {
  // Keamanan Endpoint: Kunci ketat data privat calon santri hanya untuk Administrator
  const auth = requireAuth(['admin']);
  if (!auth.authorized) {
    return auth.response!;
  }

  let localList: PpdbApplicantItem[] = [];

  // 1. Read local JSON
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    localList = JSON.parse(fileContent);
  } catch (err) {
    console.warn('Could not read ppdbRegistrationsData.json:', err);
  }

  // 2. Fetch from Supabase
  try {
    const { data: supaData, error } = await supabase
      .from('ppdb_registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && supaData && supaData.length > 0) {
      const supaMapped: PpdbApplicantItem[] = supaData.map((row: any) => ({
        id: String(row.id),
        registration_number: row.registration_number || `RH-2027-${String(row.id).slice(-3)}`,
        full_name: row.full_name,
        nisn: row.nisn || '',
        gender: row.gender || 'L',
        birth_place: row.birth_place || '',
        birth_date: row.birth_date || '',
        previous_school: row.previous_school || '',
        parent_name: row.parent_name || '',
        parent_whatsapp: row.parent_whatsapp || '',
        home_address: row.home_address || '',
        status: (row.status as any) || 'submitted',
        registration_path: row.registration_path || 'domisili',
        documents: row.documents || {
          kk_url: row.kk_url || '',
          akta_url: row.akta_url || '',
          ijazah_url: row.ijazah_url || '',
          afirmasi_url: row.afirmasi_url || '',
          prestasi_url: row.prestasi_url || '',
        },
        admin_notes: row.admin_notes || '',
        created_at: row.created_at || new Date().toISOString(),
      }));

      // If local list is empty, seed from Supabase
      if (localList.length === 0) {
        await fs.writeFile(dataFilePath, JSON.stringify(supaMapped, null, 2), 'utf-8').catch(() => {});
        return NextResponse.json(supaMapped);
      }

      // Merge: localList has priority for status / notes updates
      const localMap = new Map<string, PpdbApplicantItem>();
      localList.forEach((la) => {
        if (la.id) localMap.set(String(la.id), la);
        if (la.registration_number) localMap.set(la.registration_number, la);
      });

      const merged = [...localList];
      supaMapped.forEach((sa) => {
        if (!localMap.has(String(sa.id)) && !localMap.has(sa.registration_number)) {
          merged.push(sa);
        }
      });

      return NextResponse.json(merged);
    }
  } catch (err) {
    console.warn('Supabase fetch failed for ppdb_registrations:', err);
  }

  return NextResponse.json(localList);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Anti-Bot Honeypot Protection: tolak bot pengirim spam secara otomatis
    if (body.hp_website || body.bot_field || body.website) {
      return NextResponse.json({
        success: true,
        message: 'Formulir pendaftaran berhasil dikirim dan tersimpan di database.',
      });
    }

    if (!body.full_name || !body.full_name.trim()) {
      return NextResponse.json(
        { success: false, message: 'Nama lengkap calon santri wajib diisi.' },
        { status: 400 }
      );
    }

    if (!body.parent_name || !body.parent_whatsapp) {
      return NextResponse.json(
        { success: false, message: 'Nama dan nomor WhatsApp orang tua/wali wajib diisi.' },
        { status: 400 }
      );
    }

    // Read current local list to calculate sequential number
    let applicants: PpdbApplicantItem[] = [];
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf-8');
      applicants = JSON.parse(fileContent);
    } catch (err) {}

    const academicYear = '2027';
    const regNumber =
      body.registration_number ||
      `RH-${academicYear}-${String(applicants.length + 1).padStart(3, '0')}`;

    const newApplicant: PpdbApplicantItem = {
      id: body.id || `app-${Date.now()}`,
      registration_number: regNumber,
      full_name: body.full_name.trim(),
      nisn: (body.nisn || '').trim(),
      gender: body.gender === 'P' ? 'P' : 'L',
      birth_place: (body.birth_place || 'Tangerang').trim(),
      birth_date: (body.birth_date || '').trim(),
      previous_school: (body.previous_school || '').trim(),
      parent_name: body.parent_name.trim(),
      parent_whatsapp: body.parent_whatsapp.trim(),
      home_address: (body.home_address || '').trim(),
      status: body.status || 'submitted',
      registration_path: body.registration_path || 'domisili',
      documents: body.documents || {},
      admin_notes: (body.admin_notes || '').trim(),
      created_at: new Date().toISOString(),
    };

    // Save locally (best-effort, safe on Vercel)
    applicants.unshift(newApplicant);
    try {
      await fs.writeFile(dataFilePath, JSON.stringify(applicants, null, 2), 'utf-8');
    } catch (fsErr) {
      // Safely ignore EROFS in serverless environment
    }

    // Also attempt to insert to Supabase ppdb_registrations safely
    try {
      const { data: inserted, error: supaErr } = await supabase
        .from('ppdb_registrations')
        .insert({
          registration_number: newApplicant.registration_number,
          full_name: newApplicant.full_name,
          nisn: newApplicant.nisn,
          gender: newApplicant.gender,
          birth_place: newApplicant.birth_place,
          birth_date: newApplicant.birth_date,
          previous_school: newApplicant.previous_school,
          parent_name: newApplicant.parent_name,
          parent_whatsapp: newApplicant.parent_whatsapp,
          home_address: newApplicant.home_address,
          status: newApplicant.status,
          registration_path: newApplicant.registration_path,
          documents: newApplicant.documents,
          admin_notes: newApplicant.admin_notes,
        })
        .select()
        .single();

      if (inserted?.id) {
        newApplicant.id = String(inserted.id);
        // update local id to match supabase UUID
        applicants[0].id = String(inserted.id);
        await fs.writeFile(dataFilePath, JSON.stringify(applicants, null, 2), 'utf-8').catch(() => {});
      }
    } catch (supaErr) {
      console.warn('Notice: Supabase ppdb_registrations insert notice:', supaErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Formulir pendaftaran berhasil dikirim dan tersimpan di database.',
      applicant: newApplicant,
    });
  } catch (error: any) {
    console.error('Error in ppdb registrations POST:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal mengirim formulir pendaftaran.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  // Hanya Administrator yang dapat memverifikasi status pendaftaran
  const auth = requireAuth(['admin']);
  if (!auth.authorized) {
    return auth.response!;
  }

  try {
    const body = await request.json();
    const { id, status, registration_path, documents, admin_notes } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID diperlukan' }, { status: 400 });
    }

    // 1. Update in local file
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf-8');
      const list: PpdbApplicantItem[] = JSON.parse(fileContent);
      const idx = list.findIndex((a) => String(a.id) === String(id) || a.registration_number === id);
      if (idx >= 0) {
        if (status) list[idx].status = status;
        if (registration_path) list[idx].registration_path = registration_path;
        if (documents) list[idx].documents = { ...list[idx].documents, ...documents };
        if (admin_notes !== undefined) list[idx].admin_notes = admin_notes;
        await fs.writeFile(dataFilePath, JSON.stringify(list, null, 2), 'utf-8');
      }
    } catch (err) {}

    // 2. Update in Supabase safely
    try {
      const updatePayload = {
        ...(status ? { status } : {}),
        ...(registration_path ? { registration_path } : {}),
        ...(documents ? { documents } : {}),
        ...(admin_notes !== undefined ? { admin_notes } : {}),
      };

      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id));
      if (isUuid) {
        await supabase
          .from('ppdb_registrations')
          .update(updatePayload)
          .eq('id', id);
      } else {
        await supabase
          .from('ppdb_registrations')
          .update(updatePayload)
          .eq('registration_number', id);
      }
    } catch (err) {}

    return NextResponse.json({ success: true, message: 'Status berhasil diperbarui.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  // Hanya Administrator yang berhak menghapus data pendaftar
  const auth = requireAuth(['admin']);
  if (!auth.authorized) {
    return auth.response!;
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID diperlukan' }, { status: 400 });
    }

    // 1. Delete from local file
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf-8');
      let list: PpdbApplicantItem[] = JSON.parse(fileContent);
      list = list.filter((a) => String(a.id) !== String(id) && a.registration_number !== id);
      await fs.writeFile(dataFilePath, JSON.stringify(list, null, 2), 'utf-8');
    } catch (err) {}

    // 2. Delete from Supabase
    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id));
      if (isUuid) {
        await supabase.from('ppdb_registrations').delete().eq('id', id);
      } else {
        await supabase.from('ppdb_registrations').delete().eq('registration_number', id);
      }
    } catch (err) {}

    return NextResponse.json({ success: true, message: 'Data pendaftar berhasil dihapus.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
