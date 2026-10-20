import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'extracurricularsData.json');

export interface ExtracurricularItem {
  id: number | string;
  name: string;
  category: string;
  badge: string;
  level: string;
  schedule: string;
  coach: string;
  role: string;
  image: string;
  desc: string;
}

export async function GET() {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    const items: ExtracurricularItem[] = JSON.parse(fileContent);
    return NextResponse.json(items, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (err) {
    console.warn('Could not read extracurricularsData.json:', err);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.coach) {
      return NextResponse.json(
        { success: false, message: 'Nama ekstrakurikuler dan nama pembina wajib diisi.' },
        { status: 400 }
      );
    }

    let items: ExtracurricularItem[] = [];
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf-8');
      items = JSON.parse(fileContent);
    } catch {
      items = [];
    }

    // Check if updating existing
    const existingIndex = body.id
      ? items.findIndex((i) => String(i.id) === String(body.id))
      : -1;

    let savedItem: ExtracurricularItem;

    if (existingIndex >= 0) {
      savedItem = {
        ...items[existingIndex],
        ...body,
      };
      items[existingIndex] = savedItem;
    } else {
      const newId = items.length > 0 ? Math.max(...items.map((i) => Number(i.id) || 0)) + 1 : 1;
      savedItem = {
        id: newId,
        name: body.name,
        category: body.category || 'belanegara',
        badge: body.badge || 'Ekstrakurikuler Pilihan',
        level: body.level || 'Tingkat MA',
        schedule: body.schedule || 'Sesuai Jadwal',
        coach: body.coach,
        role: body.role || 'Pembina Ekstrakurikuler',
        image: body.image || '/hero/slide-1.jpg',
        desc: body.desc || '',
      };
      items.push(savedItem);
    }

    await fs.writeFile(dataFilePath, JSON.stringify(items, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Ekstrakurikuler berhasil disimpan.',
      item: savedItem,
    });
  } catch (err: any) {
    console.error('Error saving extracurricular:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Gagal menyimpan ekstrakurikuler.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  return POST(request);
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID ekstrakurikuler wajib disertakan.' },
        { status: 400 }
      );
    }

    let items: ExtracurricularItem[] = [];
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf-8');
      items = JSON.parse(fileContent);
    } catch {
      items = [];
    }

    const filtered = items.filter((i) => String(i.id) !== String(id));
    await fs.writeFile(dataFilePath, JSON.stringify(filtered, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Ekstrakurikuler berhasil dihapus.',
    });
  } catch (err: any) {
    console.error('Error deleting extracurricular:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Gagal menghapus ekstrakurikuler.' },
      { status: 500 }
    );
  }
}
