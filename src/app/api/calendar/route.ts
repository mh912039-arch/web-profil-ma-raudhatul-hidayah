import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const calendarFilePath = path.join(process.cwd(), 'src', 'data', 'calendarData.json');

export interface AcademicEvent {
  id: string;
  title: string;
  date_range: string;
  semester: string;
  category: 'ujian' | 'libur' | 'ppdb' | 'kegiatan';
  description: string;
}

function getEvents(): AcademicEvent[] {
  try {
    if (fs.existsSync(calendarFilePath)) {
      const data = fs.readFileSync(calendarFilePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading calendar:', error);
  }
  return [];
}

function saveEvents(events: AcademicEvent[]) {
  try {
    fs.writeFileSync(calendarFilePath, JSON.stringify(events, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing calendar:', error);
  }
}

export async function GET() {
  try {
    const events = getEvents();
    return NextResponse.json(events);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to fetch calendar: ' + message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const events = getEvents();

    const newEvent: AcademicEvent = {
      id: body.id || `ev-${Date.now()}`,
      title: body.title || 'Agenda Baru',
      date_range: body.date_range || 'Waktu Belum Ditentukan',
      semester: body.semester || 'Semester Ganjil',
      category: body.category || 'kegiatan',
      description: body.description || '',
    };

    events.unshift(newEvent);
    saveEvents(events);

    return NextResponse.json({ success: true, item: newEvent });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to save event: ' + message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const events = getEvents();

    const index = events.findIndex((e) => e.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    events[index] = {
      ...events[index],
      title: body.title !== undefined ? body.title : events[index].title,
      date_range: body.date_range !== undefined ? body.date_range : events[index].date_range,
      semester: body.semester !== undefined ? body.semester : events[index].semester,
      category: body.category !== undefined ? body.category : events[index].category,
      description: body.description !== undefined ? body.description : events[index].description,
    };

    saveEvents(events);

    return NextResponse.json({ success: true, item: events[index] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to update event: ' + message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Event ID required' }, { status: 400 });
    }

    let events = getEvents();
    events = events.filter((e) => e.id !== id);
    saveEvents(events);

    return NextResponse.json({ success: true, id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to delete event: ' + message }, { status: 500 });
  }
}
