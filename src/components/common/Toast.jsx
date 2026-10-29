import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();
  const { isRtl } = useLanguage();

  return (
    <div
      className={`fixed top-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 ${
        isRtl ? 'left-4' : 'right-4'
      }`}
    >
      <AnimatePresence>
        {toasts.map(toast => {
          const isError = toast.type === 'error';
          const isInfo = toast.type === 'info';
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl shadow-xl backdrop-blur-md border ${
                isError
                  ? 'bg-rose-500/95 text-white border-rose-400/50'
                  : isInfo
                  ? 'bg-sky-600/95 text-white border-sky-400/50'
                  : 'bg-slate-900/95 text-slate-100 border-amber-500/40 dark:bg-slate-800/95'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {isError ? (
                  <AlertCircle className="w-5 h-5 text-rose-200 shrink-0" />
                ) : isInfo ? (
                  <Info className="w-5 h-5 text-sky-200 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                )}
                <p className="text-sm font-medium">{toast.message}</p>
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
