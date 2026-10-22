import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { requireAuth } from '@/lib/auth';

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

function getSchedules(): ScheduleItem[] {
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

function saveSchedules(schedules: ScheduleItem[]) {
  try {
    fs.writeFileSync(schedulesFilePath, JSON.stringify(schedules, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing schedules:', error);
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rombel = searchParams.get('rombel');
    const day = searchParams.get('day');

    let schedules = getSchedules();

    if (rombel) {
      schedules = schedules.filter((s) => s.class_rombel.toLowerCase() === rombel.toLowerCase());
    }
    if (day) {
      schedules = schedules.filter((s) => s.day.toLowerCase() === day.toLowerCase());
    }

    return NextResponse.json(schedules);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to fetch schedules: ' + message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = requireAuth(['admin', 'guru']);
  if (!auth.authorized) {
    return auth.response!;
  }

  try {
    const body = await req.json();
    const schedules = getSchedules();

    const newItem: ScheduleItem = {
      id: body.id || `sch-${Date.now()}`,
      class_rombel: body.class_rombel || 'Kelas VIII-A',
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
    saveSchedules(schedules);

    return NextResponse.json({ success: true, item: newItem });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to save schedule: ' + message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const auth = requireAuth(['admin', 'guru']);
  if (!auth.authorized) {
    return auth.response!;
  }

  try {
    const body = await req.json();
    const schedules = getSchedules();

    const index = schedules.findIndex((s) => s.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
    }

    schedules[index] = {
      ...schedules[index],
      ...body,
      session_no: Number(body.session_no) || schedules[index].session_no,
    };

    saveSchedules(schedules);
    return NextResponse.json({ success: true, item: schedules[index] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to update schedule: ' + message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const auth = requireAuth(['admin', 'guru']);
  if (!auth.authorized) {
    return auth.response!;
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Schedule ID required' }, { status: 400 });
    }

    let schedules = getSchedules();
    const originalLength = schedules.length;
    schedules = schedules.filter((s) => s.id !== id);

    if (schedules.length === originalLength) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
    }

    saveSchedules(schedules);
    return NextResponse.json({ success: true, message: 'Schedule deleted' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to delete schedule: ' + message }, { status: 500 });
  }
}
