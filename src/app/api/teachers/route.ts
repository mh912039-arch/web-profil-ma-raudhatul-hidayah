import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { supabase } from '@/lib/supabaseClient';

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
  if (cd.startsWith('sd') || cl.includes('sd') || /kelas [1-6]\b/.test(cl)) return 'sd';
  if (cd.startsWith('smp') || cl.includes('smp') || cl.includes('vii') || cl.includes('viii') || cl.includes('ix')) return 'smp';
  return 'sma';
}

export async function GET() {
  let localTeachers: TeacherItem[] = [];

  // 1. Read local JSON
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    localTeachers = JSON.parse(fileContent);
  } catch (err) {
    console.warn('Could not read teachersData.json:', err);
  }

  // 2. Fetch from Supabase
  try {
    const { data: supaTeachers, error } = await supabase
      .from('teachers_staff')
      .select('*')
      .order('order_no', { ascending: true });

    if (!error && supaTeachers && supaTeachers.length > 0) {
      const supaMapped: TeacherItem[] = supaTeachers.map((t: any) => ({
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

      // Merge: Local edits have precedence for corresponding order_no or id
      const localMap = new Map<string, TeacherItem>();
      localTeachers.forEach((lt) => {
        if (!lt.jenjang) lt.jenjang = detectJenjang(lt.class_level, lt.code);
        if (lt.id) localMap.set(String(lt.id), lt);
        localMap.set(`code-${lt.code}-order-${lt.order_no}`, lt);
      });

      const merged = supaMapped.map((st) => {
        const localMatch = localMap.get(String(st.id)) || localMap.get(`code-${st.code}-order-${st.order_no}`);
        if (localMatch) {
          return { ...st, ...localMatch, jenjang: localMatch.jenjang || detectJenjang(localMatch.class_level, localMatch.code) };
        }
        return st;
      });

      // Add any local teachers not in Supabase
      const supaIds = new Set(supaMapped.map((s) => String(s.id)));
      localTeachers.forEach((lt) => {
        if (!lt.jenjang) lt.jenjang = detectJenjang(lt.class_level, lt.code);
        if (lt.id && !supaIds.has(String(lt.id))) {
          merged.push(lt);
        }
      });

      merged.sort((a, b) => a.order_no - b.order_no);
      return NextResponse.json(merged);
    }
  } catch (err) {
    console.warn('Notice: Supabase teachers_staff fetch:', err);
  }

  localTeachers.forEach((lt) => {
    if (!lt.jenjang) lt.jenjang = detectJenjang(lt.class_level, lt.code);
  });
  localTeachers.sort((a, b) => a.order_no - b.order_no);
  return NextResponse.json(localTeachers);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.subject_name) {
      return NextResponse.json(
        { success: false, message: 'Nama guru dan mata pelajaran wajib diisi.' },
        { status: 400 }
      );
    }

    let teachers: TeacherItem[] = [];
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf-8');
      teachers = JSON.parse(fileContent);
    } catch (err) {}

    const id = body.id || `teacher-${Date.now()}`;
    const newOrUpdated: TeacherItem = {
      id,
      order_no: Number(body.order_no) || (teachers.length + 1),
      code: String(body.code || (teachers.length + 1)).trim(),
      name: body.name.trim(),
      nip: (body.nip || '').trim() || null,
      role: (body.role || 'Dewan Guru').trim(),
      subject_name: body.subject_name.trim(),
      class_level: (body.class_level || 'Semua Kelas').trim(),
      jenjang: body.jenjang || detectJenjang(body.class_level, body.code),
      category_label: (body.category_label || 'Pendidikan Agama Islam').trim(),
      image_url: (body.image_url || '/hero/slide-1.jpg').trim(),
      education: (body.education || '').trim() || null,
      is_active: body.is_active !== undefined ? Boolean(body.is_active) : true,
      updated_at: new Date().toISOString(),
    };

    // Update or insert locally
    const existingIdx = teachers.findIndex(
      (t) => (t.id && String(t.id) === String(id)) || Number(t.order_no) === Number(newOrUpdated.order_no)
    );

    if (existingIdx >= 0) {
      teachers[existingIdx] = { ...teachers[existingIdx], ...newOrUpdated };
    } else {
      teachers.push(newOrUpdated);
    }

    teachers.sort((a, b) => a.order_no - b.order_no);

    // Save locally
    await fs.writeFile(dataFilePath, JSON.stringify(teachers, null, 2), 'utf-8');

    // Also sync to Supabase safely
    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(body.id));
      if (isUuid) {
        await supabase
          .from('teachers_staff')
          .update({
            order_no: newOrUpdated.order_no,
            code: newOrUpdated.code,
            name: newOrUpdated.name,
            nip: newOrUpdated.nip,
            role: newOrUpdated.role || 'Dewan Guru',
            subject_name: newOrUpdated.subject_name,
            class_level: newOrUpdated.class_level,
            category_label: newOrUpdated.category_label,
            image_url: newOrUpdated.image_url,
            is_active: newOrUpdated.is_active,
          })
          .eq('id', body.id);
      } else {
        // Match existing teacher in Supabase by code or order_no
        const { data: existing } = await supabase
          .from('teachers_staff')
          .select('id')
          .or(`code.eq.${newOrUpdated.code},order_no.eq.${newOrUpdated.order_no}`)
          .limit(1);

        if (existing && existing.length > 0) {
          const matchedId = existing[0].id;
          newOrUpdated.id = matchedId;
          await supabase
            .from('teachers_staff')
            .update({
              order_no: newOrUpdated.order_no,
              code: newOrUpdated.code,
              name: newOrUpdated.name,
              nip: newOrUpdated.nip,
              role: newOrUpdated.role || 'Dewan Guru',
              subject_name: newOrUpdated.subject_name,
              class_level: newOrUpdated.class_level,
              category_label: newOrUpdated.category_label,
              image_url: newOrUpdated.image_url,
              is_active: newOrUpdated.is_active,
            })
            .eq('id', matchedId);
        } else {
          const { data: inserted } = await supabase
            .from('teachers_staff')
            .insert({
              order_no: newOrUpdated.order_no,
              code: newOrUpdated.code,
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
      console.warn('Notice: Supabase teachers_staff sync:', supaErr);
    }

    return NextResponse.json({
      success: true,
      message: `Data guru "${newOrUpdated.name}" berhasil disimpan dan langsung diterapkan ke web profil.`,
      data: newOrUpdated,
    });
  } catch (error: any) {
    console.error('Error in teachers POST:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal menyimpan data guru.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID diperlukan' }, { status: 400 });
    }

    let teachers: TeacherItem[] = [];
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf-8');
      teachers = JSON.parse(fileContent);
      teachers = teachers.filter((t) => String(t.id) !== String(id) && String(t.order_no) !== String(id));
      await fs.writeFile(dataFilePath, JSON.stringify(teachers, null, 2), 'utf-8');
    } catch (err) {}

    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id));
      if (isUuid) {
        await supabase.from('teachers_staff').delete().eq('id', id);
      } else if (!isNaN(Number(id))) {
        await supabase.from('teachers_staff').delete().eq('order_no', Number(id));
      }
    } catch (err) {}

    return NextResponse.json({
      success: true,
      message: 'Data guru berhasil dihapus.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal menghapus data guru.' },
      { status: 500 }
    );
  }
}
