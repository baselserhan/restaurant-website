import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Award, Wine, Truck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function FeaturesSection() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Leaf,
      title: t('feature1Title'),
      description: t('feature1Desc'),
      accent: 'emerald',
    },
    {
      icon: Award,
      title: t('feature2Title'),
      description: t('feature2Desc'),
      accent: 'amber',
    },
    {
      icon: Wine,
      title: t('feature3Title'),
      description: t('feature3Desc'),
      accent: 'purple',
    },
    {
      icon: Truck,
      title: t('feature4Title'),
      description: t('feature4Desc'),
      accent: 'sky',
    },
  ];

  return (
    <section className="py-20 bg-slate-50/60 dark:bg-slate-900/40 border-y border-slate-200/60 dark:border-slate-800/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            {t('featuresTitle')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {t('featuresSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
