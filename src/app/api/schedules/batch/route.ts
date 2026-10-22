import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { requireAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

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

async function getExistingSchedules(): Promise<ScheduleItem[]> {
  try {
    const { data: supaData } = await supabase
      .from('teachers_staff')
      .select('education')
      .eq('code', 'SYS_SCH')
      .maybeSingle();

    if (supaData?.education) {
      const parsed = JSON.parse(supaData.education);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Supabase SYS_SCH read error:', err);
  }

  try {
    if (fs.existsSync(schedulesFilePath)) {
      const data = fs.readFileSync(schedulesFilePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Local schedules read error:', err);
  }

  return [];
}

async function persistSchedules(schedules: ScheduleItem[]): Promise<void> {
  try {
    const { data: updated, error } = await supabase
      .from('teachers_staff')
      .update({
        education: JSON.stringify(schedules),
        updated_at: new Date().toISOString(),
      })
      .eq('code', 'SYS_SCH')
      .select('id');

    if (error || !updated || updated.length === 0) {
      await supabase.from('teachers_staff').insert({
        name: 'System Schedules Store',
        code: 'SYS_SCH',
        category_label: 'Sistem',
        subject_name: 'Schedules',
        education: JSON.stringify(schedules),
        order_no: 9997,
        role: 'system',
      });
    }
  } catch (err) {
    console.warn('Failed to sync batch schedules to Supabase:', err);
  }

  try {
    fs.writeFileSync(schedulesFilePath, JSON.stringify(schedules, null, 2), 'utf8');
  } catch {
    // EROFS safe
  }
}

export async function POST(req: Request) {
  const auth = await requireAuth(['admin', 'guru']);
  if (!auth.authorized) {
    return auth.response!;
  }

  try {
    const body = await req.json();
    const newItems: ScheduleItem[] = Array.isArray(body.items) ? body.items : [];
    const replaceRombel = body.replaceRombel as string | undefined;
    const replaceAll = Boolean(body.replaceAll);
    const photoUrl = body.photoUrl as string | undefined;

    if (!newItems || newItems.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Daftar jadwal tidak boleh kosong.' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    let currentSchedules = await getExistingSchedules();
    let finalSchedules: ScheduleItem[] = [];

    if (replaceAll) {
      // Ganti seluruh jadwal sekolah
      finalSchedules = newItems;
    } else if (replaceRombel) {
      // Hapus jadwal untuk rombel target, lalu tambahkan jadwal baru
      const cleanTarget = replaceRombel.toLowerCase().trim();
      finalSchedules = currentSchedules.filter((s) => {
        const cleanItem = (s.class_rombel || '').toLowerCase().trim();
        return cleanItem !== cleanTarget && !cleanItem.includes(cleanTarget) && !cleanTarget.includes(cleanItem);
      });
      finalSchedules.push(...newItems);
    } else {
      // Append / merge
      finalSchedules = [...currentSchedules, ...newItems];
    }

    // Urutkan jadwal berdasarkan Hari, Rombel, dan Sesi
    const dayOrder: Record<string, number> = {
      Senin: 1,
      Selasa: 2,
      Rabu: 3,
      Kamis: 4,
      Jumat: 5,
      Sabtu: 6,
    };

    finalSchedules.sort((a, b) => {
      const dayDiff = (dayOrder[a.day] || 9) - (dayOrder[b.day] || 9);
      if (dayDiff !== 0) return dayDiff;
      if (a.class_rombel !== b.class_rombel) return a.class_rombel.localeCompare(b.class_rombel);
      return (a.session_no || 0) - (b.session_no || 0);
    });

    await persistSchedules(finalSchedules);

    // Jika ada photoUrl disertakan, simpan juga ke SYS_SCHIMG
    if (photoUrl) {
      try {
        const photoPayload = {
          photo_url: photoUrl,
          caption: body.caption || `Jadwal Pelajaran ${replaceRombel || 'Resmi'}`,
          updated_at: new Date().toISOString(),
        };

        const { data: updatedPhoto } = await supabase
          .from('teachers_staff')
          .update({
            education: JSON.stringify(photoPayload),
            updated_at: new Date().toISOString(),
          })
          .eq('code', 'SYS_SCHIMG')
          .select('id');

        if (!updatedPhoto || updatedPhoto.length === 0) {
          await supabase.from('teachers_staff').insert({
            name: 'System Schedule Image Store',
            code: 'SYS_SCHIMG',
            category_label: 'Sistem',
            subject_name: 'Schedule Photo',
            education: JSON.stringify(photoPayload),
            order_no: 9993,
            role: 'system',
          });
        }
      } catch (err) {
        console.warn('Notice: Failed updating photo record during batch schedule update:', err);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Berhasil memperbarui ${newItems.length} sesi jadwal pelajaran secara otomatis.`,
        count: newItems.length,
        total: finalSchedules.length,
        items: finalSchedules,
      },
      { headers: noCacheHeaders }
    );
  } catch (err: any) {
    console.error('Error in batch schedules update:', err);
    return NextResponse.json(
      { success: false, message: err?.message || 'Gagal memproses pembaruan jadwal massal.' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}
