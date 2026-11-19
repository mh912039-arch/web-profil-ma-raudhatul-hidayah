import { Metadata } from 'next';
import { getProfileData } from '@/lib/profileServer';
import { HomePageClient } from '@/components/home/HomePageClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const profileData = await getProfileData();
  const name = profileData.profile?.name || 'MAS Raudlatul Hidayah';
  const formalName = profileData.profile?.formalName || 'Madrasah Aliyah Swasta Raudlatul Hidayah';

  return {
    title: `Portal Resmi | ${name}`,
    description: `Website resmi ${formalName}. NPSN: ${profileData.profile?.npsn || '69941777'}, Mauk Kabupaten Tangerang Banten. Berlandaskan adab, Kurikulum Merdeka, dan keunggulan akademik.`,
    alternates: {
      canonical: 'https://www.masraudlatulhidayah.sch.id',
    },
  };
}

export default async function HomePage() {
  const profileData = await getProfileData();

  return <HomePageClient initialHome={profileData.homepage} />;
}
