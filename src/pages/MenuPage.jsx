import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, RotateCcw, Utensils } from 'lucide-react';
import { useMenu } from '../context/MenuContext';
import { useLanguage } from '../context/LanguageContext';
import MenuItemCard from '../components/menu/MenuItemCard';
import DishDetailModal from '../components/menu/DishDetailModal';

export default function MenuPage() {
  const { menuItems } = useMenu();
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDietary, setSelectedDietary] = useState([]);
  const [sortBy, setSortBy] = useState('recommended');
  const [activeDish, setActiveDish] = useState(null);

  const categories = [
    { id: 'all', label: t('allCategories') },
    { id: 'starters', label: t('starters') },
    { id: 'mains', label: t('mains') },
    { id: 'seafood', label: t('seafood') },
    { id: 'pasta', label: t('pasta') },
    { id: 'desserts', label: t('desserts') },
    { id: 'beverages', label: t('beverages') },
  ];

  const dietaryOptions = [
    { id: 'vegetarian', label: t('filterVegetarian') },
    { id: 'vegan', label: t('filterVegan') },
    { id: 'gluten-free', label: t('filterGlutenFree') },
    { id: 'halal', label: t('filterHalal') },
  ];

  const toggleDietary = (id) => {
    setSelectedDietary(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedDietary([]);
    setSortBy('recommended');
  };

  // Filter and sort items
  const filteredDishes = useMemo(() => {
    return menuItems.filter((dish) => {
      // Category filter
      if (selectedCategory !== 'all' && dish.category !== selectedCategory) {
        return false;
      }

      // Dietary filter
      if (selectedDietary.length > 0) {
        const matchesAllDietary = selectedDietary.every(d =>
          dish.dietary?.includes(d)
        );
        if (!matchesAllDietary) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const nameMatch = dish.name.toLowerCase().includes(query) || (dish.nameAr && dish.nameAr.includes(query));
        const descMatch = dish.description.toLowerCase().includes(query) || (dish.descriptionAr && dish.descriptionAr.includes(query));
        const ingMatch = dish.ingredients?.some(i => i.toLowerCase().includes(query));
        if (!nameMatch && !descMatch && !ingMatch) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'priceLow') return a.price - b.price;
      if (sortBy === 'priceHigh') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // recommended
    });
  }, [menuItems, selectedCategory, selectedDietary, searchQuery, sortBy]);

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
          {t('tagline')}
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white">
          {t('menuHeading')}
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
          {t('menuSubheading')}
        </p>
      </div>

      {/* Search & Sort Controls Bar */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full px-4 py-2.5 ps-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:border-amber-500 dark:text-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5" />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
              {t('sortBy')}:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:border-amber-500 dark:text-white"
            >
              <option value="recommended">{t('sortRecommended')}</option>
              <option value="priceLow">{t('sortPriceLow')}</option>
              <option value="priceHigh">{t('sortPriceHigh')}</option>
              <option value="rating">{t('sortRating')}</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Dietary Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-400 me-2 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {t('dietaryFilters')}:
          </span>
          {dietaryOptions.map((opt) => {
            const isSelected = selectedDietary.includes(opt.id);
            return (
              <button
                key={opt.id}
                onClick={() => toggleDietary(opt.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                  isSelected
                    ? 'bg-emerald-500 text-white font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {opt.label}
              </button>
            );
          })}

          {(selectedCategory !== 'all' || selectedDietary.length > 0 || searchQuery) && (
            <button
              onClick={handleResetFilters}
              className="ms-auto flex items-center gap-1 text-xs font-semibold text-rose-500 hover:text-rose-600 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('resetFilters')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Dishes Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>Showing {filteredDishes.length} artisanal dishes</span>
      </div>

      {/* Menu Dishes Grid */}
      {filteredDishes.length === 0 ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Utensils className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-slate-700 dark:text-slate-300">
            {t('noDishesFound')}
          </h3>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow"
          >
            {t('resetFilters')}
          </button>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredDishes.map((dish) => (
              <MenuItemCard
                key={dish.id}
                dish={dish}
                onOpenDetail={setActiveDish}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Dish Details Modal */}
      <DishDetailModal
        dish={activeDish}
        isOpen={!!activeDish}
        onClose={() => setActiveDish(null)}
      />
    </div>
  );
}
