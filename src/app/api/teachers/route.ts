import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { supabase } from '@/lib/supabaseClient';
import { requireAuth } from '@/lib/auth';
import { deleteStorageFile } from '@/lib/storageHelper';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'teachersData.json');

export interface TeacherItem {
  id?: string;
  order_no: number;
  code: string;
  name: string;
  nip?: string | null;
  role?: string;
  subject_name: string;
  class_level: string;
  jenjang?: 'sd' | 'smp' | 'sma';
  category_label: string;
  image_url: string;
  education?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

function detectJenjang(classLevel: string, code: string): 'sd' | 'smp' | 'sma' {
  const cl = (classLevel || '').toLowerCase();
  const cd = (code || '').toLowerCase();
  if (cd.startsWith('sd') || cl.includes('sd') || /kelas (i|ii|iii|iv|v|vi|[1-6])\b/i.test(cl)) return 'sd';
  if (cd.startsWith('smp') || cl.includes('smp') || cl.includes('vii') || cl.includes('viii') || cl.includes('ix') || /kelas [7-9]\b/.test(cl)) return 'smp';
  return 'sma';
}

async function readTeachersUnified(): Promise<TeacherItem[]> {
  // 1. Cek penyimpanan persisten terpadu di Supabase (SYS_TCH)
  try {
    const { data: sysTch } = await supabase
      .from('teachers_staff')
      .select('education')
      .eq('code', 'SYS_TCH')
      .maybeSingle();

    if (sysTch?.education) {
      const parsed = JSON.parse(sysTch.education);
      if (Array.isArray(parsed) && parsed.length > 0) {
        parsed.sort((a, b) => (a.order_no || 0) - (b.order_no || 0));
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Notice: Supabase SYS_TCH read:', err);
  }

  // 2. Fallback: Baca dari baris individual teachers_staff
  let localTeachers: TeacherItem[] = [];
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    localTeachers = JSON.parse(fileContent);
  } catch (err) {
    console.warn('Could not read teachersData.json:', err);
  }

  try {
    const { data: supaTeachers, error } = await supabase
      .from('teachers_staff')
      .select('*')
      .order('order_no', { ascending: true });

    if (!error && supaTeachers && supaTeachers.length > 0) {
      const validSupaTeachers = supaTeachers.filter(
        (t: any) => !String(t.code || '').startsWith('SYS_') && t.role !== 'system'
      );
      const supaMapped: TeacherItem[] = validSupaTeachers.map((t: any) => ({
        id: t.id,
        order_no: Number(t.order_no),
        code: String(t.code),
        name: t.name,
        nip: t.nip || null,
        role: t.role || 'Dewan Guru',
        subject_name: t.subject_name,
        class_level: t.class_level || 'Semua Kelas',
        jenjang: t.jenjang || detectJenjang(t.class_level, t.code),
        category_label: t.category_label || 'Pendidikan Agama Islam',
        image_url: t.image_url || '/hero/slide-1.jpg',
        education: t.education || null,
        is_active: t.is_active !== undefined ? t.is_active : true,
      }));

      const supaCodesAndOrders = new Set(supaMapped.map((s) => `code-${s.code}-order-${s.order_no}`));
      const supaIds = new Set(supaMapped.map((s) => String(s.id)));
      const merged: TeacherItem[] = [...supaMapped];

      localTeachers.forEach((lt) => {
        const jenjang = lt.jenjang || detectJenjang(lt.class_level, lt.code);
        const key = `code-${lt.code}-order-${lt.order_no}`;
        if (!supaCodesAndOrders.has(key) && (!lt.id || !supaIds.has(String(lt.id)))) {
          merged.push({ ...lt, jenjang });
        }
      });

      merged.sort((a, b) => a.order_no - b.order_no);
      return merged;
    }
  } catch (err) {
    console.warn('Notice: Supabase teachers_staff fetch:', err);
  }

  localTeachers.forEach((lt) => {
    if (!lt.jenjang) lt.jenjang = detectJenjang(lt.class_level, lt.code);
  });
  localTeachers.sort((a, b) => a.order_no - b.order_no);
  return localTeachers;
}

async function writeTeachersUnified(list: TeacherItem[]): Promise<void> {
  // 1. Simpan ke Supabase SYS_TCH agar persisten 100% di Vercel
  try {
    const { data: updated, error } = await supabase
      .from('teachers_staff')
      .update({ education: JSON.stringify(list) })
      .eq('code', 'SYS_TCH')
      .select('id');

    if (error || !updated || updated.length === 0) {
      await supabase.from('teachers_staff').insert({
        name: 'System Teachers Store',
        code: 'SYS_TCH',
        category_label: 'Sistem',
        subject_name: 'Teachers',
        education: JSON.stringify(list),
        order_no: 9996,
        role: 'system',
      });
    }
  } catch (err) {
    console.warn('Failed to sync SYS_TCH to Supabase:', err);
  }

  // 2. Best-effort write ke file lokal
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    // EROFS safe on Vercel
  }
}

export async function GET() {
  const teachers = await readTeachersUnified();
  return NextResponse.json(teachers, { headers: noCacheHeaders });
}

export async function POST(request: Request) {
  // Hanya Administrator yang dapat menambah atau mengubah data guru
  const auth = await requireAuth(['admin']);
  if (!auth.authorized) {
    return auth.response!;
  }

  try {
    const body = await request.json();

    if (!body.name || !body.subject_name) {
      return NextResponse.json(
        { success: false, message: 'Nama guru dan mata pelajaran wajib diisi.' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    const currentList = await readTeachersUnified();
    const id = body.id || `teacher-${Date.now()}`;
    const targetJenjang = body.jenjang || detectJenjang(body.class_level, body.code);

    const newOrUpdated: TeacherItem = {
      id,
      order_no: Number(body.order_no) || (currentList.length + 1),
      code: String(body.code || (currentList.length + 1)).trim(),
      name: body.name.trim(),
      nip: (body.nip || '').trim() || null,
      role: (body.role || 'Dewan Guru').trim(),
      subject_name: body.subject_name.trim(),
      class_level: (body.class_level || 'Semua Kelas').trim(),
      jenjang: targetJenjang,
      category_label: (body.category_label || 'Pendidikan Agama Islam').trim(),
      image_url: (body.image_url || '/hero/slide-1.jpg').trim(),
      education: (body.education || '').trim() || null,
      is_active: body.is_active !== undefined ? Boolean(body.is_active) : true,
      updated_at: new Date().toISOString(),
    };

    // 1. Update/Insert in Supabase individual rows
    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(body.id));
      if (isUuid) {
        const { data: updatedData } = await supabase
          .from('teachers_staff')
          .update({
            order_no: newOrUpdated.order_no,
            code: newOrUpdated.code.slice(0, 10),
            name: newOrUpdated.name,
            nip: newOrUpdated.nip,
            role: newOrUpdated.role || 'Dewan Guru',
            subject_name: newOrUpdated.subject_name,
            class_level: newOrUpdated.class_level,
            category_label: newOrUpdated.category_label,
            image_url: newOrUpdated.image_url,
            is_active: newOrUpdated.is_active,
            updated_at: new Date().toISOString(),
          })
          .eq('id', body.id)
          .select()
          .single();
        if (updatedData?.id) {
          newOrUpdated.id = updatedData.id;
        }
      } else {
        const { data: existing } = await supabase
          .from('teachers_staff')
          .select('id')
          .or(`code.eq.${newOrUpdated.code.slice(0, 10)},order_no.eq.${newOrUpdated.order_no}`)
          .limit(1);

        if (existing && existing.length > 0) {
          const matchedId = existing[0].id;
          newOrUpdated.id = matchedId;
          await supabase
            .from('teachers_staff')
            .update({
              order_no: newOrUpdated.order_no,
              code: newOrUpdated.code.slice(0, 10),
              name: newOrUpdated.name,
              nip: newOrUpdated.nip,
              role: newOrUpdated.role || 'Dewan Guru',
              subject_name: newOrUpdated.subject_name,
              class_level: newOrUpdated.class_level,
              category_label: newOrUpdated.category_label,
              image_url: newOrUpdated.image_url,
              is_active: newOrUpdated.is_active,
              updated_at: new Date().toISOString(),
            })
            .eq('id', matchedId);
        } else {
          const { data: inserted } = await supabase
            .from('teachers_staff')
            .insert({
              order_no: newOrUpdated.order_no,
              code: newOrUpdated.code.slice(0, 10),
              name: newOrUpdated.name,
              nip: newOrUpdated.nip,
              role: newOrUpdated.role || 'Dewan Guru',
              subject_name: newOrUpdated.subject_name,
              class_level: newOrUpdated.class_level,
              category_label: newOrUpdated.category_label,
              image_url: newOrUpdated.image_url,
              is_active: newOrUpdated.is_active,
            })
            .select()
            .single();
          if (inserted?.id) {
            newOrUpdated.id = inserted.id;
          }
        }
      }
    } catch (supaErr) {
      console.warn('Notice: Supabase teachers_staff row sync:', supaErr);
    }

    // 2. Update unified persistent list
    const existingIdx = currentList.findIndex(
      (t) =>
        (t.id && String(t.id) === String(newOrUpdated.id)) ||
        (t.id && String(t.id) === String(body.id)) ||
        (String(t.code) === String(newOrUpdated.code) && (t.jenjang === newOrUpdated.jenjang || !t.jenjang))
    );

    if (existingIdx >= 0) {
      currentList[existingIdx] = { ...currentList[existingIdx], ...newOrUpdated };
    } else {
      currentList.push(newOrUpdated);
    }

    currentList.sort((a, b) => a.order_no - b.order_no);
    await writeTeachersUnified(currentList);

    return NextResponse.json(
      {
        success: true,
        message: `Data guru "${newOrUpdated.name}" (${newOrUpdated.subject_name}) berhasil disimpan dan langsung aktif di web profil.`,
        data: newOrUpdated,
      },
      { headers: noCacheHeaders }
    );
  } catch (error: any) {
    console.error('Error in teachers POST:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal menyimpan data guru.' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}

export async function DELETE(request: Request) {
  // Hanya Administrator yang dapat menghapus data guru
  const auth = await requireAuth(['admin']);
  if (!auth.authorized) {
    return auth.response!;
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID diperlukan' }, { status: 400, headers: noCacheHeaders });
    }

    // 1. Delete from Supabase individual rows
    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id));
      if (isUuid) {
        await supabase.from('teachers_staff').delete().eq('id', id);
      } else if (!isNaN(Number(id))) {
        await supabase.from('teachers_staff').delete().eq('order_no', Number(id));
      }
    } catch (err) {}

    // 2. Delete from unified persistent store
    const currentList = await readTeachersUnified();
    const targetTeacher = currentList.find(
      (t) => String(t.id) === String(id) || String(t.order_no) === String(id)
    );
    if (targetTeacher?.image_url) {
      await deleteStorageFile(targetTeacher.image_url);
    }
    const filtered = currentList.filter(
      (t) => String(t.id) !== String(id) && String(t.order_no) !== String(id)
    );
    await writeTeachersUnified(filtered);

    return NextResponse.json({
      success: true,
      message: 'Data guru berhasil dihapus.',
    }, { headers: noCacheHeaders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal menghapus data guru.' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}
