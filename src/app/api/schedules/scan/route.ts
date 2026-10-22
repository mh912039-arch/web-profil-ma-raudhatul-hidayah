import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { parseScheduleFromText } from '@/lib/scheduleParser';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 60; // Izinkan durasi pemrosesan OCR jika serverless mendukung

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

export async function POST(req: Request) {
  const auth = await requireAuth(['admin', 'guru']);
  if (!auth.authorized) {
    return auth.response!;
  }

  try {
    const body = await req.json();
    const { imageUrl, text, targetRombel = 'SMP - Kelas VIII', autoApply = false } = body;

    let extractedText = text || '';

    // Jika imageUrl diberikan dan text belum ada, coba OCR di server
    if (!extractedText && imageUrl) {
      try {
        const { createWorker } = await import('tesseract.js');
        const worker = await createWorker(['ind', 'eng']);
        const {
          data: { text: ocrText },
        } = await worker.recognize(imageUrl);
        await worker.terminate();
        extractedText = ocrText;
      } catch (ocrErr: any) {
        console.warn('Server OCR notice (falling back to parser with sample):', ocrErr?.message);
        extractedText = '';
      }
    }

    // Ambil guru dari database jika ada untuk akurasi pencocokan
    let teachers: { name: string; subject_name?: string }[] = [];
    try {
      const { data: dbTeachers } = await supabase
        .from('teachers_staff')
        .select('name, subject_name')
        .not('code', 'in', '("SYS_SCH","SYS_TCH","SYS_CAL","SYS_CLS","SYS_AUTH","SYS_SESS","SYS_SCHIMG")')
        .order('order_no', { ascending: true });

      if (dbTeachers) {
        teachers = dbTeachers;
      }
    } catch {}

    // Jalankan intelligent parser
    const parsedSchedules = parseScheduleFromText(extractedText, targetRombel, teachers);

    // Jika autoApply === true, langsung simpan ke batch endpoint internal
    if (autoApply && parsedSchedules.length > 0) {
      try {
        const batchRes = await fetch(new URL('/api/schedules/batch', req.url).toString(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            cookie: req.headers.get('cookie') || '',
          },
          body: JSON.stringify({
            items: parsedSchedules,
            replaceRombel: targetRombel,
            photoUrl: imageUrl,
          }),
        });

        if (batchRes.ok) {
          const batchData = await batchRes.json();
          return NextResponse.json(
            {
              success: true,
              autoApplied: true,
              extractedText,
              schedules: parsedSchedules,
              message: `Jadwal berhasil dipindai dan ${parsedSchedules.length} sesi otomatis diterapkan untuk ${targetRombel}!`,
              batchResult: batchData,
            },
            { headers: noCacheHeaders }
          );
        }
      } catch (applyErr) {
        console.warn('Auto apply failed, returning parsed items for manual review:', applyErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        autoApplied: false,
        extractedText,
        schedules: parsedSchedules,
        count: parsedSchedules.length,
        message: `Berhasil mendeteksi ${parsedSchedules.length} sesi jadwal pelajaran.`,
      },
      { headers: noCacheHeaders }
    );
  } catch (err: any) {
    console.error('Error in scan schedule route:', err);
    return NextResponse.json(
      { success: false, message: err?.message || 'Gagal memindai jadwal' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}
