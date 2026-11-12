let cachedProfileData: any = null;
let inFlightPromise: Promise<any> | null = null;

export function clearProfileCache(): void {
  cachedProfileData = null;
  inFlightPromise = null;
}

export async function fetchPublicProfile(forceFresh: boolean = false): Promise<any> {
  if (forceFresh) {
    cachedProfileData = null;
    inFlightPromise = null;
  }

  if (cachedProfileData) return cachedProfileData;
  if (inFlightPromise) return inFlightPromise;

  inFlightPromise = fetch(`/api/profile?_t=${Date.now()}`, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
    },
  })
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (data) {
        cachedProfileData = data;
      }
      return data;
    })
    .catch((err) => {
      console.warn('Could not fetch public profile:', err);
      return null;
    })
    .finally(() => {
      inFlightPromise = null;
    });

  return inFlightPromise;
}
