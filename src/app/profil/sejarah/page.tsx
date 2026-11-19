import { Metadata } from 'next';
import { getProfileData } from '@/lib/profileServer';
import { SejarahClient } from '@/components/profile/SejarahClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const profileData = await getProfileData();
  const name = profileData.profile?.name || 'MAS Raudlatul Hidayah';
  const formalName = profileData.profile?.formalName || 'Madrasah Aliyah Swasta Raudlatul Hidayah';

  return {
    title: `Sejarah & Tonggak Perkembangan | ${name}`,
    description: `Sejarah pendirian, dedikasi kelembagaan, dan periodisasi perkembangan ${formalName} di Mauk Tangerang.`,
    alternates: {
      canonical: 'https://www.masraudlatulhidayah.sch.id/profil/sejarah',
    },
  };
}

export default async function SejarahPage() {
  const profileData = await getProfileData();

  return <SejarahClient initialData={profileData.history} />;
}
