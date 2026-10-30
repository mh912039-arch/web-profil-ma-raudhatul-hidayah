import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getExistingSchedules, persistSchedules, ScheduleItem } from '@/lib/scheduleStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rombel = searchParams.get('rombel');
    const day = searchParams.get('day');

    let schedules = await getExistingSchedules();

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
    const schedules = await getExistingSchedules();

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
    await persistSchedules(schedules);

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
    const schedules = await getExistingSchedules();

    const index = schedules.findIndex((s) => s.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404, headers: noCacheHeaders });
    }

    schedules[index] = {
      ...schedules[index],
      ...body,
      session_no: Number(body.session_no) || schedules[index].session_no,
    };

    await persistSchedules(schedules);
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

    let schedules = await getExistingSchedules();
    const originalLength = schedules.length;
    schedules = schedules.filter((s) => s.id !== id);

    if (schedules.length === originalLength) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404, headers: noCacheHeaders });
    }

    await persistSchedules(schedules);
    return NextResponse.json({ success: true, message: 'Schedule deleted' }, { headers: noCacheHeaders });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to delete schedule: ' + message }, { status: 500, headers: noCacheHeaders });
  }
}
