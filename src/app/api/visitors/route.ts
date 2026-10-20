import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabaseClient';

const METRICS_FILE = path.join(process.cwd(), 'src', 'data', 'visitorMetrics.json');

interface DailyRecord {
  views: number;
  uniques: number;
  hashes: string[];
  paths: Record<string, number>;
}

interface VisitorData {
  totalAccumulated: number;
  dailyRecords: Record<string, DailyRecord>;
  recentLogs: Array<{
    timestamp: string;
    path: string;
    ipHash: string;
    userAgent: string;
    referrer?: string;
  }>;
}

// Helper: Read local JSON file safely
function readVisitorMetrics(): VisitorData {
  try {
    if (fs.existsSync(METRICS_FILE)) {
      const raw = fs.readFileSync(METRICS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        totalAccumulated: typeof parsed.totalAccumulated === 'number' ? parsed.totalAccumulated : 0,
        dailyRecords: parsed.dailyRecords || {},
        recentLogs: Array.isArray(parsed.recentLogs) ? parsed.recentLogs : [],
      };
    }
  } catch (err) {
    console.error('Error reading visitorMetrics.json:', err);
  }
  return { totalAccumulated: 0, dailyRecords: {}, recentLogs: [] };
}

// Helper: Save local JSON file
function saveVisitorMetrics(data: VisitorData) {
  try {
    fs.writeFileSync(METRICS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving visitorMetrics.json:', err);
  }
}

// Helper: Get formatted date in Asia/Jakarta timezone
function getJakartaDate(offsetDays = 0): { dateStr: string; yearMonth: string; dayName: string } {
  const d = new Date();
  if (offsetDays !== 0) {
    d.setDate(d.getDate() + offsetDays);
  }

  // Use Intl to format in Asia/Jakarta
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  });

  const parts = formatter.formatToParts(d);
  const year = parts.find((p) => p.type === 'year')?.value || '2026';
  const month = parts.find((p) => p.type === 'month')?.value || '10';
  const day = parts.find((p) => p.type === 'day')?.value || '19';
  const weekday = parts.find((p) => p.type === 'weekday')?.value || 'Sen';

  // Indonesian weekday mapping
  const dayNameMap: Record<string, string> = {
    Mon: 'Sen',
    Tue: 'Sel',
    Wed: 'Rab',
    Thu: 'Kam',
    Fri: 'Jum',
    Sat: 'Sab',
    Sun: 'Min',
  };

  return {
    dateStr: `${year}-${month}-${day}`,
    yearMonth: `${year}-${month}`,
    dayName: dayNameMap[weekday] || weekday,
  };
}

// Helper: Calculate previous month string
function getPreviousYearMonth(currentYearMonth: string): string {
  const [yearStr, monthStr] = currentYearMonth.split('-');
  let year = parseInt(yearStr, 10);
  let month = parseInt(monthStr, 10);

  if (month === 1) {
    month = 12;
    year -= 1;
  } else {
    month -= 1;
  }

  return `${year}-${String(month).padStart(2, '0')}`;
}

// ====================================================================
// GET /api/visitors -> Get aggregated metrics for Admin CMS Overview
// ====================================================================
export async function GET() {
  const data = readVisitorMetrics();

  const todayInfo = getJakartaDate(0);
  const yesterdayInfo = getJakartaDate(-1);
  const currentYearMonth = todayInfo.yearMonth;
  const prevYearMonth = getPreviousYearMonth(currentYearMonth);

  // 1. Hari Ini (Today)
  const todayRecord = data.dailyRecords[todayInfo.dateStr];
  const todayViews = todayRecord ? todayRecord.views : 0;
  const todayUniques = todayRecord ? todayRecord.uniques : 0;

  // 2. Kemarin (Yesterday)
  const yesterdayRecord = data.dailyRecords[yesterdayInfo.dateStr];
  const yesterdayViews = yesterdayRecord ? yesterdayRecord.views : 0;
  const yesterdayUniques = yesterdayRecord ? yesterdayRecord.uniques : 0;

  // 3. Minggu Ini (Last 7 days, offsets 0 down to -6)
  let thisWeekViews = 0;
  for (let i = 0; i >= -6; i--) {
    const { dateStr } = getJakartaDate(i);
    const rec = data.dailyRecords[dateStr];
    if (rec) thisWeekViews += rec.views;
  }

  // 4. Minggu Lalu (Previous 7 days, offsets -7 down to -13)
  let lastWeekViews = 0;
  for (let i = -7; i >= -13; i--) {
    const { dateStr } = getJakartaDate(i);
    const rec = data.dailyRecords[dateStr];
    if (rec) lastWeekViews += rec.views;
  }

  // 5. Bulan Ini (This calendar month)
  let thisMonthViews = 0;
  Object.keys(data.dailyRecords).forEach((dateKey) => {
    if (dateKey.startsWith(currentYearMonth)) {
      thisMonthViews += data.dailyRecords[dateKey].views || 0;
    }
  });

  // 6. Bulan Lalu (Previous calendar month)
  let lastMonthViews = 0;
  Object.keys(data.dailyRecords).forEach((dateKey) => {
    if (dateKey.startsWith(prevYearMonth)) {
      lastMonthViews += data.dailyRecords[dateKey].views || 0;
    }
  });

  // 7. Last 7 Days trend chart
  const last7Days: Array<{
    date: string;
    dayLabel: string;
    views: number;
    uniques: number;
  }> = [];

  for (let i = -6; i <= 0; i++) {
    const { dateStr, dayName } = getJakartaDate(i);
    const rec = data.dailyRecords[dateStr];
    last7Days.push({
      date: dateStr,
      dayLabel: i === 0 ? 'Hari Ini' : i === -1 ? 'Kemarin' : dayName,
      views: rec ? rec.views : 0,
      uniques: rec ? rec.uniques : 0,
    });
  }

  // 8. Distribution Bar Chart Data
  // Values: Hari Ini, Kemarin, Minggu Ini, Minggu Lalu, Bulan Ini, Bulan Lalu
  const distributionRaw = [
    { label: 'Hari Ini', val: todayViews, color: 'bg-[#06b6d4]' },
    { label: 'Kemarin', val: yesterdayViews, color: 'bg-[#93c5fd]' },
    { label: 'Minggu Ini', val: thisWeekViews, color: 'bg-[#eab308]' },
    { label: 'Minggu Lalu', val: lastWeekViews, color: 'bg-[#3b82f6]' },
    { label: 'Bulan Ini', val: thisMonthViews, color: 'bg-[#16a34a]' },
    { label: 'Bulan Lalu', val: lastMonthViews, color: 'bg-[#be123c]' },
  ];

  const maxVal = Math.max(...distributionRaw.map((d) => d.val), 1);

  const distribution = distributionRaw.map((d) => ({
    ...d,
    percentage: d.val === 0 ? 0 : Math.max(Math.round((d.val / maxVal) * 100), 4),
  }));

  // 9. Top Visited Pages
  const pageHits: Record<string, number> = {};
  Object.values(data.dailyRecords).forEach((rec) => {
    if (rec.paths) {
      Object.entries(rec.paths).forEach(([pth, count]) => {
        pageHits[pth] = (pageHits[pth] || 0) + count;
      });
    }
  });

  const topPages = Object.entries(pageHits)
    .map(([pathUrl, views]) => ({ path: pathUrl, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  const lastVisit = data.recentLogs.length > 0 ? data.recentLogs[data.recentLogs.length - 1].timestamp : null;

  return NextResponse.json({
    today: todayViews,
    uniqueToday: todayUniques,
    yesterday: yesterdayViews,
    uniqueYesterday: yesterdayUniques,
    thisWeek: thisWeekViews,
    lastWeek: lastWeekViews,
    thisMonth: thisMonthViews,
    lastMonth: lastMonthViews,
    totalAccumulated: data.totalAccumulated,
    distribution,
    last7Days,
    topPages,
    lastVisitTime: lastVisit,
  });
}

// ====================================================================
// POST /api/visitors -> Record a real visitor page view
// ====================================================================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const reqPath = body.path || '/';
    const referrer = body.referrer || '';
    const isSimulation = Boolean(body.isSimulation);

    // Filter out admin routes and internal API routes unless simulation
    if (!isSimulation && (reqPath.startsWith('/admin') || reqPath.startsWith('/api'))) {
      return NextResponse.json({ skipped: true });
    }

    // Extract client IP
    const cfIp = req.headers.get('cf-connecting-ip');
    const forwarded = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const clientIp = cfIp || forwarded?.split(',')[0].trim() || realIp || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'Browser';

    // Create privacy hash
    let hash = 0;
    const rawIdentity = `${clientIp}-${userAgent.slice(0, 40)}`;
    for (let i = 0; i < rawIdentity.length; i++) {
      hash = (hash << 5) - hash + rawIdentity.charCodeAt(i);
      hash |= 0;
    }
    const visitorHash = isSimulation
      ? `sim-${Math.random().toString(36).substring(2, 7)}`
      : Math.abs(hash).toString(36);

    const { dateStr } = getJakartaDate(0);
    const nowIso = new Date().toISOString();

    // Update local data
    const data = readVisitorMetrics();

    if (!data.dailyRecords[dateStr]) {
      data.dailyRecords[dateStr] = {
        views: 0,
        uniques: 0,
        hashes: [],
        paths: {},
      };
    }

    const todayRec = data.dailyRecords[dateStr];
    todayRec.views += 1;

    if (!todayRec.hashes.includes(visitorHash)) {
      todayRec.hashes.push(visitorHash);
      todayRec.uniques += 1;
    }

    todayRec.paths[reqPath] = (todayRec.paths[reqPath] || 0) + 1;
    data.totalAccumulated += 1;

    // Keep up to 50 recent logs
    data.recentLogs.push({
      timestamp: nowIso,
      path: reqPath,
      ipHash: visitorHash,
      userAgent: userAgent.slice(0, 80),
      referrer: referrer.slice(0, 100),
    });
    if (data.recentLogs.length > 50) {
      data.recentLogs = data.recentLogs.slice(-50);
    }

    saveVisitorMetrics(data);

    // Try persistence to Supabase visitor_logs (safe non-blocking try-catch)
    try {
      const { error } = await supabase.from('visitor_logs').insert([
        {
          ip_hash: visitorHash,
          path: reqPath,
          user_agent: userAgent.slice(0, 200),
          referrer: referrer.slice(0, 200),
          visited_at: nowIso,
          visit_date: dateStr,
        },
      ]);
      if (error && error.code !== '42P01') {
        console.warn('Supabase visitor_logs insert notice:', error.message);
      }
    } catch {
      // Supabase not reachable or table pending creation
    }

    return NextResponse.json({
      success: true,
      totalAccumulated: data.totalAccumulated,
      todayViews: todayRec.views,
    });
  } catch (err) {
    console.error('Error tracking visitor:', err);
    return NextResponse.json({ success: false, error: 'Failed to record visit' }, { status: 500 });
  }
}
