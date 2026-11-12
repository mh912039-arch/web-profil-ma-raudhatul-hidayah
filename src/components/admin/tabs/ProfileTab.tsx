'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  Building2,
  Save,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock,
  BookOpen,
  History,
  Sparkles,
  Plus,
  Trash2,
  Upload,
  Layers,
  Compass,
  Navigation,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
} from 'lucide-react';
import { uploadImageWithAutoCompression } from '@/lib/imageCompression';

export interface ProfileFacility {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  image: string;
  badge: string;
}

export interface ProfileMilestone {
  year?: string;
  badge?: string;
  title: string;
  desc: string;
}

export interface FullProfileData {
  profile: {
    name: string;
    formalName: string;
    level: string;
    npsn: string;
    nsm: string;
    accreditation: string;
    foundedYear: string;
    address: string;
    district: string;
    regency: string;
    province: string;
    postalCode: string;
    phone: string;
    whatsapp: string;
    email: string;
    hoursWeekdays: string;
    hoursSaturday: string;
    hoursSunday: string;
    contactTitle?: string;
    contactSubtitle?: string;
    mapsEmbedUrl?: string;
    navGuideAccess?: string;
    navGuideBenchmark?: string;
    navGuideParking?: string;
  };
  visionMission: {
    vision: string;
    missions: string[];
    missionTitle?: string;
    missionSubtitle?: string;
    pageTitle?: string;
    pageSubtitle?: string;
    pillars?: { title: string; desc: string; icon: string }[];
  };
  history: {
    title: string;
    subtitle: string;
    lead: string;
    paragraphs?: string[];
    image?: string;
    imageCaptionTitle?: string;
    imageCaptionSubtitle?: string;
    stat1Label?: string;
    stat1Value?: string;
    stat2Label?: string;
    stat2Value?: string;
    periodSectionTitle?: string;
    periodSectionSubtitle?: string;
    milestones: ProfileMilestone[];
  };
  facilities: ProfileFacility[];
}

interface ProfileTabProps {
  data: FullProfileData;
  onSaveFullProfile: (data: FullProfileData) => Promise<void>;
  isSaving: boolean;
  activeTab?: 'profile' | 'facilities' | 'contact';
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  data,
  onSaveFullProfile,
  isSaving,
  activeTab = 'profile',
}) => {
  const [formData, setFormData] = useState<FullProfileData>({
    profile: {
      name: data.profile?.name || 'MAS Raudlatul Hidayah',
      formalName: data.profile?.formalName || 'Madrasah Aliyah Raudlatul Hidayah',
      level: data.profile?.level || 'Madrasah Aliyah (MA)',
      npsn: data.profile?.npsn || '6994888',
      nsm: data.profile?.nsm || '131236030045',
      accreditation: data.profile?.accreditation || 'C',
      foundedYear: data.profile?.foundedYear || '2012',
      address: data.profile?.address || 'Jl. Raya Tanjung Kait No. 33, RT 02 / RW 01',
      district: data.profile?.district || 'Mauk',
      regency: data.profile?.regency || 'Kabupaten Tangerang',
      province: data.profile?.province || 'Banten',
      postalCode: data.profile?.postalCode || '15330',
      phone: data.profile?.phone || '0817-6614-723',
      whatsapp: data.profile?.whatsapp || '628176614723',
      email: data.profile?.email || 'info@maraudlatulhidayah.sch.id',
      hoursWeekdays: data.profile?.hoursWeekdays || '07.00 – 16.00 WIB',
      hoursSaturday: data.profile?.hoursSaturday || '07.00 – 12.00 WIB',
      hoursSunday: data.profile?.hoursSunday || 'Tutup Layanan Fisik',
      contactTitle: data.profile?.contactTitle || 'Hubungi Layanan Kami',
      contactSubtitle: data.profile?.contactSubtitle || 'Mempunyai pertanyaan seputar administrasi, sistem PPDB, atau kemitraan akademik? Tinggalkan pesan Anda.',
      mapsEmbedUrl: data.profile?.mapsEmbedUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3967.6256247920387!2d106.53266297592476!3d-6.022493393963283!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6a077ff9292557%3A0xae9bc40d9fedd490!2sMA%20RAUDLATUL%20HIDAYAH!5e0!3m2!1sid!2sid!4v1728300000000!5m2!1sid!2sid',
      navGuideAccess: data.profile?.navGuideAccess || 'Melalui Jl. Raya Tanjung Kait, Desa Tanjung Anom, Kec. Mauk.',
      navGuideBenchmark: data.profile?.navGuideBenchmark || 'Berada di kawasan Tanjung Anom Mauk, dekat dengan fasilitas publik desa dan kantor pemerintahan.',
      navGuideParking: data.profile?.navGuideParking || 'Halaman sekolah menyediakan area parkir yang tertib untuk motor maupun mobil wali murid.',
    },
    visionMission: {
      vision: data.visionMission?.vision || 'Terwujudnya generasi santri yang beriman dan bertakwa, berakhlak mulia, unggul dalam prestasi akademik dan non-akademik, serta berwawasan lingkungan dan keislaman yang moderat.',
      missions: data.visionMission?.missions || [
        'Menyelenggarakan proses pembelajaran integratif antara Kurikulum Nasional dan kurikulum kepesantrenan.',
        'Mengembangkan budaya riset ilmiah, penalaran kritis, dan literasi digital yang berlandaskan etika Islam.',
      ],
      missionTitle: data.visionMission?.missionTitle || 'Misi Pokok Penyelenggaraan Sekolah',
      missionSubtitle: data.visionMission?.missionSubtitle || 'Langkah konkret institusi dalam mengejawantahkan visi luhur ke dalam iklim pembelajaran, kultur madrasah, dan interaksi sosial harian peserta didik.',
      pageTitle: data.visionMission?.pageTitle || 'Visi & Misi Madrasah',
      pageSubtitle: data.visionMission?.pageSubtitle || 'Arah haluan nilai pendidikan, visi kelembagaan, misi pembelajaran kontekstual, dan pilar keunggulan santri MAS Raudlatul Hidayah.',
      pillars: data.visionMission?.pillars || [],
    },
    history: {
      title: data.history?.title || 'Memperluas Akses Pendidikan Menengah di Wilayah Mauk',
      subtitle: data.history?.subtitle || 'Sejarah & Perjalanan Madrasah',
      lead: data.history?.lead || 'MAS Raudlatul Hidayah didirikan pada tahun 2015 sebagai bagian dari ikhtiar Kementerian Agama bersama masyarakat Desa Tanjung Anom...',
      paragraphs: data.history?.paragraphs || [],
      image: data.history?.image || '/halaman-sekolah.jpeg',
      imageCaptionTitle: data.history?.imageCaptionTitle || 'Lingkungan Gedung Utama MAS Raudlatul Hidayah',
      imageCaptionSubtitle: data.history?.imageCaptionSubtitle || 'Jl. Raya Tanjung Kait No. 33, RT 02 / RW 01, Desa Tanjung Anom, Kec. Mauk',
      stat1Label: data.history?.stat1Label || 'Tahun Berdiri',
      stat1Value: data.history?.stat1Value || data.profile?.foundedYear || '2015',
      stat2Label: data.history?.stat2Label || 'NPSN Resmi',
      stat2Value: data.history?.stat2Value || data.profile?.npsn || '69941777',
      periodSectionTitle: data.history?.periodSectionTitle || 'Periodisasi Perkembangan Sekolah',
      periodSectionSubtitle: data.history?.periodSectionSubtitle || 'Tahapan pertumbuhan kelembagaan dan pemenuhan sarana pendidikan sejak awal berdiri hingga saat ini.',
      milestones: data.history?.milestones || [
        {
          year: '2015',
          title: 'Pendirian & Pembukaan Layanan Pendidikan',
          desc: 'MAS Raudlatul Hidayah mulai beroperasi di Desa Tanjung Anom untuk menjawab kebutuhan akses pendidikan menengah Islam.',
        },
      ],
    },
    facilities: data.facilities || [],
  });

  useEffect(() => {
    if (data && data.profile) {
      setFormData({
        profile: {
          name: data.profile.name || 'MAS Raudlatul Hidayah',
          formalName: data.profile.formalName || 'Madrasah Aliyah Swasta Raudlatul Hidayah',
          level: data.profile.level || 'Madrasah Aliyah (MA)',
          npsn: data.profile.npsn || '69941777',
          nsm: data.profile.nsm || '131236030069',
          accreditation: data.profile.accreditation || 'C',
          foundedYear: data.profile.foundedYear || '2015',
          address: data.profile.address || 'Jl. Raya Tanjung Kait No. 33, RT 02 / RW 01',
          district: data.profile.district || 'Mauk',
          regency: data.profile.regency || 'Kabupaten Tangerang',
          province: data.profile.province || 'Banten',
          postalCode: data.profile.postalCode || '15330',
          phone: data.profile.phone || '0817-6614-723',
          whatsapp: data.profile.whatsapp || '628176614723',
          email: data.profile.email || 'info@maraudhatulhidayah.sch.id',
          hoursWeekdays: data.profile.hoursWeekdays || '07.00 – 16.00 WIB',
          hoursSaturday: data.profile.hoursSaturday || '07.00 – 12.00 WIB',
          hoursSunday: data.profile.hoursSunday || 'Tutup Layanan Fisik',
          contactTitle: data.profile.contactTitle || 'Hubungi Layanan Kami',
          contactSubtitle: data.profile.contactSubtitle || 'Mempunyai pertanyaan seputar administrasi, sistem PPDB, atau kemitraan akademik? Tinggalkan pesan Anda.',
          mapsEmbedUrl: data.profile.mapsEmbedUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3967.6256247920387!2d106.53266297592476!3d-6.022493393963283!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6a077ff9292557%3A0xae9bc40d9fedd490!2sMA%20RAUDLATUL%20HIDAYAH!5e0!3m2!1sid!2sid!4v1728300000000!5m2!1sid!2sid',
          navGuideAccess: data.profile.navGuideAccess || 'Melalui Jl. Raya Tanjung Kait, Desa Tanjung Anom, Kec. Mauk.',
          navGuideBenchmark: data.profile.navGuideBenchmark || 'Berada di kawasan Tanjung Anom Mauk, dekat dengan fasilitas publik desa dan kantor pemerintahan.',
          navGuideParking: data.profile.navGuideParking || 'Halaman sekolah menyediakan area parkir yang tertib untuk motor maupun mobil wali murid.',
        },
        visionMission: {
          vision: data.visionMission?.vision || '',
          missions: data.visionMission?.missions || [],
          missionTitle: data.visionMission?.missionTitle || 'Misi Pokok Penyelenggaraan Sekolah',
          missionSubtitle: data.visionMission?.missionSubtitle || 'Langkah konkret institusi dalam mengejawantahkan visi luhur ke dalam iklim pembelajaran, kultur madrasah, dan interaksi sosial harian peserta didik.',
          pageTitle: data.visionMission?.pageTitle || 'Visi & Misi Madrasah',
          pageSubtitle: data.visionMission?.pageSubtitle || 'Arah haluan nilai pendidikan, visi kelembagaan, misi pembelajaran kontekstual, dan pilar keunggulan santri MAS Raudlatul Hidayah.',
          pillars: data.visionMission?.pillars || [],
        },
        history: {
          title: data.history?.title || '',
          subtitle: data.history?.subtitle || '',
          lead: data.history?.lead || '',
          paragraphs: data.history?.paragraphs || [],
          image: data.history?.image || '/halaman-sekolah.jpeg',
          imageCaptionTitle: data.history?.imageCaptionTitle || 'Lingkungan Gedung Utama MAS Raudlatul Hidayah',
          imageCaptionSubtitle: data.history?.imageCaptionSubtitle || 'Jl. Raya Tanjung Kait No. 33, RT 02 / RW 01, Mauk, Kab. Tangerang',
          stat1Label: data.history?.stat1Label || 'Tahun Berdiri',
          stat1Value: data.history?.stat1Value || data.profile?.foundedYear || '2015',
          stat2Label: data.history?.stat2Label || 'NPSN Resmi',
          stat2Value: data.history?.stat2Value || data.profile?.npsn || '69941777',
          periodSectionTitle: data.history?.periodSectionTitle || 'Periodisasi Perkembangan Sekolah',
          periodSectionSubtitle: data.history?.periodSectionSubtitle || 'Tahapan pertumbuhan kelembagaan dan pemenuhan sarana pendidikan sejak awal berdiri hingga saat ini.',
          milestones: data.history?.milestones || [],
        },
        facilities: data.facilities || [],
      });
    }
  }, [data]);

  const [activeSubTab, setActiveSubTab] = useState<'kontak' | 'legal' | 'visi' | 'sejarah' | 'fasilitas'>(
    activeTab === 'facilities' ? 'fasilitas' : activeTab === 'contact' ? 'kontak' : 'legal'
  );

  useEffect(() => {
    if (activeTab === 'facilities') {
      setActiveSubTab('fasilitas');
    } else if (activeTab === 'contact') {
      setActiveSubTab('kontak');
    } else if (activeTab === 'profile') {
      setActiveSubTab('legal');
    }
  }, [activeTab]);
  const [uploadingFacilityId, setUploadingFacilityId] = useState<string | null>(null);

  // Profile text change
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [name]: value,
      },
    }));
  };

  // Vision change
  const handleVisionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      visionMission: {
        ...prev.visionMission,
        vision: val,
      },
    }));
  };

  const handleVisionMissionFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      visionMission: {
        ...prev.visionMission,
        [name]: value,
      },
    }));
  };

  // Mission changes
  const handleMissionChange = (index: number, val: string) => {
    setFormData((prev) => {
      const nextMissions = [...prev.visionMission.missions];
      nextMissions[index] = val;
      return {
        ...prev,
        visionMission: {
          ...prev.visionMission,
          missions: nextMissions,
        },
      };
    });
  };

  const handleAddMission = () => {
    setFormData((prev) => ({
      ...prev,
      visionMission: {
        ...prev.visionMission,
        missions: [...prev.visionMission.missions, ''],
      },
    }));
  };

  const handleRemoveMission = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      visionMission: {
        ...prev.visionMission,
        missions: prev.visionMission.missions.filter((_, i) => i !== index),
      },
    }));
  };

  // History text change
  const handleHistoryChange = (field: keyof FullProfileData['history'], val: any) => {
    setFormData((prev) => ({
      ...prev,
      history: {
        ...prev.history,
        [field]: val,
      },
    }));
  };

  const [uploadingHistoryImage, setUploadingHistoryImage] = useState(false);

  const handleHistoryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingHistoryImage(true);
    try {
      const result = await uploadImageWithAutoCompression(file);
      handleHistoryChange('image', result.url);
    } catch (err: any) {
      alert(err.message || 'Gagal mengunggah foto gedung sejarah');
    } finally {
      setUploadingHistoryImage(false);
    }
  };

  // Milestone changes
  const handleMilestoneChange = (index: number, field: keyof ProfileMilestone, val: string) => {
    setFormData((prev) => {
      const nextMilestones = [...prev.history.milestones];
      nextMilestones[index] = { ...nextMilestones[index], [field]: val };
      return {
        ...prev,
        history: {
          ...prev.history,
          milestones: nextMilestones,
        },
      };
    });
  };

  const handleAddMilestone = () => {
    const curYear = new Date().getFullYear();
    setFormData((prev) => ({
      ...prev,
      history: {
        ...prev.history,
        milestones: [
          ...prev.history.milestones,
          {
            year: `${curYear}`,
            badge: `${curYear}`,
            title: 'Tahap Pertumbuhan Baru',
            desc: 'Tuliskan deskripsi peristiwa atau pencapaian madrasah...',
          },
        ],
      },
    }));
  };

  const handleRemoveMilestone = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      history: {
        ...prev.history,
        milestones: prev.history.milestones.filter((_, i) => i !== index),
      },
    }));
  };

  const handleMoveMilestone = (index: number, direction: 'up' | 'down') => {
    setFormData((prev) => {
      const next = [...prev.history.milestones];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return {
        ...prev,
        history: {
          ...prev.history,
          milestones: next,
        },
      };
    });
  };

  // Facilities changes
  const handleFacilityChange = (index: number, field: keyof ProfileFacility, val: string) => {
    setFormData((prev) => {
      const nextFacs = [...prev.facilities];
      nextFacs[index] = { ...nextFacs[index], [field]: val };
      return {
        ...prev,
        facilities: nextFacs,
      };
    });
  };

  const handleFacilityUpload = async (e: React.ChangeEvent<HTMLInputElement>, facId: string, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFacilityId(facId);
    try {
      const result = await uploadImageWithAutoCompression(file);
      handleFacilityChange(index, 'image', result.url);
    } catch (err: any) {
      alert(err.message || 'Gagal mengunggah foto fasilitas');
    } finally {
      setUploadingFacilityId(null);
    }
  };

  const handleAddFacility = () => {
    const newId = `fac-${Date.now()}`;
    setFormData((prev) => ({
      ...prev,
      facilities: [
        ...prev.facilities,
        {
          id: newId,
          title: 'Fasilitas Baru',
          subtitle: 'Keterangan Singkat',
          desc: 'Deskripsi lengkap sarana dan prasarana penunjang kegiatan santri.',
          image: '/kelas.jpeg',
          badge: 'Sarana Akademik',
        },
      ],
    }));
  };

  const handleRemoveFacility = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveFullProfile(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-[18px] font-bold text-slate-900">
            {activeSubTab === 'kontak'
              ? 'Pengaturan Halaman Kontak (/kontak)'
              : activeSubTab === 'visi'
              ? 'Visi & Misi Madrasah (/profil/visi-misi)'
              : activeSubTab === 'sejarah'
              ? 'Sejarah Madrasah (/profil/sejarah)'
              : activeSubTab === 'fasilitas'
              ? 'Fasilitas Madrasah (/profil/fasilitas)'
              : 'Identitas & Profil Web'}
          </h3>
          <p className="text-[13px] text-slate-500">
            {activeSubTab === 'kontak'
              ? 'Sesuaikan judul, kontak telepon/WA/email resmi, jam kerja TU, dan peta lokasi Google Maps'
              : activeSubTab === 'visi'
              ? 'Sesuaikan teks visi utama, judul misi pokok, subtitle pengantar, dan butir misi madrasah'
              : activeSubTab === 'sejarah'
              ? 'Sesuaikan judul besar, narasi pengantar, dan tonggak sejarah perkembangan madrasah'
              : activeSubTab === 'fasilitas'
              ? 'Sarana prasarana, laboratorium, ruang kelas, dan fasilitas unggulan madrasah'
              : 'NPSN, NSM, visi misi kelembagaan, alamat resmi, dan profil madrasah'}
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-sans text-[13px] font-bold transition-all shadow-xs active:scale-95 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>
            {isSaving
              ? 'Menyimpan...'
              : activeSubTab === 'kontak'
              ? 'Simpan Halaman Kontak'
              : activeSubTab === 'visi'
              ? 'Simpan Visi & Misi'
              : activeSubTab === 'sejarah'
              ? 'Simpan Sejarah Madrasah'
              : activeSubTab === 'fasilitas'
              ? 'Simpan Fasilitas Madrasah'
              : 'Simpan Profil Web'}
          </span>
        </button>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-xl w-fit">
        <button
          type="button"
          onClick={() => setActiveSubTab('legal')}
          className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
            activeSubTab === 'legal'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Identitas Lembaga
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('kontak')}
          className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
            activeSubTab === 'kontak'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Halaman Kontak
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('visi')}
          className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
            activeSubTab === 'visi'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Visi &amp; Misi
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('sejarah')}
          className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
            activeSubTab === 'sejarah'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Sejarah Madrasah
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('fasilitas')}
          className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
            activeSubTab === 'fasilitas'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Fasilitas Madrasah
        </button>
      </div>

      {/* SUB-TAB 0: HALAMAN KONTAK */}
      {activeSubTab === 'kontak' && (
        <div className="space-y-6">
          {/* Card: Header Halaman Kontak */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-5">
            <h4 className="font-serif text-[16px] font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Phone className="w-5 h-5 text-blue-600" />
              <span>Header &amp; Pengantar Halaman Kontak</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[12.5px] font-bold text-slate-700">Judul Utama Halaman Kontak</label>
                <input
                  type="text"
                  name="contactTitle"
                  value={formData.profile.contactTitle || ''}
                  onChange={handleProfileChange}
                  placeholder="Hubungi Layanan Kami"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[14px] font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[12.5px] font-bold text-slate-700">Deskripsi / Subtitle Pengantar</label>
                <textarea
                  rows={2}
                  name="contactSubtitle"
                  value={formData.profile.contactSubtitle || ''}
                  onChange={handleProfileChange}
                  placeholder="Mempunyai pertanyaan seputar administrasi, sistem PPDB, atau kemitraan akademik? Tinggalkan pesan Anda."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13px] text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  required
                />
              </div>
            </div>
          </div>

          {/* Card: 3 Kontak Utama (Alamat, Telepon, Email) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-5">
            <h4 className="font-serif text-[16px] font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-600" />
              <span>Direktori Kontak Resmi (Tampil pada 3 Kartu Kontak)</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-bold text-slate-700">Alamat Jalan (Lengkap)</label>
                <input
                  type="text"
                  name="address"
                  value={formData.profile.address}
                  onChange={handleProfileChange}
                  placeholder="Jl. Raya Tanjung Kait No. 33, RT 02 / RW 01"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13px] text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12.5px] font-bold text-slate-700">Kecamatan</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.profile.district}
                    onChange={handleProfileChange}
                    placeholder="Mauk"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13px]"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12.5px] font-bold text-slate-700">Kabupaten/Kota</label>
                  <input
                    type="text"
                    name="regency"
                    value={formData.profile.regency}
                    onChange={handleProfileChange}
                    placeholder="Kabupaten Tangerang"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13px]"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-bold text-slate-700">Telepon Resmi (Tata Usaha)</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.profile.phone}
                  onChange={handleProfileChange}
                  placeholder="0817-6614-723"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-mono text-slate-900"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-bold text-slate-700">WhatsApp Resmi (dengan awalan 62)</label>
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.profile.whatsapp}
                  onChange={handleProfileChange}
                  placeholder="628176614723"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-mono text-slate-900"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-bold text-slate-700">E-mail Resmi</label>
                <input
                  type="email"
                  name="email"
                  value={formData.profile.email}
                  onChange={handleProfileChange}
                  placeholder="info@maraudhatulhidayah.sch.id"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13px] text-slate-900"
                  required
                />
              </div>
            </div>

            {/* Jam Kerja TU */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <span className="text-[12.5px] font-bold text-slate-800 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>Jam Pelayanan Tata Usaha</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-medium text-slate-600">Senin – Jumat</label>
                  <input
                    type="text"
                    name="hoursWeekdays"
                    value={formData.profile.hoursWeekdays}
                    onChange={handleProfileChange}
                    placeholder="07.00 – 16.00 WIB"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-[12.5px]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-medium text-slate-600">Sabtu</label>
                  <input
                    type="text"
                    name="hoursSaturday"
                    value={formData.profile.hoursSaturday}
                    onChange={handleProfileChange}
                    placeholder="07.00 – 12.00 WIB"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-[12.5px]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-medium text-slate-600">Ahad &amp; Libur</label>
                  <input
                    type="text"
                    name="hoursSunday"
                    value={formData.profile.hoursSunday}
                    onChange={handleProfileChange}
                    placeholder="Tutup Layanan Fisik"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-[12.5px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card: Peta Google Maps & Panduan Rute */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-5">
            <h4 className="font-serif text-[16px] font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-indigo-600" />
              <span>Peta Lokasi Google Maps &amp; Panduan Navigasi</span>
            </h4>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12.5px] font-bold text-slate-700">URL Embed Google Maps (Iframe Src)</label>
              <input
                type="text"
                name="mapsEmbedUrl"
                value={formData.profile.mapsEmbedUrl || ''}
                onChange={handleProfileChange}
                placeholder="https://www.google.com/maps/embed?pb=..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[12.5px] font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
              <span className="text-[11.5px] text-slate-500">
                Dapatkan dari Google Maps: Bagikan &gt; Sematkan peta (Embed a map) &gt; Salin tautan src dari iframe.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-slate-700">Akses Utama</label>
                <textarea
                  rows={2}
                  name="navGuideAccess"
                  value={formData.profile.navGuideAccess || ''}
                  onChange={handleProfileChange}
                  placeholder="Melalui Jl. Raya Tanjung Kait, Desa Tanjung Anom, Kec. Mauk."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[12.5px] text-slate-900 focus:bg-white"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-slate-700">Patokan Lokasi</label>
                <textarea
                  rows={2}
                  name="navGuideBenchmark"
                  value={formData.profile.navGuideBenchmark || ''}
                  onChange={handleProfileChange}
                  placeholder="Berada di kawasan Tanjung Anom Mauk, dekat dengan fasilitas publik desa dan kantor pemerintahan."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[12.5px] text-slate-900 focus:bg-white"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-slate-700">Fasilitas Parkir</label>
                <textarea
                  rows={2}
                  name="navGuideParking"
                  value={formData.profile.navGuideParking || ''}
                  onChange={handleProfileChange}
                  placeholder="Halaman sekolah menyediakan area parkir yang tertib untuk motor maupun mobil wali murid."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[12.5px] text-slate-900 focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 1: IDENTITAS LEMBAGA */}
      {activeSubTab === 'legal' && (
        <div className="space-y-6">
          {/* Card: Legalitas Lembaga */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-5">
            <h4 className="font-serif text-[16px] font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <span>Legalitas Kelembagaan</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-bold text-slate-700">Nama Madrasah Singkat</label>
                <input
                  type="text"
                  name="name"
                  value={formData.profile.name}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13.5px] font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[12.5px] font-bold text-slate-700">Nama Resmi Lengkap Lembaga</label>
                <input
                  type="text"
                  name="formalName"
                  value={formData.profile.formalName}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13.5px] text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-bold text-slate-700">NPSN</label>
                <input
                  type="text"
                  name="npsn"
                  value={formData.profile.npsn}
                  onChange={handleProfileChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-mono font-bold"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-bold text-slate-700">NSM Kemenag</label>
                <input
                  type="text"
                  name="nsm"
                  value={formData.profile.nsm}
                  onChange={handleProfileChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-mono font-bold"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-bold text-slate-700">Akreditasi</label>
                <input
                  type="text"
                  name="accreditation"
                  value={formData.profile.accreditation}
                  onChange={handleProfileChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-bold text-emerald-700"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-bold text-slate-700">Tahun Berdiri</label>
                <input
                  type="text"
                  name="foundedYear"
                  value={formData.profile.foundedYear}
                  onChange={handleProfileChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-bold"
                  required
                />
              </div>
            </div>
          </div>

          {/* Card: Alamat & Kontak */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-5">
            <h4 className="font-serif text-[16px] font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-600" />
              <span>Alamat Kantor &amp; Kontak Resmi</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-bold text-slate-700">Alamat Jalan</label>
                <input
                  type="text"
                  name="address"
                  value={formData.profile.address}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13px]"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12.5px] font-bold text-slate-700">Kecamatan</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.profile.district}
                    onChange={handleProfileChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13px]"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12.5px] font-bold text-slate-700">Kabupaten/Kota</label>
                  <input
                    type="text"
                    name="regency"
                    value={formData.profile.regency}
                    onChange={handleProfileChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13px]"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-bold text-slate-700">Telepon Tata Usaha</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.profile.phone}
                  onChange={handleProfileChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-mono"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-bold text-slate-700">WhatsApp Resmi (dengan awalan 62)</label>
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.profile.whatsapp}
                  onChange={handleProfileChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-mono"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-bold text-slate-700">Email Resmi</label>
                <input
                  type="email"
                  name="email"
                  value={formData.profile.email}
                  onChange={handleProfileChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13px]"
                />
              </div>
            </div>

            {/* Jam Kerja TU */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <span className="text-[12.5px] font-bold text-slate-800 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>Jam Pelayanan Tata Usaha</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-medium text-slate-600">Senin – Jumat</label>
                  <input
                    type="text"
                    name="hoursWeekdays"
                    value={formData.profile.hoursWeekdays}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-[12.5px]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-medium text-slate-600">Sabtu</label>
                  <input
                    type="text"
                    name="hoursSaturday"
                    value={formData.profile.hoursSaturday}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-[12.5px]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-medium text-slate-600">Ahad &amp; Libur</label>
                  <input
                    type="text"
                    name="hoursSunday"
                    value={formData.profile.hoursSunday}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-[12.5px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: VISI & MISI */}
      {activeSubTab === 'visi' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-6">
          <h4 className="font-serif text-[16px] font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-600" />
            <span>Visi &amp; Misi Madrasah (/profil/visi-misi)</span>
          </h4>

          {/* Visi */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-slate-800">Teks Visi Utama</label>
            <textarea
              rows={3}
              value={formData.visionMission.vision}
              onChange={handleVisionChange}
              className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-[14px] font-medium text-slate-900 leading-relaxed focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              required
            />
          </div>

          {/* Pengaturan Judul & Deskripsi Pengantar Bagian Misi */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/90 space-y-4">
            <h5 className="font-serif text-[15px] font-bold text-slate-900 border-b border-slate-200 pb-2.5 flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-600" />
              <span>Pengaturan Judul &amp; Subtitle Bagian Misi</span>
            </h5>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12.5px] font-bold text-slate-700">
                Judul Bagian Misi
              </label>
              <input
                type="text"
                name="missionTitle"
                value={formData.visionMission.missionTitle || ''}
                onChange={handleVisionMissionFieldChange}
                placeholder="Misi Pokok Penyelenggaraan Sekolah"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-[14px] font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12.5px] font-bold text-slate-700">
                Deskripsi / Subtitle Pengantar Misi
              </label>
              <textarea
                rows={2}
                name="missionSubtitle"
                value={formData.visionMission.missionSubtitle || ''}
                onChange={handleVisionMissionFieldChange}
                placeholder="Langkah konkret institusi dalam mengejawantahkan visi luhur ke dalam iklim pembelajaran, kultur madrasah, dan interaksi sosial harian peserta didik."
                className="w-full p-3.5 rounded-xl bg-white border border-slate-200 text-[13.5px] text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                required
              />
            </div>
          </div>

          {/* Misi */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-bold text-slate-800">Butir-Butir Misi Madrasah</label>
              <button
                type="button"
                onClick={handleAddMission}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[12px] font-bold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Butir Misi</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {formData.visionMission.missions.map((mission, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-bold text-[12px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={mission}
                    onChange={(e) => handleMissionChange(idx, e.target.value)}
                    placeholder="Tuliskan misi madrasah..."
                    className="flex-grow px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px]"
                    required
                  />
                  {formData.visionMission.missions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMission(idx)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                      title="Hapus butir misi"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: SEJARAH & PERIODISASI MADRASAH (SESUAI SSAN GAMBAR 1, 2, & 3) */}
      {activeSubTab === 'sejarah' && (
        <div className="space-y-6">
          {/* Bagian 1: Narasi Editorial & Judul Halaman (Sesuai Gambar 1 - Kiri) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-5">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <h4 className="font-serif text-[16px] font-bold text-slate-900 flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-700" />
                <span>1. Narasi Sejarah & Judul Halaman (/profil/sejarah)</span>
              </h4>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Gambar 1 (Kiri)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-bold text-slate-700">Subjudul Tag Pill</label>
                <input
                  type="text"
                  value={formData.history.subtitle || ''}
                  onChange={(e) => handleHistoryChange('subtitle', e.target.value)}
                  placeholder="Sejarah & Perjalanan Madrasah"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-medium"
                />
              </div>
              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="text-[12.5px] font-bold text-slate-700">Judul Besar Editorial</label>
                <input
                  type="text"
                  value={formData.history.title || ''}
                  onChange={(e) => handleHistoryChange('title', e.target.value)}
                  placeholder="Memperluas Akses Pendidikan Menengah di Wilayah Mauk"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13.5px] font-bold"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[12.5px] font-bold text-slate-700">
                  Paragraf Narasi Sejarah (Bisa Multi-Paragraf)
                </label>
                <span className="text-[11.5px] text-slate-400">
                  Pisahkan dengan baris kosong (enter 2x) untuk membuat paragraf baru
                </span>
              </div>
              <textarea
                rows={6}
                value={formData.history.lead || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  handleHistoryChange('lead', val);
                  const splitParas = val.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
                  handleHistoryChange('paragraphs', splitParas);
                }}
                placeholder="Tuliskan kisah sejarah pendirian madrasah di sini..."
                className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[13px] leading-relaxed resize-y font-sans"
                required
              />
            </div>
          </div>

          {/* Bagian 2: Foto Gedung Utama & 2 Kotak Statistik (Sesuai Gambar 1 - Kanan) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-5">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <h4 className="font-serif text-[16px] font-bold text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-700" />
                <span>2. Foto Gedung & Kotak Statistik</span>
              </h4>
              <span className="text-[11px] font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                Gambar 1 (Kanan)
              </span>
            </div>

            {/* Unggah Foto Gedung & Keterangan */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              <div className="md:col-span-4 flex flex-col gap-2">
                <span className="text-[12.5px] font-bold text-slate-700">Foto Gedung Utama</span>
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group">
                  <Image
                    src={formData.history.image || '/halaman-sekolah.jpeg'}
                    alt="Foto Gedung Sejarah"
                    fill
                    className="object-cover"
                  />
                  {uploadingHistoryImage && (
                    <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center text-white text-xs gap-1">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Mengunggah...</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <label className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-bold transition-all cursor-pointer border border-blue-200 shadow-2xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingHistoryImage ? 'Mengompres...' : 'Ganti Foto Gedung'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleHistoryImageUpload}
                      disabled={uploadingHistoryImage}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="md:col-span-8 space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12.5px] font-bold text-slate-700">URL Foto Manual (Opsional)</label>
                  <input
                    type="text"
                    value={formData.history.image || ''}
                    onChange={(e) => handleHistoryChange('image', e.target.value)}
                    placeholder="/halaman-sekolah.jpeg atau https://..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[12.5px]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12.5px] font-bold text-slate-700">Judul Keterangan Foto</label>
                    <input
                      type="text"
                      value={formData.history.imageCaptionTitle || ''}
                      onChange={(e) => handleHistoryChange('imageCaptionTitle', e.target.value)}
                      placeholder="Lingkungan Gedung Utama MAS Raudlatul Hidayah"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-semibold"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12.5px] font-bold text-slate-700">Alamat / Lokasi Keterangan</label>
                    <input
                      type="text"
                      value={formData.history.imageCaptionSubtitle || ''}
                      onChange={(e) => handleHistoryChange('imageCaptionSubtitle', e.target.value)}
                      placeholder="Jl. Raya Tanjung Kait No. 33, RT 02 / RW 01, Mauk"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px]"
                    />
                  </div>
                </div>

                {/* 2 Kotak Statistik Berdampingan */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[12.5px] font-bold text-slate-700 block mb-2">
                    Dua Kotak Statistik Bawah Foto
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Kotak 1: Tahun Berdiri */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-semibold text-slate-500">Label Kotak 1</label>
                        <input
                          type="text"
                          value={formData.history.stat1Label || 'Tahun Berdiri'}
                          onChange={(e) => handleHistoryChange('stat1Label', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-semibold text-slate-500">Nilai / Angka Kotak 1</label>
                        <input
                          type="text"
                          value={formData.history.stat1Value || '2015'}
                          onChange={(e) => handleHistoryChange('stat1Value', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-sm font-bold text-slate-900"
                        />
                      </div>
                    </div>

                    {/* Kotak 2: NPSN Resmi */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-semibold text-slate-500">Label Kotak 2</label>
                        <input
                          type="text"
                          value={formData.history.stat2Label || 'NPSN Resmi'}
                          onChange={(e) => handleHistoryChange('stat2Label', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-semibold text-slate-500">Nilai / Angka Kotak 2</label>
                        <input
                          type="text"
                          value={formData.history.stat2Value || '69941777'}
                          onChange={(e) => handleHistoryChange('stat2Value', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-sm font-bold text-slate-900"
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Bagian 3: Periodisasi Perkembangan Sekolah (Sesuai Gambar 2 & 3) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-5">
            <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-serif text-[16px] font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-600" />
                  <span>3. Periodisasi Perkembangan Sekolah</span>
                </h4>
                <p className="text-[12px] text-slate-500 mt-0.5">
                  Daftar urutan garis waktu tahapan sekolah (Sesuai Gambar 2 & 3)
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddMilestone}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Periode Baru</span>
              </button>
            </div>

            {/* Judul & Subjudul Bagian Periodisasi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-slate-700">Judul Bagian Periodisasi</label>
                <input
                  type="text"
                  value={formData.history.periodSectionTitle || ''}
                  onChange={(e) => handleHistoryChange('periodSectionTitle', e.target.value)}
                  placeholder="Periodisasi Perkembangan Sekolah"
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-slate-700">Subjudul Penjelasan</label>
                <input
                  type="text"
                  value={formData.history.periodSectionSubtitle || ''}
                  onChange={(e) => handleHistoryChange('periodSectionSubtitle', e.target.value)}
                  placeholder="Tahapan pertumbuhan kelembagaan dan pemenuhan sarana..."
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs"
                />
              </div>
            </div>

            {/* Daftar Periode Garis Waktu */}
            <div className="space-y-4 pt-2">
              {formData.history.milestones.length === 0 ? (
                <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
                  <p className="text-[13px] text-slate-500 mb-3">Belum ada periode perkembangan sejarah.</p>
                  <button
                    type="button"
                    onClick={handleAddMilestone}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Periode Pertama</span>
                  </button>
                </div>
              ) : (
                formData.history.milestones.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/90 shadow-2xs space-y-3 relative group/item hover:border-slate-300 transition-all"
                  >
                    {/* Header Baris Periode */}
                    <div className="flex items-center justify-between gap-3 border-b border-slate-200/60 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-[12.5px] font-bold text-slate-800">
                          {m.year || m.badge || 'Periode Baru'} · {m.title || 'Tanpa Judul'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Tombol Geser Atas */}
                        <button
                          type="button"
                          onClick={() => handleMoveMilestone(idx, 'up')}
                          disabled={idx === 0}
                          title="Geser ke atas"
                          className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>

                        {/* Tombol Geser Bawah */}
                        <button
                          type="button"
                          onClick={() => handleMoveMilestone(idx, 'down')}
                          disabled={idx === formData.history.milestones.length - 1}
                          title="Geser ke bawah"
                          className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>

                        {/* Tombol Hapus Periode */}
                        <button
                          type="button"
                          onClick={() => handleRemoveMilestone(idx)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-[11.5px] font-bold transition-all ml-2 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>

                    {/* Input Data Periode */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
                      {/* Kolom Tahun / Rentang Waktu (Hijau Sesuai Gambar 2 & 3) */}
                      <div className="sm:col-span-4 flex flex-col gap-1">
                        <label className="text-[11.5px] font-semibold text-slate-600">
                          Tahun / Rentang Waktu (Kolom Kiri)
                        </label>
                        <input
                          type="text"
                          value={m.year ?? m.badge ?? ''}
                          onChange={(e) => {
                            handleMilestoneChange(idx, 'year', e.target.value);
                            handleMilestoneChange(idx, 'badge', e.target.value);
                          }}
                          placeholder="2015 atau 2016 – 2020 atau 2024 – Sekarang"
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[13px] font-bold text-emerald-800 focus:ring-1 focus:ring-emerald-700"
                          required
                        />
                      </div>

                      {/* Kolom Judul Peristiwa / Tahap */}
                      <div className="sm:col-span-8 flex flex-col gap-1">
                        <label className="text-[11.5px] font-semibold text-slate-600">
                          Judul Peristiwa / Tahap (Tebal Kanan)
                        </label>
                        <input
                          type="text"
                          value={m.title || ''}
                          onChange={(e) => handleMilestoneChange(idx, 'title', e.target.value)}
                          placeholder="Pendirian & Pembukaan Layanan Pendidikan"
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[13px] font-bold text-slate-900"
                          required
                        />
                      </div>
                    </div>

                    {/* Uraian Lengkap Sejarah */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[11.5px] font-semibold text-slate-600">
                        Uraian Penjelasan Perkembangan
                      </label>
                      <textarea
                        rows={2}
                        value={m.desc || ''}
                        onChange={(e) => handleMilestoneChange(idx, 'desc', e.target.value)}
                        placeholder="Uraikan peristiwa atau pencapaian madrasah pada periode ini..."
                        className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-[12.5px] text-slate-700 leading-relaxed"
                        required
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Tombol Tambah di Bawah List */}
            {formData.history.milestones.length > 0 && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleAddMilestone}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Periode Sejarah Lainnya</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: FASILITAS BELAJAR */}
      {activeSubTab === 'fasilitas' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h4 className="font-serif text-[16px] font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span>Fasilitas Madrasah (/profil/fasilitas)</span>
              </h4>
              <p className="text-[12.5px] text-slate-500 mt-0.5">
                Kelola kartu fasilitas dengan gambar yang dikompresi otomatis
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddFacility}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[12.5px] font-bold transition-all shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Fasilitas</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formData.facilities.map((fac, idx) => (
              <div key={fac.id || idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-4 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[11.5px] font-bold text-slate-500 uppercase">
                    Fasilitas #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFacility(idx)}
                    className="text-rose-500 hover:text-rose-700 text-[11.5px] font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>

                {/* Photo Preview & Upload */}
                <div className="relative w-full h-36 rounded-lg overflow-hidden bg-slate-200 border border-slate-300">
                  <Image
                    src={fac.image || '/kelas.jpeg'}
                    alt={fac.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <label className="cursor-pointer bg-slate-900/80 hover:bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-xs">
                      <Upload className="w-3 h-3" />
                      <span>{uploadingFacilityId === fac.id ? 'Mengompres...' : 'Ganti Foto'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFacilityUpload(e, fac.id, idx)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11.5px] font-semibold text-slate-700">Nama Fasilitas</label>
                    <input
                      type="text"
                      value={fac.title}
                      onChange={(e) => handleFacilityChange(idx, 'title', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[13px] font-bold"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11.5px] font-semibold text-slate-700">Badge Kategori</label>
                    <input
                      type="text"
                      value={fac.badge}
                      onChange={(e) => handleFacilityChange(idx, 'badge', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[12.5px]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11.5px] font-semibold text-slate-700">Subjudul Fasilitas</label>
                  <input
                    type="text"
                    value={fac.subtitle}
                    onChange={(e) => handleFacilityChange(idx, 'subtitle', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[12px]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11.5px] font-semibold text-slate-700">Deskripsi Lengkap</label>
                  <textarea
                    rows={2}
                    value={fac.desc}
                    onChange={(e) => handleFacilityChange(idx, 'desc', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[12px]"
                    required
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Save Bar for Mobile & Desktop */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-xs text-slate-500 font-medium">
          Perubahan profil dan fasilitas akan langsung tersimpan ke Supabase &amp; diterapkan di seluruh web.
        </span>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-sans text-xs sm:text-[13px] font-bold transition-all shadow-xs active:scale-95 disabled:opacity-50 w-full sm:w-auto"
        >
          <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
          <span>
            {isSaving
              ? 'Menyimpan...'
              : activeSubTab === 'fasilitas'
              ? 'Simpan Fasilitas Madrasah'
              : activeSubTab === 'sejarah'
              ? 'Simpan Sejarah Madrasah'
              : activeSubTab === 'kontak'
              ? 'Simpan Halaman Kontak'
              : activeSubTab === 'visi'
              ? 'Simpan Visi & Misi'
              : 'Simpan Profil Web'}
          </span>
        </button>
      </div>
    </form>
  );
};
