import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const headers = {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
};

export async function GET() {
  const startTime = Date.now();
  let dbStatus = 'active';

  try {
    // Jalankan kueri ringan dengan timeout 5 detik agar Vercel tidak pernah kena gateway timeout
    const dbPromise = (async () => {
      const client = supabaseAdmin || supabase;
      const { error } = await client
        .from('teachers_staff')
        .select('id', { count: 'exact', head: true });
      return error;
    })();

    const timeoutPromise = new Promise<{ message: string }>((resolve) =>
      setTimeout(() => resolve({ message: 'query-timeout-handled' }), 5000)
    );

    const result = await Promise.race([dbPromise, timeoutPromise]);
    if (result && 'message' in result && result.message) {
      dbStatus = 'notice: ' + result.message;
    }
  } catch (err: any) {
    dbStatus = 'notice: ' + (err?.message || 'fallback');
  }

  const durationMs = Date.now() - startTime;

  return NextResponse.json(
    {
      status: 'success',
      message: 'MA Raudlatul Hidayah Database Keep-Alive Active',
      database: dbStatus,
      duration: `${durationMs}ms`,
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers,
    }
  );
}

export async function HEAD() {
  return new Response(null, {
    status: 200,
    headers,
  });
}

export async function POST() {
  return GET();
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers,
  });
}
