import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { parseScheduleFromText } from '@/lib/scheduleParser';
import { supabase } from '@/lib/supabaseClient';
import { applyBatchSchedules } from '@/lib/scheduleStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 30;

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
    const body = await req.json().catch(() => ({}));
    const { imageUrl, text, targetRombel = 'SMA - Kelas X', autoApply = false } = body;

    let extractedText = typeof text === 'string' ? text.trim() : '';

    // Fallback OCR di sisi server jika teks dari browser kosong atau terlalu minim
    if ((!extractedText || extractedText.length < 10) && imageUrl && typeof imageUrl === 'string') {
      try {
        const { createWorker } = await import('tesseract.js');
        const worker = await createWorker('ind');
        const ocrPromise = worker.recognize(imageUrl);
        const timeoutPromise = new Promise<{ data: { text: string } }>((_, reject) =>
          setTimeout(() => reject(new Error('Server OCR timeout')), 10000)
        );
        const ocrResult = await Promise.race([ocrPromise, timeoutPromise]);
        await worker.terminate();
        if (ocrResult?.data?.text) {
          extractedText = ocrResult.data.text.trim();
        }
      } catch (ocrServerErr) {
        console.warn('Notice: Server OCR fallback notice:', ocrServerErr);
      }
    }

    // Ambil daftar guru dari database untuk pencocokan akurat
    let teachers: { name: string; subject_name?: string }[] = [];
    try {
      const { data: dbTeachers } = await supabase
        .from('teachers_staff')
        .select('name, subject_name')
        .not('code', 'in', '("SYS_SCH","SYS_TCH","SYS_CAL","SYS_CLS","SYS_AUTH","SYS_SESS","SYS_SCHIMG","SYS_HOME","SYS_PROF")')
        .order('order_no', { ascending: true });

      if (dbTeachers && Array.isArray(dbTeachers)) {
        teachers = dbTeachers;
      }
    } catch (err) {
      console.warn('Notice: Teacher pool lookup in schedule scan:', err);
    }

    // Jalankan intelligent schedule parser dengan target rombel yang dipilih pengguna
    const parsedSchedules = parseScheduleFromText(extractedText, targetRombel, teachers, true);
    const finalRombel = targetRombel || parsedSchedules[0]?.class_rombel || 'SMA - Kelas X';

    // Jika autoApply === true, langsung simpan secara internal ke database (tanpa HTTP loopback)
    if (autoApply && parsedSchedules.length > 0) {
      try {
        const batchResult = await applyBatchSchedules({
          items: parsedSchedules,
          replaceRombel: finalRombel,
          photoUrl: imageUrl || undefined,
          caption: `Foto Jadwal Resmi ${finalRombel}`,
        });

        return NextResponse.json(
          {
            success: true,
            autoApplied: true,
            extractedText,
            schedules: parsedSchedules,
            count: parsedSchedules.length,
            rombel: finalRombel,
            message: `Jadwal resmi ${finalRombel} berhasil dipindai dan ${parsedSchedules.length} sesi diterapkan otomatis ke database digital!`,
            batchResult,
          },
          { headers: noCacheHeaders }
        );
      } catch (applyErr: any) {
        console.warn('Auto apply direct save warning:', applyErr?.message);
      }
    }

    return NextResponse.json(
      {
        success: true,
        autoApplied: false,
        extractedText,
        schedules: parsedSchedules,
        count: parsedSchedules.length,
        rombel: finalRombel,
        message: `Berhasil mendeteksi ${parsedSchedules.length} sesi jadwal pelajaran untuk ${finalRombel}.`,
      },
      { headers: noCacheHeaders }
    );
  } catch (err: any) {
    console.error('Error in scan schedule route:', err);
    return NextResponse.json(
      { success: false, message: err?.message || 'Gagal memproses pemindaian jadwal' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}
