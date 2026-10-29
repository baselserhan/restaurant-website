import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  ShieldCheck,
  DollarSign,
  ShoppingBag,
  CalendarCheck,
  Utensils,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Bike,
  XCircle,
  AlertTriangle,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Eye,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useReservations } from '../context/ReservationContext';
import { useMenu } from '../context/MenuContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import Modal from '../components/common/Modal';
import dish1 from '../assets/dishes/dish-1.jpg';

export default function AdminDashboardPage({ onOpenLogin }) {
  const { currentUser, isAdmin, quickLogin } = useAuth();
  const { orders, updateOrderStatus } = useOrders();
  const { reservations, updateReservationStatus } = useReservations();
  const { menuItems, addMenuItem, toggleAvailability, deleteMenuItem, resetToDefaultMenu } = useMenu();
  const { t, language } = useLanguage();
  const { addToast } = useToast();

  const isArabic = language === 'ar';
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'reservations' | 'menu'
  const [orderFilter, setOrderFilter] = useState('all');

  // Add Item Modal State
  const [isAddDishOpen, setIsAddDishOpen] = useState(false);
  const [newDishName, setNewDishName] = useState('');
  const [newDishNameAr, setNewDishNameAr] = useState('');
  const [newDishCategory, setNewDishCategory] = useState('mains');
  const [newDishPrice, setNewDishPrice] = useState('28.00');
  const [newDishImage, setNewDishImage] = useState(dish1);
  const [newDishDesc, setNewDishDesc] = useState('');
  const [newDishDescAr, setNewDishDescAr] = useState('');
  const [newDishDietary, setNewDishDietary] = useState('halal');
  const [dishErrors, setDishErrors] = useState({});
  const [dishTouched, setDishTouched] = useState({});

  const validateDishField = (field, val) => {
    let err = '';
    if (field === 'name') {
      if (!val || !val.trim()) err = t('valDishNameRequired');
    }
    if (field === 'price') {
      const parsed = parseFloat(val);
      if (isNaN(parsed) || parsed <= 0) err = t('valPriceInvalid');
    }
    if (field === 'image') {
      if (!val || !val.trim()) {
        err = t('valRequired');
      } else if (!val.startsWith('http://') && !val.startsWith('https://') && !val.startsWith('/') && !val.startsWith('data:') && !val.includes('assets/')) {
        err = t('valImageInvalid');
      }
    }
    return err;
  };

  const handleDishBlur = (field, val) => {
    setDishTouched(prev => ({ ...prev, [field]: true }));
    const err = validateDishField(field, val);
    setDishErrors(prev => ({ ...prev, [field]: err }));
  };

  const handleDishChange = (field, val, setter) => {
    setter(val);
    if (dishTouched[field]) {
      const err = validateDishField(field, val);
      setDishErrors(prev => ({ ...prev, [field]: err }));
    }
  };

  // Authorization Guard View
  if (!isAdmin) {
    return (
      <div className="py-20 max-w-xl mx-auto px-4 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-rose-500/10 dark:bg-rose-500/20 border-2 border-rose-500/30 flex items-center justify-center text-rose-500">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-3xl font-bold text-slate-900 dark:text-white">
            Administrator Access Required
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            This management portal is reserved for Savoria Bistro executive staff and kitchen managers.
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-3">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            For rapid evaluation, use the one-click demo login below:
          </p>
          <button
            onClick={() => quickLogin('admin')}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Sign in as Admin (Chef Antoine Blanc)</span>
          </button>
        </div>
      </div>
    );
  }

  // Analytics Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.total : 0), 0);
  const activeOrdersCount = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const todayReservationsCount = reservations.length;
  const totalDishesCount = menuItems.length;

  const filteredOrders = orderFilter === 'all'
    ? orders
    : orders.filter(o => o.status.toLowerCase() === orderFilter.toLowerCase());

  // Handle Add Dish Submit
  const handleAddDishSubmit = (e) => {
    e.preventDefault();

    const nameErr = validateDishField('name', newDishName);
    const priceErr = validateDishField('price', newDishPrice);
    const imgErr = validateDishField('image', newDishImage);

    if (nameErr || priceErr || imgErr) {
      setDishErrors({ name: nameErr, price: priceErr, image: imgErr });
      setDishTouched({ name: true, price: true, image: true });
      addToast(t('valRequired'), 'error');
      return;
    }

    addMenuItem({
      name: newDishName.trim(),
      nameAr: newDishNameAr.trim() || newDishName.trim(),
      category: newDishCategory,
      price: parseFloat(newDishPrice) || 25,
      image: newDishImage.trim(),
      description: newDishDesc.trim() || 'Exquisite artisanal recipe prepared with fresh seasonal ingredients.',
      descriptionAr: newDishDescAr.trim() || 'وصفة فاخرة محضرة من مكونات موسمية طازجة.',
      prepTime: '20 min',
      calories: '550 kcal',
      isChefSpecial: true,
      dietary: [newDishDietary],
      spiceLevel: 0,
      ingredients: ["Artisan Produce", "Olive Oil", "Fresh Herbs"],
      allergens: [],
    });

    addToast(t('menuUpdatedToast'), 'success');
    setIsAddDishOpen(false);
    setNewDishName('');
    setNewDishNameAr('');
    setNewDishDesc('');
    setNewDishDescAr('');
    setDishErrors({});
    setDishTouched({});
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
              Admin Portal
            </span>
            <span className="text-xs text-slate-400">Logged in as {currentUser.name}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-1">
            {t('adminTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {t('adminSubtitle')}
          </p>
        </div>

        {/* Quick Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl self-start md:self-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'orders'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            {t('ordersTab')} ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('reservations')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'reservations'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            {t('reservationsTab')} ({reservations.length})
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'menu'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            {t('menuTab')} ({menuItems.length})
          </button>
        </div>
      </div>

      {/* KPI Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">{t('totalRevenue')}</p>
            <h4 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
              ${totalRevenue.toFixed(2)}
            </h4>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">{t('totalOrders')}</p>
            <h4 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
              {orders.length} <span className="text-xs font-sans text-amber-500 font-semibold">({activeOrdersCount} active)</span>
            </h4>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">{t('todayReservations')}</p>
            <h4 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
              {todayReservationsCount} Bookings
            </h4>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">{t('menuItemsCount')}</p>
            <h4 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
              {totalDishesCount} Dishes
            </h4>
          </div>
        </div>
      </div>

      {/* TAB 1: ORDERS MANAGER */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Order Status Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {['all', 'pending', 'preparing', 'out for delivery', 'delivered', 'cancelled'].map(st => (
              <button
                key={st}
                onClick={() => setOrderFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition ${
                  orderFilter === st
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="p-4 text-start">Order ID</th>
                    <th className="p-4 text-start">Customer</th>
                    <th className="p-4 text-start">Dishes & Details</th>
                    <th className="p-4 text-start">Amount</th>
                    <th className="p-4 text-start">Status</th>
                    <th className="p-4 text-end">Action Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                      <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                        #{order.id}
                        <span className="block text-[10px] text-slate-400 font-sans">
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      <td className="p-4">
                        <p className="font-semibold text-slate-900 dark:text-white">{order.customerName}</p>
                        <p className="text-[11px] text-slate-400">{order.customerPhone}</p>
                        <span className="inline-block mt-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                          {order.orderType}
                          {order.tableNumber ? ` (T${order.tableNumber})` : ''}
                        </span>
                      </td>

                      <td className="p-4 max-w-xs">
                        <div className="space-y-1">
                          {order.items.map((item, idx) => (
                            <p key={idx} className="truncate text-slate-700 dark:text-slate-300">
                              {item.quantity}x {isArabic && item.nameAr ? item.nameAr : item.name}
                            </p>
                          ))}
                          {order.deliveryAddress && (
                            <p className="text-[10px] text-slate-400 italic truncate">
                              Addr: {order.deliveryAddress}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="p-4 font-serif font-bold text-sm text-amber-600 dark:text-amber-400">
                        ${order.total.toFixed(2)}
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
                              : order.status === 'Preparing'
                              ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400'
                              : order.status === 'Out for Delivery'
                              ? 'bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400'
                              : order.status === 'Cancelled'
                              ? 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="p-4 text-end">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {order.status === 'Pending' && (
                            <button
                              onClick={() => {
                                updateOrderStatus(order.id, 'Preparing');
                                addToast(t('statusUpdatedToast'), 'success');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px]"
                            >
                              {t('markPreparing')}
                            </button>
                          )}

                          {order.status === 'Preparing' && (
                            <button
                              onClick={() => {
                                updateOrderStatus(order.id, 'Out for Delivery');
                                addToast(t('statusUpdatedToast'), 'success');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-bold text-[11px]"
                            >
                              {t('markOutForDelivery')}
                            </button>
                          )}

                          {order.status === 'Out for Delivery' && (
                            <button
                              onClick={() => {
                                updateOrderStatus(order.id, 'Delivered');
                                addToast(t('statusUpdatedToast'), 'success');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-[11px]"
                            >
                              {t('markDelivered')}
                            </button>
                          )}

                          {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                            <button
                              onClick={() => {
                                updateOrderStatus(order.id, 'Cancelled');
                                addToast('Order cancelled', 'info');
                              }}
                              className="px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-bold text-[11px]"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RESERVATIONS MANAGER */}
      {activeTab === 'reservations' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="p-4 text-start">Booking ID</th>
                  <th className="p-4 text-start">Guest</th>
                  <th className="p-4 text-start">Date & Time</th>
                  <th className="p-4 text-start">Party Size</th>
                  <th className="p-4 text-start">Area & Occasion</th>
                  <th className="p-4 text-start">Status</th>
                  <th className="p-4 text-end">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {reservations.map(res => (
                  <tr key={res.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                    <td className="p-4 font-mono font-bold text-amber-600 dark:text-amber-400">
                      {res.id}
                    </td>

                    <td className="p-4">
                      <p className="font-semibold text-slate-900 dark:text-white">{res.customerName}</p>
                      <p className="text-[11px] text-slate-400">{res.customerPhone}</p>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-slate-800 dark:text-slate-200">{res.date}</p>
                      <p className="text-[11px] text-slate-400">{res.time}</p>
                    </td>

                    <td className="p-4 font-bold text-slate-800 dark:text-slate-200">
                      {res.guests} Guests
                    </td>

                    <td className="p-4">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{t(res.seatingArea)}</p>
                      <span className="text-[10px] text-amber-500 font-semibold">{t(res.occasion)}</span>
                      {res.notes && (
                        <p className="text-[10px] text-slate-400 italic truncate max-w-xs">
                          "{res.notes}"
                        </p>
                      )}
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          res.status === 'Confirmed'
                            ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
                            : res.status === 'Seated'
                            ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400'
                            : 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {res.status}
                      </span>
                    </td>

                    <td className="p-4 text-end">
                      <div className="flex items-center justify-end gap-1.5">
                        {res.status === 'Confirmed' && (
                          <button
                            onClick={() => {
                              updateReservationStatus(res.id, 'Seated');
                              addToast(t('statusUpdatedToast'), 'success');
                            }}
                            className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px]"
                          >
                            {t('seatReservation')}
                          </button>
                        )}
                        {res.status !== 'Cancelled' && (
                          <button
                            onClick={() => {
                              updateReservationStatus(res.id, 'Cancelled');
                              addToast('Reservation cancelled', 'info');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-bold text-[11px]"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MENU MANAGEMENT */}
      {activeTab === 'menu' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setIsAddDishOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span>{t('addNewDish')}</span>
            </button>

            <button
              onClick={resetToDefaultMenu}
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset to Seed Menu</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="p-4 text-start">Dish</th>
                    <th className="p-4 text-start">Category</th>
                    <th className="p-4 text-start">Price</th>
                    <th className="p-4 text-start">Stock Status</th>
                    <th className="p-4 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {menuItems.map(dish => {
                    const name = isArabic && dish.nameAr ? dish.nameAr : dish.name;
                    return (
                      <tr key={dish.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={dish.image}
                            alt={name}
                            className="w-12 h-12 rounded-xl object-cover shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{name}</p>
                            <span className="text-[10px] text-slate-400 capitalize">{dish.dietary?.join(', ')}</span>
                          </div>
                        </td>

                        <td className="p-4 capitalize font-medium text-slate-700 dark:text-slate-300">
                          {dish.category}
                        </td>

                        <td className="p-4 font-serif font-bold text-sm text-amber-600 dark:text-amber-400">
                          ${dish.price.toFixed(2)}
                        </td>

                        <td className="p-4">
                          <button
                            onClick={() => toggleAvailability(dish.id)}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition ${
                              dish.isAvailable
                                ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
                                : 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400'
                            }`}
                          >
                            {dish.isAvailable ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                            <span>{dish.isAvailable ? t('dishAvailable') : t('dishStockout')}</span>
                          </button>
                        </td>

                        <td className="p-4 text-end">
                          <button
                            onClick={() => {
                              deleteMenuItem(dish.id);
                              addToast('Item removed from menu', 'info');
                            }}
                            className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition"
                            title={t('deleteItem')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add New Dish Modal */}
      <Modal
        isOpen={isAddDishOpen}
        onClose={() => setIsAddDishOpen(false)}
        title={t('addNewDish')}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleAddDishSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Name (English) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={newDishName}
                onBlur={() => handleDishBlur('name', newDishName)}
                onChange={(e) => handleDishChange('name', e.target.value, setNewDishName)}
                placeholder="e.g. Saffron Lobster Tail"
                className={`w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs focus:outline-none dark:text-white transition ${
                  dishErrors.name && dishTouched.name
                    ? 'border-rose-500 focus:border-rose-500 ring-1 ring-rose-500'
                    : 'border-slate-200 dark:border-slate-700 focus:border-amber-500'
                }`}
              />
              {dishErrors.name && dishTouched.name && (
                <p className="text-rose-500 text-[11px] mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{dishErrors.name}</span>
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Name (Arabic)
              </label>
              <input
                type="text"
                value={newDishNameAr}
                onChange={(e) => setNewDishNameAr(e.target.value)}
                placeholder="e.g. ذيل الإستاكوزا بالزعفران"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-amber-500 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('dishCategory')}
              </label>
              <select
                value={newDishCategory}
                onChange={(e) => setNewDishCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-amber-500 dark:text-white"
              >
                <option value="starters">{t('starters')}</option>
                <option value="mains">{t('mains')}</option>
                <option value="seafood">{t('seafood')}</option>
                <option value="pasta">{t('pasta')}</option>
                <option value="desserts">{t('desserts')}</option>
                <option value="beverages">{t('beverages')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('dishPrice')} <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.5"
                value={newDishPrice}
                onBlur={() => handleDishBlur('price', newDishPrice)}
                onChange={(e) => handleDishChange('price', e.target.value, setNewDishPrice)}
                className={`w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs focus:outline-none dark:text-white transition ${
                  dishErrors.price && dishTouched.price
                    ? 'border-rose-500 focus:border-rose-500 ring-1 ring-rose-500'
                    : 'border-slate-200 dark:border-slate-700 focus:border-amber-500'
                }`}
              />
              {dishErrors.price && dishTouched.price && (
                <p className="text-rose-500 text-[11px] mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{dishErrors.price}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Dietary
              </label>
              <select
                value={newDishDietary}
                onChange={(e) => setNewDishDietary(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-amber-500 dark:text-white"
              >
                <option value="halal">Halal</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="gluten-free">Gluten Free</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Image URL <span className="text-rose-500">*</span>
            </label>
            <input
              type="url"
              value={newDishImage}
              onBlur={() => handleDishBlur('image', newDishImage)}
              onChange={(e) => handleDishChange('image', e.target.value, setNewDishImage)}
              className={`w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs focus:outline-none dark:text-white transition ${
                dishErrors.image && dishTouched.image
                  ? 'border-rose-500 focus:border-rose-500 ring-1 ring-rose-500'
                  : 'border-slate-200 dark:border-slate-700 focus:border-amber-500'
              }`}
            />
            {dishErrors.image && dishTouched.image && (
              <p className="text-rose-500 text-[11px] mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{dishErrors.image}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description (English)
            </label>
            <textarea
              rows={2}
              value={newDishDesc}
              onChange={(e) => setNewDishDesc(e.target.value)}
              placeholder="Flavors, preparation technique..."
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-amber-500 dark:text-white resize-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddDishOpen(false)}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow transition"
            >
              Save Dish
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
