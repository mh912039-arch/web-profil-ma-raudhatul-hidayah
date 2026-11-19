import { Metadata } from 'next';
import { getProfileData } from '@/lib/profileServer';
import { FasilitasClient } from '@/components/profile/FasilitasClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const profileData = await getProfileData();
  const name = profileData.profile?.name || 'MAS Raudlatul Hidayah';
  const formalName = profileData.profile?.formalName || 'Madrasah Aliyah Swasta Raudlatul Hidayah';

  return {
    title: `Sarana & Fasilitas Pembelajaran | ${name}`,
    description: `Daftar fasilitas penunjang akademik, laboratorium, ruang ibadah, dan sarana olahraga di ${formalName}.`,
    alternates: {
      canonical: 'https://www.masraudlatulhidayah.sch.id/profil/fasilitas',
    },
  };
}

export default async function FasilitasPage() {
  const profileData = await getProfileData();

  return <FasilitasClient initialFacilities={profileData.facilities} />;
}
