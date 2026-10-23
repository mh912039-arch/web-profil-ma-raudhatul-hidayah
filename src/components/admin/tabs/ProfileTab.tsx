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
  title: string;
  badge: string;
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
  };
  visionMission: {
    vision: string;
    missions: string[];
    pillars?: { title: string; desc: string; icon: string }[];
  };
  history: {
    title: string;
    subtitle: string;
    lead: string;
    milestones: ProfileMilestone[];
  };
  facilities: ProfileFacility[];
}

interface ProfileTabProps {
  data: FullProfileData;
  onSaveFullProfile: (data: FullProfileData) => Promise<void>;
  isSaving: boolean;
  activeTab?: 'profile' | 'facilities';
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  data,
  onSaveFullProfile,
  isSaving,
  activeTab = 'profile',
}) => {
  const [formData, setFormData] = useState<FullProfileData>({
    profile: {
      name: data.profile?.name || 'MAS Raudhatul Hidayah',
      formalName: data.profile?.formalName || 'Madrasah Aliyah Swasta Raudhatul Hidayah',
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
      email: data.profile?.email || 'info@maraudhatulhidayah.sch.id',
      hoursWeekdays: data.profile?.hoursWeekdays || '07.00 – 15.30 WIB',
      hoursSaturday: data.profile?.hoursSaturday || '07.00 – 12.30 WIB',
      hoursSunday: data.profile?.hoursSunday || 'Tutup Layanan Fisik',
    },
    visionMission: {
      vision: data.visionMission?.vision || 'Terwujudnya Peserta Didik Madrasah yang Berakhlak Mulia, Berprestasi, Mandiri, dan Berwawasan Lingkungan',
      missions: data.visionMission?.missions || [
        'Menyelenggarakan proses pembelajaran integratif antara Kurikulum Nasional dan kurikulum kepesantrenan.',
        'Mengembangkan budaya riset ilmiah, penalaran kritis, dan literasi digital yang berlandaskan etika Islam.',
      ],
      pillars: data.visionMission?.pillars || [],
    },
    history: {
      title: data.history?.title || 'Dedikasi Membangun Generasi di Mauk',
      subtitle: data.history?.subtitle || 'Tonggak Sejarah',
      lead: data.history?.lead || 'Bermula dari kepedulian tulus para tokoh masyarakat terhadap masa depan pendidikan generasi muda di pesisir utara Kabupaten Tangerang...',
      milestones: data.history?.milestones || [
        {
          title: 'Awal Mula Pendidikan Dasar (MIS Raudlatul Hidayah 01)',
          badge: 'Pondasi Awal',
          desc: 'Perjalanan dimulai dengan pendirian MIS Raudlatul Hidayah 01 di Kampung Tanjung Anom.',
        },
      ],
    },
    facilities: data.facilities || [],
  });

  useEffect(() => {
    if (data && data.profile) {
      setFormData({
        profile: {
          name: data.profile.name || 'MAS Raudhatul Hidayah',
          formalName: data.profile.formalName || 'Madrasah Aliyah Swasta Raudhatul Hidayah',
          level: data.profile.level || 'Madrasah Aliyah (MA)',
          npsn: data.profile.npsn || '6994888',
          nsm: data.profile.nsm || '131236030045',
          accreditation: data.profile.accreditation || 'C',
          foundedYear: data.profile.foundedYear || '2012',
          address: data.profile.address || 'Jl. Raya Tanjung Kait No. 33, RT 02 / RW 01',
          district: data.profile.district || 'Mauk',
          regency: data.profile.regency || 'Kabupaten Tangerang',
          province: data.profile.province || 'Banten',
          postalCode: data.profile.postalCode || '15330',
          phone: data.profile.phone || '0817-6614-723',
          whatsapp: data.profile.whatsapp || '628176614723',
          email: data.profile.email || 'info@maraudhatulhidayah.sch.id',
          hoursWeekdays: data.profile.hoursWeekdays || '07.00 – 15.30 WIB',
          hoursSaturday: data.profile.hoursSaturday || '07.00 – 12.30 WIB',
          hoursSunday: data.profile.hoursSunday || 'Tutup Layanan Fisik',
        },
        visionMission: {
          vision: data.visionMission?.vision || '',
          missions: data.visionMission?.missions || [],
          pillars: data.visionMission?.pillars || [],
        },
        history: {
          title: data.history?.title || '',
          subtitle: data.history?.subtitle || '',
          lead: data.history?.lead || '',
          milestones: data.history?.milestones || [],
        },
        facilities: data.facilities || [],
      });
    }
  }, [data]);

  const isFacilities = activeTab === 'facilities';
  const [activeSubTab, setActiveSubTab] = useState<'legal' | 'visi' | 'sejarah' | 'fasilitas'>(
    isFacilities ? 'fasilitas' : 'legal'
  );

  useEffect(() => {
    if (activeTab === 'facilities') {
      setActiveSubTab('fasilitas');
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

  // History lead change
  const handleHistoryChange = (field: 'title' | 'subtitle' | 'lead', val: string) => {
    setFormData((prev) => ({
      ...prev,
      history: {
        ...prev.history,
        [field]: val,
      },
    }));
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
    setFormData((prev) => ({
      ...prev,
      history: {
        ...prev.history,
        milestones: [
          ...prev.history.milestones,
          { title: 'Tonggak Baru', badge: 'Tahun', desc: 'Keterangan perkembangan' },
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
            {isFacilities ? 'Fasilitas & Sarpras' : 'Identitas & Profil Web'}
          </h3>
          <p className="text-[13px] text-slate-500">
            {isFacilities
              ? 'Sarana, prasarana gedung, laboratorium, dan fasilitas madrasah'
              : 'NPSN, NSM, visi misi kelembagaan, alamat resmi, dan profil madrasah'}
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-sans text-[13px] font-bold transition-all shadow-xs active:scale-95 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Menyimpan...' : isFacilities ? 'Simpan Fasilitas & Sarpras' : 'Simpan Profil Web'}</span>
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
          Identitas &amp; Kontak
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
          Fasilitas &amp; Sarpras
        </button>
      </div>

      {/* SUB-TAB 1: IDENTITAS & KONTAK */}
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

      {/* SUB-TAB 3: SEJARAH MADRASAH */}
      {activeSubTab === 'sejarah' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-6">
          <h4 className="font-serif text-[16px] font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <History className="w-5 h-5 text-amber-600" />
            <span>Sejarah Madrasah (/profil/sejarah)</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12.5px] font-bold text-slate-700">Subjudul Tag</label>
              <input
                type="text"
                value={formData.history.subtitle}
                onChange={(e) => handleHistoryChange('subtitle', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px]"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12.5px] font-bold text-slate-700">Judul Besar Halaman</label>
              <input
                type="text"
                value={formData.history.title}
                onChange={(e) => handleHistoryChange('title', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13.5px] font-bold"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12.5px] font-bold text-slate-700">Paragraf Pengantar Narasi</label>
            <textarea
              rows={4}
              value={formData.history.lead}
              onChange={(e) => handleHistoryChange('lead', e.target.value)}
              className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[13px] leading-relaxed"
              required
            />
          </div>

          {/* Milestones */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-bold text-slate-800">Tahapan / Tonggak Sejarah</label>
              <button
                type="button"
                onClick={handleAddMilestone}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-[12px] font-bold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Tonggak Sejarah</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.history.milestones.map((m, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 relative">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12px] font-bold text-slate-700">Tahap #{idx + 1}</span>
                    {formData.history.milestones.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMilestone(idx)}
                        className="text-rose-500 hover:text-rose-700 text-[12px] font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2 flex flex-col gap-1">
                      <label className="text-[11.5px] font-semibold text-slate-600">Judul Peristiwa</label>
                      <input
                        type="text"
                        value={m.title}
                        onChange={(e) => handleMilestoneChange(idx, 'title', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[13px] font-bold"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11.5px] font-semibold text-slate-600">Tanggal / Badge</label>
                      <input
                        type="text"
                        value={m.badge}
                        onChange={(e) => handleMilestoneChange(idx, 'badge', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[12.5px]"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11.5px] font-semibold text-slate-600">Uraian Sejarah</label>
                    <textarea
                      rows={2}
                      value={m.desc}
                      onChange={(e) => handleMilestoneChange(idx, 'desc', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-[12.5px]"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
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
                <span>Fasilitas &amp; Sarpras Madrasah (/profil/fasilitas)</span>
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
    </form>
  );
};
