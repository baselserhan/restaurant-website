import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  ArrowLeft,
  Truck,
  UtensilsCrossed,
  ShoppingBag as BagIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';

export default function CartDrawer({ onProceedToCheckout }) {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    orderType,
    setOrderType,
    subtotal,
    discountAmount,
    taxAmount,
    deliveryFee,
    totalAmount,
    totalItemCount,
  } = useCart();

  const { t, isRtl, language } = useLanguage();
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState(null);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;

    const res = applyCoupon(couponCodeInput);
    if (res.success) {
      setCouponFeedback({ type: 'success', text: t('couponApplied') });
      setCouponCodeInput('');
    } else {
      setCouponFeedback({
        type: 'error',
        text: res.message === 'invalidCoupon' ? t('invalidCoupon') : res.message,
      });
    }
  };

  const isArabic = language === 'ar';

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Slide-over Panel */}
          <div className={`fixed inset-y-0 ${isRtl ? 'left-0' : 'right-0'} max-w-full flex`}>
            <motion.div
              initial={{ x: isRtl ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-screen max-w-md bg-white dark:bg-slate-900 border-s border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
                      {t('cartTitle')}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {totalItemCount} {t('itemsOrdered')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {cartItems.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-500 transition text-xs"
                      title="Clear Cart"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={closeCart}
                    className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Order Mode Switcher */}
              <div className="px-5 pt-3">
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/70 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setOrderType('delivery')}
                    className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                      orderType === 'delivery'
                        ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>{t('delivery')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderType('dineIn')}
                    className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                      orderType === 'dineIn'
                        ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <UtensilsCrossed className="w-3.5 h-3.5" />
                    <span>{t('dineIn')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderType('takeaway')}
                    className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                      orderType === 'takeaway'
                        ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <BagIcon className="w-3.5 h-3.5" />
                    <span>{t('takeaway')}</span>
                  </button>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-serif text-lg font-bold text-slate-800 dark:text-slate-200">
                        {t('emptyCartTitle')}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                        {t('emptyCartDesc')}
                      </p>
                    </div>
                  </div>
                ) : (
                  cartItems.map((item) => {
                    const itemName = isArabic && item.nameAr ? item.nameAr : item.name;
                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800"
                      >
                        <img
                          src={item.image}
                          alt={itemName}
                          className="w-16 h-16 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                              {itemName}
                            </h4>
                            <span className="font-serif text-xs font-bold text-amber-600 dark:text-amber-400 shrink-0">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>

                          {item.notes && (
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 italic truncate">
                              "{item.notes}"
                            </p>
                          )}

                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 min-w-[14px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-slate-400 hover:text-rose-500 transition p-1"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {/* Bottom Summary & Actions */}
              {cartItems.length > 0 && (
                <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-4">
                  {/* Coupon Code Input */}
                  <div>
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>
                            {appliedCoupon.code} (-{appliedCoupon.discountPercent}%)
                          </span>
                        </div>
                        <button
                          onClick={removeCoupon}
                          className="text-slate-400 hover:text-rose-500 text-[11px] font-bold"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <input
                              type="text"
                              value={couponCodeInput}
                              onChange={(e) => setCouponCodeInput(e.target.value)}
                              placeholder={t('promoCode')}
                              className="w-full px-3 py-2 ps-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs uppercase font-medium focus:outline-none focus:border-amber-500 dark:text-white"
                            />
                            <Tag className="w-3.5 h-3.5 text-slate-400 absolute top-1/2 -translate-y-1/2 start-2.5" />
                          </div>
                          <button
                            type="submit"
                            className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 text-white font-semibold text-xs hover:bg-slate-800 transition"
                          >
                            {t('applyCoupon')}
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-400">
                          {t('couponHint')}
                        </p>
                        {couponFeedback && (
                          <div
                            className={`flex items-center gap-1.5 text-[11px] ${
                              couponFeedback.type === 'success'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-rose-500'
                            }`}
                          >
                            {couponFeedback.type === 'success' ? (
                              <CheckCircle2 className="w-3 h-3" />
                            ) : (
                              <AlertCircle className="w-3 h-3" />
                            )}
                            <span>{couponFeedback.text}</span>
                          </div>
                        )}
                      </form>
                    )}
                  </div>

                  {/* Calculations */}
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between">
                      <span>{t('subtotal')}</span>
                      <span className="font-semibold">${subtotal.toFixed(2)}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                        <span>{t('discount')}</span>
                        <span className="font-semibold">-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>{t('tax')}</span>
                      <span>${taxAmount.toFixed(2)}</span>
                    </div>

                    {orderType === 'delivery' && (
                      <div className="flex justify-between">
                        <span>{t('deliveryFee')}</span>
                        <span>
                          {deliveryFee === 0 ? (
                            <span className="text-emerald-500 font-semibold">{t('freeDelivery')}</span>
                          ) : (
                            `$${deliveryFee.toFixed(2)}`
                          )}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                      <span>{t('orderTotal')}</span>
                      <span className="font-serif text-base text-amber-600 dark:text-amber-400">
                        ${totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={onProceedToCheckout}
                    className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition"
                  >
                    <span>{t('proceedCheckout')}</span>
                    {isRtl ? (
                      <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                    ) : (
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
