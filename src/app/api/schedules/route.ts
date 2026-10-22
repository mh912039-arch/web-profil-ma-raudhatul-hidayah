import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { requireAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

const schedulesFilePath = path.join(process.cwd(), 'src', 'data', 'schedulesData.json');

export interface ScheduleItem {
  id: string;
  class_rombel: string;
  day: string;
  session_no: number;
  time_start: string;
  time_end: string;
  subject_name: string;
  category: string;
  teacher_name: string;
  room: string;
}

async function getSchedules(): Promise<ScheduleItem[]> {
  // 1. Prioritaskan data persisten dari Supabase
  try {
    const { data: supaData } = await supabase
      .from('teachers_staff')
      .select('education')
      .eq('code', 'SYS_SCH')
      .maybeSingle();

    if (supaData?.education) {
      const parsed = JSON.parse(supaData.education);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Supabase SYS_SCH read error:', err);
  }

  // 2. Fallback ke file JSON lokal
  try {
    if (fs.existsSync(schedulesFilePath)) {
      const data = fs.readFileSync(schedulesFilePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading schedules:', error);
  }
  return [];
}

async function saveSchedules(schedules: ScheduleItem[]): Promise<void> {
  // 1. Simpan ke Supabase agar persisten di Vercel Serverless
  try {
    const { data: updated, error } = await supabase
      .from('teachers_staff')
      .update({ education: JSON.stringify(schedules) })
      .eq('code', 'SYS_SCH')
      .select('id');

    if (error || !updated || updated.length === 0) {
      await supabase.from('teachers_staff').insert({
        name: 'System Schedules Store',
        code: 'SYS_SCH',
        category_label: 'Sistem',
        subject_name: 'Schedules',
        education: JSON.stringify(schedules),
        order_no: 9997,
        role: 'system',
      });
    }
  } catch (err) {
    console.warn('Failed to sync schedules to Supabase:', err);
  }

  // 2. Best-effort write ke file lokal (abaikan aman jika read-only di Vercel)
  try {
    fs.writeFileSync(schedulesFilePath, JSON.stringify(schedules, null, 2), 'utf8');
  } catch (error) {
    // EROFS safe
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rombel = searchParams.get('rombel');
    const day = searchParams.get('day');

    let schedules = await getSchedules();

    if (rombel) {
      schedules = schedules.filter((s) => s.class_rombel.toLowerCase() === rombel.toLowerCase());
    }
    if (day) {
      schedules = schedules.filter((s) => s.day.toLowerCase() === day.toLowerCase());
    }

    return NextResponse.json(schedules, { headers: noCacheHeaders });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to fetch schedules: ' + message }, { status: 500, headers: noCacheHeaders });
  }
}

export async function POST(req: Request) {
  const auth = await requireAuth(['admin', 'guru']);
  if (!auth.authorized) {
    return auth.response!;
  }

  try {
    const body = await req.json();
    const schedules = await getSchedules();

    const newItem: ScheduleItem = {
      id: body.id || `sch-${Date.now()}`,
      class_rombel: body.class_rombel || 'SMP - Kelas VIII',
      day: body.day || 'Senin',
      session_no: Number(body.session_no) || 1,
      time_start: body.time_start || '07:30',
      time_end: body.time_end || '08:15',
      subject_name: body.subject_name || 'Mata Pelajaran',
      category: body.category || 'Mata Pelajaran Wajib',
      teacher_name: body.teacher_name || 'Dewan Guru',
      room: body.room || 'Ruang Kelas',
    };

    schedules.push(newItem);
    await saveSchedules(schedules);

    return NextResponse.json({ success: true, item: newItem }, { headers: noCacheHeaders });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to save schedule: ' + message }, { status: 500, headers: noCacheHeaders });
  }
}

export async function PUT(req: Request) {
  const auth = await requireAuth(['admin', 'guru']);
  if (!auth.authorized) {
    return auth.response!;
  }

  try {
    const body = await req.json();
    const schedules = await getSchedules();

    const index = schedules.findIndex((s) => s.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404, headers: noCacheHeaders });
    }

    schedules[index] = {
      ...schedules[index],
      ...body,
      session_no: Number(body.session_no) || schedules[index].session_no,
    };

    await saveSchedules(schedules);
    return NextResponse.json({ success: true, item: schedules[index] }, { headers: noCacheHeaders });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to update schedule: ' + message }, { status: 500, headers: noCacheHeaders });
  }
}

export async function DELETE(req: Request) {
  const auth = await requireAuth(['admin', 'guru']);
  if (!auth.authorized) {
    return auth.response!;
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Schedule ID required' }, { status: 400, headers: noCacheHeaders });
    }

    let schedules = await getSchedules();
    const originalLength = schedules.length;
    schedules = schedules.filter((s) => s.id !== id);

    if (schedules.length === originalLength) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404, headers: noCacheHeaders });
    }

    await saveSchedules(schedules);
    return NextResponse.json({ success: true, message: 'Schedule deleted' }, { headers: noCacheHeaders });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to delete schedule: ' + message }, { status: 500, headers: noCacheHeaders });
  }
}
