import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { initialTestimonials } from '../../data/mockData';
import { useLanguage } from '../../context/LanguageContext';

export default function Testimonials() {
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
          {t('testimonialsTitle')}
        </h2>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
          {t('testimonialsSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {initialTestimonials.map((item, index) => {
          const name = isArabic && item.nameAr ? item.nameAr : item.name;
          const role = isArabic && item.roleAr ? item.roleAr : item.role;
          const reviewText = isArabic && item.textAr ? item.textAr : item.text;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -6 }}
              className="relative p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <Quote className="w-10 h-10 text-amber-500/20 mb-4" />

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic mb-6">
                "{reviewText}"
              </p>

              <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <img
                  src={item.avatar}
                  alt={name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-500/40"
                />
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                    ))}
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {name}
                  </h4>
                  <p className="text-xs text-slate-400">{role}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
