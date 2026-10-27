import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { requireAuth } from '@/lib/auth';
import { supabaseServer } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

const calendarFilePath = path.join(process.cwd(), 'src', 'data', 'calendarData.json');

export interface AcademicEvent {
  id: string;
  title: string;
  date_range: string;
  semester: string;
  category: 'ujian' | 'libur' | 'ppdb' | 'kegiatan';
  description: string;
}

async function getEvents(): Promise<AcademicEvent[]> {
  // 1. Cek penyimpanan persisten di Supabase (SYS_CAL)
  try {
    const { data: supaData } = await supabaseServer
      .from('teachers_staff')
      .select('education')
      .eq('code', 'SYS_CAL')
      .maybeSingle();

    if (supaData && typeof supaData.education === 'string') {
      try {
        const parsed = JSON.parse(supaData.education);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (jsonErr) {}
    }
  } catch (err) {
    console.warn('Supabase SYS_CAL read error:', err);
  }

  // 2. Fallback ke file JSON lokal jika Supabase belum terisi
  try {
    if (fs.existsSync(calendarFilePath)) {
      const data = fs.readFileSync(calendarFilePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading calendarData.json:', error);
  }
  return [];
}

async function saveEvents(events: AcademicEvent[]): Promise<void> {
  const jsonStr = JSON.stringify(events);

  // 1. Simpan ke Supabase (SYS_CAL) menggunakan service role
  try {
    const { data: existing } = await supabaseServer
      .from('teachers_staff')
      .select('id')
      .eq('code', 'SYS_CAL')
      .maybeSingle();

    if (existing) {
      await supabaseServer
        .from('teachers_staff')
        .update({ education: jsonStr })
        .eq('id', existing.id);
    } else {
      await supabaseServer
        .from('teachers_staff')
        .insert({
          name: 'System Calendar Store',
          code: 'SYS_CAL',
          category_label: 'Sistem',
          subject_name: 'Calendar',
          education: jsonStr,
          order_no: 9995,
          role: 'system',
        });
    }
  } catch (err) {
    console.warn('Failed to sync calendar to Supabase:', err);
  }

  // 2. Best-effort local file write
  try {
    fs.writeFileSync(calendarFilePath, JSON.stringify(events, null, 2), 'utf8');
  } catch (error) {
    // EROFS safe on Vercel
  }
}

export async function GET() {
  try {
    const events = await getEvents();
    return NextResponse.json(events, { headers: noCacheHeaders });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to fetch calendar: ' + message }, { status: 500, headers: noCacheHeaders });
  }
}

export async function POST(req: Request) {
  const auth = await requireAuth(['admin', 'guru']);
  if (!auth.authorized) {
    return auth.response!;
  }

  try {
    const body = await req.json();
    const events = await getEvents();

    const newEvent: AcademicEvent = {
      id: body.id || `ev-${Date.now()}`,
      title: body.title?.trim() || 'Agenda Baru',
      date_range: body.date_range?.trim() || 'Waktu Belum Ditentukan',
      semester: body.semester || 'Semester Ganjil',
      category: body.category || 'kegiatan',
      description: body.description?.trim() || '',
    };

    events.unshift(newEvent);
    await saveEvents(events);

    return NextResponse.json({ success: true, item: newEvent }, { headers: noCacheHeaders });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to save event: ' + message }, { status: 500, headers: noCacheHeaders });
  }
}

export async function PUT(req: Request) {
  const auth = await requireAuth(['admin', 'guru']);
  if (!auth.authorized) {
    return auth.response!;
  }

  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: 'Event ID required' }, { status: 400, headers: noCacheHeaders });
    }

    const events = await getEvents();
    const index = events.findIndex((e) => e.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404, headers: noCacheHeaders });
    }

    events[index] = {
      ...events[index],
      title: body.title !== undefined ? body.title.trim() : events[index].title,
      date_range: body.date_range !== undefined ? body.date_range.trim() : events[index].date_range,
      semester: body.semester !== undefined ? body.semester : events[index].semester,
      category: body.category !== undefined ? body.category : events[index].category,
      description: body.description !== undefined ? body.description.trim() : events[index].description,
    };

    await saveEvents(events);

    return NextResponse.json({ success: true, item: events[index] }, { headers: noCacheHeaders });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to update event: ' + message }, { status: 500, headers: noCacheHeaders });
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
      return NextResponse.json({ error: 'Event ID required' }, { status: 400, headers: noCacheHeaders });
    }

    let events = await getEvents();
    const initialLen = events.length;
    events = events.filter((e) => e.id !== id);
    await saveEvents(events);

    return NextResponse.json({ success: true, id, removedCount: initialLen - events.length }, { headers: noCacheHeaders });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to delete event: ' + message }, { status: 500, headers: noCacheHeaders });
  }
}
