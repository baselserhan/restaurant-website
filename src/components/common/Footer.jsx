import React, { useState } from 'react';
import { Utensils, MapPin, Phone, Mail, Clock, Send, Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';

export default function Footer({ onNavigate }) {
  const { t, isRtl } = useLanguage();
  const { addToast } = useToast();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newsletterEmail.trim()) {
      setEmailError(t('valRequired'));
      return;
    }
    if (!emailRegex.test(newsletterEmail.trim())) {
      setEmailError(t('valEmailInvalid'));
      return;
    }
    setEmailError('');
    addToast(t('subscribedMsg'), 'success');
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/40">
                <Utensils className="w-5 h-5 text-amber-400" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                {t('brandName')}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t('footerDesc')}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Michelin Guide 2026
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                100% Organic
              </span>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              {t('hoursTitle')}
            </h4>
            <div className="space-y-2 text-sm text-slate-400">
              <p className="font-medium text-slate-200">{t('weekdayHours')}</p>
              <p className="font-medium text-slate-200">{t('weekendHours')}</p>
              <p className="text-xs text-amber-400/90 pt-2">
                * Kitchen closes 45 minutes before closing time.
              </p>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              {t('contactUs')}
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{t('locationAddress')}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span dir="ltr">+1 (555) 839-4020</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>concierge@savoria-bistro.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-white">
              {t('newsletterTitle')}
            </h4>
            <p className="text-sm text-slate-400">
              {t('newsletterDesc')}
            </p>
            <form onSubmit={handleSubscribe} className="space-y-1.5">
              <div className="relative">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => {
                    setNewsletterEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  placeholder={t('newsletterPlaceholder')}
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-800 border text-white placeholder-slate-500 text-sm focus:outline-none pr-10 transition ${
                    emailError ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700 focus:border-amber-500'
                  }`}
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className={`absolute top-1/2 -translate-y-1/2 p-2 text-amber-400 hover:text-amber-300 transition ${
                    isRtl ? 'left-1' : 'right-1'
                  }`}
                >
                  <Send className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
              </div>
              {emailError && (
                <p className="text-rose-400 text-[11px] mt-1">
                  {emailError}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 {t('brandName')}. {t('allRightsReserved')}</p>
          <p className="flex items-center gap-1">
            Handcrafted with culinary passion & React 18
          </p>
        </div>
      </div>
    </footer>
  );
}
