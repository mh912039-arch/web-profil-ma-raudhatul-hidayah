'use client';

import React, { useState } from 'react';
import { Users, Shield, Key, Search, CheckCircle2, UserPlus, Filter } from 'lucide-react';

interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'Superadmin (TU)' | 'Kepala Madrasah' | 'Dewan Guru' | 'Staf Kurikulum';
  status: 'Aktif' | 'Nonaktif';
  last_login: string;
}

const mockUsers: UserAccount[] = [
  {
    id: 'usr-1',
    name: 'A. Khutbi. AR, S.Pd',
    email: 'kepala@smpnraudhatulhidayah.sch.id',
    role: 'Kepala Madrasah',
    status: 'Aktif',
    last_login: 'Hari ini, 08:32 WIB',
  },
  {
    id: 'usr-2',
    name: 'Dra. Hj. Siti Rohmah, M.Pd',
    email: 'admin.tu@smpnraudhatulhidayah.sch.id',
    role: 'Superadmin (TU)',
    status: 'Aktif',
    last_login: 'Hari ini, 09:14 WIB',
  },
  {
    id: 'usr-3',
    name: 'TAJUDIN, S.Pd.I',
    email: 'tajudin@smpnraudhatulhidayah.sch.id',
    role: 'Dewan Guru',
    status: 'Aktif',
    last_login: 'Kemarin, 14:10 WIB',
  },
  {
    id: 'usr-4',
    name: 'MADROSYID, S.Pd',
    email: 'madrosyid@smpnraudhatulhidayah.sch.id',
    role: 'Staf Kurikulum',
    status: 'Aktif',
    last_login: 'Hari ini, 07:45 WIB',
  },
  {
    id: 'usr-5',
    name: 'SITI KHAERUNNISA, S.Pd.I',
    email: 'siti.khaerunnisa@smpnraudhatulhidayah.sch.id',
    role: 'Dewan Guru',
    status: 'Aktif',
    last_login: '2 hari lalu',
  },
  {
    id: 'usr-6',
    name: 'SARNAH, S.Pd.I',
    email: 'sarnah@smpnraudhatulhidayah.sch.id',
    role: 'Dewan Guru',
    status: 'Aktif',
    last_login: '3 hari lalu',
  },
  {
    id: 'usr-7',
    name: 'AHMAD NURUL KAHFI, SE',
    email: 'ahmad.kahfi@smpnraudhatulhidayah.sch.id',
    role: 'Dewan Guru',
    status: 'Aktif',
    last_login: 'Kemarin, 16:20 WIB',
  },
  {
    id: 'usr-8',
    name: 'JAKARIA, S.Pd.I',
    email: 'jakaria@smpnraudhatulhidayah.sch.id',
    role: 'Dewan Guru',
    status: 'Aktif',
    last_login: 'Hari ini, 06:50 WIB',
  },
];

interface UsersTabProps {
  mode?: 'users' | 'activation';
}

export const UsersTab: React.FC<UsersTabProps> = ({ mode = 'users' }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = mockUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isActivation = mode === 'activation';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {isActivation ? 'Aktivasi Akun Pengguna' : 'Direktori Pengguna'}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {isActivation
              ? 'Otorisasi akses akun guru baru dan pembagian kredensial portal'
              : 'Akses akun terdaftar portal akademik resmi: dewan guru, operator TU, dan pimpinan madrasah.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold">
            {isActivation ? 'Status: 65 Akun Terverifikasi' : 'Total 65 Akun Terdaftar'}
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama, email, atau jabatan..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1e3a8a] text-white uppercase text-[11px] tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-6">NAMA PENGGUNA</th>
                <th className="py-3.5 px-4">PERAN & OTORISASI</th>
                <th className="py-3.5 px-4">STATUS</th>
                <th className="py-3.5 px-4">AKTIVITAS TERAKHIR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 text-sm">{user.name}</span>
                      <span className="text-slate-500 text-xs">{user.email}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-md ${
                        user.role === 'Superadmin (TU)'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : user.role === 'Kepala Madrasah'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-800 border border-slate-200'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1.5 text-blue-700 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-500">{user.last_login}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
