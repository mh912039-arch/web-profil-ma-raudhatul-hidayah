import { Metadata } from 'next';
import { getProfileData } from '@/lib/profileServer';
import { VisiMisiClient } from '@/components/profile/VisiMisiClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const profileData = await getProfileData();
  const name = profileData.profile?.name || 'MAS Raudlatul Hidayah';
  const formalName = profileData.profile?.formalName || 'Madrasah Aliyah Swasta Raudlatul Hidayah';

  return {
    title: `Visi & Misi | ${name}`,
    description: `Arah haluan nilai pendidikan, visi kelembagaan, dan misi pembelajaran kontekstual di ${formalName}.`,
    alternates: {
      canonical: 'https://www.masraudlatulhidayah.sch.id/profil/visi-misi',
    },
  };
}

export default async function VisiMisiPage() {
  const profileData = await getProfileData();

  return <VisiMisiClient initialData={profileData.visionMission} />;
}
