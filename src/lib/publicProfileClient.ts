let cachedProfileData: any = null;
let inFlightPromise: Promise<any> | null = null;

export async function fetchPublicProfile(): Promise<any> {
  if (cachedProfileData) return cachedProfileData;
  if (inFlightPromise) return inFlightPromise;

  inFlightPromise = fetch('/api/profile', { cache: 'no-store' })
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
