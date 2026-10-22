import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

export type ClassJenjang = 'sd' | 'smp' | 'sma';

export interface ClassRombel {
  id: string;
  code: string;
  name: string;
  jenjang: ClassJenjang;
  level: string;
  homeroom_teacher: string;
  total_students: number;
  room_location?: string;
  curriculum: string;
}

const defaultClasses: ClassRombel[] = [
  // 1. Jenjang SD
  { id: 'cls-sd-1', code: 'I', name: 'SD - Kelas I', jenjang: 'sd', level: 'Jenjang SD (Kelas I • Fase A)', homeroom_teacher: 'KUSTYANINGSIH, S.Pd', total_students: 26, curriculum: 'Kurikulum Merdeka' },
  { id: 'cls-sd-2', code: 'II', name: 'SD - Kelas II', jenjang: 'sd', level: 'Jenjang SD (Kelas II • Fase A)', homeroom_teacher: 'SARNAH, S.Pd.I', total_students: 25, curriculum: 'Kurikulum Merdeka' },
  { id: 'cls-sd-3', code: 'III', name: 'SD - Kelas III', jenjang: 'sd', level: 'Jenjang SD (Kelas III • Fase B)', homeroom_teacher: 'TAJUDIN, S.Pd.I', total_students: 28, curriculum: 'Kurikulum Merdeka' },
  { id: 'cls-sd-4', code: 'IV', name: 'SD - Kelas IV', jenjang: 'sd', level: 'Jenjang SD (Kelas IV • Fase B)', homeroom_teacher: 'MADROSYID, S.Pd', total_students: 27, curriculum: 'Kurikulum Merdeka' },
  { id: 'cls-sd-5', code: 'V', name: 'SD - Kelas V', jenjang: 'sd', level: 'Jenjang SD (Kelas V • Fase C)', homeroom_teacher: 'Drs. MULYADI', total_students: 29, curriculum: 'Kurikulum Merdeka' },
  { id: 'cls-sd-6', code: 'VI', name: 'SD - Kelas VI', jenjang: 'sd', level: 'Jenjang SD (Kelas VI • Fase C)', homeroom_teacher: 'JAKARIA, S.Pd.I', total_students: 30, curriculum: 'Kurikulum Merdeka' },
  // 2. Jenjang SMP
  { id: 'cls-smp-1', code: 'VII', name: 'SMP - Kelas VII', jenjang: 'smp', level: 'Jenjang SMP (Kelas VII • Fase D)', homeroom_teacher: 'TAJUDIN, S.Pd.I', total_students: 32, curriculum: 'Kurikulum Merdeka' },
  { id: 'cls-smp-2', code: 'VIII', name: 'SMP - Kelas VIII', jenjang: 'smp', level: 'Jenjang SMP (Kelas VIII • Fase D)', homeroom_teacher: 'SITI KHAERUNNISA, S.Pd.I', total_students: 31, curriculum: 'Kurikulum Merdeka' },
  { id: 'cls-smp-3', code: 'IX', name: 'SMP - Kelas IX', jenjang: 'smp', level: 'Jenjang SMP (Kelas IX • Fase D)', homeroom_teacher: 'MADROSYID, S.Pd', total_students: 30, curriculum: 'Kurikulum Merdeka' },
  // 3. Jenjang SMA / MA
  { id: 'cls-sma-1', code: 'X', name: 'SMA - Kelas X', jenjang: 'sma', level: 'Jenjang SMA (Kelas X • Fase E)', homeroom_teacher: 'SARNAH, S.Pd.I', total_students: 32, curriculum: 'Kurikulum Merdeka' },
  { id: 'cls-sma-2', code: 'XI', name: 'SMA - Kelas XI', jenjang: 'sma', level: 'Jenjang SMA (Kelas XI • Fase F)', homeroom_teacher: 'YAHYA HIDAYATULLOH, S.Pd.I', total_students: 30, curriculum: 'Kurikulum Merdeka' },
  { id: 'cls-sma-3', code: 'XII', name: 'SMA - Kelas XII', jenjang: 'sma', level: 'Jenjang SMA (Kelas XII • Fase F)', homeroom_teacher: 'TISKA PUSPITA DEWI, S.Pd.I', total_students: 28, curriculum: 'Kurikulum Merdeka' },
];

async function getClasses(): Promise<ClassRombel[]> {
  try {
    const { data: supaData } = await supabase
      .from('teachers_staff')
      .select('education')
      .eq('code', 'SYS_CLS')
      .maybeSingle();

    if (supaData?.education) {
      const parsed = JSON.parse(supaData.education);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Notice: Supabase SYS_CLS read:', err);
  }

  return defaultClasses;
}

async function saveClasses(list: ClassRombel[]): Promise<void> {
  try {
    const { data: updated, error } = await supabase
      .from('teachers_staff')
      .update({ education: JSON.stringify(list) })
      .eq('code', 'SYS_CLS')
      .select('id');

    if (error || !updated || updated.length === 0) {
      await supabase.from('teachers_staff').insert({
        name: 'System Classes Store',
        code: 'SYS_CLS',
        category_label: 'Sistem',
        subject_name: 'Classes',
        education: JSON.stringify(list),
        order_no: 9994,
        role: 'system',
      });
    }
  } catch (err) {
    console.warn('Failed to sync SYS_CLS to Supabase:', err);
  }
}

export async function GET() {
  const classes = await getClasses();
  return NextResponse.json(classes, { headers: noCacheHeaders });
}

export async function PUT(request: Request) {
  const auth = await requireAuth(['admin']);
  if (!auth.authorized) {
    return auth.response!;
  }

  try {
    const body = await request.json();
    const { id, homeroom_teacher, total_students, name, curriculum } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID rombel diperlukan' }, { status: 400, headers: noCacheHeaders });
    }

    const currentClasses = await getClasses();
    const idx = currentClasses.findIndex((c) => c.id === id);

    if (idx === -1) {
      return NextResponse.json({ success: false, message: 'Rombel tidak ditemukan' }, { status: 404, headers: noCacheHeaders });
    }

    if (homeroom_teacher !== undefined) currentClasses[idx].homeroom_teacher = homeroom_teacher;
    if (total_students !== undefined) currentClasses[idx].total_students = Number(total_students);
    if (name !== undefined) currentClasses[idx].name = name;
    if (curriculum !== undefined) currentClasses[idx].curriculum = curriculum;

    await saveClasses(currentClasses);

    return NextResponse.json({ success: true, item: currentClasses[idx] }, { headers: noCacheHeaders });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500, headers: noCacheHeaders });
  }
}
