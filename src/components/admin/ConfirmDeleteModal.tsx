'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, AlertTriangle, X, Loader2 } from 'lucide-react';

export interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: string;
  itemName?: string;
  itemType?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi Penghapusan',
  description = 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.',
  itemName,
  itemType = 'Data',
  confirmLabel = 'Ya, Hapus Data',
  cancelLabel = 'Batal',
  isLoading = false,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop Blur Gelap */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => !isLoading && onClose()}
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs"
          />

          {/* Modal / Bottom Sheet Card */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl border-t sm:border border-slate-200/90 shadow-2xl p-5 sm:p-6 z-10 flex flex-col gap-4 text-slate-800 max-h-[90vh] overflow-y-auto"
          >
            {/* Handle bar khusus tampilan mobile */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto sm:hidden shrink-0 -mt-1 mb-1" />

            {/* Header: Icon & Close */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                    {title}
                  </h3>
                  {itemType && (
                    <span className="text-[11px] font-semibold text-rose-600 uppercase tracking-wider">
                      {itemType}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                disabled={isLoading}
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content: Description & Item Preview Box */}
            <div className="space-y-3">
              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                {description}
              </p>

              {itemName && (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wide block">
                      Target yang akan dihapus:
                    </span>
                    <p className="text-xs font-bold text-slate-900 break-words mt-0.5 line-clamp-2">
                      {itemName}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer: Action Buttons */}
            <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                disabled={isLoading}
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors active:scale-98 cursor-pointer text-center"
              >
                {cancelLabel}
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={onConfirm}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all active:scale-98 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 text-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{confirmLabel}</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
