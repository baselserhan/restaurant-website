import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import Modal from '../common/Modal';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import {
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  MapPin,
  UtensilsCrossed,
  AlertCircle
} from 'lucide-react';

export default function CheckoutModal({ isOpen, onClose, onOrderPlacedSuccess }) {
  const {
    cartItems,
    orderType,
    tableNumber,
    setTableNumber,
    deliveryAddress,
    setDeliveryAddress,
    orderNotes,
    setOrderNotes,
    subtotal,
    discountAmount,
    appliedCoupon,
    taxAmount,
    deliveryFee,
    totalAmount,
    clearCart,
  } = useCart();

  const { createOrder } = useOrders();
  const { currentUser } = useAuth();
  const { t, isRtl } = useLanguage();
  const { addToast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('888');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Field validation states
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (field, value) => {
    let error = '';
    switch (field) {
      case 'deliveryAddress':
        if (orderType === 'delivery' && (!value || value.trim().length < 5)) {
          error = t('valAddressRequired');
        }
        break;
      case 'tableNumber':
        if (orderType === 'dineIn' && (!value || !value.toString().trim())) {
          error = t('valTableRequired');
        }
        break;
      case 'cardNumber':
        if (paymentMethod === 'creditCard') {
          const raw = value ? value.replace(/\D/g, '') : '';
          if (raw.length < 16) error = t('valCardNumberInvalid');
        }
        break;
      case 'expiry':
        if (paymentMethod === 'creditCard') {
          const regex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
          if (!value || !regex.test(value.trim())) error = t('valExpiryInvalid');
        }
        break;
      case 'cvv':
        if (paymentMethod === 'creditCard') {
          const raw = value ? value.replace(/\D/g, '') : '';
          if (!raw || raw.length < 3 || raw.length > 4) error = t('valCvvInvalid');
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleBlur = (field, value) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const err = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: err }));
  };

  const handleChange = (field, value, setter) => {
    setter(value);
    if (touched[field]) {
      const err = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: err }));
    }
  };

  const validateAll = () => {
    const newErrors = {};
    if (orderType === 'delivery') {
      const addrErr = validateField('deliveryAddress', deliveryAddress);
      if (addrErr) newErrors.deliveryAddress = addrErr;
    } else if (orderType === 'dineIn') {
      const tblErr = validateField('tableNumber', tableNumber);
      if (tblErr) newErrors.tableNumber = tblErr;
    }

    if (paymentMethod === 'creditCard') {
      const cardErr = validateField('cardNumber', cardNumber);
      if (cardErr) newErrors.cardNumber = cardErr;
      const expErr = validateField('expiry', expiry);
      if (expErr) newErrors.expiry = expErr;
      const cvvErr = validateField('cvv', cvv);
      if (cvvErr) newErrors.cvv = cvvErr;
    }
    return newErrors;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    const validationErrors = validateAll();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTouched({
        deliveryAddress: true,
        tableNumber: true,
        cardNumber: true,
        expiry: true,
        cvv: true,
      });
      addToast(t('valRequired'), 'error');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const orderPayload = {
        customerEmail: currentUser?.email || 'guest@savoria.com',
        customerName: currentUser?.name || 'Valued Guest',
        customerPhone: currentUser?.phone || '+1 (555) 019-2834',
        items: [...cartItems],
        subtotal,
        discount: discountAmount,
        couponCode: appliedCoupon?.code || null,
        tax: taxAmount,
        deliveryFee,
        total: totalAmount,
        orderType,
        deliveryAddress: orderType === 'delivery' ? deliveryAddress : null,
        tableNumber: orderType === 'dineIn' ? tableNumber : null,
        notes: orderNotes,
        paymentMethod,
      };

      const created = createOrder(orderPayload);
      clearCart();
      setIsProcessing(false);
      setConfirmedOrder(created);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#d4af37', '#f59e0b', '#10b981', '#6366f1'],
        });
      } catch (err) {
        console.error('Confetti error:', err);
      }

      addToast(t('orderPlacedToast'), 'success');
    }, 1000);
  };

  const handleClose = () => {
    setConfirmedOrder(null);
    onClose();
  };

  const handleViewOrders = () => {
    handleClose();
    if (onOrderPlacedSuccess) {
      onOrderPlacedSuccess();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={confirmedOrder ? t('orderSuccessTitle') : t('proceedCheckout')}
      maxWidth="max-w-xl"
    >
      {confirmedOrder ? (
        /* Order Confirmed View */
        <div className="text-center py-6 space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-500">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
              {t('orderSuccessTitle')}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              {t('orderSuccessDesc')}
            </p>
          </div>

          {/* Receipt Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-start space-y-2">
            <div className="flex justify-between font-semibold border-b border-slate-200 dark:border-slate-700 pb-2">
              <span className="text-slate-500">{t('orderIdText')}:</span>
              <span className="text-amber-600 dark:text-amber-400 font-mono text-sm">
                #{confirmedOrder.id}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">{t('orderType')}:</span>
              <span className="capitalize font-medium text-slate-800 dark:text-slate-200">
                {confirmedOrder.orderType}
                {confirmedOrder.tableNumber && ` (Table ${confirmedOrder.tableNumber})`}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">{t('estimatedTime')}:</span>
              <span className="font-medium text-emerald-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> 25-35 mins
              </span>
            </div>

            <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700 font-bold text-sm">
              <span>{t('orderTotal')}:</span>
              <span className="text-amber-600 dark:text-amber-400 font-serif">
                ${confirmedOrder.total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleViewOrders}
              className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition"
            >
              {t('trackOrder')}
            </button>
            <button
              onClick={handleClose}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs transition"
            >
              {t('continueDining')}
            </button>
          </div>
        </div>
      ) : (
        /* Checkout Form View */
        <form onSubmit={handlePlaceOrder} className="space-y-5">
          {/* Order Details: Address or Table */}
          {orderType === 'delivery' ? (
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t('deliveryAddress')} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={deliveryAddress}
                  onBlur={() => handleBlur('deliveryAddress', deliveryAddress)}
                  onChange={(e) => handleChange('deliveryAddress', e.target.value, setDeliveryAddress)}
                  placeholder={t('addressPlaceholder')}
                  className={`w-full px-4 py-2.5 ps-10 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs focus:outline-none dark:text-white transition ${
                    errors.deliveryAddress && touched.deliveryAddress
                      ? 'border-rose-500 focus:border-rose-500 ring-1 ring-rose-500'
                      : 'border-slate-200 dark:border-slate-700 focus:border-amber-500'
                  }`}
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3" />
              </div>
              {errors.deliveryAddress && touched.deliveryAddress && (
                <p className="text-rose-500 text-[11px] mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.deliveryAddress}</span>
                </p>
              )}
            </div>
          ) : orderType === 'dineIn' ? (
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t('tableNumber')} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={tableNumber}
                  onBlur={() => handleBlur('tableNumber', tableNumber)}
                  onChange={(e) => handleChange('tableNumber', e.target.value, setTableNumber)}
                  placeholder="e.g. Table 12"
                  className={`w-full px-4 py-2.5 ps-10 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs focus:outline-none dark:text-white transition ${
                    errors.tableNumber && touched.tableNumber
                      ? 'border-rose-500 focus:border-rose-500 ring-1 ring-rose-500'
                      : 'border-slate-200 dark:border-slate-700 focus:border-amber-500'
                  }`}
                />
                <UtensilsCrossed className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3" />
              </div>
              {errors.tableNumber && touched.tableNumber && (
                <p className="text-rose-500 text-[11px] mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.tableNumber}</span>
                </p>
              )}
            </div>
          ) : null}

          {/* Chef / Delivery Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t('specialInstructions')}
            </label>
            <input
              type="text"
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              placeholder={t('notesPlaceholder')}
              className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-amber-500 dark:text-white"
            />
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t('paymentMethod')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('creditCard')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition ${
                  paymentMethod === 'creditCard'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <CreditCard className="w-5 h-5 mb-1" />
                <span className="text-[11px]">{t('creditCard')}</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('applePay')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition ${
                  paymentMethod === 'applePay'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Smartphone className="w-5 h-5 mb-1" />
                <span className="text-[11px]">Digital Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition ${
                  paymentMethod === 'cash'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Banknote className="w-5 h-5 mb-1" />
                <span className="text-[11px]">Cash</span>
              </button>
            </div>
          </div>

          {/* Mock Card Input Fields */}
          {paymentMethod === 'creditCard' && (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                  {t('cardNumber')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onBlur={() => handleBlur('cardNumber', cardNumber)}
                  onChange={(e) => handleChange('cardNumber', e.target.value, setCardNumber)}
                  className={`w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border text-xs font-mono dark:text-white transition ${
                    errors.cardNumber && touched.cardNumber
                      ? 'border-rose-500 focus:border-rose-500 ring-1 ring-rose-500'
                      : 'border-slate-200 dark:border-slate-700 focus:border-amber-500'
                  }`}
                />
                {errors.cardNumber && touched.cardNumber && (
                  <p className="text-rose-500 text-[11px] mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.cardNumber}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                    {t('expiryDate')} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={expiry}
                    placeholder="MM/YY"
                    onBlur={() => handleBlur('expiry', expiry)}
                    onChange={(e) => handleChange('expiry', e.target.value, setExpiry)}
                    className={`w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border text-xs font-mono dark:text-white transition ${
                      errors.expiry && touched.expiry
                        ? 'border-rose-500 focus:border-rose-500 ring-1 ring-rose-500'
                        : 'border-slate-200 dark:border-slate-700 focus:border-amber-500'
                    }`}
                  />
                  {errors.expiry && touched.expiry && (
                    <p className="text-rose-500 text-[11px] mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.expiry}</span>
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                    {t('cvv')} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={cvv}
                    maxLength={4}
                    placeholder="123"
                    onBlur={() => handleBlur('cvv', cvv)}
                    onChange={(e) => handleChange('cvv', e.target.value, setCvv)}
                    className={`w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border text-xs font-mono dark:text-white transition ${
                      errors.cvv && touched.cvv
                        ? 'border-rose-500 focus:border-rose-500 ring-1 ring-rose-500'
                        : 'border-slate-200 dark:border-slate-700 focus:border-amber-500'
                    }`}
                  />
                  {errors.cvv && touched.cvv && (
                    <p className="text-rose-500 text-[11px] mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.cvv}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Order Summary Line */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t('orderTotal')}:
            </span>
            <span className="font-serif text-lg font-bold text-amber-600 dark:text-amber-400">
              ${totalAmount.toFixed(2)}
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition disabled:opacity-50"
          >
            {isProcessing ? (
              <span>{t('processing')}</span>
            ) : (
              <>
                <span>{t('placeOrder')}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </>
            )}
          </button>
        </form>
      )}
    </Modal>
  );
}
