import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { supabase, supabaseAdmin } from '@/lib/supabaseClient';
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
    const { data: supaProfile, error } = await supabaseAdmin
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
    const { data: sysHome } = await supabaseAdmin
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
    const { data: sysProf } = await supabaseAdmin
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
    const { data: supaFacilities, error: facErr } = await supabaseAdmin
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

    // 1. Fetch current persisted state from Supabase to prevent regression
    let currentHome: any = {};
    try {
      const { data: rowHome } = await supabaseAdmin
        .from('teachers_staff')
        .select('education')
        .eq('code', 'SYS_HOME')
        .maybeSingle();
      if (rowHome?.education) currentHome = JSON.parse(rowHome.education);
    } catch {}

    let currentProf: any = {};
    try {
      const { data: rowProf } = await supabaseAdmin
        .from('teachers_staff')
        .select('education')
        .eq('code', 'SYS_PROF')
        .maybeSingle();
      if (rowProf?.education) currentProf = JSON.parse(rowProf.education);
    } catch {}

    // Read local fallback file
    let currentFileData: any = {};
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf-8');
      currentFileData = JSON.parse(fileContent);
    } catch (err) {}

    const mergedHome = incoming.homepage
      ? { ...(currentHome.heroTitle ? currentHome : currentFileData.homepage || {}), ...incoming.homepage }
      : (currentHome.heroTitle ? currentHome : currentFileData.homepage || {});

    const mergedProfile = incoming.profile
      ? { ...(currentProf.profile || currentFileData.profile || {}), ...incoming.profile }
      : (currentProf.profile || currentFileData.profile || {});

    const mergedVision = incoming.visionMission
      ? { ...(currentProf.visionMission || currentFileData.visionMission || {}), ...incoming.visionMission }
      : (currentProf.visionMission || currentFileData.visionMission || {});

    const mergedHistory = incoming.history
      ? { ...(currentProf.history || currentFileData.history || {}), ...incoming.history }
      : (currentProf.history || currentFileData.history || {});

    const mergedFacilities = incoming.facilities !== undefined
      ? incoming.facilities
      : (currentProf.facilities || currentFileData.facilities || []);

    const updatedData = {
      homepage: mergedHome,
      profile: mergedProfile,
      visionMission: mergedVision,
      history: mergedHistory,
      facilities: mergedFacilities,
    };

    // Best-effort local file write
    try {
      await fs.writeFile(dataFilePath, JSON.stringify(updatedData, null, 2), 'utf-8');
    } catch (fsErr) {}

    // 2. Primary Persistent Store: Save homepage config into Supabase teachers_staff (SYS_HOME)
    if (incoming.homepage) {
      try {
        const homeJson = JSON.stringify(mergedHome);
        const { data: updatedHome } = await supabaseAdmin
          .from('teachers_staff')
          .update({ education: homeJson, is_active: true, updated_at: new Date().toISOString() })
          .eq('code', 'SYS_HOME')
          .select('id');

        if (!updatedHome || updatedHome.length === 0) {
          await supabaseAdmin.from('teachers_staff').insert({
            name: 'System Homepage Store',
            code: 'SYS_HOME',
            category_label: 'Sistem',
            subject_name: 'Homepage',
            education: homeJson,
            order_no: 9995,
            role: 'system',
            is_active: true,
          });
        }
      } catch (e) {
        console.warn('Notice: SYS_HOME sync:', e);
      }
    }

    // 3. Primary Persistent Store: Save extended profile into Supabase teachers_staff (SYS_PROF)
    if (incoming.profile || incoming.visionMission || incoming.history || incoming.facilities !== undefined) {
      try {
        const profPayload = {
          profile: mergedProfile,
          visionMission: mergedVision,
          history: mergedHistory,
          facilities: mergedFacilities,
        };
        const profJson = JSON.stringify(profPayload);
        const { data: updatedProf } = await supabaseAdmin
          .from('teachers_staff')
          .update({ education: profJson, is_active: true, updated_at: new Date().toISOString() })
          .eq('code', 'SYS_PROF')
          .select('id');

        if (!updatedProf || updatedProf.length === 0) {
          await supabaseAdmin.from('teachers_staff').insert({
            name: 'System Profile Store',
            code: 'SYS_PROF',
            category_label: 'Sistem',
            subject_name: 'Profile',
            education: profJson,
            order_no: 9994,
            role: 'system',
            is_active: true,
          });
        }
      } catch (e) {
        console.warn('Notice: SYS_PROF sync:', e);
      }
    }

    // 4. Update school_profile table
    try {
      const profUpdate: any = { id: 1 };
      if (mergedProfile.name) profUpdate.name = mergedProfile.name;
      else if (mergedHome.heroTitle) profUpdate.name = mergedHome.heroTitle;
      if (mergedProfile.formalName) profUpdate.formal_name = mergedProfile.formalName;
      if (mergedProfile.npsn) profUpdate.npsn = mergedProfile.npsn;
      if (mergedProfile.nsm) profUpdate.nsm = mergedProfile.nsm;
      if (mergedProfile.accreditation) profUpdate.accreditation = mergedProfile.accreditation;
      if (mergedProfile.foundedYear) profUpdate.founded_year = mergedProfile.foundedYear;
      if (mergedProfile.address) profUpdate.address = mergedProfile.address;
      if (mergedProfile.district) profUpdate.district = mergedProfile.district;
      if (mergedProfile.regency) profUpdate.regency = mergedProfile.regency;
      if (mergedProfile.phone) profUpdate.phone = mergedProfile.phone;
      if (mergedProfile.whatsapp) profUpdate.whatsapp = mergedProfile.whatsapp;
      if (mergedProfile.email) profUpdate.email = mergedProfile.email;
      if (mergedVision.vision) profUpdate.vision = mergedVision.vision;
      if (Array.isArray(mergedVision.missions)) profUpdate.missions = mergedVision.missions;
      if (mergedHome.schoolLogo) profUpdate.logo_url = mergedHome.schoolLogo;

      if (incoming.homepage) {
        const numStudents = parseInt(mergedHome.stat1Value);
        const numTeachers = parseInt(mergedHome.stat2Value);
        if (!isNaN(numStudents)) profUpdate.stats_active_students = numStudents;
        if (!isNaN(numTeachers)) profUpdate.stats_certified_teachers = numTeachers;
      }

      await supabaseAdmin.from('school_profile').upsert(profUpdate);
    } catch (spErr) {
      console.warn('Notice: school_profile upsert:', spErr);
    }

    // 5. Sync facilities if present
    if (Array.isArray(incoming.facilities)) {
      for (const fac of incoming.facilities) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(fac.id));
        if (isUuid) {
          try {
            await supabaseAdmin.from('facilities').update({
              name: fac.title,
              category: fac.badge || fac.subtitle,
              description: fac.desc,
              image_url: fac.image,
            }).eq('id', fac.id);
          } catch (_) {}
        }
      }
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
