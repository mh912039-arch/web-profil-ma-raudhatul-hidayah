'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Shield,
  Key,
  KeyRound,
  Search,
  CheckCircle2,
  UserPlus,
  Filter,
  Laptop,
  Smartphone,
  Tablet,
  Globe,
  Clock,
  Sliders,
  X,
  AlertCircle,
  RefreshCw,
  LogOut,
  Check,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserX,
  Trash2,
  Eye,
  EyeOff,
  Copy,
} from 'lucide-react';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  username?: string;
  password?: string;
  role: 'admin' | 'guru' | 'siswa';
  status: 'Aktif' | 'Nonaktif';
  permissions: string[];
  created_at?: string;
  last_login?: string;
  last_device?: string;
  last_device_type?: 'desktop' | 'mobile' | 'tablet';
  last_ip?: string;
  is_online?: boolean;
  nip_nisn?: string;
  note?: string;
}

export interface UserSession {
  id: string;
  user_id: string;
  user_name: string;
  email: string;
  role: string;
  device_name: string;
  browser: string;
  os: string;
  device_type: 'desktop' | 'mobile' | 'tablet';
  ip_address: string;
  login_time: string;
  status: 'active' | 'expired';
}

const AVAILABLE_MODULES: { id: string; label: string; group: 'ppdb' | 'akademik' | 'konten' | 'sistem' }[] = [
  // PPDB
  { id: 'ppdb', label: 'Pengaturan Alur & Info PPDB', group: 'ppdb' },
  { id: 'registrations', label: 'Data & Verifikasi Calon Santri PPDB', group: 'ppdb' },

  // Akademik
  { id: 'teachers', label: 'Data Dewan Guru & Tendik', group: 'akademik' },
  { id: 'schedules', label: 'Jadwal Pelajaran & Rombel', group: 'akademik' },
  { id: 'classes', label: 'Kelas & Wali Kelas', group: 'akademik' },
  { id: 'calendar', label: 'Kalender Akademik & Agenda', group: 'akademik' },
  { id: 'extracurricular', label: 'Kegiatan Ekstrakurikuler', group: 'akademik' },

  // Konten Website
  { id: 'articles', label: 'Warta Berita & Artikel Madrasah', group: 'konten' },
  { id: 'achievements', label: 'Prestasi & Galeri Foto Juara', group: 'konten' },
  { id: 'homepage', label: 'Konfigurasi Halaman Depan / Sambutan', group: 'konten' },
  { id: 'profile', label: 'Identitas Profil Sekolah & Fasilitas', group: 'konten' },
  { id: 'messages', label: 'Pesan Masuk & Kontak Pengunjung', group: 'konten' },

  // Sistem
  { id: 'users', label: 'Kelola Pengguna & Hak Akses', group: 'sistem' },
];

const PRESETS: Record<'admin' | 'guru' | 'siswa', string[]> = {
  admin: AVAILABLE_MODULES.map((m) => m.id),
  guru: ['schedules', 'classes', 'calendar', 'articles', 'achievements', 'extracurricular'],
  siswa: ['schedules', 'classes', 'calendar'],
};

interface UsersTabProps {
  mode?: 'users' | 'activation';
}

export const UsersTab: React.FC<UsersTabProps> = ({ mode = 'users' }) => {
  const [activeSubTab, setActiveSubTab] = useState<'directory' | 'sessions' | 'activation'>(
    mode === 'activation' ? 'activation' : 'directory'
  );

  const [users, setUsers] = useState<UserAccount[]>([]);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'guru' | 'siswa'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Aktif' | 'Nonaktif'>('all');
  const [onlineFilter, setOnlineFilter] = useState<'all' | 'online' | 'offline'>('all');

  // Modals & Password states
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    password: 'guru2026',
    role: 'guru' as 'admin' | 'guru' | 'siswa',
    status: 'Aktif' as 'Aktif' | 'Nonaktif',
    permissions: PRESETS.guru,
  });

  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [showNewUserPassword, setShowNewUserPassword] = useState(false);
  const [isSavingPass, setIsSavingPass] = useState(false);

  const togglePasswordVisibility = (userId: string) => {
    setVisiblePasswords((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  const copyCredentials = (user: { name?: string; email: string; password?: string; role?: string }) => {
    const isHashed = user.password?.startsWith('h256:');
    const pass = isHashed ? '(Tersimpan aman terenkripsi - atur sandi baru di tombol Atur Sandi jika lupa)' : (user.password || '-');
    const text = `Kredensial Login Portal MAS Raudhatul Hidayah:\nNama: ${user.name || '-'}\nEmail/ID: ${user.email}\nKata Sandi: ${pass}\nAlamat Portal: https://web-profil-ma-raudhatul-hidayah.vercel.app/masuk`;
    navigator.clipboard.writeText(text);
    showNotification('success', `Kredensial untuk "${user.email}" berhasil disalin.`);
  };

  const generateRandomPassword = () => {
    const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
    let rand = '';
    for (let i = 0; i < 6; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const prefix =
      editingUser?.role === 'siswa'
        ? 'santri'
        : editingUser?.role === 'admin'
        ? 'adm'
        : 'guru';
    const newPass = `${prefix}#${rand}`;
    if (editingUser) {
      setEditingUser({ ...editingUser, password: newPass });
      setShowEditPassword(true);
    }
  };

  // Simpan kata sandi langsung dari card modal
  const handleQuickSavePassword = async () => {
    if (!editingUser) return;
    const pwd = editingUser.password?.trim();
    if (!pwd || pwd.startsWith('h256:')) {
      showNotification('error', 'Ketik kata sandi baru atau klik Buat Sandi Acak terlebih dahulu.');
      return;
    }
    setIsSavingPass(true);
    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingUser.id,
          password: pwd,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === editingUser.id
              ? { ...u, password: pwd }
              : u
          )
        );
        showNotification(
          'success',
          `Kata sandi baru untuk "${editingUser.name}" berhasil disimpan dan langsung aktif!`
        );
      } else {
        showNotification('error', data.message || 'Gagal menyimpan kata sandi.');
      }
    } catch {
      showNotification('error', 'Terjadi kesalahan jaringan.');
    } finally {
      setIsSavingPass(false);
    }
  };

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchUsersAndSessions = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const res = await fetch('/api/users', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.users) setUsers(data.users);
        if (data.sessions) setSessions(data.sessions);
      }
    } catch (err) {
      console.warn('Gagal memuat data pengguna:', err);
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAndSessions();

    const pollInterval = setInterval(() => {
      fetchUsersAndSessions(true);
    }, 15000);

    return () => clearInterval(pollInterval);
  }, []);

  useEffect(() => {
    if (mode === 'activation') {
      setActiveSubTab('activation');
    } else {
      setActiveSubTab('directory');
    }
  }, [mode]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Quick Toggle Status
  const handleToggleUserStatus = async (user: UserAccount) => {
    const nextStatus = user.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, status: nextStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
        );
        showNotification(
          'success',
          `Status akun "${user.name}" diubah menjadi ${nextStatus}.`
        );
      } else {
        showNotification('error', data.message || 'Gagal mengubah status akun.');
      }
    } catch {
      showNotification('error', 'Terjadi kesalahan jaringan.');
    }
  };

  // Save Permissions & Password Modal
  const handleSavePermissions = async () => {
    if (!editingUser) return;
    try {
      const payload: Record<string, any> = {
        id: editingUser.id,
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
        status: editingUser.status,
        permissions: editingUser.permissions,
      };

      // Hanya kirim kata sandi jika pengguna mengetikkan kata sandi baru (bukan hash)
      if (editingUser.password && editingUser.password.trim() && !editingUser.password.startsWith('h256:')) {
        payload.password = editingUser.password.trim();
      }

      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === editingUser.id ? { ...u, ...payload } : u))
        );
        showNotification('success', data.message);
        setEditingUser(null);
      } else {
        showNotification('error', data.message || 'Gagal menyimpan perubahan.');
      }
    } catch {
      showNotification('error', 'Terjadi kesalahan jaringan.');
    }
  };

  // Create User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email) return;

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserForm),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers((prev) => [data.user, ...prev]);
        showNotification('success', data.message);
        setIsAddModalOpen(false);
        setNewUserForm({
          name: '',
          email: '',
          password: 'guru2026',
          role: 'guru',
          status: 'Aktif',
          permissions: PRESETS.guru,
        });
      } else {
        showNotification('error', data.message || 'Gagal menambahkan akun.');
      }
    } catch {
      showNotification('error', 'Terjadi kesalahan jaringan.');
    }
  };

  // Revoke / Terminate Session
  const handleRevokeSession = async (sessionId: string, userName: string) => {
    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'revoke_session', session_id: sessionId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSessions((prev) =>
          prev.map((s) => (s.id === sessionId ? { ...s, status: 'expired' } : s))
        );
        showNotification('success', `Sesi perangkat untuk "${userName}" berhasil diputuskan.`);
      } else {
        showNotification('error', data.message || 'Gagal memutuskan sesi.');
      }
    } catch {
      showNotification('error', 'Terjadi kesalahan jaringan.');
    }
  };

  // Delete User Account
  const handleDeleteUser = async (user: UserAccount) => {
    if (!confirm(`Hapus akun "${user.name}" (${user.email}) secara permanen?`)) return;

    try {
      const res = await fetch(`/api/users?id=${encodeURIComponent(user.id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
        showNotification('success', data.message);
      } else {
        showNotification('error', data.message || 'Gagal menghapus pengguna.');
      }
    } catch {
      showNotification('error', 'Terjadi kesalahan jaringan.');
    }
  };

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.last_device && u.last_device.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (u.last_ip && u.last_ip.includes(searchTerm));

      const matchRole = roleFilter === 'all' || u.role === roleFilter;
      const matchStatus = statusFilter === 'all' || u.status === statusFilter;
      const matchOnline =
        onlineFilter === 'all' ||
        (onlineFilter === 'online' ? Boolean(u.is_online) : !u.is_online);

      return matchSearch && matchRole && matchStatus && matchOnline;
    });
  }, [users, searchTerm, roleFilter, statusFilter, onlineFilter]);

  const activeSessionsCount = sessions.filter((s) => s.status === 'active').length;
  const activeUsersCount = users.filter((u) => u.is_online).length;

  const getDeviceIcon = (deviceType?: string) => {
    if (deviceType === 'mobile') return <Smartphone className="w-4 h-4 text-emerald-600" />;
    if (deviceType === 'tablet') return <Tablet className="w-4 h-4 text-amber-600" />;
    return <Laptop className="w-4 h-4 text-blue-600" />;
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-200">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
            Administrator
          </span>
        );
      case 'guru':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
            <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
            Dewan Guru
          </span>
        );
      case 'siswa':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
            <Users className="w-3.5 h-3.5 text-amber-700" />
            Santri / Siswa
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
            {role}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-rose-50 text-rose-900 border-rose-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{notification.message}</span>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="p-1 rounded-md hover:bg-black/5 text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & Sub-Tab Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Kelola Pengguna, Perangkat &amp; Hak Akses
          </h2>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => fetchUsersAndSessions()}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-all shadow-xs active:scale-[0.98]"
            title="Muat Ulang Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
            <span>Segarkan</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-all shadow-sm active:scale-[0.98]"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Pengguna</span>
          </button>
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <span className="text-[11.5px] font-bold uppercase tracking-wide text-slate-500">
            Total Pengguna
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{users.length}</span>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
              Terdaftar
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-emerald-300 shadow-xs flex flex-col justify-between bg-gradient-to-br from-white to-emerald-50/40">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-bold uppercase tracking-wide text-emerald-800">
              Pengguna Online
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
              {activeUsersCount}
            </span>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
              Sedang Menggunakan
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <span className="text-[11.5px] font-bold uppercase tracking-wide text-slate-500">
            Pengguna Offline
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-600">
              {Math.max(0, users.length - activeUsersCount)}
            </span>
            <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
              Tidak Aktif
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <span className="text-[11.5px] font-bold uppercase tracking-wide text-slate-500">
            Sesi Perangkat
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-blue-700">
              {activeSessionsCount}
            </span>
            <span className="text-[11px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md">
              Terhubung
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('directory')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
            activeSubTab === 'directory'
              ? 'border-blue-700 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Direktori Pengguna &amp; Hak Akses</span>
          <span className="px-2 py-0.5 text-[11px] rounded-full bg-slate-100 text-slate-700">
            {users.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('sessions')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
            activeSubTab === 'sessions'
              ? 'border-blue-700 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <Laptop className="w-4 h-4" />
          <span>Riwayat Sesi &amp; Perangkat Login</span>
          <span className="px-2 py-0.5 text-[11px] rounded-full bg-emerald-100 text-emerald-800 font-extrabold">
            {activeSessionsCount} Aktif
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('activation')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
            activeSubTab === 'activation'
              ? 'border-blue-700 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Aktivasi Akun Pengguna</span>
          {users.filter((u) => u.status === 'Nonaktif').length > 0 && (
            <span className="px-2 py-0.5 text-[11px] rounded-full bg-amber-100 text-amber-800 font-bold">
              {users.filter((u) => u.status === 'Nonaktif').length} Tertunda
            </span>
          )}
        </button>
      </div>

      {/* =========================================================================
          TAB 1: DIREKTORI PENGGUNA & HAK AKSES
      ========================================================================= */}
      {activeSubTab === 'directory' && (
        <div className="space-y-4">
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama, email, perangkat, atau alamat IP..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-semibold text-slate-600">Peran:</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as any)}
                  className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="all">Semua Peran</option>
                  <option value="admin">Administrator</option>
                  <option value="guru">Dewan Guru</option>
                  <option value="siswa">Santri / Siswa</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
                <span className="font-semibold text-slate-600">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="all">Semua Akun</option>
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
                <span className="font-semibold text-slate-600">Koneksi:</span>
                <select
                  value={onlineFilter}
                  onChange={(e) => setOnlineFilter(e.target.value as any)}
                  className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="all">Semua ({users.length})</option>
                  <option value="online">Online ({activeUsersCount})</option>
                  <option value="offline">Offline ({Math.max(0, users.length - activeUsersCount)})</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table (Desktop) & Cards (Mobile) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#1e3a8a] text-white uppercase text-[11px] tracking-wider font-bold">
                  <tr>
                    <th className="py-3.5 px-6">Pengguna &amp; Akun</th>
                    <th className="py-3.5 px-4">Peran Utama</th>
                    <th className="py-3.5 px-4">Kata Sandi (Password)</th>
                    <th className="py-3.5 px-4">Hak Akses Modul</th>
                    <th className="py-3.5 px-4">Perangkat &amp; Login Terakhir</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        Tidak ada pengguna yang cocok dengan kriteria pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Pengguna & Akun */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="relative shrink-0">
                              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-900 font-bold flex items-center justify-center border border-blue-200 text-sm">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <span
                                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                                  user.is_online ? 'bg-emerald-500 ring-2 ring-emerald-200' : 'bg-slate-300'
                                }`}
                                title={user.is_online ? 'Sedang Online' : 'Offline'}
                              />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 text-[13.5px] truncate">
                                  {user.name}
                                </span>
                                {user.is_online ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Online
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200 shrink-0">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                    Offline
                                  </span>
                                )}
                              </div>
                              <span className="text-slate-500 text-[11.5px] truncate font-mono">
                                {user.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Peran Utama */}
                        <td className="py-4 px-4">{getRoleBadge(user.role)}</td>

                        {/* Kata Sandi (Password) */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1.5">
                            <div className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11.5px] text-slate-900 flex items-center gap-2 min-w-[110px] justify-between shadow-2xs">
                              <span className="font-bold">
                                {visiblePasswords[user.id]
                                  ? user.password && !user.password.startsWith('h256:')
                                    ? user.password
                                    : '•••••••• (Terenkripsi)'
                                  : '••••••••'}
                              </span>
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility(user.id)}
                                className="text-slate-400 hover:text-blue-700 transition-colors p-0.5"
                                title={
                                  visiblePasswords[user.id]
                                    ? 'Sembunyikan Kata Sandi'
                                    : 'Tampilkan Kata Sandi'
                                }
                              >
                                {visiblePasswords[user.id] ? (
                                  <EyeOff className="w-3.5 h-3.5" />
                                ) : (
                                  <Eye className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => copyCredentials(user)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-700 hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-200"
                              title="Salin Kredensial Lengkap (Email & Password)"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                        {/* Hak Akses Modul */}
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {user.role === 'admin' ? (
                              <span className="inline-flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                                <Check className="w-3 h-3 text-blue-600" />
                                Akses Penuh Seluruh Sistem ({AVAILABLE_MODULES.length} Modul)
                              </span>
                            ) : user.permissions && user.permissions.length > 0 ? (
                              <>
                                {user.permissions.slice(0, 3).map((permId) => {
                                  const mod = AVAILABLE_MODULES.find((m) => m.id === permId);
                                  return (
                                    <span
                                      key={permId}
                                      className="inline-block text-[10.5px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 truncate max-w-[120px]"
                                    >
                                      {mod ? mod.label.split(' ')[0] : permId}
                                    </span>
                                  );
                                })}
                                {user.permissions.length > 3 && (
                                  <span className="inline-block text-[10.5px] font-bold px-1.5 py-0.5 rounded-md bg-slate-200 text-slate-700">
                                    +{user.permissions.length - 3} lainnya
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">Tidak ada akses modul</span>
                            )}
                          </div>
                        </td>

                        {/* Perangkat & Login Terakhir */}
                        <td className="py-4 px-4">
                          <div className="flex items-start gap-2">
                            <div className="mt-0.5">{getDeviceIcon(user.last_device_type)}</div>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[12px] font-bold text-slate-800">
                                  {user.last_device || 'Belum ada data'}
                                </span>
                                {user.is_online && (
                                  <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                                    Aktif
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span>{user.last_login || '-'}</span>
                                {user.last_ip && user.last_ip !== '-' && (
                                  <>
                                    <span>•</span>
                                    <span className="font-mono text-[10.5px]">{user.last_ip}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleUserStatus(user)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors active:scale-95 ${
                              user.status === 'Aktif'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                            }`}
                            title="Klik untuk mengubah status aktif/nonaktif"
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                user.status === 'Aktif' ? 'bg-emerald-500' : 'bg-rose-500'
                              }`}
                            />
                            <span>{user.status}</span>
                          </button>
                        </td>

                        {/* Aksi */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                const isHashed = user.password?.startsWith('h256:');
                                setEditingUser({ ...user, password: isHashed ? '' : (user.password || '') });
                                setShowEditPassword(true);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-[11.5px] transition-colors border border-blue-200 flex items-center gap-1 active:scale-[0.98]"
                            >
                              <Sliders className="w-3.5 h-3.5" />
                              <span>Atur Akses &amp; Sandi</span>
                            </button>

                            {user.role !== 'admin' && (
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(user)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                title="Hapus Akun Pengguna"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile View: Touch-Friendly Responsive Cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  Tidak ada pengguna yang cocok dengan kriteria pencarian.
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div key={user.id} className="p-4 space-y-3 hover:bg-slate-50/80 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative shrink-0">
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-900 font-bold flex items-center justify-center border border-blue-200 text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                              user.is_online ? 'bg-emerald-500 ring-2 ring-emerald-200' : 'bg-slate-300'
                            }`}
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-slate-900 text-sm truncate">{user.name}</h4>
                          </div>
                          <p className="text-xs font-mono text-slate-500 truncate">{user.email}</p>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {getRoleBadge(user.role)}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      {/* Password Quick Pill */}
                      <div className="flex items-center gap-1.5 font-mono text-[11px]">
                        <span className="text-slate-400 font-sans">Sandi:</span>
                        <span className="font-bold text-slate-800">
                          {visiblePasswords[user.id]
                            ? user.password && !user.password.startsWith('h256:')
                              ? user.password
                              : '•••••••• (Terenkripsi)'
                            : '••••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(user.id)}
                          className="text-slate-400 hover:text-blue-700 p-0.5"
                          title="Tampilkan / Sembunyikan"
                        >
                          {visiblePasswords[user.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingUser({ ...user, password: '' });
                            setShowEditPassword(true);
                          }}
                          className="text-blue-700 hover:text-blue-900 p-0.5 font-sans font-bold text-[10.5px] underline ml-1"
                        >
                          Ganti
                        </button>
                        <button
                          type="button"
                          onClick={() => copyCredentials(user)}
                          className="text-slate-400 hover:text-blue-700 p-0.5 ml-0.5"
                          title="Salin Kredensial"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Status Toggle */}
                      <button
                        type="button"
                        onClick={() => handleToggleUserStatus(user)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                          user.status === 'Aktif'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            user.status === 'Aktif' ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        />
                        <span>{user.status}</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <span className="text-[11px] text-slate-400">
                        {user.permissions.length} Modul Diizinkan
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            const isHashed = user.password?.startsWith('h256:');
                            setEditingUser({ ...user, password: isHashed ? '' : (user.password || '') });
                            setShowEditPassword(true);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs transition-colors border border-blue-200 flex items-center gap-1"
                        >
                          <Sliders className="w-3 h-3" />
                          <span>Atur Akses</span>
                        </button>

                        {user.role !== 'admin' && (
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(user)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Hapus Akun Pengguna"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: RIWAYAT SESI & PERANGKAT LOGIN (SIAPA AJA YANG LOGIN & DEVICE)
      ========================================================================= */}
      {activeSubTab === 'sessions' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900 leading-relaxed">
              <span className="font-bold block text-sm mb-0.5">Audit Keamanan Perangkat Login</span>
              Daftar di bawah mencatat setiap sesi login ke Portal Madrasah, lengkap dengan nama pengguna, email, sistem operasi/perangkat yang digunakan, dan alamat IP. Administrator dapat memutuskan sesi login perangkat yang mencurigakan sewaktu-waktu.
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#1e3a8a] text-white uppercase text-[11px] tracking-wider font-bold">
                  <tr>
                    <th className="py-3.5 px-6">Waktu Login</th>
                    <th className="py-3.5 px-4">Pengguna &amp; Email</th>
                    <th className="py-3.5 px-4">Peran</th>
                    <th className="py-3.5 px-4">Perangkat &amp; OS</th>
                    <th className="py-3.5 px-4">Peramban (Browser)</th>
                    <th className="py-3.5 px-4">Alamat IP</th>
                    <th className="py-3.5 px-4 text-center">Status Sesi</th>
                    <th className="py-3.5 px-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sessions.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        Belum ada riwayat sesi login yang tercatat.
                      </td>
                    </tr>
                  ) : (
                    sessions.map((sess) => {
                      const isActive = sess.status === 'active';
                      return (
                        <tr key={sess.id} className="hover:bg-slate-50/80 transition-colors">
                          {/* Waktu Login */}
                          <td className="py-4 px-6 font-mono text-[11.5px] text-slate-600">
                            {new Date(sess.login_time).toLocaleString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>

                          {/* Pengguna & Email */}
                          <td className="py-4 px-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900 text-sm">
                                {sess.user_name}
                              </span>
                              <span className="text-slate-500 text-xs font-mono">{sess.email}</span>
                            </div>
                          </td>

                          {/* Peran */}
                          <td className="py-4 px-4">{getRoleBadge(sess.role)}</td>

                          {/* Perangkat & OS */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              {getDeviceIcon(sess.device_type)}
                              <span className="font-semibold text-slate-800">{sess.os}</span>
                            </div>
                          </td>

                          {/* Browser */}
                          <td className="py-4 px-4 text-slate-700 font-medium">{sess.browser}</td>

                          {/* Alamat IP */}
                          <td className="py-4 px-4 font-mono text-slate-600 text-[11.5px]">
                            {sess.ip_address}
                          </td>

                          {/* Status Sesi */}
                          <td className="py-4 px-4 text-center">
                            {isActive ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                Aktif Sekarang
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                                Sesi Berakhir
                              </span>
                            )}
                          </td>

                          {/* Aksi */}
                          <td className="py-4 px-6 text-right">
                            {isActive ? (
                              <button
                                type="button"
                                onClick={() => handleRevokeSession(sess.id, sess.user_name)}
                                className="px-2.5 py-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[11px] transition-colors flex items-center gap-1 ml-auto active:scale-95"
                                title="Putuskan sesi login pada perangkat ini"
                              >
                                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                                <span>Putuskan Sesi</span>
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: AKTIVASI AKUN PENGGUNA (PENDING ACTIVATIONS & CREDENTIALS)
      ========================================================================= */}
      {activeSubTab === 'activation' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <Key className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <span className="font-bold block text-sm mb-0.5">Otorisasi &amp; Aktivasi Kredensial Pengguna</span>
              Halaman ini menampilkan akun-akun yang baru didaftarkan, akun yang dinonaktifkan sementara, atau permohonan akses baru dari dewan guru dan tenaga kependidikan.
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Daftar Akun Membutuhkan Aktivasi</h3>
                <p className="text-xs text-slate-500">Klik tombol Aktifkan untuk segera membuka akses login pengguna ke Portal Madrasah.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#1e3a8a] text-white uppercase text-[11px] tracking-wider font-bold">
                  <tr>
                    <th className="py-3.5 px-6">Nama Pengguna &amp; Email</th>
                    <th className="py-3.5 px-4">Peran Dimohon</th>
                    <th className="py-3.5 px-4">Kata Sandi (Password)</th>
                    <th className="py-3.5 px-4">Tanggal Pendaftaran</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-6 text-right">Aksi Otorisasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.filter((u) => u.status === 'Nonaktif').length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                        <span className="font-semibold block text-slate-700 text-sm">Semua Akun Sudah Aktif</span>
                        <span className="text-xs text-slate-400">Tidak ada akun yang sedang menunggu aktivasi saat ini.</span>
                      </td>
                    </tr>
                  ) : (
                    users
                      .filter((u) => u.status === 'Nonaktif')
                      .map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900 text-sm">{user.name}</span>
                              <span className="text-slate-500 text-xs font-mono">{user.email}</span>
                              {user.nip_nisn && user.nip_nisn !== '-' && (
                                <span className="text-[11px] text-slate-600 mt-0.5">
                                  ID: <span className="font-mono font-medium">{user.nip_nisn}</span>
                                  {user.note && user.note !== '-' ? ` • ${user.note}` : ''}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">{getRoleBadge(user.role)}</td>
                          {/* Kata Sandi (Password) */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1.5">
                              <div className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11.5px] text-slate-900 flex items-center gap-2 min-w-[110px] justify-between shadow-2xs">
                                <span className="font-bold">
                                  {visiblePasswords[user.id]
                                    ? user.password ||
                                      (user.role === 'admin'
                                        ? 'admin123'
                                        : user.role === 'siswa'
                                        ? 'siswa2026'
                                        : 'guru2026')
                                    : '••••••••'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => togglePasswordVisibility(user.id)}
                                  className="text-slate-400 hover:text-blue-700 transition-colors p-0.5"
                                  title={
                                    visiblePasswords[user.id]
                                      ? 'Sembunyikan Kata Sandi'
                                      : 'Tampilkan Kata Sandi'
                                  }
                                >
                                  {visiblePasswords[user.id] ? (
                                    <EyeOff className="w-3.5 h-3.5" />
                                  ) : (
                                    <Eye className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => copyCredentials(user)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-700 hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-200"
                                title="Salin Kredensial Lengkap (Email & Password)"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-slate-500 text-[11.5px] font-mono">
                            {user.created_at
                              ? new Date(user.created_at).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })
                              : '-'}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              Nonaktif
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleToggleUserStatus(user)}
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs active:scale-[0.98] flex items-center gap-1.5"
                                title="Setujui dan Aktifkan Akun"
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>Aktifkan Sekarang</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const isHashed = user.password?.startsWith('h256:');
                                  setEditingUser({ ...user, password: isHashed ? '' : (user.password || '') });
                                  setShowEditPassword(true);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs transition-colors border border-blue-200 flex items-center gap-1 active:scale-[0.98]"
                                title="Ubah Peran, Hak Akses & Kata Sandi"
                              >
                                <Sliders className="w-3.5 h-3.5" />
                                <span>Atur Akses &amp; Sandi</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(user)}
                                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors border border-transparent hover:border-rose-200"
                                title="Tolak & Hapus Permohonan Akun"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ATUR HAK AKSES PENGGUNA (EDIT PERMISSIONS & ROLE)
      ========================================================================= */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-[#1e3a8a] text-white p-5 sm:p-6 shrink-0 relative flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400 block mb-1">
                  Pengaturan Otorisasi &amp; Hak Akses
                </span>
                <h3 className="text-xl font-bold tracking-tight">{editingUser.name}</h3>
                <p className="text-xs text-blue-200 font-mono mt-0.5">{editingUser.email}</p>
              </div>

              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
              {/* Role Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Peran Akun Utama
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'admin', label: 'Administrator', desc: 'Akses penuh seluruh sistem' },
                      { id: 'guru', label: 'Dewan Guru', desc: 'Akademik & publikasi warta' },
                      { id: 'siswa', label: 'Santri / Siswa', desc: 'Hanya baca jadwal & kalender' },
                    ] as const
                  ).map((r) => {
                    const isSelected = editingUser.role === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          setEditingUser({
                            ...editingUser,
                            role: r.id,
                            permissions: PRESETS[r.id] || editingUser.permissions,
                          });
                        }}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-bold ${isSelected ? 'text-blue-800' : 'text-slate-800'}`}>
                            {r.label}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                        </div>
                        <p className="text-[11px] text-slate-500">{r.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status Akun Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Status Akun Pengguna</span>
                  <span className="text-[11.5px] text-slate-500">
                    Jika dinonaktifkan, pengguna tidak dapat login ke Portal Madrasah.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditingUser({
                      ...editingUser,
                      status: editingUser.status === 'Aktif' ? 'Nonaktif' : 'Aktif',
                    })
                  }
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 ${
                    editingUser.status === 'Aktif'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-600 text-white'
                  }`}
                >
                  {editingUser.status}
                </button>
              </div>

              {/* Kata Sandi & Kredensial Login */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 to-slate-50 border border-blue-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-blue-700" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      Kata Sandi Login Pengguna
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    className="text-[11px] font-bold text-blue-700 hover:text-blue-900 bg-white border border-blue-200 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 active:scale-95 shadow-2xs"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Buat Sandi Acak</span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showEditPassword ? 'text' : 'password'}
                      value={editingUser.password ?? ''}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, password: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleQuickSavePassword();
                        }
                      }}
                      placeholder="Ketik kata sandi baru..."
                      className="w-full pl-3.5 pr-10 py-2.5 text-xs font-mono font-bold text-slate-900 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowEditPassword(!showEditPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 rounded-md"
                      title={showEditPassword ? 'Sembunyikan Kata Sandi' : 'Tampilkan Kata Sandi'}
                    >
                      {showEditPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleQuickSavePassword}
                      disabled={isSavingPass}
                      className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow-xs"
                      title="Simpan Kata Sandi Ini Sekarang"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isSavingPass ? 'Menyimpan...' : 'Simpan Sandi'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => copyCredentials(editingUser)}
                      className="px-3.5 py-2.5 rounded-xl border border-blue-200 bg-white hover:bg-blue-50 text-blue-700 text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 active:scale-95 shadow-2xs"
                      title="Salin Kredensial Lengkap (Email & Kata Sandi)"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin</span>
                    </button>
                  </div>
                </div>

                <p className="text-[11.5px] text-slate-600 leading-relaxed">
                  Ketik kata sandi baru atau klik <span className="font-semibold text-slate-800">Buat Sandi Acak</span>, lalu tekan tombol <span className="font-semibold text-blue-700">Simpan Sandi</span> agar perubahan langsung aktif dan tersimpan permanen.
                </p>
              </div>

              {/* Granular Permissions Checkboxes */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div>
                    <label className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      Hak Akses Modul Spesifik
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Tentukan modul mana saja yang dapat dibuka dan dikelola oleh akun ini.
                    </p>
                  </div>

                  {/* Preset quick buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setEditingUser({
                          ...editingUser,
                          permissions: AVAILABLE_MODULES.map((m) => m.id),
                        })
                      }
                      className="px-2 py-1 text-[10.5px] font-bold rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700"
                    >
                      Pilih Semua
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingUser({
                          ...editingUser,
                          permissions: [],
                        })
                      }
                      className="px-2 py-1 text-[10.5px] font-bold rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700"
                    >
                      Kosongkan
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                  {AVAILABLE_MODULES.map((mod) => {
                    const isChecked = editingUser.permissions?.includes(mod.id);
                    return (
                      <label
                        key={mod.id}
                        className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-blue-50/70 border-blue-200 text-blue-900'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const newPerms = e.target.checked
                              ? [...(editingUser.permissions || []), mod.id]
                              : (editingUser.permissions || []).filter((p) => p !== mod.id);
                            setEditingUser({ ...editingUser, permissions: newPerms });
                          }}
                          className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer shrink-0"
                        />
                        <span className="text-xs font-semibold leading-tight">{mod.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 shrink-0 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSavePermissions}
                className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-all shadow-sm active:scale-[0.98]"
              >
                Simpan Seluruh Perubahan (Akses &amp; Sandi)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: TAMBAH PENGGUNA BARU
      ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col">
            <div className="bg-[#1e3a8a] text-white p-5 sm:p-6 shrink-0 relative flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400 block mb-1">
                  Registrasi Akun Baru
                </span>
                <h3 className="text-xl font-bold tracking-tight">Tambah Pengguna Portal</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-5 sm:p-6 space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-800">
                  Nama Lengkap &amp; Gelar <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  placeholder="Contoh: Dra. Hj. Siti Rohmah, M.Pd"
                  className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-800">
                  Email Akun Resmi <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  placeholder="Contoh: guru@raudhatulhidayah.sch.id"
                  className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-800">Peran Utama</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => {
                      const r = e.target.value as 'admin' | 'guru' | 'siswa';
                      const defaultPass =
                        r === 'admin'
                          ? 'admin123'
                          : r === 'siswa'
                          ? 'siswa2026'
                          : 'guru2026';
                      setNewUserForm({
                        ...newUserForm,
                        role: r,
                        password: defaultPass,
                        permissions: PRESETS[r] || [],
                      });
                    }}
                    className="px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 bg-white"
                  >
                    <option value="admin">Administrator</option>
                    <option value="guru">Dewan Guru</option>
                    <option value="siswa">Santri / Siswa</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-800">Status Awal</label>
                  <select
                    value={newUserForm.status}
                    onChange={(e) =>
                      setNewUserForm({ ...newUserForm, status: e.target.value as any })
                    }
                    className="px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 bg-white"
                  >
                    <option value="Aktif">Aktif Langsung</option>
                    <option value="Nonaktif">Nonaktif (Tertunda)</option>
                  </select>
                </div>
              </div>

              {/* Input Kata Sandi Baru */}
              <div className="flex flex-col gap-1.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-blue-700" />
                    <span>Kata Sandi Akun</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
                      let rand = '';
                      for (let i = 0; i < 5; i++) {
                        rand += chars.charAt(Math.floor(Math.random() * chars.length));
                      }
                      const prefix =
                        newUserForm.role === 'siswa'
                          ? 'santri'
                          : newUserForm.role === 'admin'
                          ? 'adm'
                          : 'guru';
                      setNewUserForm({ ...newUserForm, password: `${prefix}#${rand}` });
                      setShowNewUserPassword(true);
                    }}
                    className="text-[11px] font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 active:scale-95 bg-white border border-blue-200 px-2 py-0.5 rounded-md shadow-2xs"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Buat Sandi Acak</span>
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showNewUserPassword ? 'text' : 'password'}
                    required
                    value={newUserForm.password}
                    onChange={(e) =>
                      setNewUserForm({ ...newUserForm, password: e.target.value })
                    }
                    placeholder="Masukkan kata sandi akun..."
                    className="w-full pl-3 pr-10 py-2 text-xs font-mono font-bold rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewUserPassword(!showNewUserPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                    title={
                      showNewUserPassword
                        ? 'Sembunyikan Kata Sandi'
                        : 'Tampilkan Kata Sandi'
                    }
                  >
                    {showNewUserPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 leading-tight">
                  Kata sandi ini dapat langsung Anda salin dan dibagikan ke guru atau siswa melalui WhatsApp.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-all shadow-sm active:scale-[0.98]"
                >
                  Tambahkan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
