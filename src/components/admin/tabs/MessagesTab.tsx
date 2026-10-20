'use client';

import React, { useState } from 'react';
import {
  Mail,
  Search,
  CheckCircle2,
  Trash2,
  Phone,
  Calendar,
  X,
  MessageSquare,
  ExternalLink,
} from 'lucide-react';

export interface ContactMessage {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  subject?: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  created_at: string;
}

interface MessagesTabProps {
  messages: ContactMessage[];
  onMarkRead: (id: string) => Promise<void>;
  onDeleteMessage: (id: string) => Promise<void>;
  isSaving: boolean;
}

export const MessagesTab: React.FC<MessagesTabProps> = ({
  messages,
  onMarkRead,
  onDeleteMessage,
  isSaving,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const filteredMessages = messages.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.email && m.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.phone && m.phone.includes(searchQuery)) ||
      m.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === 'all'
        ? true
        : filterStatus === 'unread'
        ? m.status === 'unread'
        : m.status !== 'unread';
    return matchesSearch && matchesStatus;
  });

  const handleOpenDetail = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (msg.status === 'unread') {
      onMarkRead(msg.id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-[18px] font-bold text-slate-900">
            Pesan Masuk (Buku Tamu)
          </h3>
          <p className="text-[13px] text-slate-500">
            Daftar pertanyaan dan aspirasi publik dari formulir kontak website
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl text-[12.5px] font-semibold transition-all ${
              filterStatus === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Semua ({messages.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('unread')}
            className={`px-3 py-1.5 rounded-xl text-[12.5px] font-semibold transition-all ${
              filterStatus === 'unread'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Belum Dibaca ({messages.filter((m) => m.status === 'unread').length})
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari pesan berdasarkan nama pengirim, nomor HP/WA, atau isi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {filteredMessages.length === 0 ? (
          <div className="text-center py-14 px-4 space-y-2">
            <Mail className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-serif text-[16px] font-bold text-slate-700">
              Tidak Ada Pesan Masuk
            </h4>
            <p className="text-[13px] text-slate-500 max-w-sm mx-auto">
              Setiap pesan yang dikirimkan oleh pengunjung melalui formulir halaman Kontak akan langsung tersimpan di Supabase dan tampil di sini.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => handleOpenDetail(msg)}
                className={`p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/80 transition-colors ${
                  msg.status === 'unread' ? 'bg-blue-50/40' : 'bg-white'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      msg.status === 'unread'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                  </div>

                  <div className="flex flex-col min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[14px] text-slate-900 truncate">
                        {msg.name}
                      </span>
                      {msg.status === 'unread' && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                      )}
                    </div>
                    <span className="text-[12.5px] font-medium text-slate-600 line-clamp-1">
                      {msg.subject || 'Pertanyaan Umum'}
                    </span>
                    <p className="text-[13px] text-slate-500 line-clamp-1">
                      {msg.message}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="text-[11px] font-mono text-slate-400">
                    {msg.created_at ? new Date(msg.created_at).toLocaleDateString('id-ID') : 'Hari ini'}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Hapus pesan dari ${msg.name}?`)) {
                        onDeleteMessage(msg.id);
                      }
                    }}
                    className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Hapus pesan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Message Dialog */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11.5px] font-bold uppercase tracking-wider text-blue-700">
                  Detail Pesan Masuk
                </span>
                <h4 className="font-serif text-[18px] font-bold text-slate-900">
                  {selectedMessage.name}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-[13.5px]">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between text-[12px] text-slate-500">
                  <span>Kontak Pengirim:</span>
                  <span className="font-mono">
                    {selectedMessage.created_at
                      ? new Date(selectedMessage.created_at).toLocaleString('id-ID')
                      : 'Baru saja'}
                  </span>
                </div>
                <div className="font-bold text-slate-900">
                  {selectedMessage.phone || selectedMessage.email || 'Tanpa Kontak'}
                </div>
              </div>

              <div>
                <span className="text-[12px] font-bold text-slate-500 uppercase block mb-1">
                  Subjek Pertanyaan
                </span>
                <div className="font-semibold text-slate-900">
                  {selectedMessage.subject || 'Pertanyaan Umum'}
                </div>
              </div>

              <div>
                <span className="text-[12px] font-bold text-slate-500 uppercase block mb-1">
                  Isi Pesan
                </span>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            {/* Direct Reply Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-[13px]"
              >
                Tutup
              </button>

              <div className="flex items-center gap-2">
                {selectedMessage.phone && (
                  <a
                    href={`https://wa.me/${selectedMessage.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[13px] shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Balas via WhatsApp</span>
                  </a>
                )}
                {selectedMessage.email && (
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[13px] shadow-xs"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Kirim Email</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
