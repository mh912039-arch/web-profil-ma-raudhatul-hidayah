import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabaseClient';

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

export async function getExistingSchedules(): Promise<ScheduleItem[]> {
  // 1. Prioritaskan data persisten dari Supabase
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

  // 2. Fallback ke file JSON lokal
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

export async function persistSchedules(schedules: ScheduleItem[]): Promise<void> {
  // 1. Simpan ke Supabase agar persisten di Vercel Serverless
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

  // 2. Best-effort update file lokal (aman dari EROFS di Vercel)
  try {
    fs.writeFileSync(schedulesFilePath, JSON.stringify(schedules, null, 2), 'utf8');
  } catch {
    // EROFS safe on Vercel
  }
}

export interface ApplyBatchParams {
  items: ScheduleItem[];
  replaceRombel?: string;
  replaceAll?: boolean;
  photoUrl?: string;
  caption?: string;
}

export async function applyBatchSchedules(params: ApplyBatchParams): Promise<{
  success: boolean;
  count: number;
  total: number;
  items: ScheduleItem[];
}> {
  const { items: newItems, replaceRombel, replaceAll = false, photoUrl, caption } = params;

  if (!Array.isArray(newItems) || newItems.length === 0) {
    throw new Error('Daftar jadwal baru tidak boleh kosong.');
  }

  const currentSchedules = await getExistingSchedules();
  let finalSchedules: ScheduleItem[] = [];

  if (replaceAll) {
    // Ganti seluruh jadwal sekolah
    finalSchedules = [...newItems];
  } else if (replaceRombel) {
    // Hapus jadwal untuk rombel target, lalu tambahkan jadwal baru
    const cleanTarget = replaceRombel.toLowerCase().trim();
    finalSchedules = currentSchedules.filter((s) => {
      const cleanItem = (s.class_rombel || '').toLowerCase().trim();
      return cleanItem !== cleanTarget && !cleanItem.includes(cleanTarget) && !cleanTarget.includes(cleanItem);
    });
    finalSchedules.push(...newItems);
  } else {
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

  // Jika photoUrl disertakan, simpan juga ke SYS_SCHIMG
  if (photoUrl) {
    try {
      const photoPayload = {
        photo_url: photoUrl,
        caption: caption || `Jadwal Pelajaran ${replaceRombel || 'Resmi'}`,
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

  return {
    success: true,
    count: newItems.length,
    total: finalSchedules.length,
    items: finalSchedules,
  };
}
