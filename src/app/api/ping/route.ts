import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const startTime = Date.now();
  let dbStatus = 'active';

  try {
    // Kueri sangat ringan (HEAD query, 0 KB data transfer) untuk mereset timer 7 hari Supabase
    const { error } = await supabase
      .from('teachers_staff')
      .select('id', { count: 'exact', head: true });

    if (error) {
      dbStatus = 'warning: ' + error.message;
    }
  } catch (err: any) {
    dbStatus = 'error: ' + (err?.message || 'unknown');
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
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
}
