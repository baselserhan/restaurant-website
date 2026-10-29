import React, { useState } from 'react';
import { useMenu } from '../../context/MenuContext';
import { useLanguage } from '../../context/LanguageContext';
import MenuItemCard from '../menu/MenuItemCard';
import DishDetailModal from '../menu/DishDetailModal';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

export default function ChefSpecials({ onExploreMenu }) {
  const { menuItems } = useMenu();
  const { t, isRtl } = useLanguage();
  const [selectedDish, setSelectedDish] = useState(null);

  const specials = menuItems.filter(item => item.isChefSpecial).slice(0, 4);

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <Sparkles className="w-4 h-4" />
            <span>Curated Gastronomy</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            {t('chefSpecialsTitle')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
            {t('chefSpecialsSubtitle')}
          </p>
        </div>

        <button
          onClick={onExploreMenu}
          className="inline-flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-500 transition group self-start md:self-auto"
        >
          <span>{t('exploreMenu')}</span>
          {isRtl ? (
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          ) : (
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          )}
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {specials.map((dish) => (
          <MenuItemCard
            key={dish.id}
            dish={dish}
            onOpenDetail={setSelectedDish}
          />
        ))}
      </div>

      {/* Detail Modal */}
      <DishDetailModal
        dish={selectedDish}
        isOpen={!!selectedDish}
        onClose={() => setSelectedDish(null)}
      />
    </section>
  );
}
