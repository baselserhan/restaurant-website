import React from 'react';
import { motion } from 'framer-motion';
import { Award, ArrowRight, ArrowLeft, Star, Utensils, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function HeroSection({ onExploreMenu, onBookTable }) {
  const { t, isRtl } = useLanguage();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-16 lg:py-24">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -start-24 w-96 h-96 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -end-24 w-96 h-96 bg-emerald-500/10 dark:bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Text & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 space-y-6 text-start"
          >
            {/* Award badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider shadow-sm">
              <Award className="w-4 h-4 text-amber-500" />
              <span>{t('heroBadge')}</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.15] tracking-tight">
              {t('heroTitle')}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              {t('heroSubtitle')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onExploreMenu}
                className="px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/25 flex items-center gap-2 transition"
              >
                <span>{t('exploreMenu')}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onBookTable}
                className="px-8 py-4 rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-500 font-bold text-sm shadow-md transition"
              >
                {t('bookTable')}
              </motion.button>
            </div>

            {/* Social Proof Stats */}
            <div className="pt-6 flex items-center gap-6 border-t border-slate-200/80 dark:border-slate-800/80">
              <div className="flex -space-x-2 overflow-hidden">
                <img className="inline-block h-9 w-9 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="Customer" />
                <img className="inline-block h-9 w-9 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" alt="Customer" />
                <img className="inline-block h-9 w-9 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80" alt="Customer" />
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t('ratingText')}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Hero Visual Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Image Frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/60 dark:border-slate-800/80 aspect-4/5 group">
                <img
                  src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1000&q=80"
                  alt="Fine dining table ambiance"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Overlay Text */}
                <div className="absolute bottom-6 start-6 end-6 text-white space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Michelin Recommended</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold">
                    Signature Wagyu & Black Truffle
                  </h3>
                  <p className="text-xs text-slate-300">
                    Artisanal curation by Executive Chef Antoine Blanc
                  </p>
                </div>
              </div>

              {/* Floating Floating Badge Card 1 */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className={`absolute -bottom-6 ${
                  isRtl ? '-end-6' : '-start-6'
                } p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3.5`}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Fresh Farm to Table</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">100% Organic & Certified</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
