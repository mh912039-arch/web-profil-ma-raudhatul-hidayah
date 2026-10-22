export interface DeviceInfo {
  deviceType: 'desktop' | 'mobile' | 'tablet';
  os: string;
  browser: string;
  display: string;
}

export function parseUserAgent(uaString: string | null | undefined): DeviceInfo {
  if (!uaString) {
    return {
      deviceType: 'desktop',
      os: 'Perangkat Tidak Dikenal',
      browser: 'Peramban Web',
      display: 'Perangkat Tidak Dikenal',
    };
  }

  const ua = uaString.toLowerCase();

  // 1. Detect OS
  let os = 'Perangkat Lainnya';
  if (ua.includes('windows nt 10.0') || ua.includes('windows nt 11.0')) {
    os = 'Windows 11/10';
  } else if (ua.includes('windows')) {
    os = 'Windows PC';
  } else if (ua.includes('iphone')) {
    os = 'iPhone (iOS)';
  } else if (ua.includes('ipad')) {
    os = 'iPad (iPadOS)';
  } else if (ua.includes('android')) {
    const match = ua.match(/android\s([0-9\.]+)/);
    os = match ? `Android ${match[1]}` : 'Android';
  } else if (ua.includes('macintosh') || ua.includes('mac os x')) {
    os = 'macOS (MacBook/iMac)';
  } else if (ua.includes('linux')) {
    os = 'Linux OS';
  }

  // 2. Detect Browser
  let browser = 'Peramban Web';
  if (ua.includes('edg/') || ua.includes('edge/') || ua.includes('edgios/')) {
    browser = 'Microsoft Edge';
  } else if (ua.includes('opr/') || ua.includes('opera/')) {
    browser = 'Opera';
  } else if (ua.includes('samsungbrowser/')) {
    browser = 'Samsung Internet';
  } else if (ua.includes('crios/')) {
    browser = 'Google Chrome';
  } else if (ua.includes('fxios/')) {
    browser = 'Mozilla Firefox';
  } else if (ua.includes('chrome/') && !ua.includes('edg/') && !ua.includes('opr/')) {
    browser = 'Google Chrome';
  } else if (ua.includes('firefox/')) {
    browser = 'Mozilla Firefox';
  } else if (ua.includes('safari/') && !ua.includes('chrome/')) {
    browser = 'Apple Safari';
  }

  // 3. Detect Device Type
  let deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop';
  if (ua.includes('ipad') || ua.includes('tablet') || (ua.includes('android') && !ua.includes('mobile'))) {
    deviceType = 'tablet';
  } else if (ua.includes('mobile') || ua.includes('iphone') || ua.includes('android')) {
    deviceType = 'mobile';
  }

  return {
    deviceType,
    os,
    browser,
    display: `${os} • ${browser}`,
  };
}
