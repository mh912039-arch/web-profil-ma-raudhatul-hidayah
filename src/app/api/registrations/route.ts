import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { supabaseServer } from '@/lib/supabaseServer';
import { requireAuth } from '@/lib/auth';
import { deleteStorageFile } from '@/lib/storageHelper';
import { checkEndpointRateLimit } from '@/lib/rateLimiter';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'ppdbRegistrationsData.json');

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

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
    registration_path?: string;
  };
  admin_notes?: string;
  created_at?: string;
}

function unpackApplicant(row: any): PpdbApplicantItem {
  const docObj = (typeof row.documents === 'object' && row.documents) ? row.documents : {};
  const regPath = docObj.registration_path || row.registration_path || 'domisili';

  return {
    id: String(row.id),
    registration_number: row.registration_number || `RH-2027-${String(row.id).slice(-3)}`,
    full_name: row.full_name || '',
    nisn: row.nisn || '',
    gender: row.gender === 'P' ? 'P' : 'L',
    birth_place: row.birth_place || '',
    birth_date: row.birth_date ? String(row.birth_date) : '',
    previous_school: row.previous_school || '',
    parent_name: row.parent_name || '',
    parent_whatsapp: row.parent_whatsapp || '',
    home_address: row.home_address || '',
    status: (row.status as any) || 'submitted',
    registration_path: regPath,
    documents: {
      kk_url: docObj.kk_url || '',
      akta_url: docObj.akta_url || '',
      ijazah_url: docObj.ijazah_url || '',
      afirmasi_url: docObj.afirmasi_url || '',
      prestasi_url: docObj.prestasi_url || '',
      registration_path: regPath,
    },
    admin_notes: row.admin_notes || '',
    created_at: row.created_at || new Date().toISOString(),
  };
}

export async function GET() {
  // Keamanan Endpoint: Kunci ketat data privat calon santri hanya untuk Administrator
  const auth = await requireAuth(['admin']);
  if (!auth.authorized) {
    return auth.response!;
  }

  let localList: PpdbApplicantItem[] = [];

  // 1. Read fallback local JSON
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    localList = JSON.parse(fileContent);
  } catch (err) {
    console.warn('Could not read ppdbRegistrationsData.json:', err);
  }

  // 2. Fetch from Supabase primary persistent store
  try {
    const { data: supaData, error } = await supabaseServer
      .from('ppdb_registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && supaData && supaData.length > 0) {
      const supaMapped = supaData.map(unpackApplicant);

      // Best effort sync local cache
      try {
        await fs.writeFile(dataFilePath, JSON.stringify(supaMapped, null, 2), 'utf-8');
      } catch (_) {}

      return NextResponse.json(supaMapped, { headers: noCacheHeaders });
    }
  } catch (err) {
    console.warn('Supabase fetch failed for ppdb_registrations:', err);
  }

  return NextResponse.json(localList, { headers: noCacheHeaders });
}

export async function POST(request: Request) {
  try {
    // 0. Proteksi Batas Frekuensi Pendaftaran PPDB (Anti Spam Flooding)
    const cfIp = request.headers.get('cf-connecting-ip');
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const clientIp = cfIp || forwarded?.split(',')[0].trim() || realIp || '127.0.0.1';

    const rateCheck = checkEndpointRateLimit(clientIp, 'ppdb_reg', 10, 30 * 60);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Terlalu banyak formulir pendaftaran yang dikirim dari jaringan ini. Silakan coba kembali dalam ${Math.ceil(rateCheck.retryAfterSeconds / 60)} menit.`,
        },
        {
          status: 429,
          headers: { ...noCacheHeaders, 'Retry-After': String(rateCheck.retryAfterSeconds) },
        }
      );
    }

    const body = await request.json();

    // Anti-Bot Honeypot Protection
    if (body.hp_website || body.bot_field || body.website) {
      return NextResponse.json({
        success: true,
        message: 'Formulir pendaftaran berhasil dikirim dan tersimpan di database.',
      }, { headers: noCacheHeaders });
    }

    if (!body.full_name || !body.full_name.trim()) {
      return NextResponse.json(
        { success: false, message: 'Nama lengkap calon santri wajib diisi.' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    if (!body.parent_name || !body.parent_name.trim() || !body.parent_whatsapp || !body.parent_whatsapp.trim()) {
      return NextResponse.json(
        { success: false, message: 'Nama dan nomor WhatsApp orang tua/wali wajib diisi.' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    // Determine registration number
    let existingCount = 0;
    try {
      const { count } = await supabaseServer
        .from('ppdb_registrations')
        .select('*', { count: 'exact', head: true });
      if (typeof count === 'number') existingCount = count;
    } catch (_) {}

    if (existingCount === 0) {
      try {
        const fileContent = await fs.readFile(dataFilePath, 'utf-8');
        const list = JSON.parse(fileContent);
        if (Array.isArray(list)) existingCount = list.length;
      } catch (_) {}
    }

    const academicYear = '2027';
    const regNumber =
      body.registration_number ||
      `RH-${academicYear}-${String(existingCount + 1).padStart(3, '0')}`;

    const regPath = body.registration_path || 'domisili';
    const docObj = {
      ...(typeof body.documents === 'object' && body.documents ? body.documents : {}),
      registration_path: regPath,
    };

    // Sanitize birth_date for Postgres DATE column
    const birthDate = body.birth_date && String(body.birth_date).trim() ? String(body.birth_date).trim() : null;

    const insertPayload = {
      registration_number: regNumber,
      full_name: body.full_name.trim(),
      nisn: body.nisn && String(body.nisn).trim() ? String(body.nisn).trim() : null,
      gender: body.gender === 'P' ? 'P' : 'L',
      birth_place: (body.birth_place || 'Tangerang').trim(),
      birth_date: birthDate,
      previous_school: body.previous_school && String(body.previous_school).trim() ? String(body.previous_school).trim() : null,
      parent_name: body.parent_name.trim(),
      parent_whatsapp: body.parent_whatsapp.trim(),
      home_address: body.home_address && String(body.home_address).trim() ? String(body.home_address).trim() : null,
      status: body.status || 'submitted',
      documents: docObj,
      admin_notes: body.admin_notes && String(body.admin_notes).trim() ? String(body.admin_notes).trim() : null,
    };

    let savedItem: PpdbApplicantItem;

    // 1. Insert to Supabase (primary persistent store)
    const { data: inserted, error: supaErr } = await supabaseServer
      .from('ppdb_registrations')
      .insert(insertPayload)
      .select()
      .single();

    if (supaErr) {
      console.error('Supabase ppdb_registrations insert error:', supaErr);
      throw new Error(supaErr.message || 'Gagal menyimpan pendaftaran ke database.');
    }

    savedItem = unpackApplicant(inserted);

    // 2. Best-effort sync to local JSON
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf-8');
      const list: PpdbApplicantItem[] = JSON.parse(fileContent);
      list.unshift(savedItem);
      await fs.writeFile(dataFilePath, JSON.stringify(list, null, 2), 'utf-8');
    } catch (_) {}

    return NextResponse.json({
      success: true,
      message: 'Formulir pendaftaran berhasil dikirim dan tersimpan di database.',
      applicant: savedItem,
    }, { headers: noCacheHeaders });
  } catch (error: any) {
    console.error('Error in ppdb registrations POST:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal mengirim formulir pendaftaran.' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}

export async function PATCH(request: Request) {
  // Hanya Administrator yang dapat memverifikasi status atau mengubah data pendaftaran
  const auth = await requireAuth(['admin']);
  if (!auth.authorized) {
    return auth.response!;
  }

  try {
    const body = await request.json();
    const {
      id,
      registration_number,
      full_name,
      nisn,
      gender,
      birth_place,
      birth_date,
      previous_school,
      parent_name,
      parent_whatsapp,
      home_address,
      status,
      registration_path,
      documents,
      admin_notes,
    } = body;

    const targetId = id || registration_number;
    if (!targetId) {
      return NextResponse.json(
        { success: false, message: 'ID atau nomor registrasi diperlukan' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (full_name !== undefined) updatePayload.full_name = String(full_name).trim();
    if (nisn !== undefined) updatePayload.nisn = String(nisn).trim() || null;
    if (gender !== undefined) updatePayload.gender = gender === 'P' ? 'P' : 'L';
    if (birth_place !== undefined) updatePayload.birth_place = String(birth_place).trim();
    if (birth_date !== undefined) {
      updatePayload.birth_date = birth_date && String(birth_date).trim() ? String(birth_date).trim() : null;
    }
    if (previous_school !== undefined) updatePayload.previous_school = String(previous_school).trim() || null;
    if (parent_name !== undefined) updatePayload.parent_name = String(parent_name).trim();
    if (parent_whatsapp !== undefined) updatePayload.parent_whatsapp = String(parent_whatsapp).trim();
    if (home_address !== undefined) updatePayload.home_address = String(home_address).trim() || null;
    if (status !== undefined) updatePayload.status = status;
    if (admin_notes !== undefined) updatePayload.admin_notes = String(admin_notes).trim() || null;

    // Handle documents and registration_path safely
    if (documents !== undefined || registration_path !== undefined) {
      const mergedDocs = {
        ...(typeof documents === 'object' && documents ? documents : {}),
      };
      if (registration_path) {
        mergedDocs.registration_path = registration_path;
      }
      updatePayload.documents = mergedDocs;
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(targetId));

    let updatedRow: any = null;

    if (isUuid) {
      const { data, error } = await supabaseServer
        .from('ppdb_registrations')
        .update(updatePayload)
        .eq('id', targetId)
        .select()
        .single();

      if (error) {
        console.error('Supabase update applicant error:', error);
        throw new Error(error.message);
      }
      updatedRow = data;
    } else {
      const { data, error } = await supabaseServer
        .from('ppdb_registrations')
        .update(updatePayload)
        .eq('registration_number', targetId)
        .select()
        .single();

      if (error) {
        console.error('Supabase update applicant error:', error);
        throw new Error(error.message);
      }
      updatedRow = data;
    }

    const updatedItem = unpackApplicant(updatedRow);

    // Best-effort local file update
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf-8');
      const list: PpdbApplicantItem[] = JSON.parse(fileContent);
      const idx = list.findIndex((a) => String(a.id) === String(targetId) || a.registration_number === targetId);
      if (idx >= 0) {
        list[idx] = updatedItem;
        await fs.writeFile(dataFilePath, JSON.stringify(list, null, 2), 'utf-8');
      }
    } catch (_) {}

    return NextResponse.json({
      success: true,
      message: 'Data pendaftar berhasil diperbarui.',
      applicant: updatedItem,
    }, { headers: noCacheHeaders });
  } catch (error: any) {
    console.error('Error in ppdb registrations PATCH:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal memperbarui data pendaftar.' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}

export async function DELETE(request: Request) {
  // Hanya Administrator yang berhak menghapus data pendaftar
  const auth = await requireAuth(['admin']);
  if (!auth.authorized) {
    return auth.response!;
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID diperlukan' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id));

    // 1. Fetch document URLs to clean up uploaded files in Supabase storage
    try {
      const query = isUuid
        ? supabaseServer.from('ppdb_registrations').select('documents').eq('id', id).single()
        : supabaseServer.from('ppdb_registrations').select('documents').eq('registration_number', id).single();

      const { data: itemData } = await query;
      if (itemData?.documents && typeof itemData.documents === 'object') {
        const docs = itemData.documents as Record<string, string>;
        if (docs.kk_url) await deleteStorageFile(docs.kk_url);
        if (docs.akta_url) await deleteStorageFile(docs.akta_url);
        if (docs.ijazah_url) await deleteStorageFile(docs.ijazah_url);
        if (docs.afirmasi_url) await deleteStorageFile(docs.afirmasi_url);
        if (docs.prestasi_url) await deleteStorageFile(docs.prestasi_url);
      }
    } catch (_) {}

    // 2. Delete from Supabase
    if (isUuid) {
      const { error: delErr } = await supabaseServer
        .from('ppdb_registrations')
        .delete()
        .eq('id', id);

      if (delErr) {
        console.error('Supabase delete applicant error:', delErr);
        throw new Error(delErr.message);
      }
    } else {
      const { error: delErr } = await supabaseServer
        .from('ppdb_registrations')
        .delete()
        .eq('registration_number', id);

      if (delErr) {
        console.error('Supabase delete applicant error:', delErr);
        throw new Error(delErr.message);
      }
    }

    // 3. Best-effort delete from local file
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf-8');
      let list: PpdbApplicantItem[] = JSON.parse(fileContent);
      list = list.filter((a) => String(a.id) !== String(id) && a.registration_number !== id);
      await fs.writeFile(dataFilePath, JSON.stringify(list, null, 2), 'utf-8');
    } catch (_) {}

    return NextResponse.json({
      success: true,
      message: 'Data pendaftar berhasil dihapus.',
    }, { headers: noCacheHeaders });
  } catch (error: any) {
    console.error('Error in ppdb registrations DELETE:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal menghapus data pendaftar.' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}
