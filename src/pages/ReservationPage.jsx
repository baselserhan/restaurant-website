import React from 'react';
import ReservationForm from '../components/reservation/ReservationForm';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, Clock, Wine, ShieldCheck } from 'lucide-react';

export default function ReservationPage() {
  const { t } = useLanguage();

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Bespoke Hospitality</span>
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white">
          {t('reservationTitle')}
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
          {t('reservationSubtitle')}
        </p>
      </div>

      {/* Main Reservation Form */}
      <ReservationForm />

      {/* Hospitality Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
          <Clock className="w-6 h-6 text-amber-500 mx-auto" />
          <h4 className="font-serif font-bold text-slate-900 dark:text-white text-base">
            Punctual Seating Policy
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tables are reserved for 2 hours. We hold your reservation for up to 15 minutes past your requested time.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
          <Wine className="w-6 h-6 text-amber-500 mx-auto" />
          <h4 className="font-serif font-bold text-slate-900 dark:text-white text-base">
            Complimentary Welcome Aperitif
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Every booked guest receives our signature botanical herbal elixir upon being seated.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
          <ShieldCheck className="w-6 h-6 text-amber-500 mx-auto" />
          <h4 className="font-serif font-bold text-slate-900 dark:text-white text-base">
            No Cancellation Penalties
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Plans change? You can modify or cancel your booking easily without cancellation fees up to 2 hours prior.
          </p>
        </div>
      </div>
    </div>
  );
}
