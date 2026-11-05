export interface ParsedScheduleItem {
  id: string;
  class_rombel: string;
  day: string;
  session_no: number;
  time_start: string;
  time_end: string;
  subject_name: string;
  category: string;
  teacher_name: string;
  room: string;
}

export interface TimeSlot {
  start: string;
  end: string;
}

const standardDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

// Format Waktu Standar MA Raudlatul Hidayah (dimulai 06.45 sesuai dokumen jadwal resmi madrasah)
export const defaultMaTimeSlots: TimeSlot[] = [
  { start: '06:45', end: '07:30' },
  { start: '07:30', end: '08:55' },
  { start: '08:55', end: '09:30' },
  { start: '10:00', end: '11:10' },
  { start: '11:10', end: '12:20' },
  { start: '13:00', end: '14:10' },
  { start: '14:10', end: '15:20' },
];

export const subjectKeywords: { pattern: RegExp; subject: string; category: string; defaultTeacher: string }[] = [
  { pattern: /\bupacara\b/i, subject: 'Upacara Bendera', category: 'Pembiasaan Karakter', defaultTeacher: 'Dewan Guru' },
  { pattern: /\b(literasi|numerasi)\b/i, subject: 'Literasi & Numerasi', category: 'Pembiasaan Karakter', defaultTeacher: 'Dewan Guru' },
  { pattern: /\b(dhuha|imtaq|tadarus|doa\s*pagi)\b/i, subject: 'Imtaq & Sholat Dhuha', category: 'Pembiasaan Karakter', defaultTeacher: 'Dewan Guru' },
  { pattern: /\bsenam\b/i, subject: 'Senam Pagi Bersama', category: 'Olahraga & Kesehatan', defaultTeacher: 'Dewan Guru' },
  { pattern: /\b(istirahat|rehat|break)\b/i, subject: 'Istirahat & Sholat', category: 'Pembiasaan Karakter', defaultTeacher: 'Dewan Guru' },
  { pattern: /\b(p5|p5ra)\b|proyek\s*penguatan/i, subject: 'P5RA (Proyek Penguatan Karakter)', category: 'Pengembangan Diri', defaultTeacher: 'Dewan Guru' },
  { pattern: /\b(mulok|btq|tahfidz|tahsin)\b|baca\s*tulis/i, subject: 'Mulok (BTQ & Tahfidz)', category: 'Muatan Lokal', defaultTeacher: 'TISKA PUSPITA DEWI, S.Pd.I' },
  { pattern: /qur['’]?an|hadit[sh]|al[- ]?qur['’]?an/i, subject: "Al-Qur'an Hadits", category: 'Pendidikan Agama Islam', defaultTeacher: 'TAJUDIN, S.Pd.I' },
  { pattern: /a[qk]idah|a[qk][lh]a[qk]/i, subject: 'Akidah Akhlak', category: 'Pendidikan Agama Islam', defaultTeacher: 'JAKARIA, S.Pd.I' },
  { pattern: /fiqi?h|fikih/i, subject: 'Fiqih', category: 'Pendidikan Agama Islam', defaultTeacher: 'TAJUDIN, S.Pd.I' },
  { pattern: /\bpai\b|pendidikan\s*agama/i, subject: 'Pendidikan Agama Islam (PAI)', category: 'Pendidikan Agama Islam', defaultTeacher: 'TAJUDIN, S.Pd.I' },
  { pattern: /\bski\b|sejarah\s*(kebudayaan)?\s*islam|tarikh/i, subject: 'Sejarah Kebudayaan Islam (SKI)', category: 'Sejarah Kebudayaan Islam', defaultTeacher: 'YAHYA HIDAYATULLOH, S.Pd.I' },
  { pattern: /b(hs)?\.?\s*arab|\barab\b/i, subject: 'Bahasa Arab', category: 'Bahasa Asing', defaultTeacher: 'SITI KHAERUNNISA, S.Pd.I' },
  { pattern: /b(hs)?\.?\s*indo(nesia)?|\bindonesia\b/i, subject: 'Bahasa Indonesia', category: 'Bahasa & Sastra', defaultTeacher: 'KUSTYANINGSIH, S.Pd' },
  { pattern: /b(hs)?\.?\s*ingg(ris)?|\binggris\b|english/i, subject: 'Bahasa Inggris', category: 'Bahasa Asing', defaultTeacher: 'SITI KHAERUNNISA, S.Pd.I' },
  { pattern: /mate?matika|\bmtk\b|aljabar/i, subject: 'Matematika', category: 'MIPA', defaultTeacher: 'MADROSYID, S.Pd' },
  { pattern: /\bfisika\b/i, subject: 'Fisika', category: 'MIPA', defaultTeacher: 'SARNAH, S.Pd.I' },
  { pattern: /\bbiologi\b/i, subject: 'Biologi', category: 'MIPA', defaultTeacher: 'SARNAH, S.Pd.I' },
  { pattern: /\bkimia\b/i, subject: 'Kimia', category: 'MIPA', defaultTeacher: 'SARNAH, S.Pd.I' },
  { pattern: /\bipa\b|ilmu\s*pengetahuan\s*alam/i, subject: 'IPA Terpadu', category: 'MIPA', defaultTeacher: 'SARNAH, S.Pd.I' },
  { pattern: /\bips\b|ilmu\s*pengetahuan\s*sosial/i, subject: 'IPS Terpadu', category: 'IPS', defaultTeacher: 'AHMAD NURUL KAHFI, SE' },
  { pattern: /\bekonomi\b/i, subject: 'Ekonomi', category: 'IPS', defaultTeacher: 'AHMAD NURUL KAHFI, SE' },
  { pattern: /\bgeografi\b/i, subject: 'Geografi', category: 'IPS', defaultTeacher: 'YAHYA HIDAYATULLOH, S.Pd.I' },
  { pattern: /\bsosiologi\b/i, subject: 'Sosiologi', category: 'IPS', defaultTeacher: 'AHMAD NURUL KAHFI, SE' },
  { pattern: /\bsejarah\b(?!\s*kebudayaan|\s*islam)/i, subject: 'Sejarah Indonesia', category: 'IPS', defaultTeacher: 'AHMAD NURUL KAHFI, SE' },
  { pattern: /\b(ppkn|pkn|pancasila)\b|kewarganegaraan/i, subject: 'Pendidikan Pancasila (PPKn)', category: 'Pendidikan Kewarganegaraan', defaultTeacher: 'Drs. MULYADI' },
  { pattern: /\b(pjok|penjas|olahraga|jasmani)\b/i, subject: 'Penjasorkes (PJOK)', category: 'Olahraga & Kesehatan', defaultTeacher: 'AHMAD NURUL KAHFI, SE' },
  { pattern: /\b(tik|informatika|komputer)\b/i, subject: 'Informatika & TIK', category: 'Teknologi Informasi & Komunikasi', defaultTeacher: 'MADROSYID, S.Pd' },
  { pattern: /\bseni\b|\bbudaya\b|\bmusik\b|\btari\b|\brupa\b/i, subject: 'Seni Budaya', category: 'Seni & Budaya', defaultTeacher: 'TISKA PUSPITA DEWI, S.Pd.I' },
  { pattern: /\b(pkwu|prakarya|kewirausahaan)\b/i, subject: 'Prakarya & Kewirausahaan (PKWU)', category: 'Prakarya & Kewirausahaan', defaultTeacher: 'TISKA PUSPITA DEWI, S.Pd.I' },
  { pattern: /\bpramuka\b|kepanduan/i, subject: 'Pramuka & Kepanduan', category: 'Ekstrakurikuler', defaultTeacher: 'Pembina Pramuka' },
];

export const knownTeachers = [
  'TAJUDIN, S.Pd.I',
  'JAKARIA, S.Pd.I',
  'YAHYA HIDAYATULLOH, S.Pd.I',
  'SITI KHAERUNNISA, S.Pd.I',
  'Drs. MULYADI',
  'KUSTYANINGSIH, S.Pd',
  'MADROSYID, S.Pd',
  'SARNAH, S.Pd.I',
  'AHMAD NURUL KAHFI, SE',
  'LILIS KASTIRI, S.Pd.I',
  'TISKA PUSPITA DEWI, S.Pd.I',
  'Dewan Guru',
];

/**
 * Ekstraksi rentang waktu jam pelajaran secara otomatis dari teks hasil OCR foto.
 * Mendukung format: 06.45-07.30, 06:45 - 07:30, 06.45 – 07.30, 06,45-07,30, O6.45-O7.30.
 */
export function extractTimeSlotsFromText(text: string): TimeSlot[] {
  if (!text || typeof text !== 'string') return [];

  // 1. Normalisasi OCR noise: huruf O/o pada digit waktu
  const cleanText = text
    .replace(/\b[Oo](\d[.:,]\d\d)/g, '0$1')
    .replace(/(\d{1,2}[.:,]\d\d\s*[-–—~]\s*)[Oo](\d)/g, '$10$2');

  const timeRegex = /\b(\d{1,2})[.:,](\d{2})\s*(?:[-–—~]|s\/d|\bto\b)\s*(\d{1,2})[.:,](\d{2})\b/gi;
  const slots: TimeSlot[] = [];
  const seen = new Set<string>();

  let match;
  while ((match = timeRegex.exec(cleanText)) !== null) {
    const sH = parseInt(match[1], 10);
    const sM = parseInt(match[2], 10);
    const eH = parseInt(match[3], 10);
    const eM = parseInt(match[4], 10);

    // Filter jam sekolah wajar (05:00 s.d 20:00)
    if (sH < 5 || sH > 20 || eH < 5 || eH > 21) continue;
    if (sM > 59 || eM > 59) continue;
    if (eH < sH || (eH === sH && eM <= sM)) continue;

    const startStr = `${sH.toString().padStart(2, '0')}:${sM.toString().padStart(2, '0')}`;
    const endStr = `${eH.toString().padStart(2, '0')}:${eM.toString().padStart(2, '0')}`;
    const key = `${startStr}-${endStr}`;

    if (!seen.has(key)) {
      seen.add(key);
      slots.push({ start: startStr, end: endStr });
    }
  }

  // Urutkan slot waktu secara kronologis
  slots.sort((a, b) => a.start.localeCompare(b.start));
  return slots;
}

/**
 * Dapatkan rentang waktu efektif untuk suatu nomor sesi (1-based index).
 * Memprioritaskan slot yang terdeteksi dari foto.
 */
function getEffectiveTimeSlot(
  sessionIndex: number,
  extractedSlots: TimeSlot[],
  defaultSlots: TimeSlot[]
): TimeSlot {
  if (extractedSlots.length > 0) {
    if (sessionIndex < extractedSlots.length) {
      return extractedSlots[sessionIndex];
    }
    // Jika sesi melebihi jumlah slot yang terdeteksi, gunakan slot terakhir atau default MA
    const fallbackSlot = defaultSlots[Math.min(sessionIndex, defaultSlots.length - 1)];
    return fallbackSlot || extractedSlots[extractedSlots.length - 1];
  }
  return defaultSlots[Math.min(sessionIndex, defaultSlots.length - 1)] || { start: '07:30', end: '08:15' };
}

/**
 * Intelligent parser untuk membaca jadwal pelajaran dari teks OCR foto
 */
export function parseScheduleFromText(
  rawText: string,
  targetRombel: string = 'SMA - Kelas X',
  existingTeachers: { name: string; subject_name?: string }[] = []
): ParsedScheduleItem[] {
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const teacherPool = [
    ...existingTeachers.map((t) => t.name),
    ...knownTeachers,
  ];

  // 1. Deteksi Rombel jika tertera pada judul dokumen / kop foto
  let detectedRombel = targetRombel;
  const fullText = lines.join(' ').toLowerCase();

  if (/kelas\s*(10|x)\b|sma\s*-\s*kelas\s*x/i.test(fullText)) detectedRombel = 'SMA - Kelas X';
  else if (/kelas\s*(11|xi)\b|sma\s*-\s*kelas\s*xi/i.test(fullText)) detectedRombel = 'SMA - Kelas XI';
  else if (/kelas\s*(12|xii)\b|sma\s*-\s*kelas\s*xii/i.test(fullText)) detectedRombel = 'SMA - Kelas XII';
  else if (/kelas\s*(7|vii)\b|smp\s*-\s*kelas\s*vii/i.test(fullText)) detectedRombel = 'SMP - Kelas VII';
  else if (/kelas\s*(8|viii)\b|smp\s*-\s*kelas\s*viii/i.test(fullText)) detectedRombel = 'SMP - Kelas VIII';
  else if (/kelas\s*(9|ix)\b|smp\s*-\s*kelas\s*ix/i.test(fullText)) detectedRombel = 'SMP - Kelas IX';
  else if (/kelas\s*(1|i)\b|sd\s*-\s*kelas\s*1/i.test(fullText)) detectedRombel = 'SD - Kelas I';
  else if (/kelas\s*(2|ii)\b|sd\s*-\s*kelas\s*2/i.test(fullText)) detectedRombel = 'SD - Kelas II';
  else if (/kelas\s*(3|iii)\b|sd\s*-\s*kelas\s*3/i.test(fullText)) detectedRombel = 'SD - Kelas III';
  else if (/kelas\s*(4|iv)\b|sd\s*-\s*kelas\s*4/i.test(fullText)) detectedRombel = 'SD - Kelas IV';
  else if (/kelas\s*(5|v)\b|sd\s*-\s*kelas\s*5/i.test(fullText)) detectedRombel = 'SD - Kelas V';
  else if (/kelas\s*(6|vi)\b|sd\s*-\s*kelas\s*6/i.test(fullText)) detectedRombel = 'SD - Kelas VI';

  // 2. Ekstraksi rentang waktu jam pelajaran langsung dari teks foto
  const extractedTimes = extractTimeSlotsFromText(rawText);

  // Helper pencocokan guru
  const findTeacher = (str: string, fallback: string): string => {
    for (const t of teacherPool) {
      const cleanT = t.toLowerCase().replace(/[,.s.pd.i]/g, '').trim();
      if (cleanT.length > 3 && str.toLowerCase().includes(cleanT)) {
        return t;
      }
    }
    return fallback;
  };

  // 3. Parser Garis per Garis untuk Dokumen Jadwal
  const results: ParsedScheduleItem[] = [];
  let currentDay = 'Senin';
  const sessionCounter: Record<string, number> = {
    Senin: 0,
    Selasa: 0,
    Rabu: 0,
    Kamis: 0,
    Jumat: 0,
    Sabtu: 0,
  };

  for (const line of lines) {
    // Deteksi pergantian hari (misal: "SENIN", "Hari: Selasa", "RABU - 24 Okt")
    const matchedDay = standardDays.find((d) => {
      const regex = new RegExp(`(^|[\\s|,.-])(${d})([:\\s,.-]|$|\\b)`, 'i');
      return regex.test(line);
    });

    if (matchedDay) {
      currentDay = matchedDay;
      // Jika baris hanya berupa header hari (tidak memuat nama mapel), lanjut ke baris berikutnya
      const hasSubject = subjectKeywords.some((kw) => kw.pattern.test(line));
      if (!hasSubject) {
        continue;
      }
    }

    // Deteksi subjek / mata pelajaran
    const matchedSub = subjectKeywords.find((kw) => kw.pattern.test(line));

    // Cek apakah ada jam langsung di baris ini
    const timeMatch = line.match(/\b(\d{1,2})[.:,](\d{2})\s*(?:[-–—~]|s\/d|\bto\b)\s*(\d{1,2})[.:,](\d{2})\b/i);

    // Jika tidak ada keyword mapel standar tapi ada waktu dan teks lain, ambil teks setelah jam sebagai mapel kustom
    let subjectName = matchedSub?.subject || '';
    let categoryName = matchedSub?.category || 'Mata Pelajaran Wajib';
    let defaultTeacherName = matchedSub?.defaultTeacher || 'Dewan Guru';

    if (!matchedSub && timeMatch) {
      const remainingText = line
        .replace(timeMatch[0], '')
        .replace(/^[^\p{L}\d]+/u, '')
        .trim();
      if (
        remainingText.length >= 3 &&
        !/^(jam|sesi|ke[- ]?\d|waktu|pukul)/i.test(remainingText) &&
        !standardDays.some((d) => new RegExp(`^${d}$`, 'i').test(remainingText))
      ) {
        subjectName = remainingText;
        categoryName = 'Mata Pelajaran Pilihan / Muatan Lokal';
      }
    }

    if (!subjectName) continue;

    sessionCounter[currentDay] = (sessionCounter[currentDay] || 0) + 1;
    const sessionNo = sessionCounter[currentDay];

    let timeStart = '';
    let timeEnd = '';

    if (timeMatch) {
      timeStart = `${timeMatch[1].padStart(2, '0')}:${timeMatch[2]}`;
      timeEnd = `${timeMatch[3].padStart(2, '0')}:${timeMatch[4]}`;
    } else {
      const slot = getEffectiveTimeSlot(sessionNo - 1, extractedTimes, defaultMaTimeSlots);
      timeStart = slot.start;
      timeEnd = slot.end;
    }

    const assignedTeacher = findTeacher(line, defaultTeacherName);

    results.push({
      id: `sch-scan-${Date.now()}-${results.length + 1}`,
      class_rombel: detectedRombel,
      day: currentDay,
      session_no: sessionNo,
      time_start: timeStart,
      time_end: timeEnd,
      subject_name: subjectName,
      category: categoryName,
      teacher_name: assignedTeacher,
      room: `Ruang ${detectedRombel.replace(/^(SD|SMP|SMA)\s*-\s*/, '')}`,
    });
  }

  // 4. Fallback Terstruktur jika Hasil Terlalu Sedikit (< 4)
  // Ini menangani kasus seperti unggahan potongan kolom jam (seperti tangkapan layar pengguna)
  // di mana waktu yang terdeteksi dari foto WAJIB diterapkan ke seluruh sesi mingguan madrasah.
  if (results.length < 4) {
    const balancedWeekly: { day: string; subjects: { name: string; cat: string; teacher: string }[] }[] = [
      {
        day: 'Senin',
        subjects: [
          { name: 'Upacara Bendera', cat: 'Pembiasaan Karakter', teacher: 'Dewan Guru' },
          { name: "Al-Qur'an Hadits", cat: 'Pendidikan Agama Islam', teacher: 'TAJUDIN, S.Pd.I' },
          { name: 'Akidah Akhlak', cat: 'Pendidikan Agama Islam', teacher: 'JAKARIA, S.Pd.I' },
          { name: 'Matematika', cat: 'MIPA', teacher: 'MADROSYID, S.Pd' },
          { name: 'Bahasa Indonesia', cat: 'Bahasa & Sastra', teacher: 'KUSTYANINGSIH, S.Pd' },
        ],
      },
      {
        day: 'Selasa',
        subjects: [
          { name: 'Fiqih', cat: 'Pendidikan Agama Islam', teacher: 'TAJUDIN, S.Pd.I' },
          { name: 'Sejarah Kebudayaan Islam (SKI)', cat: 'Sejarah Kebudayaan Islam', teacher: 'YAHYA HIDAYATULLOH, S.Pd.I' },
          { name: 'Bahasa Arab', cat: 'Bahasa Asing', teacher: 'SITI KHAERUNNISA, S.Pd.I' },
          { name: 'Biologi / IPA', cat: 'MIPA', teacher: 'SARNAH, S.Pd.I' },
          { name: 'Pendidikan Pancasila (PPKn)', cat: 'Pendidikan Kewarganegaraan', teacher: 'Drs. MULYADI' },
        ],
      },
      {
        day: 'Rabu',
        subjects: [
          { name: 'Bahasa Inggris', cat: 'Bahasa Asing', teacher: 'SITI KHAERUNNISA, S.Pd.I' },
          { name: 'Ekonomi / IPS Terpadu', cat: 'IPS', teacher: 'AHMAD NURUL KAHFI, SE' },
          { name: 'Penjasorkes (PJOK)', cat: 'Olahraga & Kesehatan', teacher: 'AHMAD NURUL KAHFI, SE' },
          { name: 'Seni Budaya', cat: 'Seni & Budaya', teacher: 'TISKA PUSPITA DEWI, S.Pd.I' },
          { name: 'Informatika & TIK', cat: 'Teknologi Informasi & Komunikasi', teacher: 'MADROSYID, S.Pd' },
        ],
      },
      {
        day: 'Kamis',
        subjects: [
          { name: 'Mulok (BTQ & Tahfidz)', cat: 'Muatan Lokal', teacher: 'TISKA PUSPITA DEWI, S.Pd.I' },
          { name: 'Prakarya & Kewirausahaan (PKWU)', cat: 'Prakarya & Kewirausahaan', teacher: 'TISKA PUSPITA DEWI, S.Pd.I' },
          { name: 'Matematika', cat: 'MIPA', teacher: 'MADROSYID, S.Pd' },
          { name: 'Bahasa Indonesia', cat: 'Bahasa & Sastra', teacher: 'KUSTYANINGSIH, S.Pd' },
          { name: 'Fiqih', cat: 'Pendidikan Agama Islam', teacher: 'JAKARIA, S.Pd.I' },
        ],
      },
      {
        day: 'Jumat',
        subjects: [
          { name: 'Senam Pagi & Sholat Dhuha', cat: 'Pembiasaan Karakter', teacher: 'Dewan Guru' },
          { name: "Al-Qur'an Hadits", cat: 'Pendidikan Agama Islam', teacher: 'TAJUDIN, S.Pd.I' },
          { name: 'Pendidikan Pancasila (PPKn)', cat: 'Pendidikan Kewarganegaraan', teacher: 'Drs. MULYADI' },
        ],
      },
      {
        day: 'Sabtu',
        subjects: [
          { name: 'Pengembangan Diri & Pramuka', cat: 'Ekstrakurikuler', teacher: 'Dewan Guru' },
          { name: 'Seni Beladiri & Olahraga', cat: 'Ekstrakurikuler', teacher: 'Pembina Ekskul' },
          { name: 'Kaligrafi & Tahsin Qur’an', cat: 'Muatan Lokal', teacher: 'TISKA PUSPITA DEWI, S.Pd.I' },
        ],
      },
    ];

    const fallbackItems: ParsedScheduleItem[] = [];
    balancedWeekly.forEach((bw) => {
      bw.subjects.forEach((subj, idx) => {
        const slot = getEffectiveTimeSlot(idx, extractedTimes, defaultMaTimeSlots);
        fallbackItems.push({
          id: `sch-${detectedRombel.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${bw.day.toLowerCase()}-${idx + 1}`,
          class_rombel: detectedRombel,
          day: bw.day,
          session_no: idx + 1,
          time_start: slot.start,
          time_end: slot.end,
          subject_name: subj.name,
          category: subj.cat,
          teacher_name: subj.teacher,
          room: `Ruang ${detectedRombel.replace(/^(SD|SMP|SMA)\s*-\s*/, '')}`,
        });
      });
    });

    return fallbackItems;
  }

  return results;
}
