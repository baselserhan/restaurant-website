import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { Clock, Flame, AlertTriangle, Plus, Minus, Check, Star } from 'lucide-react';

export default function DishDetailModal({ dish, isOpen, onClose }) {
  const { addToCart } = useCart();
  const { t, language } = useLanguage();
  const { addToast } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [customNotes, setCustomNotes] = useState('');

  if (!dish) return null;

  const isArabic = language === 'ar';
  const displayName = isArabic && dish.nameAr ? dish.nameAr : dish.name;
  const displayDesc = isArabic && dish.descriptionAr ? dish.descriptionAr : dish.description;
  const displayIngredients = isArabic && dish.ingredientsAr ? dish.ingredientsAr : dish.ingredients;

  const handleAddToCart = () => {
    addToCart(dish, quantity, customNotes);
    addToast(`${quantity}x ${displayName} ${t('itemAddedToast')}`, 'success');
    setQuantity(1);
    setCustomNotes('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={displayName} maxWidth="max-w-2xl">
      <div className="space-y-6">
        {/* Dish Banner Image */}
        <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden shadow-inner">
          <img
            src={dish.image}
            alt={displayName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-5">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 bg-amber-500/90 text-slate-950 font-bold px-2.5 py-1 rounded-lg text-xs shadow">
                  <Star className="w-3.5 h-3.5 fill-slate-950" />
                  {dish.rating} ({dish.reviewsCount})
                </span>
                {dish.isChefSpecial && (
                  <span className="bg-purple-600/90 text-white font-semibold px-2.5 py-1 rounded-lg text-xs">
                    Chef Special
                  </span>
                )}
              </div>
              <span className="text-2xl font-bold font-serif text-white drop-shadow">
                ${dish.price.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {displayDesc}
        </p>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-amber-500 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">{t('prepTime')}</p>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{dish.prepTime}</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2.5">
            <Flame className="w-4 h-4 text-rose-500 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">{t('calories')}</p>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{dish.calories}</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2.5 col-span-2 sm:col-span-1">
            <Flame className="w-4 h-4 text-amber-500 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">{t('spicyLevel')}</p>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                {dish.spiceLevel === 0 ? 'Mild' : dish.spiceLevel === 1 ? 'Medium' : 'Hot 🔥'}
              </p>
            </div>
          </div>
        </div>

        {/* Dietary & Allergens */}
        <div className="space-y-3">
          {dish.dietary && dish.dietary.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                {t('dietaryFilters')}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {dish.dietary.map(tag => (
                  <span
                    key={tag}
                    className="capitalize px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {dish.allergens && dish.allergens.length > 0 && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>
                <strong>{t('allergens')}:</strong> {dish.allergens.join(', ')}
              </span>
            </div>
          )}

          {/* Ingredients list */}
          {displayIngredients && displayIngredients.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                {t('ingredients')}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {displayIngredients.map((ing, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Custom instructions note */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            {t('specialInstructions')}
          </label>
          <input
            type="text"
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            placeholder={t('notesPlaceholder')}
            className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-amber-500 dark:text-white"
          />
        </div>

        {/* Quantity and Add Button */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl">
            <button
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-bold text-sm min-w-[20px] text-center text-slate-800 dark:text-slate-100">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(prev => prev + 1)}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!dish.isAvailable}
            className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition ${
              dish.isAvailable
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/25'
                : 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            {dish.isAvailable ? (
              <>
                <Plus className="w-4 h-4" />
                <span>{t('addToCart')} - ${(dish.price * quantity).toFixed(2)}</span>
              </>
            ) : (
              <span>{t('soldOut')}</span>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
