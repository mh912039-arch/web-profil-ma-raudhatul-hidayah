/**
 * Helper client-side untuk memvalidasi apakah pengguna aktif merupakan Akun Developer Utama.
 * Akun non-developer (walaupun memiliki role admin atau full access) akan menghasilkan false.
 */

export const DEVELOPER_EMAILS = [
  'admin@raudhatulhidayah.sch.id',
  'admin@raudlatulhidayah.sch.id',
];

export function checkIsDeveloper(user?: {
  id?: string;
  userId?: string;
  username?: string;
  name?: string;
  email?: string;
} | null): boolean {
  if (user) {
    if (user.id === 'usr-1' || user.userId === 'usr-1') return true;
    if (user.username?.toLowerCase() === 'developer') return true;
    if (user.name?.toLowerCase() === 'developer') return true;
    if (user.email && DEVELOPER_EMAILS.includes(user.email.toLowerCase().trim())) {
      return true;
    }
  }

  // Fallback membaca dari localStorage di peramban pengguna
  if (typeof window !== 'undefined') {
    try {
      const storedId = localStorage.getItem('mrh_user_id') || '';
      const storedUsername = (localStorage.getItem('mrh_username') || '').toLowerCase().trim();
      const storedEmail = (localStorage.getItem('mrh_email') || '').toLowerCase().trim();

      if (storedId === 'usr-1') return true;
      if (storedUsername === 'developer') return true;
      if (DEVELOPER_EMAILS.includes(storedEmail)) return true;
    } catch {
      // Abaikan jika localStorage tidak dapat diakses
    }
  }

  return false;
}
