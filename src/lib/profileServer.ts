import fs from 'fs/promises';
import path from 'path';
import { supabaseAdmin } from '@/lib/supabaseClient';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'homeProfileData.json');

export interface FullProfileResult {
  profile: any;
  visionMission: any;
  history: any;
  facilities: any[];
  homepage: any;
}

export async function getProfileData(): Promise<FullProfileResult> {
  let data: any = {};

  // 1. Read fallback homeProfileData.json
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    data = JSON.parse(fileContent);
  } catch (err) {
    console.warn('Could not read homeProfileData.json:', err);
  }

  // 2. Read from Supabase school_profile
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

  // 3. Read persistent homepage configuration from SYS_HOME
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
      if (data.homepage && (!data.homepage.ctaLink || data.homepage.ctaLink === '/profil/visi-misi')) {
        data.homepage.ctaLink = '/profil/sejarah';
      }
      if (data.homepage && (!data.homepage.teachersSectionTitle || data.homepage.teachersSectionTitle === 'Guru')) {
        data.homepage.teachersSectionTitle = 'Tenaga Pendidik';
      }
    }
  } catch (err) {
    console.warn('Notice: SYS_HOME read:', err);
  }

  // 4. Read persistent extended profile data from SYS_PROF (vision-mission, history, facilities)
  try {
    const { data: profRows } = await supabaseAdmin
      .from('teachers_staff')
      .select('education')
      .eq('code', 'SYS_PROF')
      .order('updated_at', { ascending: false })
      .limit(1);

    const sysProf = profRows && profRows.length > 0 ? profRows[0] : null;

    if (sysProf?.education) {
      const parsedProf = JSON.parse(sysProf.education);
      if (parsedProf && typeof parsedProf === 'object') {
        if (parsedProf.profile) data.profile = { ...(data.profile || {}), ...parsedProf.profile };
        if (parsedProf.visionMission) data.visionMission = { ...(data.visionMission || {}), ...parsedProf.visionMission };
        if (parsedProf.history) {
          data.history = { ...(data.history || {}), ...parsedProf.history };
          if (typeof parsedProf.history.lead === 'string') {
            data.history.paragraphs = parsedProf.history.lead
              .split(/\n\s*\n/)
              .map((p: string) => p.trim())
              .filter(Boolean);
          }
        }
        if (Array.isArray(parsedProf.facilities)) {
          data.facilities = parsedProf.facilities;
        }
      }
    }
  } catch (err) {
    console.warn('Notice: SYS_PROF read:', err);
  }

  // 5. Try reading facilities table from Supabase if present
  try {
    const { data: supaFacilities, error: facErr } = await supabaseAdmin
      .from('facilities')
      .select('*')
      .order('order_index', { ascending: true });

    if (!facErr && supaFacilities && supaFacilities.length > 0) {
      const profFacMap = new Map<string, any>();
      if (Array.isArray(data.facilities)) {
        for (const pf of data.facilities) {
          profFacMap.set(String(pf.id), pf);
        }
      }

      data.facilities = supaFacilities.map((f: any) => {
        const matched = profFacMap.get(String(f.id));
        return {
          id: f.id,
          title: f.name || matched?.title || 'Fasilitas Madrasah',
          subtitle: matched?.subtitle || f.category || 'Sarana Madrasah',
          desc: f.description !== undefined ? f.description : (matched?.desc || ''),
          image: f.image_url || matched?.image || '/kelas.jpeg',
          badge: matched?.badge || f.category || 'Fasilitas Unggulan',
          location: matched?.location || '',
          capacity: matched?.capacity || '',
          specs: Array.isArray(matched?.specs) ? matched.specs : [],
        };
      });
    }
  } catch (err) {
    // Non-blocking
  }

  return {
    profile: data.profile || {},
    visionMission: data.visionMission || {},
    history: data.history || {},
    facilities: Array.isArray(data.facilities) ? data.facilities : [],
    homepage: data.homepage || {},
  };
}
