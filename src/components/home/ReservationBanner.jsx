import React from 'react';
import { CalendarCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function ReservationBanner({ onBookTable }) {
  const { t, isRtl } = useLanguage();

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 p-8 sm:p-12 lg:p-16">
        <div className="relative z-10 max-w-2xl space-y-4 text-start">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/15 text-slate-950 text-xs font-bold uppercase tracking-wider">
            <CalendarCheck className="w-4 h-4" />
            <span>Instant Confirmation</span>
          </span>

          <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
            Reserve Your Evening of Unrivaled Elegance
          </h3>

          <p className="text-sm sm:text-base font-medium text-slate-900/90 leading-relaxed">
            Whether for an intimate anniversary, celebratory gathering, or business dinner, our hospitality team ensures an unforgettable experience.
          </p>

          <div className="pt-2">
            <button
              onClick={onBookTable}
              className="px-8 py-4 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-sm shadow-xl flex items-center gap-2 transition transform hover:-translate-y-0.5"
            >
              <span>{t('bookTable')}</span>
              {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Decorative circle shapes in background */}
        <div className="absolute -bottom-16 -end-16 w-80 h-80 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute top-0 end-1/4 w-60 h-60 rounded-full bg-black/5 pointer-events-none" />
      </div>
    </section>
  );
}
