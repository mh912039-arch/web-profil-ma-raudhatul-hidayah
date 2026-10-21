import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { supabase } from '@/lib/supabaseClient';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'homeProfileData.json');

export async function GET() {
  let data: any = {};

  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    data = JSON.parse(fileContent);
  } catch (err) {
    console.warn('Could not read homeProfileData.json:', err);
  }

  // Also try to read from Supabase school_profile
  try {
    const { data: supaProfile, error } = await supabase
      .from('school_profile')
      .select('*')
      .eq('id', 1)
      .single();

    if (!error && supaProfile) {
      if (!data.profile) data.profile = {};
      if (!data.profile.name && supaProfile.name) data.profile.name = supaProfile.name;
      if (!data.profile.formalName && supaProfile.formal_name) data.profile.formalName = supaProfile.formal_name;
      if (!data.profile.npsn && supaProfile.npsn) data.profile.npsn = supaProfile.npsn;
      if (!data.profile.nsm && supaProfile.nsm) data.profile.nsm = supaProfile.nsm;
      if (!data.profile.accreditation && supaProfile.accreditation) data.profile.accreditation = supaProfile.accreditation;
      if (!data.profile.foundedYear && supaProfile.founded_year) data.profile.foundedYear = supaProfile.founded_year;
      if (!data.profile.address && supaProfile.address) data.profile.address = supaProfile.address;
      if (!data.profile.district && supaProfile.district) data.profile.district = supaProfile.district;
      if (!data.profile.regency && supaProfile.regency) data.profile.regency = supaProfile.regency;
      if (!data.profile.phone && supaProfile.phone) data.profile.phone = supaProfile.phone;
      if (!data.profile.whatsapp && supaProfile.whatsapp) data.profile.whatsapp = supaProfile.whatsapp;
      if (!data.profile.email && supaProfile.email) data.profile.email = supaProfile.email;
      if ((!data.visionMission || !data.visionMission.vision) && supaProfile.vision) {
        if (!data.visionMission) data.visionMission = {};
        data.visionMission.vision = supaProfile.vision;
      }
    }

    // Try reading homepage_config from Supabase
    try {
      const { data: supaHome } = await supabase
        .from('homepage_config')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (supaHome) {
        if (!data.homepage) data.homepage = {};
        if (supaHome.hero_title) data.homepage.heroTitle = supaHome.hero_title;
        if (supaHome.hero_tagline) data.homepage.heroTagline = supaHome.hero_tagline;
        if (supaHome.hero_badge) data.homepage.heroBadge = supaHome.hero_badge;
        if (supaHome.hero_background) data.homepage.heroBackground = supaHome.hero_background;
        if (supaHome.school_logo) data.homepage.schoolLogo = supaHome.school_logo;
        if (supaHome.marquee_text1) data.homepage.marqueeText1 = supaHome.marquee_text1;
        if (supaHome.marquee_cta1) data.homepage.marqueeCta1 = supaHome.marquee_cta1;
        if (supaHome.marquee_link1) data.homepage.marqueeLink1 = supaHome.marquee_link1;
        if (supaHome.marquee_text2) data.homepage.marqueeText2 = supaHome.marquee_text2;
        if (supaHome.marquee_cta2) data.homepage.marqueeCta2 = supaHome.marquee_cta2;
        if (supaHome.marquee_link2) data.homepage.marqueeLink2 = supaHome.marquee_link2;
        if (supaHome.sambutan_heading) data.homepage.sambutanHeading = supaHome.sambutan_heading;
        if (supaHome.sambutan_subtitle) data.homepage.sambutanSubtitle = supaHome.sambutan_subtitle;
        if (supaHome.sambutan_badge) data.homepage.sambutanBadge = supaHome.sambutan_badge;
        if (supaHome.headmaster_name) data.homepage.headmasterName = supaHome.headmaster_name;
        if (supaHome.headmaster_role) data.homepage.headmasterRole = supaHome.headmaster_role;
        if (supaHome.headmaster_photo) data.homepage.headmasterPhoto = supaHome.headmaster_photo;
        if (supaHome.sambutan_text1) data.homepage.sambutanText1 = supaHome.sambutan_text1;
        if (supaHome.sambutan_text2) data.homepage.sambutanText2 = supaHome.sambutan_text2;
        if (supaHome.cta_text) data.homepage.ctaText = supaHome.cta_text;
        if (supaHome.cta_link) data.homepage.ctaLink = supaHome.cta_link;
        if (supaHome.stat1_value) data.homepage.stat1Value = supaHome.stat1_value;
        if (supaHome.stat1_label) data.homepage.stat1Label = supaHome.stat1_label;
        if (supaHome.stat2_value) data.homepage.stat2Value = supaHome.stat2_value;
        if (supaHome.stat2_label) data.homepage.stat2Label = supaHome.stat2_label;
        if (supaHome.stat3_value) data.homepage.stat3Value = supaHome.stat3_value;
        if (supaHome.stat3_label) data.homepage.stat3Label = supaHome.stat3_label;
      }
    } catch (e) {}
  } catch (err) {
    // Non-blocking
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
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
        logo_url: home.schoolLogo,
      });

      // Sync homepage_config if table exists
      if (updatedData.homepage) {
        try {
          await supabase.from('homepage_config').upsert({
            id: 1,
            hero_title: home.heroTitle,
            hero_tagline: home.heroTagline,
            hero_badge: home.heroBadge,
            hero_background: home.heroBackground,
            school_logo: home.schoolLogo,
            marquee_text1: home.marqueeText1,
            marquee_cta1: home.marqueeCta1,
            marquee_link1: home.marqueeLink1,
            marquee_text2: home.marqueeText2,
            marquee_cta2: home.marqueeCta2,
            marquee_link2: home.marqueeLink2,
            sambutan_heading: home.sambutanHeading,
            sambutan_subtitle: home.sambutanSubtitle,
            sambutan_badge: home.sambutanBadge,
            headmaster_name: home.headmasterName,
            headmaster_role: home.headmasterRole,
            headmaster_photo: home.headmasterPhoto,
            sambutan_text1: home.sambutanText1,
            sambutan_text2: home.sambutanText2,
            cta_text: home.ctaText,
            cta_link: home.ctaLink,
            stat1_value: home.stat1Value,
            stat1_label: home.stat1Label,
            stat2_value: home.stat2Value,
            stat2_label: home.stat2Label,
            stat3_value: home.stat3Value,
            stat3_label: home.stat3Label,
          });
        } catch (e) {}
      }

      // Also update school_profile stats if numbers are valid
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

      // Sync facilities if present
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
    });
  } catch (error: any) {
    console.error('Error in profile POST:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal menyimpan data profil.' },
      { status: 500 }
    );
  }
}
