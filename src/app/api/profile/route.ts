import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { supabase } from '@/lib/supabaseClient';
import { requireAuth } from '@/lib/auth';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'homeProfileData.json');

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

export async function GET() {
  let data: any = {};

  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    data = JSON.parse(fileContent);
  } catch (err) {
    console.warn('Could not read homeProfileData.json:', err);
  }

  // 1. Read from Supabase school_profile (primary database)
  try {
    const { data: supaProfile, error } = await supabase
      .from('school_profile')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (!error && supaProfile) {
      if (!data.profile) data.profile = {};
      if (supaProfile.name) data.profile.name = supaProfile.name;
      if (supaProfile.formal_name) data.profile.formalName = supaProfile.formal_name;
      if (supaProfile.level) data.profile.level = supaProfile.level;
      if (supaProfile.npsn) data.profile.npsn = supaProfile.npsn;
      if (supaProfile.nsm) data.profile.nsm = supaProfile.nsm;
      if (supaProfile.accreditation) data.profile.accreditation = supaProfile.accreditation;
      if (supaProfile.founded_year) data.profile.foundedYear = supaProfile.founded_year;
      if (supaProfile.address) data.profile.address = supaProfile.address;
      if (supaProfile.district) data.profile.district = supaProfile.district;
      if (supaProfile.regency) data.profile.regency = supaProfile.regency;
      if (supaProfile.province) data.profile.province = supaProfile.province;
      if (supaProfile.postal_code) data.profile.postalCode = supaProfile.postal_code;
      if (supaProfile.phone) data.profile.phone = supaProfile.phone;
      if (supaProfile.whatsapp) data.profile.whatsapp = supaProfile.whatsapp;
      if (supaProfile.email) data.profile.email = supaProfile.email;
      if (supaProfile.vision) {
        if (!data.visionMission) data.visionMission = {};
        data.visionMission.vision = supaProfile.vision;
      }
      if (supaProfile.missions && Array.isArray(supaProfile.missions) && supaProfile.missions.length > 0) {
        if (!data.visionMission) data.visionMission = {};
        data.visionMission.missions = supaProfile.missions;
      }
    }
  } catch (err) {
    console.warn('Supabase school_profile read:', err);
  }

  // 2. Read persistent homepage configuration from SYS_HOME
  try {
    const { data: sysHome } = await supabase
      .from('teachers_staff')
      .select('education')
      .eq('code', 'SYS_HOME')
      .maybeSingle();

    if (sysHome?.education) {
      const parsedHome = JSON.parse(sysHome.education);
      if (parsedHome && typeof parsedHome === 'object') {
        data.homepage = { ...(data.homepage || {}), ...parsedHome };
      }
    }
  } catch (err) {
    console.warn('Notice: SYS_HOME read:', err);
  }

  // 3. Read persistent extended profile data from SYS_PROF (vision-mission, history, facilities)
  try {
    const { data: sysProf } = await supabase
      .from('teachers_staff')
      .select('education')
      .eq('code', 'SYS_PROF')
      .maybeSingle();

    if (sysProf?.education) {
      const parsedProf = JSON.parse(sysProf.education);
      if (parsedProf && typeof parsedProf === 'object') {
        if (parsedProf.profile) data.profile = { ...(data.profile || {}), ...parsedProf.profile };
        if (parsedProf.visionMission) data.visionMission = { ...(data.visionMission || {}), ...parsedProf.visionMission };
        if (parsedProf.history) data.history = { ...(data.history || {}), ...parsedProf.history };
        if (Array.isArray(parsedProf.facilities) && parsedProf.facilities.length > 0) {
          data.facilities = parsedProf.facilities;
        }
      }
    }
  } catch (err) {
    console.warn('Notice: SYS_PROF read:', err);
  }

  // 4. Try reading facilities table from Supabase if present
  try {
    const { data: supaFacilities, error: facErr } = await supabase
      .from('facilities')
      .select('*')
      .order('order_index', { ascending: true });

    if (!facErr && supaFacilities && supaFacilities.length > 0) {
      data.facilities = supaFacilities.map((f: any) => ({
        id: f.id,
        title: f.name,
        subtitle: f.category || 'Akademik',
        desc: f.description || '',
        image: f.image_url || '/kelas.jpeg',
        badge: f.category || 'Fasilitas Unggulan',
      }));
    }
  } catch (err) {
    // Non-blocking
  }

  return NextResponse.json(data, { headers: noCacheHeaders });
}

export async function POST(request: Request) {
  // Hanya Administrator yang berhak mengubah identitas dan profil sekolah
  const auth = await requireAuth(['admin']);
  if (!auth.authorized) {
    return auth.response!;
  }

  try {
    const incoming = await request.json();

    // Read current data
    let currentData: any = {};
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf-8');
      currentData = JSON.parse(fileContent);
    } catch (err) {}

    // Merge incoming changes
    const updatedData = {
      ...currentData,
      ...(incoming.homepage ? { homepage: { ...currentData.homepage, ...incoming.homepage } } : {}),
      ...(incoming.profile ? { profile: { ...currentData.profile, ...incoming.profile } } : {}),
      ...(incoming.visionMission ? { visionMission: { ...currentData.visionMission, ...incoming.visionMission } } : {}),
      ...(incoming.history ? { history: { ...currentData.history, ...incoming.history } } : {}),
      ...(incoming.facilities ? { facilities: incoming.facilities } : {}),
    };

    // Save locally (safe on Vercel)
    try {
      await fs.writeFile(dataFilePath, JSON.stringify(updatedData, null, 2), 'utf-8');
    } catch (fsErr) {
      // Safely ignore EROFS in serverless environments
    }

    // Also attempt to sync relevant profile fields to Supabase
    try {
      const prof = updatedData.profile || {};
      const home = updatedData.homepage || {};
      const vis = updatedData.visionMission || {};

      await supabase.from('school_profile').upsert({
        id: 1,
        name: prof.name || home.heroTitle,
        formal_name: prof.formalName,
        npsn: prof.npsn,
        nsm: prof.nsm,
        accreditation: prof.accreditation,
        founded_year: prof.foundedYear,
        address: prof.address,
        district: prof.district,
        regency: prof.regency,
        phone: prof.phone,
        whatsapp: prof.whatsapp,
        email: prof.email,
        vision: vis.vision,
        missions: Array.isArray(vis.missions) ? vis.missions : undefined,
        logo_url: home.schoolLogo,
      });

      // 1. Primary Persistent Store: Save homepage config into Supabase teachers_staff (SYS_HOME)
      if (updatedData.homepage) {
        try {
          const homeJson = JSON.stringify(updatedData.homepage);
          const { data: updatedHome } = await supabase
            .from('teachers_staff')
            .update({ education: homeJson, updated_at: new Date().toISOString() })
            .eq('code', 'SYS_HOME')
            .select('id');

          if (!updatedHome || updatedHome.length === 0) {
            await supabase.from('teachers_staff').insert({
              name: 'System Homepage Store',
              code: 'SYS_HOME',
              category_label: 'Sistem',
              subject_name: 'Homepage',
              education: homeJson,
              order_no: 9995,
              role: 'system',
              is_active: false,
            });
          }
        } catch (e) {
          console.warn('Notice: SYS_HOME sync:', e);
        }
      }

      // 2. Primary Persistent Store: Save extended profile into Supabase teachers_staff (SYS_PROF)
      try {
        const profPayload = {
          profile: updatedData.profile,
          visionMission: updatedData.visionMission,
          history: updatedData.history,
          facilities: updatedData.facilities,
        };
        const profJson = JSON.stringify(profPayload);
        const { data: updatedProf } = await supabase
          .from('teachers_staff')
          .update({ education: profJson, updated_at: new Date().toISOString() })
          .eq('code', 'SYS_PROF')
          .select('id');

        if (!updatedProf || updatedProf.length === 0) {
          await supabase.from('teachers_staff').insert({
            name: 'System Profile Store',
            code: 'SYS_PROF',
            category_label: 'Sistem',
            subject_name: 'Profile',
            education: profJson,
            order_no: 9994,
            role: 'system',
            is_active: false,
          });
        }
      } catch (e) {
        console.warn('Notice: SYS_PROF sync:', e);
      }

      // 3. Update school_profile stats if numbers are valid
      if (updatedData.homepage) {
        try {
          const numStudents = parseInt(home.stat1Value);
          const numTeachers = parseInt(home.stat2Value);
          const statsUpdate: any = {};
          if (!isNaN(numStudents)) statsUpdate.stats_active_students = numStudents;
          if (!isNaN(numTeachers)) statsUpdate.stats_certified_teachers = numTeachers;

          if (Object.keys(statsUpdate).length > 0) {
            await supabase.from('school_profile').update(statsUpdate).eq('id', 1);
          }
        } catch (e) {}
      }

      // 4. Sync facilities if present
      if (Array.isArray(updatedData.facilities)) {
        for (const fac of updatedData.facilities) {
          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(fac.id));
          if (isUuid) {
            try {
              await supabase.from('facilities').update({
                name: fac.title,
                category: fac.subtitle || 'Akademik',
                description: fac.desc,
                image_url: fac.image,
              }).eq('id', fac.id);
            } catch (e) {}
          }
        }
      }
    } catch (supaErr) {
      console.warn('Notice: Supabase school_profile sync:', supaErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Perubahan berhasil disimpan dan langsung diterapkan.',
      data: updatedData,
    }, { headers: noCacheHeaders });
  } catch (error: any) {
    console.error('Error in profile POST:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal menyimpan data profil.' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}
