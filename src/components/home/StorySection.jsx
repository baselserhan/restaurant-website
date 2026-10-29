import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

export default function StorySection() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-cream-50 dark:bg-[#0e1420] transition-colors relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Images Grid */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80"
                alt="Chef preparing signature meal"
                className="w-full h-64 sm:h-80 object-cover rounded-3xl shadow-xl"
              />
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80"
                alt="Restaurant interior"
                className="w-full h-64 sm:h-80 object-cover rounded-3xl shadow-xl mt-8"
              />
            </div>
            {/* Experience badge */}
            <div className="absolute -bottom-4 start-1/2 -translate-x-1/2 p-4 rounded-2xl bg-amber-500 text-slate-950 font-bold shadow-xl text-center min-w-[180px]">
              <span className="block font-serif text-3xl">8+</span>
              <span className="text-xs uppercase tracking-wider">Years of Culinary Passion</span>
            </div>
          </motion.div>

          {/* Text Content & Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 space-y-6 text-start"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              {t('about')}
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
              {t('storyHeading')}
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('storyParagraph1')}
            </p>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('storyParagraph2')}
            </p>

            {/* Stats Counter Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400 block">
                  {t('storyStat1')}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {t('storyStat1Label')}
                </span>
              </div>

              <div>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400 block">
                  {t('storyStat2')}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {t('storyStat2Label')}
                </span>
              </div>

              <div>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400 block">
                  {t('storyStat3')}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {t('storyStat3Label')}
                </span>
              </div>

              <div>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400 block">
                  {t('storyStat4')}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {t('storyStat4Label')}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
