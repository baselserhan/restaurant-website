import React from 'react';
import { motion } from 'framer-motion';
import {
  PackageCheck,
  ChefHat,
  Bike,
  CheckCircle,
  Clock,
  ShoppingBag,
  MapPin,
  UtensilsCrossed,
  Receipt
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function OrderHistoryPage({ onOpenLogin }) {
  const { orders } = useOrders();
  const { currentUser, isAuthenticated, quickLogin } = useAuth();
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';

  // Filter orders for current logged in user (or show all customer orders if guest)
  const userOrders = orders.filter(o =>
    currentUser?.email
      ? o.customerEmail?.toLowerCase() === currentUser.email.toLowerCase()
      : true
  );

  const statusSteps = [
    { key: 'Pending', label: t('orderPlaced'), icon: Clock },
    { key: 'Preparing', label: t('orderPreparing'), icon: ChefHat },
    { key: 'Out for Delivery', label: t('orderOutForDelivery'), icon: Bike },
    { key: 'Delivered', label: t('orderDelivered'), icon: CheckCircle },
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'Pending':
        return 0;
      case 'Preparing':
        return 1;
      case 'Out for Delivery':
        return 2;
      case 'Delivered':
        return 3;
      case 'Cancelled':
        return -1;
      default:
        return 0;
    }
  };

  return (
    <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            {t('myOrdersTitle')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time live progress tracking and past dining receipts
          </p>
        </div>

        {!isAuthenticated && (
          <button
            onClick={() => quickLogin('customer')}
            className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow hover:bg-amber-400 transition self-start sm:self-auto"
          >
            Quick Sign In as Guest
          </button>
        )}
      </div>

      {userOrders.length === 0 ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-slate-700 dark:text-slate-300">
            {t('noOrdersYet')}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Explore our curated menu and place your first culinary order to track live preparation!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {userOrders.map((order) => {
            const currentStepIdx = getStepIndex(order.status);
            const isCancelled = order.status === 'Cancelled';

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-6"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                      <Receipt className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-mono text-base font-bold text-slate-900 dark:text-white">
                          #{order.id}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {order.orderType}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="text-start sm:text-end">
                    <span className="text-xs text-slate-400 block">{t('orderTotal')}</span>
                    <span className="font-serif text-xl font-bold text-amber-600 dark:text-amber-400">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Tracking Stepper Progress Bar */}
                {!isCancelled ? (
                  <div className="py-2">
                    <div className="grid grid-cols-4 gap-2 text-center relative">
                      {statusSteps.map((step, idx) => {
                        const Icon = step.icon;
                        const isComplete = idx <= currentStepIdx;
                        const isCurrent = idx === currentStepIdx;

                        return (
                          <div key={step.key} className="flex flex-col items-center relative">
                            {/* Step Circle */}
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                isComplete
                                  ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/30'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                              } ${isCurrent ? 'ring-4 ring-amber-500/30' : ''}`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>

                            {/* Label */}
                            <span
                              className={`mt-2 text-xs font-semibold ${
                                isComplete
                                  ? 'text-slate-900 dark:text-white'
                                  : 'text-slate-400'
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold text-center">
                    {t('orderCancelled')}
                  </div>
                )}

                {/* Items Ordered List */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    {t('itemsOrdered')}
                  </span>
                  <div className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
                    {order.items.map((item, idx) => {
                      const itemName = isArabic && item.nameAr ? item.nameAr : item.name;
                      return (
                        <div key={idx} className="py-2 flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={itemName}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-semibold text-slate-800 dark:text-slate-200">
                                {itemName}
                              </p>
                              <span className="text-slate-400 text-[11px]">
                                Qty: {item.quantity} × ${item.price.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          <span className="font-serif font-bold text-slate-900 dark:text-white">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Delivery / Table Info & Notes */}
                {(order.deliveryAddress || order.tableNumber || order.notes) && (
                  <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                    {order.deliveryAddress && (
                      <p className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-500" />
                        <span><strong>{t('deliveryAddress')}:</strong> {order.deliveryAddress}</span>
                      </p>
                    )}
                    {order.tableNumber && (
                      <p className="flex items-center gap-1.5">
                        <UtensilsCrossed className="w-3.5 h-3.5 text-amber-500" />
                        <span><strong>{t('tableNumber')}:</strong> {order.tableNumber}</span>
                      </p>
                    )}
                    {order.notes && (
                      <p className="italic">
                        <strong>Notes:</strong> "{order.notes}"
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
