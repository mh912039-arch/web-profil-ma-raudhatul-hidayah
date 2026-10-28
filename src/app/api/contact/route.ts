import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { supabase } from '@/lib/supabaseClient';
import { requireAuth } from '@/lib/auth';
import { checkEndpointRateLimit } from '@/lib/rateLimiter';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'messagesData.json');

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export interface ContactMessage {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  subject?: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  created_at: string;
}

export async function GET() {
  // Hanya Administrator yang berhak membaca pesan masuk dan kontak pengunjung
  const auth = await requireAuth(['admin']);
  if (!auth.authorized) {
    return auth.response!;
  }

  let localMessages: ContactMessage[] = [];

  // 1. Read local messages
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    localMessages = JSON.parse(fileContent);
  } catch (err) {
    console.warn('Could not read messagesData.json:', err);
  }

  // 2. Fetch from Supabase
  try {
    const { data: supaMessages, error: supaErr } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (!supaErr && supaMessages && supaMessages.length > 0) {
      const supaMapped: ContactMessage[] = supaMessages.map((row: any) => ({
        id: String(row.id),
        name: row.name,
        email: row.email || undefined,
        phone: row.phone || undefined,
        subject: row.subject || 'Pertanyaan Umum Pengunjung',
        message: row.message,
        status: (row.status as any) || 'unread',
        created_at: row.created_at || new Date().toISOString(),
      }));

      // Local messages take precedence for status updates (e.g. read/replied)
      const localMap = new Map(localMessages.map((m) => [m.id, m]));
      const merged: ContactMessage[] = [...localMessages];
      supaMapped.forEach((sm) => {
        if (!localMap.has(sm.id)) {
          merged.push(sm);
        }
      });

      return NextResponse.json(merged);
    }
  } catch (supaErr) {
    console.warn('Supabase fetch failed for contact messages:', supaErr);
  }

  return NextResponse.json(localMessages);
}

export async function POST(request: Request) {
  try {
    // 0. Proteksi Batas Frekuensi Pengiriman Pesan Kontak (Anti Spam Flooding)
    const cfIp = request.headers.get('cf-connecting-ip');
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const clientIp = cfIp || forwarded?.split(',')[0].trim() || realIp || '127.0.0.1';

    const rateCheck = checkEndpointRateLimit(clientIp, 'contact', 5, 15 * 60);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Terlalu banyak pengiriman pesan. Demi keamanan, silakan tunggu ${Math.ceil(rateCheck.retryAfterSeconds / 60)} menit sebelum mengirim pesan kembali.`,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) },
        }
      );
    }

    const body = await request.json();

    // Anti-Bot Honeypot Protection: tolak bot pengirim spam secara otomatis
    if (body.hp_website || body.bot_field || body.website) {
      return NextResponse.json({
        success: true,
        message: 'Pesan berhasil dikirim dan tersimpan.',
      });
    }

    if (!body.name || !body.message) {
      return NextResponse.json(
        { success: false, message: 'Nama dan isi pesan wajib diisi.' },
        { status: 400 }
      );
    }

    const contactStr = (body.contact || '').trim();
    const email = body.email?.trim() || (contactStr.includes('@') ? contactStr : '');
    const phone = body.phone?.trim() || (!contactStr.includes('@') ? contactStr : '');

    const newMessage: ContactMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: body.name.trim(),
      email: email || undefined,
      phone: phone || undefined,
      subject: body.subject?.trim() || 'Pertanyaan Umum Pengunjung',
      message: body.message.trim(),
      status: 'unread',
      created_at: new Date().toISOString(),
    };

    // 1. Save persistently to local messagesData.json
    let messages: ContactMessage[] = [];
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf-8');
      messages = JSON.parse(fileContent);
    } catch (err) {}

    // 1. Primary: Insert into Supabase
    try {
      await supabase.from('contact_messages').insert({
        name: newMessage.name,
        email: newMessage.email || null,
        phone: newMessage.phone || null,
        subject: newMessage.subject,
        message: newMessage.message,
        status: 'unread',
      });
    } catch (supaErr) {
      console.warn('Supabase contact_messages insert notice:', supaErr);
    }

    // 2. Best-effort local file write
    try {
      messages.unshift(newMessage);
      await fs.writeFile(dataFilePath, JSON.stringify(messages, null, 2), 'utf-8');
    } catch (fsErr) {
      // Safely ignore EROFS on Vercel
    }

    return NextResponse.json({
      success: true,
      message: 'Pesan berhasil dikirim dan tersimpan.',
      data: newMessage,
    });
  } catch (error: any) {
    console.error('Error in contact POST:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengirim pesan.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  // Hanya Administrator yang dapat mengubah status pesan
  const auth = await requireAuth(['admin']);
  if (!auth.authorized) {
    return auth.response!;
  }

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID diperlukan' }, { status: 400 });
    }

    // 1. Update in local file
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf-8');
      const messages: ContactMessage[] = JSON.parse(fileContent);
      const idx = messages.findIndex((m) => m.id === id);
      if (idx >= 0) {
        messages[idx].status = status || 'read';
        await fs.writeFile(dataFilePath, JSON.stringify(messages, null, 2), 'utf-8');
      }
    } catch (err) {}

    // 2. Update in Supabase
    try {
      await supabase.from('contact_messages').update({ status }).eq('id', id);
    } catch (err) {}

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  // Hanya Administrator yang berhak menghapus pesan masuk
  const auth = await requireAuth(['admin']);
  if (!auth.authorized) {
    return auth.response!;
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID diperlukan' }, { status: 400 });
    }

    // 1. Delete in local file
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf-8');
      let messages: ContactMessage[] = JSON.parse(fileContent);
      messages = messages.filter((m) => m.id !== id);
      await fs.writeFile(dataFilePath, JSON.stringify(messages, null, 2), 'utf-8');
    } catch (err) {}

    // 2. Delete in Supabase
    try {
      await supabase.from('contact_messages').delete().eq('id', id);
    } catch (err) {}

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
