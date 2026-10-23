export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  category: 'Akademik' | 'Prestasi' | 'Kegiatan' | 'Pengumuman' | 'Berita Sekolah' | 'Berita Utama' | 'Artikel';
  date: string;
  time: string;
  author: string;
  authorRole: string;
  readTime: string;
  summary: string;
  lead: string;
  paragraphs: string[];
  quote?: {
    text: string;
    speaker: string;
    role: string;
  };
  keyPoints?: string[];
  tags: string[];
  imageUrl: string;
  imageCaption: string;
  additionalImages?: {
    url: string;
    caption: string;
  }[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Akademik' | 'Keagamaan' | 'Kesiswaan' | 'Fasilitas';
  date: string;
  imageUrl: string;
  caption: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  event: string;
  level: 'Nasional' | 'Provinsi' | 'Kabupaten/Kota';
  year: string;
  recipient: string;
  category: 'Sains' | 'Keagamaan' | 'Seni & Bahasa' | 'Olahraga';
}

export interface ExtracurricularItem {
  id: string;
  name: string;
  category: 'Keagamaan' | 'Kepemimpinan' | 'Kreativitas & Sains' | 'Olahraga & Seni';
  schedule: string;
  coach: string;
  description: string;
}

export interface AcademicMajor {
  id: string;
  code: string;
  name: string;
  tagline: string;
  description: string;
  coreSubjects: string[];
  careerProspects: string[];
  facilities: string[];
}

export interface SchoolData {
  profile: {
    name: string;
    level: string;
    accreditation: string;
    npsn: string;
    nsm: string;
    motto: string;
    foundedYear: string;
    address: string;
    city: string;
    phone: string;
    whatsapp: string;
    email: string;
    operatingHours: string;
    stats: {
      activeStudents: string;
      certifiedTeachers: string;
      graduatesPassRate: string;
      alumniInPTN: string;
    };
  };
  headmaster: {
    name: string;
    nip: string;
    title: string;
    degrees: string;
    photoUrl: string;
    greetingTitle: string;
    greetingParagraphs: string[];
    closingQuote: string;
  };
  visionMission: {
    vision: string;
    missions: string[];
    values: {
      name: string;
      arabic: string;
      meaning: string;
    }[];
  };
  majors: AcademicMajor[];
  extracurriculars: ExtracurricularItem[];
  achievements: AchievementItem[];
  news: NewsItem[];
  gallery: GalleryItem[];
  testimonials: {
    id: string;
    name: string;
    role: string;
    status: string;
    message: string;
    avatarUrl: string;
  }[];
}

export const schoolData: SchoolData = {
  profile: {
    name: 'MAS Raudhatul Hidayah',
    level: 'Jenjang Madrasah Aliyah (MA) Berbasis Karakter & Kurikulum Merdeka',
    accreditation: 'Akreditasi A (Unggul)',
    npsn: '69941777',
    nsm: '131232010045',
    motto: 'Membina Akidah, Mengasah Nalar, Menegakkan Akhlakul Karimah',
    foundedYear: '2015',
    address: 'Jl. Raya Tanjung Kait No. 33, Tj. Anom, Kec. Mauk',
    city: 'Kabupaten Tangerang, Banten 15330',
    phone: '0817-6614-723',
    whatsapp: '+62 817-6614-723',
    email: 'info@maraudhatulhidayah.sch.id',
    operatingHours: 'Senin - Sabtu: 07.00 - 15.30 WIB',
    stats: {
      activeStudents: '450+',
      certifiedTeachers: '22',
      graduatesPassRate: '100%',
      alumniInPTN: '92%',
    },
  },
  headmaster: {
    name: 'A. Khutbi. AR, S.Pd',
    nip: '-',
    title: 'Kepala Madrasah MAS Raudhatul Hidayah',
    degrees: 'Pendidikan & Manajemen Madrasah',
    photoUrl: '/kepala-madrasah.jpg',
    greetingTitle: 'Meneguhkan Karakter Qurani di Era Transformasi Digital',
    greetingParagraphs: [
      'Bismillahirrohmanirrohim. Assalamu’alaikum Warahmatullahi Wabarakatuh. Segala puji bagi Allah Subhanahu Wa Ta’ala atas segala limpahan rahmat, hidayah, dan taufik-Nya yang senantiasa menaungi ikhtiar kita dalam mendidik generasi penerus peradaban.',
      'MAS Raudhatul Hidayah hadir bukan sekadar sebagai institusi transfer ilmu pengetahuan umum, melainkan kawah candradimuka yang menyeimbangkan antara kedalaman pemahaman agama Islam (tafaqquh fiddin), integritas moral, serta kecakapan sains dan teknologi abad ke-21.',
      'Melalui integrasi Kurikulum Merdeka Kemenag dan kurikulum kepesantrenan, kami berkomitmen mendampingi setiap peserta didik agar memiliki akidah yang lurus, pemikiran kritis, serta kepekaan sosial yang tinggi. Semoga website profil resmi ini menjadi jendela informasi yang transparan dan bermanfaat bagi seluruh masyarakat luas.',
    ],
    closingQuote: 'Ilmu tanpa adab ibarat pohon tanpa buah; adab tanpa ilmu ibarat pelita tanpa minyak.',
  },
  visionMission: {
    vision: 'Terwujudnya Generasi Muslim yang Mutafaqqih Fiddin, Unggul dalam Penguasaan Sains & Teknologi, Berintegritas Tinggi, serta Bermanfaat bagi Umat.',
    missions: [
      'Menyelenggarakan proses pembelajaran integratif antara Kurikulum Nasional dan kurikulum kepesantrenan berhaluan Ahlussunnah wal Jama’ah.',
      'Mengembangkan budaya riset ilmiah, penalaran kritis, dan literasi digital yang berlandaskan etika Islam.',
      'Membina program pembiasaan ibadah harian, Tahfidzul Quran bersanad, dan kajian kitab turots (kuning).',
      'Menumbuhkan jiwa kepemimpinan mandiri, kewirausahaan, dan kepedulian lingkungan hidup.',
      'Membangun tata kelola madrasah yang akuntabel, transparan, dan berbasis teknologi informasi modern.',
    ],
    values: [
      {
        name: 'Integritas Moral',
        arabic: 'الأخلاق الكريمة',
        meaning: 'Menjunjung tinggi kejujuran, keteladanan, dan ketawaduan dalam bertindak dan bertutur kata.',
      },
      {
        name: 'Kedalaman Ilmu',
        arabic: 'التفقه في الدين',
        meaning: 'Memahami dasar-dasar syariat Islam secara mendalam dengan sanad keilmuan yang jelas dan terpercaya.',
      },
      {
        name: 'Keunggulan Sains',
        arabic: 'الإتقan والتميز',
        meaning: 'Memiliki etos kerja tinggi dan komitmen pantang menyerah dalam menguasai teknologi dan ilmu pengetahuan.',
      },
      {
        name: 'Keteguhan Prinsip',
        arabic: 'الاستقامة',
        meaning: 'Konsisten dalam mengamalkan kebajikan dan berkontribusi nyata bagi peradaban masyarakat.',
      },
    ],
  },
  majors: [
    {
      id: 'kurikulum-ma',
      code: 'MA-KM',
      name: 'Struktur Kurikulum & 22 Mata Pelajaran MA',
      tagline: 'Integrasi Sains Modern, Keagamaan & Keterampilan Praktis',
      description: 'Program pendidikan intrakurikuler jenjang Madrasah Aliyah yang mencakup 22 mata pelajaran resmi terstruktur, dibimbing langsung oleh dewan guru spesialis di bidangnya.',
      coreSubjects: [
        "Qur'an-Hadits (#01)",
        'Aqidah-Akhlak (#02)',
        'Fiqih Kls 10, 11 & 12 (#03)',
        'SKI (#04)',
        'Bahasa Arab (#05)',
        'Pendidikan Pancasila (#06)',
        'Bahasa Indonesia (#07)',
        'Matematika (#08)',
        'Fisika & Biologi (#09, #10)',
        'Sejarah & Geografi (#11, #14, #15)',
        'Ekonomi (#13)',
        'Bahasa Inggris (#16)',
        'Penjaskes / PJOK (#17)',
        'Seni-Budaya (#18, #21)',
        'Mulok BTQ & PKWU (#19, #20)',
        'TIKOM / Informatika (#22)'
      ],
      careerProspects: ['Kesiapan Melanjutkan ke PTN & PTKIN Favorit', 'Kesiapan Beasiswa Kuliah Timur Tengah & Luar Negeri', 'Pengembangan Wirausaha Mandiri & Teknologi', 'Kader Ulama Intelektual Berintegritas'],
      facilities: ['Laboratorium Komputer & TIKOM', 'Perpustakaan Riset Terpadu', 'Masjid & Ruang Halaqah', 'Sarana Olahraga Representatif'],
    },
    {
      id: 'p5-karakter',
      code: 'SMP-P5',
      name: 'Projek Penguatan Karakter & P5',
      tagline: 'Membangun Karakter Beriman, Mandiri, dan Gotong Royong',
      description: 'Kegiatan kokurikuler berbasis projek terstruktur untuk memperkuat kompetensi profil pelajar, kepedulian lingkungan, serta penanaman adab dan akhlakul karimah.',
      coreSubjects: ['Kewirausahaan Siswa', 'Kearifan Lokal', 'Gaya Hidup Berkelanjutan', 'Bangunlah Jiwa dan Raganya', 'Suara Demokrasi Pelajar', 'Adab Pergaulan Islami'],
      careerProspects: ['Kepemimpinan OSIS & Organisasi', 'Kemandirian Belajar Siswa', 'Kepedulian Sosial & Lingkungan', 'Kecakapan Kolaborasi Tim'],
      facilities: ['Aula Pertemuan Siswa', 'Area Projek Terbuka', 'Perpustakaan Sekolah', 'Halaman Sekolah'],
    },
    {
      id: 'bimbingan-lanjut',
      code: 'SMP-LANJUT',
      name: 'Bimbingan Sukses Masuk SMA/SMK/MA',
      tagline: 'Mendampingi Siswa Meraih Sekolah Lanjutan Impian',
      description: 'Pendampingan khusus siswa kelas IX mencakup pemetaan minat bakat, bimbingan asesmen sekolah, pengayaan materi, dan konsultasi pemilihan SMA, SMK, atau MA favorit.',
      coreSubjects: ['Pendalaman Materi Asesmen', 'Try-Out Berkala Ujian Sekolah', 'Pemetaan Bakat & Minat Kejuruan', 'Konsultasi Jalur Prestasi & Zonasi', 'Bimbingan Konseling Mandiri', 'Motivasi Belajar'],
      careerProspects: ['Diterima di SMA Negeri Favorit', 'Diterima di SMK Jurusan Pilihan', 'Diterima di MAN Unggulan', 'Penerima Beasiswa Prestasi'],
      facilities: ['Ruang Bimbingan Konseling', 'Perpustakaan & Khazanah Turots', 'Ruang CBT Komputer', 'Pusat Informasi Kelulusan'],
    },
  ],
  extracurriculars: [
    {
      id: '1',
      name: 'Halaqah Tahfidz & Qira’at',
      category: 'Keagamaan',
      schedule: 'Setiap Hari, Ba’da Subuh & Ba’da Maghrib',
      coach: 'Ust. M. Ridwan Al-Hafidz',
      description: 'Pembinaan hafalan Al-Quran intensif dengan bimbingan sanad bacaan mutawatir dan kajian tajwid musyafahah.',
    },
    {
      id: '2',
      name: 'Karya Ilmiah Remaja & Robotik',
      category: 'Kreativitas & Sains',
      schedule: 'Selasa & Kamis, 15.45 - 17.15 WIB',
      coach: 'Madrosyid, S.Pd',
      description: 'Riset sains terapan, perakitan mikrokontroler Arduino, dan penulisan karya tulis ilmiah untuk kompetisi nasional.',
    },
    {
      id: '3',
      name: 'Pramuka Penegak Ambalan RH',
      category: 'Kepemimpinan',
      schedule: 'Jumat, 14.00 - 16.30 WIB',
      coach: 'Kak Deni Firmansyah, S.Pd.',
      description: 'Pengembangan ketangkasan kepanduan, survival, kepemimpinan tim, bakti sosial kemasyarakatan, dan penjelajahan alam.',
    },
    {
      id: '4',
      name: 'Seni Hadrah & Sholawat Al-Banjari',
      category: 'Olahraga & Seni',
      schedule: 'Rabu Malam, 19.30 - 21.00 WIB',
      coach: 'Tajudin, S.Pd.I',
      description: 'Pelatihan ketukan rebana klasik kontemporer, vokal melayu-arabi, serta penguatan rasa cinta kepada Baginda Rasulullah SAW.',
    },
    {
      id: '5',
      name: 'Palang Merah Remaja (PMR Wira)',
      category: 'Kepemimpinan',
      schedule: 'Sabtu, 09.00 - 11.30 WIB',
      coach: 'Ns. Siti Rahmah, S.Kep.',
      description: 'Pelatihan pertolongan pertama gawat darurat (PPGD), mitigasi bencana madrasah, dan kampanye kesehatan santri.',
    },
    {
      id: '6',
      name: 'Futsal & Bulutangkis Prestasi',
      category: 'Olahraga & Seni',
      schedule: 'Senin & Kamis, 16.00 - 17.45 WIB',
      coach: 'Coach Arif Budiman, S.Or.',
      description: 'Pembinaan fisik, taktik olahraga beregu, serta seleksi atlet perwakilan ajang Pekan Olahraga Madrasah (POSPEDA).',
    },
  ],
  achievements: [
    {
      id: 'ach-1',
      title: 'Juara 1 Kompetisi Sains Madrasah (KSM)',
      event: 'KSM Kemenag Tingkat Provinsi Banten',
      level: 'Provinsi',
      year: '2024',
      recipient: 'Muhammad Farhan Az-Zuhdi (Kelas XII MIPA)',
      category: 'Sains',
    },
    {
      id: 'ach-2',
      title: 'Medali Emas Musabaqah Hifdzil Quran (MHQ 10 Juz)',
      event: 'Festival Pelajar Islam Nasional Universitas Padjadjaran',
      level: 'Nasional',
      year: '2024',
      recipient: 'Aisyah Nur Salsabila (Kelas XI Keagamaan)',
      category: 'Keagamaan',
    },
    {
      id: 'ach-3',
      title: 'Juara 2 Lomba Karya Tulis Ilmiah Remaja (LKTI)',
      event: 'Olimpiade Humaniora Nasional UIN Sunan Kalijaga',
      level: 'Nasional',
      year: '2023',
      recipient: 'Tim Riset Sosial MAS Raudhatul Hidayah',
      category: 'Sains',
    },
    {
      id: 'ach-4',
      title: 'Juara Umum Kemah Da’wah & Kepanduan Madrasah',
      event: 'Jambore Daerah Kwartir Daerah Banten',
      level: 'Provinsi',
      year: '2024',
      recipient: 'Ambalan Raudhatul Hidayah',
      category: 'Seni & Bahasa',
    },
  ],
  news: [
    {
      id: 'news-pramuka-gebyar-ramadhan-1447',
      title: 'Torehkan Sejarah Gemilang: Kontingen MAS Raudhatul Hidayah Sapu Bersih Juara pada Gebyar Ramadhan 1447 H Kwarran Mauk',
      slug: 'kontingen-pramuka-ma-raudhatul-hidayah-sapu-bersih-juara-gebyar-ramadhan-1447-h',
      category: 'Prestasi',
      date: '14 April 2026',
      time: '21:30 WIB',
      author: 'Humas MAS Raudhatul Hidayah',
      authorRole: 'Biro Publikasi & Informasi Madrasah',
      readTime: '4 Menit Baca',
      summary: 'Kontingen santri MAS Raudhatul Hidayah berhasil memboyong deretan trofi piala kejuaraan pada malam Gebyar Ramadhan 1447 H Kwartir Ranting Gerakan Pramuka Mauk Tahun 2026.',
      lead: 'Malam puncak penganugerahan Gebyar Ramadhan 1447 H Kwartir Ranting Gerakan Pramuka Mauk menjadi momen penuh kebanggaan bagi MAS Raudhatul Hidayah saat kontingen santri madrasah dipanggil berulang kali ke atas panggung utama untuk menerima deretan piala kejuaraan.',
      paragraphs: [
        'Ajang bergengsi Gebyar Ramadhan 1447 H yang diselenggarakan oleh Kwartir Ranting Gerakan Pramuka Mauk mempertemukan delegasi pramuka penegak dan pelajar terbaik dari berbagai gugus depan se-wilayah Mauk dan sekitarnya. Kompetisi tahunan ini menguji ketangkasan kepramukaan, wawasan keislaman, pidato syiar, serta kepemimpinan regu santri.',
        'Melalui persiapan yang matang dan disiplin latihan di bawah bimbingan para pembina madrasah, santri putra dan putri MAS Raudhatul Hidayah tampil memukau di hadapan dewan juri dan berhasil merebut posisi teratas di berbagai mata lomba.',
        'Kepala Madrasah MAS Raudhatul Hidayah, A. Khutbi. AR, S.Pd, menyampaikan apresiasi mendalam atas dedikasi dan kerja keras para santri. Beliau menekankan bahwa prestasi ini merupakan bukti nyata integrasi antara nilai-nilai luhur kepesantrenan dan semangat dasadarma kepramukaan.',
        'Keberhasilan menyapu bersih piala kejuaraan ini disambut dengan rasa syukur mendalam oleh seluruh dewan guru dan santri, sekaligus memotivasi generasi muda madrasah untuk senantiasa berprestasi di tingkat kabupaten hingga provinsi.',
      ],
      quote: {
        text: 'Prestasi ini membuktikan bahwa pembinaan karakter, adab santri, dan kecakapan kepramukaan di MAS Raudhatul Hidayah mampu melahirkan generasi berdaya saing tinggi yang berakhlak mulia.',
        speaker: 'A. Khutbi. AR, S.Pd',
        role: 'Kepala Madrasah MAS Raudhatul Hidayah',
      },
      keyPoints: [
        'Kontingen MAS Raudhatul Hidayah berhasil memboyong deretan trofi piala kemenangan.',
        'Juara diraih pada cabang lomba keagamaan, pidato syiar, dan ketangkasan kepramukaan.',
        'Apresiasi resmi diberikan langsung oleh jajaran pimpinan Kwartir Ranting Gerakan Pramuka Mauk.',
      ],
      tags: ['PrestasiSantri', 'PramukaPenegak', 'KwarranMauk', 'GebyarRamadhan', 'JuaraUmum'],
      imageUrl: '/foto-semua-juara.jpeg',
      imageCaption: 'Santri berprestasi MAS Raudhatul Hidayah berpose bangga memegang trofi piala kemenangan Gebyar Ramadhan 1447 H Kwarran Mauk.',
      additionalImages: [
        {
          url: '/foto-juara-pramuka.jpeg',
          caption: 'Kontingen Pramuka Penegak MAS Raudhatul Hidayah bersama pembina di panggung kehormatan.',
        },
        {
          url: '/foto-juara.jpeg',
          caption: 'Prosesi khidmat penyerahan trofi kejuaraan di panggung utama Kwartir Ranting Mauk.',
        },
      ],
    },
    {
      id: 'news-kontingen-pramuka-pembina-ramadhan',
      title: 'Kekompakan Kontingen Pramuka MAS Raudhatul Hidayah di Panggung Kehormatan Kwarran Mauk',
      slug: 'kekompakan-kontingen-pramuka-ma-raudhatul-hidayah-panggung-kehormatan-kwarran-mauk',
      category: 'Kegiatan',
      date: '15 April 2026',
      time: '08:45 WIB',
      author: 'Bidang Pembinaan Kesiswaan',
      authorRole: 'Koordinator Ekstrakurikuler MA',
      readTime: '3 Menit Baca',
      summary: 'Potret kekompakan dan dedikasi kontingen Pramuka Penegak MAS Raudhatul Hidayah bersama pembina usai menorehkan prestasi gemilang pada Gebyar Ramadhan 1447 H.',
      lead: 'Pramuka Penegak Gugus Depan MAS Raudhatul Hidayah menunjukkan kekompakan luar biasa saat menerima penghargaan di panggung kehormatan Kwartir Ranting Gerakan Pramuka Mauk Tahun 2026.',
      paragraphs: [
        'Didampingi oleh pembina kesiswaan dan pelatih kepramukaan, para santri penegak MAS Raudhatul Hidayah berbaris rapi mengenakan seragam pramuka lengkap berhasduk merah putih sembari memegang piala-piala kemenangan.',
        'Kegiatan Gebyar Ramadhan Kwarran Mauk menjadi ajang silaturahmi sekaligus pembuktian kualitas latihan rutin mingguan di madrasah, mulai dari teknik kepanduan, semaphore, morse, hingga ketahanan mental santri di alam terbuka.',
        'Ke depan, pihak madrasah berkomitmen untuk terus memfasilitasi dan memperluas ruang partisipasi santri dalam berbagai ajang kepanduan dan kompetisi pelajar tingkat daerah maupun nasional.',
      ],
      quote: {
        text: 'Kerja sama tim dan adab santri adalah fondasi utama kami. Kemenangan ini kami persembahkan untuk seluruh keluarga besar madrasah.',
        speaker: 'Sarnah, S.Pd.I',
        role: 'Pembina Kesiswaan MAS Raudhatul Hidayah',
      },
      keyPoints: [
        'Kekompakan dan disiplin tinggi ditunjukkan oleh seluruh anggota kontingen.',
        'Dukungan penuh dari para pembina madrasah sepanjang kompetisi berlangsung.',
        'Piala kemenangan menjadi motivasi untuk terus meningkatkan mutu pembinaan kepramukaan.',
      ],
      tags: ['PramukaPenegak', 'KwarranMauk', 'KegiatanSantri', 'Ekstrakurikuler', 'GebyarRamadhan'],
      imageUrl: '/foto-juara-pramuka.jpeg',
      imageCaption: 'Kontingen Pramuka Penegak MAS Raudhatul Hidayah bersama pembina di panggung utama Gebyar Ramadhan 1447 H.',
      additionalImages: [
        {
          url: '/foto-semua-juara.jpeg',
          caption: 'Para peraih piala kejuaraan tersenyum bangga di pelataran panggung kehormatan.',
        },
      ],
    },
    {
      id: 'news-momen-penyerahan-trofi-ramadhan-1447',
      title: 'Momen Khidmat Penyerahan Trofi: Santri MAS Raudhatul Hidayah Terima Apresiasi Panggung Utama Kwarran Mauk',
      slug: 'momen-khidmat-penyerahan-trofi-santri-ma-raudhatul-hidayah-panggung-utama-kwarran-mauk',
      category: 'Berita Sekolah',
      date: '15 April 2026',
      time: '10:00 WIB',
      author: 'Tim Jurnalistik Santri',
      authorRole: 'Redaksi Berita Madrasah',
      readTime: '3 Menit Baca',
      summary: 'Prosesi khidmat penyerahan piala penghargaan kepada perwakilan santri MAS Raudhatul Hidayah di panggung utama Gebyar Ramadhan 1447 H Kwartir Ranting Mauk.',
      lead: 'Sorotan cahaya dan tepuk tangan hadirin mengiringi perwakilan santri MAS Raudhatul Hidayah saat menerima trofi kejuaraan di panggung utama Gebyar Ramadhan 1447 H Kwarran Mauk.',
      paragraphs: [
        'Mengenakan busana muslim dan peci rapi, santri perwakilan madrasah menerima trofi dari pimpinan panitia pelaksana Kwartir Ranting Gerakan Pramuka Mauk dengan penuh takzim.',
        'Penghargaan ini merupakan hasil dari penilaian ketat dewan juri dalam cabang perlombaan syiar Islam dan kepramukaan yang menekankan ketelitian, penghayatan materi, serta kefasihan penyampaian.',
        'Madrasah terus mendorong para santri untuk tidak hanya unggul di ruang kelas, tetapi juga aktif mengasah kepercayaan diri dan keterampilan berbicara di hadapan publik.',
      ],
      quote: {
        text: 'Berani tampil dan memberikan yang terbaik adalah pelajaran paling berharga dari setiap ajang kompetisi.',
        speaker: 'Ahmad Nurul Kahfi, SE',
        role: 'Staf Kesiswaan MAS Raudhatul Hidayah',
      },
      keyPoints: [
        'Penyerahan trofi secara langsung di hadapan seluruh peserta kwartir ranting.',
        'Pengakuan atas ketelitian materi dan performa luar biasa santri.',
        'Bukti keberhasilan pembinaan soft skills dan public speaking santri.',
      ],
      tags: ['PenyerahanTrofi', 'KwarranMauk', 'SantriBerprestasi', 'BeritaSekolah'],
      imageUrl: '/foto-juara.jpeg',
      imageCaption: 'Perwakilan santri MAS Raudhatul Hidayah saat menerima trofi kejuaraan di panggung utama Kwarran Mauk.',
      additionalImages: [
        {
          url: '/foto-semua-juara.jpeg',
          caption: 'Kebersamaan para juara usai prosesi penyerahan penghargaan di panggung.',
        },
      ],
    },
    {
      id: 'news-1',
      title: 'Santri MAS Raudhatul Hidayah Raih Prestasi Gemilang pada KSM Tingkat Provinsi 2024',
      slug: 'santri-raih-prestasi-ksm-provinsi-2024',
      category: 'Prestasi',
      date: '02 Oktober 2024',
      time: '08:30 WIB',
      author: 'Humas MAS Raudhatul Hidayah',
      authorRole: 'Biro Publikasi & Informasi Madrasah',
      readTime: '4 Menit Baca',
      summary: 'Muhammad Farhan Az-Zuhdi berhasil meraih podium pertama dalam cabang Biologi Terintegrasi dan melaju ke kompetisi tingkat nasional mewakili Banten.',
      lead: 'Prestasi gemilang kembali ditorehkan oleh santri MAS Raudhatul Hidayah dalam ajang bergengsi Kompetisi Sains Madrasah (KSM) tingkat Provinsi Banten yang digelar oleh Kantor Wilayah Kementerian Agama RI.',
      paragraphs: [
        'Dalam kompetisi yang berlangsung ketat selama tiga hari di Serang tersebut, ananda Muhammad Farhan Az-Zuhdi, santri kelas XII MIPA MAS Raudhatul Hidayah, dinobatkan sebagai Juara Pertama pada cabang Biologi Terintegrasi setelah mengungguli ratusan delegasi madrasah aliyah terbaik se-Provinsi Banten.',
        'Materi ujian KSM Biologi Terintegrasi menguji kemampuan analisis biosains tingkat lanjut yang dikontekstualisasikan dengan fikih thaharah, kajian ayat-ayat kauniyah dalam Al-Quran, serta metodologi ijtihad ulama terkait sains modern. Keberhasilan Farhan membuktikan bahwa integrasi antara kurikulum sains nasional dan kajian turots kepesantrenan di MAS Raudhatul Hidayah membuahkan hasil yang sangat nyata.',
        'Kepala Madrasah, A. Khutbi. AR, S.Pd, menyampaikan rasa syukur dan apresiasi yang mendalam saat menyambut kepulangan delegasi di kampus madrasah. Beliau menegaskan bahwa pencapaian ini adalah buah dari kerja keras kolaboratif antara santri, pembimbing olimpiade, serta doa para asatidz dan orang tua.',
        'Kini, Farhan tengah menjalani program karantina intensif di Laboratorium Sains Terpadu madrasah bersama dosen pakar dari ITB dan IPB guna mempersiapkan diri melaju ke KSM Tingkat Nasional yang akan digelar pada bulan November mendatang.',
      ],
      quote: {
        text: 'Keberhasilan ini membuktikan bahwa anak santri yang mengaji kitab kuning setiap ba’da subuh memiliki ketajaman nalar sains yang setara, bahkan melampaui standar kompetisi sains nasional.',
        speaker: 'A. Khutbi. AR, S.Pd',
        role: 'Kepala Madrasah MAS Raudhatul Hidayah',
      },
      keyPoints: [
        'Juara 1 KSM Banten cabang Biologi Terintegrasi diraih Muhammad Farhan Az-Zuhdi.',
        'Berhak melaju sebagai delegasi resmi Provinsi Banten ke KSM Nasional 2024.',
        'Karantina sains lanjutan didampingi langsung oleh dosen tamu dan tim olimpiade madrasah.',
      ],
      tags: ['KSM2024', 'PrestasiSantri', 'SainsMadrasah', 'KemenagBanten', 'BiologiTerintegrasi'],
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
      imageCaption: 'Muhammad Farhan Az-Zuhdi saat menerima piala dan piagam penghargaan Juara 1 KSM Banten.',
    },
    {
      id: 'news-2',
      title: 'Implementasi Kurikulum Merdeka: Gelar Karya P5-PPRA Bertema Kearifan Lokal dan Kewirausahaan',
      slug: 'gelar-karya-p5-ppra-kearifan-lokal',
      category: 'Berita Sekolah',
      date: '24 September 2024',
      time: '13:15 WIB',
      author: 'Tim Kurikulum & P5-PPRA',
      authorRole: 'Koordinator Kurikulum Merdeka',
      readTime: '5 Menit Baca',
      summary: 'Seluruh peserta didik kelas X dan XI memamerkan inovasi olahan herbal pesantren, madu trigona mandiri, dan teknologi tata kelola air hidroponik ramah lingkungan.',
      lead: 'Halaman utama MAS Raudhatul Hidayah disulap menjadi ruang pameran inovasi kreatif santri dalam rangka puncak Gelar Karya Projek Penguatan Profil Pelajar Pancasila dan Profil Pelajar Rahmatan Lil Alamin (P5-PPRA).',
      paragraphs: [
        'Kegiatan tahunan ini mengusung dua tema kolaboratif: "Kearifan Lokal Pesantren" dan "Kewirausahaan Berkelanjutan Berbasis Syariah". Sebanyak 12 stan pameran menampilkan produk-produk hasil riset kelompok santri kelas X dan XI yang dibina selama tiga bulan penuh.',
        'Di antara inovasi yang menarik perhatian para dewan juri dan pengunjung adalah formula minuman herbal instan dari rimpang jahe merah dan temulawak kebun madrasah, sabun cuci ramah lingkungan berbahan dasar minyak jelantah terfiltrasi karbon aktif arang sekam, serta miniatur smart greenhouse berbasis sensor kelembaban tanah Arduino.',
        'Selain memamerkan produk fisik, para santri juga diuji kemampuannya dalam mempresentasikan rencana bisnis syariah (business plan), pembukuan arus kas, hingga analisis dampak sosial terhadap masyarakat pedesaan sekitar madrasah.',
        'Pengawas Madrasah Kantor Kemenag yang hadir mengapresiasi tingginya mutu inovasi santri yang tidak hanya berorientasi pada nilai rapor, melainkan langsung dapat diaplikasikan untuk kemandirian ekonomi pesantren.',
      ],
      quote: {
        text: 'P5-PPRA bukan sekadar pameran seremonial, melainkan laboratorium pembuktian bahwa santri mampu mengidentifikasi problem lingkungan dan menciptakan solusi konkret.',
        speaker: 'Ust. M. Ridwan, Lc., M.Ag',
        role: 'Wakil Kepala Bidang Kurikulum',
      },
      keyPoints: [
        'Pameran diikuti oleh 12 stan kelompok santri kelas X dan XI.',
        'Menghasilkan 15 produk inovasi siap guna mulai dari olahan herbal hingga teknologi hidroponik.',
        'Dihadiri oleh Pengawas Kemenag, tokoh masyarakat, dan perwakilan wali murid.',
      ],
      tags: ['KurikulumMerdeka', 'P5PPRA', 'KearifanLokal', 'InovasiSantri', 'Kewirausahaan'],
      imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
      imageCaption: 'Suasana stan pameran produk herbal dan teknologi pertanian mandiri karya santri MAS Raudhatul Hidayah.',
    },
    {
      id: 'news-3',
      title: 'Peringatan Maulid Nabi Muhammad SAW: Mengukuhkan Adab Menuntut Ilmu Santri Zaman Sekarang',
      slug: 'peringatan-maulid-nabi-dan-pengajian-akbar',
      category: 'Kegiatan',
      date: '16 September 2024',
      time: '19:45 WIB',
      author: 'OSIS & MPK Raudhatul Hidayah',
      authorRole: 'Divisi Ubudiyah & Syiar Islam',
      readTime: '4 Menit Baca',
      summary: 'Kajian kitab Syama’il Muhammadiyah dan lantunan sholawat kolosal diikuti oleh 500 santri dan seluruh dewan asatidz dengan khidmat.',
      lead: 'Lantunan bait-bait sholawat Simtudduror menggema syahdu di Masjid Jami’ Raudhatul Hidayah dalam rangkaian Peringatan Maulid Nabi Muhammad SAW 1446 H.',
      paragraphs: [
        'Acara yang diselenggarakan secara gabungan oleh OSIS dan Majelis Santri ini dihadiri oleh seluruh dewan asatidz, pengasuh pondok, serta tokoh ulama setempat. Peringatan dibuka dengan pembacaan ayat suci Al-Quran oleh qari juara MTQ Jawa Barat, dilanjutkan dengan persembahan vokal tim Hadrah Al-Banjari santriwati.',
        'Dalam mauizhah hasanah, penceramah tamu mengkaji secara mendalam kitab Asy-Syama’il Al-Muhammadiyyah karya Imam At-Tirmidzi, menekankan betapa agungnya keluhuran akhlak Baginda Rasulullah SAW yang harus dijiwai dalam setiap aspek belajar santri modern.',
        'Di tengah gelombang digitalisasi dan masifnya arus informasi, adab kepada guru, orang tua, dan kesucian waktu belajar menjadi perisai utama santri agar ilmu yang diperoleh mendatangkan keberkahan sejati.',
        'Acara ditutup dengan doa bersama untuk keselamatan bangsa, kemajuan madrasah, serta jamuan makan malam bersama (mayor) yang mempererat ukhuwah islamiyah antar santri dan guru.',
      ],
      quote: {
        text: 'Meneladani Rasulullah bukan hanya tentang membaca sejarah, melainkan menghidupkan kasih sayang, kejujuran, dan kesungguhan beliau dalam mencari ilmu di madrasah ini.',
        speaker: 'Tajudin, S.Pd.I',
        role: 'Pembina Ubudiyah Santri',
      },
      keyPoints: [
        'Diikuti 500 santri, dewan guru, dan para tokoh masyarakat sekitar.',
        'Kajian mendalam kitab Syama’il Muhammadiyah tentang adab menuntut ilmu.',
        'Penampilan kolosal tim Seni Hadrah & Sholawat Banjari santri.',
      ],
      tags: ['MaulidNabi', 'KegiatanSantri', 'Ubudiyah', 'SholawatBanjari', 'Pesantren'],
      imageUrl: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1200&q=80',
      imageCaption: 'Khitmatnya jemaah santri saat melantunkan sholawat bersama di Masjid Jami’ Raudhatul Hidayah.',
    },
    {
      id: 'news-4',
      title: 'Sosialisasi Persiapan Asesmen Akhir & Bimbingan Studi Lanjut ke Jenjang SMA / SMK / MA Favorit',
      slug: 'sosialisasi-studi-lanjut-sma-smk-ma',
      category: 'Berita Utama',
      date: '08 September 2024',
      time: '10:00 WIB',
      author: 'Bimbingan Konseling (BK)',
      authorRole: 'Koordinator Studi Lanjut SMP',
      readTime: '3 Menit Baca',
      summary: 'Tim Bimbingan Konseling memaparkan pemetaan nilai rapor dan pembobotan sertifikat prestasi untuk siswa kelas IX menuju sekolah lanjutan impian.',
      lead: 'Layanan Bimbingan Konseling (BK) MAS Raudhatul Hidayah menggelar workshop intensif Sosialisasi Persiapan Asesmen dan Pilihan Sekolah Lanjutan jenjang SMA/SMK/MA tahun ajaran baru.',
      paragraphs: [
        'Kegiatan yang bertempat di Aula Pertemuan Sekolah ini menghadirkan siswa kelas IX beserta wali murid untuk menyamakan persepsi dan strategi dalam menghadapi persiapan asesmen akhir serta penerimaan peserta didik baru (PPDB) jenjang menengah atas.',
        'Koordinator BK menjelaskan secara transparan sistem pemeringkatan nilai rapor semester 1 hingga 5, jalur zonasi, jalur prestasi akademik dan non-akademik, serta validasi sertifikat kejuaraan dan tahfidz Al-Quran yang menjadi nilai tambah masuk sekolah negeri favorit.',
        'Selain itu, sekolah juga menyosialisasikan program pendampingan intensif berupa try-out berkala materi asesmen sumatif, konsultasi pemilihan jurusan di SMK/SMA, dan pemetaan bakat minat siswa.',
        'Dengan persiapan yang matang dan terarah sejak awal semester, MAS Raudhatul Hidayah berkomitmen mengantarkan setiap lulusan diterima di sekolah menengah atas impian mereka.',
      ],
      quote: {
        text: 'Kami mendampingi setiap siswa satu per satu. Memilih sekolah lanjutan adalah langkah awal penting bagi pembentukan masa depan mereka.',
        speaker: 'Dra. Hj. Nurjanah, M.Pd',
        role: 'Koordinator Bimbingan Konseling SMP',
      },
      keyPoints: [
        'Panduan lengkap kriteria jalur prestasi rapor dan sertifikat untuk SMA/SMK/MA.',
        'Sertifikat tahfidz dan juara kejuaraan memiliki nilai tambah dalam PPDB lanjutan.',
        'Program bimbingan materi asesmen dan try-out berkala resmi dimulai bulan depan.',
      ],
      tags: ['Pengumuman', 'StudiLanjut', 'SiswaSMP', 'SMKdanSMA', 'BimbinganKonseling'],
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
      imageCaption: 'Sesi pemaparan strategi pemilihan sekolah lanjutan SMA/SMK/MA di hadapan siswa kelas IX dan wali murid.',
    },
    {
      id: 'news-5',
      title: 'Latihan Dasar Kepemimpinan (LDK) Pengurus MPK & OSIS: Menempa Pemimpin Muda Berintegritas',
      slug: 'ldk-pengurus-mpk-osis-pemimpin-muda',
      category: 'Berita Sekolah',
      date: '13 Sep 2026',
      time: '08:00 WIB',
      author: 'Administrator',
      authorRole: 'Pembina OSIS & Kesiswaan',
      readTime: '4 Menit Baca',
      summary: 'Sebanyak 45 pengurus baru OSIS dan MPK mengikuti pembekalan manajemen organisasi, komunikasi efektif, dan pemecahan masalah.',
      lead: 'Pelaksanaan LDK Calon Pengurus MPK dan OSIS masa bakti baru berlangsung khidmat dan penuh semangat kepemimpinan di Aula Utama Madrasah.',
      paragraphs: [
        'Latihan Dasar Kepemimpinan (LDK) merupakan agenda wajib tahunan bagi pengurus baru OSIS dan MPK guna menanamkan nilai-nilai kepemimpinan Islam, tanggung jawab, dan kedisiplinan berorganisasi.',
        'Materi yang disampaikan mencakup manajemen waktu, penyusunan program kerja madrasah, etika bermedia sosial, serta latihan resolusi konflik secara santun dan solutif.',
      ],
      quote: {
        text: 'Pemimpin sejati adalah mereka yang paling dahulu melayani dan paling akhir memikirkan kepentingan dirinya sendiri.',
        speaker: 'Ust. M. Ridwan, Lc., M.Ag',
        role: 'Wakil Kepala Bidang Kesiswaan',
      },
      keyPoints: [
        'Diikuti oleh 45 santri terpilih perwakilan kelas VII hingga IX.',
        'Fokus pada kepemimpinan profetik dan manajemen tim yang tangguh.',
      ],
      tags: ['LDK', 'OSIS', 'MPK', 'Kepemimpinan', 'Santri'],
      imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
      imageCaption: 'Foto bersama peserta LDK Calon Pengurus MPK dan OSIS bersama dewan pembina.',
    },
    {
      id: 'news-6',
      title: 'Menata Nalar di Tengah Disrupsi Teknologi: Bedah Buku & Literasi Kritis Santri di Era AI',
      slug: 'menata-nalar-disrupsi-teknologi-era-ai',
      category: 'Artikel',
      date: '09 Oct 2026',
      time: '14:00 WIB',
      author: 'Administrator',
      authorRole: 'Koordinator Literasi & Riset',
      readTime: '6 Menit Baca',
      summary: 'Mengupas tuntas sisi kemanusiaan, etika adab menuntut ilmu, dan posisi kecerdasan buatan dalam pendidikan madrasah modern.',
      lead: 'Perpustakaan Madrasah menggelar bedah buku literasi digital guna membekali santri bersikap bijak dan kritis terhadap perkembangan teknologi generative AI.',
      paragraphs: [
        'Dalam diskusi interaktif ini, dibahas bagaimana santri dapat memanfaatkan kecerdasan buatan sebagai akselerator riset tanpa melupakan orisinalitas nalar dan adab mencari ilmu.',
        'Para guru menekankan bahwa teknologi adalah sarana pendukung, sementara kebajikan nurani dan integritas moral santri tetap menjadi pondasi yang tak tergantikan.',
      ],
      quote: {
        text: 'AI dapat menyusun kalimat dalam sekejap, namun adab, integritas, dan ketulusan hanya lahir dari hati manusia yang terpaut pada Sang Pencipta.',
        speaker: 'A. Khutbi. AR, S.Pd',
        role: 'Kepala Madrasah',
      },
      keyPoints: [
        'Kupas tuntas etika pemanfaatan AI dalam tugas akademik santri.',
        'Penguatan budaya membaca kritis dan penulisan ilmiah berbasis data.',
      ],
      tags: ['Artikel', 'Literasi', 'EraAI', 'Teknologi', 'Pendidikan'],
      imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
      imageCaption: 'Suasana bedah buku dan diskusi literasi kritis santri di perpustakaan.',
    },
    {
      id: 'news-7',
      title: 'Atmosfer Hari Ketiga Gelar Prestasi & Sportivitas: Rajut Refleksi dan Gelora Kebersamaan',
      slug: 'atmosfer-gelar-prestasi-sportivitas-santri',
      category: 'Berita Utama',
      date: '02 Oct 2026',
      time: '16:00 WIB',
      author: 'Administrator',
      authorRole: 'Biro Publikasi & Humas',
      readTime: '4 Menit Baca',
      summary: 'Rangkaian perlombaan antarkelas cabang sains, kaligrafi, dan futsal mencapai babak final dengan antusiasme yang meriah.',
      lead: 'Hari ketiga ajang tahunan Gelar Prestasi Santri berlangsung semarak di lapangan utama dan gedung olahraga MAS Raudhatul Hidayah.',
      paragraphs: [
        'Seluruh santri menunjukkan sportivitas tinggi dalam berbagai cabang perlombaan, mulai dari olimpiade matematika madrasah hingga musabaqah tilawatil quran.',
        'Pemberian piagam penghargaan dilakukan langsung oleh perwakilan dewan guru kepada para juara di masing-masing kategori.',
      ],
      quote: {
        text: 'Menang adalah bonus, namun persaudaraan dan sportivitas santri adalah piala yang sesungguhnya.',
        speaker: 'Coach Arif Budiman, S.Or.',
        role: 'Koordinator Olahraga',
      },
      keyPoints: [
        'Final cabang sains, seni islami, dan olahraga beregu.',
        'Pemberian apresiasi beasiswa pembinaan bagi juara umum antarkelas.',
      ],
      tags: ['BeritaUtama', 'Kompetisi', 'Sportivitas', 'PrestasiSantri'],
      imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
      imageCaption: 'Para santri peraih penghargaan berdiri bangga bersama sertifikat prestasi di podium juara.',
    },
  ],
  gallery: [
    {
      id: 'gal-1',
      title: 'Aktivitas Literasi di Perpustakaan Khazanah Turots',
      category: 'Fasilitas',
      date: 'September 2024',
      imageUrl: '/perpus2.jpeg',
      caption: 'Siswa kelas VIII memanfaatkan ruang perpustakaan untuk membaca buku referensi pengetahuan umum dan khazanah turots.',
    },
    {
      id: 'gal-2',
      title: 'Halaqah Musyafahah Bimbingan Al-Quran',
      category: 'Keagamaan',
      date: 'Agustus 2024',
      imageUrl: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1000&q=80',
      caption: 'Kegiatan setoran hafalan harian dan perbaikan makharijul huruf bersama guru pembina di masjid sekolah.',
    },
    {
      id: 'gal-3',
      title: 'Latihan Rutin Pramuka Penegak MAS Raudhatul Hidayah',
      category: 'Kesiswaan',
      date: 'September 2024',
      imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1000&q=80',
      caption: 'Pelatihan pembuatan pionering tali-temali dan formasi baris berbaris di halaman sekolah MAS Raudhatul Hidayah.',
    },
    {
      id: 'gal-4',
      title: 'Perpustakaan & Ruang Baca Turots',
      category: 'Fasilitas',
      date: 'Juli 2024',
      imageUrl: '/perpus2.jpeg',
      caption: 'Koleksi buku pelajaran, referensi keilmuan, dan kitab keagamaan yang dapat diakses dengan nyaman oleh seluruh siswa.',
    },
    {
      id: 'gal-5',
      title: 'Upacara Peringatan Hari Santri Nasional',
      category: 'Kesiswaan',
      date: 'Oktober 2023',
      imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80',
      caption: 'Khitmatnya barisan siswa dalam memperingati upacara bendera dan Hari Santri Nasional di halaman sekolah.',
    },
    {
      id: 'gal-6',
      title: 'Aktivitas Belajar di Ruang Kelas MA',
      category: 'Akademik',
      date: 'Agustus 2024',
      imageUrl: '/kelas.jpeg',
      caption: 'Suasana kegiatan belajar mengajar interaktif siswa MAS Raudhatul Hidayah di dalam ruang kelas.',
    },
  ],
  testimonials: [
    {
      id: 'test-1',
      name: 'Dr. H. Bambang Irawan, M.Kes',
      role: 'Wali Murid Santri MA',
      status: 'Dokter Spesialis & Wali Murid Kelas XI',
      message: 'Saya sangat bersyukur mempercayakan pendidikan putra kami di MAS Raudhatul Hidayah. Keseimbangan antara pembiasaan adab dan ibadah harian dengan pembelajaran aktif Kurikulum Merdeka Fase E & F sangat riil dirasakan anak kami.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'test-2',
      name: 'Fatimah Zahra, S.Kom',
      role: 'Alumni MAS Raudhatul Hidayah',
      status: 'Lulusan MA RH — Melanjutkan ke Perguruan Tinggi Negeri',
      message: 'Pendidikan karakter, adab, dan kedisiplinan belajar di MAS Raudhatul Hidayah menjadi bekal fondasi yang sangat kuat ketika saya melanjutkan ke jenjang universitas negeri favorit hingga berkarier profesional.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'test-3',
      name: 'K.H. Mansyur Sholeh',
      role: 'Tokoh Masyarakat & Wali Siswa',
      status: 'Pengasuh Majelis Taklim Sekitar',
      message: 'Kekuatan utama sekolah ini adalah konsistensi kepala madrasah dan dewan guru dalam membimbing akhlak serta tata krama santri usia remaja. Di era saat ini, madrasah yang teguh menjaga nilai adab dan khazanah keislaman adalah berkah tersendiri.',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    },
  ],
};
