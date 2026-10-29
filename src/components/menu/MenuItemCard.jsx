import React from 'react';
import { motion } from 'framer-motion';
import { Star, Plus, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';

export default function MenuItemCard({ dish, onOpenDetail }) {
  const { addToCart } = useCart();
  const { t, language } = useLanguage();
  const { addToast } = useToast();

  const isArabic = language === 'ar';
  const name = isArabic && dish.nameAr ? dish.nameAr : dish.name;
  const description = isArabic && dish.descriptionAr ? dish.descriptionAr : dish.description;

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    if (!dish.isAvailable) return;
    addToCart(dish, 1);
    addToast(`${name} ${t('itemAddedToast')}`, 'success');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      onClick={() => onOpenDetail(dish)}
      className="group relative flex flex-col bg-white dark:bg-slate-900/90 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 shadow-md hover:shadow-xl dark:shadow-slate-950/50 transition-all cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={dish.image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-xs font-bold text-slate-900 dark:text-amber-400 shadow-lg">
            <Eye className="w-3.5 h-3.5" />
            {t('viewDetails')}
          </span>
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 start-3 flex flex-col gap-1.5">
          {dish.isChefSpecial && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-600/90 text-white backdrop-blur-sm shadow">
              Chef Special
            </span>
          )}
          {!dish.isAvailable && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-600/90 text-white backdrop-blur-sm shadow">
              {t('soldOut')}
            </span>
          )}
        </div>

        {/* Rating Pill */}
        <div className="absolute top-3 end-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-amber-400 text-xs font-semibold">
          <Star className="w-3 h-3 fill-amber-400" />
          <span>{dish.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
              {name}
            </h3>
            <span className="font-serif text-lg font-bold text-amber-600 dark:text-amber-400 shrink-0">
              ${dish.price.toFixed(2)}
            </span>
          </div>

          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Footer info & CTA */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          {/* Dietary tags */}
          <div className="flex flex-wrap gap-1">
            {dish.dietary?.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 capitalize"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Add to Cart button */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleQuickAdd}
            disabled={!dish.isAvailable}
            title={dish.isAvailable ? t('addToCart') : t('soldOut')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
              dish.isAvailable
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-amber-500/20'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">{t('addToCart')}</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
