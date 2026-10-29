import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Clock,
  Users,
  Sparkles,
  CheckCircle2,
  MapPin,
  Heart,
  Briefcase,
  Cake,
  Wine,
  AlertCircle
} from 'lucide-react';
import { useReservations } from '../../context/ReservationContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';

export default function ReservationForm({ onBookingComplete }) {
  const { createReservation } = useReservations();
  const { currentUser } = useAuth();
  const { t, language } = useLanguage();
  const { addToast } = useToast();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateString = tomorrow.toISOString().split('T')[0];

  const [date, setDate] = useState(defaultDateString);
  const [time, setTime] = useState('19:30');
  const [guests, setGuests] = useState(2);
  const [seatingArea, setSeatingArea] = useState('seatingWindow');
  const [occasion, setOccasion] = useState('occasionRomantic');
  const [name, setName] = useState(currentUser?.name || 'Elena Rostova');
  const [email, setEmail] = useState(currentUser?.email || 'guest@savoria.com');
  const [phone, setPhone] = useState(currentUser?.phone || '+1 (555) 438-9201');
  const [notes, setNotes] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const timeSlots = [
    { label: '12:00 PM', value: '12:00', type: 'lunch' },
    { label: '12:45 PM', value: '12:45', type: 'lunch' },
    { label: '01:30 PM', value: '13:30', type: 'lunch' },
    { label: '02:15 PM', value: '14:15', type: 'lunch' },
    { label: '06:00 PM', value: '18:00', type: 'dinner' },
    { label: '06:45 PM', value: '18:45', type: 'dinner' },
    { label: '07:30 PM', value: '19:30', type: 'dinner' },
    { label: '08:15 PM', value: '20:15', type: 'dinner' },
    { label: '09:00 PM', value: '21:00', type: 'dinner' },
    { label: '09:45 PM', value: '21:45', type: 'dinner' },
  ];

  const seatingOptions = [
    { id: 'seatingMain', title: t('seatingMain') },
    { id: 'seatingTerrace', title: t('seatingTerrace') },
    { id: 'seatingWindow', title: t('seatingWindow') },
    { id: 'seatingVip', title: t('seatingVip') },
  ];

  const occasionOptions = [
    { id: 'occasionNone', label: t('occasionNone'), icon: Wine },
    { id: 'occasionRomantic', label: t('occasionRomantic'), icon: Heart },
    { id: 'occasionBirthday', label: t('occasionBirthday'), icon: Cake },
    { id: 'occasionAnniversary', label: t('occasionAnniversary'), icon: Sparkles },
    { id: 'occasionBusiness', label: t('occasionBusiness'), icon: Briefcase },
  ];

  // Field validation states
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (field, value) => {
    let error = '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    switch (field) {
      case 'date':
        if (!value) {
          error = t('valDateRequired');
        } else {
          const selected = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selected < today) error = t('valDateRequired');
        }
        break;
      case 'time':
        if (!value) error = t('valTimeRequired');
        break;
      case 'name':
        if (!value || value.trim().length < 2) error = t('valNameRequired');
        break;
      case 'email':
        if (!value || !emailRegex.test(value.trim())) error = t('valEmailInvalid');
        break;
      case 'phone': {
        const digits = value ? value.replace(/\D/g, '') : '';
        if (!value || digits.length < 7) error = t('valPhoneInvalid');
        break;
      }
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
    const newErrors = {
      date: validateField('date', date),
      time: validateField('time', time),
      name: validateField('name', name),
      email: validateField('email', email),
      phone: validateField('phone', phone),
    };

    // Filter out empty errors
    const activeErrors = {};
    Object.keys(newErrors).forEach(key => {
      if (newErrors[key]) activeErrors[key] = newErrors[key];
    });
    return activeErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateAll();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTouched({ date: true, time: true, name: true, email: true, phone: true });
      addToast(t('valRequired'), 'error');
      return;
    }

    const reservationData = {
      customerEmail: email,
      customerName: name,
      customerPhone: phone,
      date,
      time,
      guests,
      seatingArea,
      occasion,
      notes,
    };

    const newRes = createReservation(reservationData);
    setConfirmedBooking(newRes);

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#d4af37', '#e1c255', '#10b981'],
      });
    } catch (e) {
      console.error(e);
    }

    addToast(t('reservationConfirmedToast'), 'success');
  };

  const handleReset = () => {
    setConfirmedBooking(null);
    setNotes('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {confirmedBooking ? (
        /* Confirmation View */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-6"
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/10 dark:bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center text-amber-500">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-3xl font-bold text-slate-900 dark:text-white">
              {t('reservationSuccessTitle')}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              {t('reservationSuccessDesc')}
            </p>
          </div>

          {/* Booking Pass */}
          <div className="max-w-md mx-auto p-6 rounded-2xl bg-amber-500/5 dark:bg-slate-800/80 border border-amber-500/20 text-start space-y-3">
            <div className="flex justify-between items-center border-b border-amber-500/20 pb-3">
              <div>
                <span className="text-xs text-slate-500 uppercase font-semibold">
                  {t('bookingCode')}
                </span>
                <p className="font-mono text-lg font-bold text-amber-600 dark:text-amber-400">
                  {confirmedBooking.id}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                {confirmedBooking.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400">{t('dateLabel')}</span>
                <p className="font-bold text-slate-800 dark:text-slate-100">{confirmedBooking.date}</p>
              </div>
              <div>
                <span className="text-slate-400">{t('timeLabel')}</span>
                <p className="font-bold text-slate-800 dark:text-slate-100">{confirmedBooking.time}</p>
              </div>
              <div>
                <span className="text-slate-400">{t('partySizeLabel')}</span>
                <p className="font-bold text-slate-800 dark:text-slate-100">
                  {confirmedBooking.guests} {t('guestCount')}
                </p>
              </div>
              <div>
                <span className="text-slate-400">{t('seatingAreaLabel')}</span>
                <p className="font-bold text-slate-800 dark:text-slate-100 truncate">
                  {t(confirmedBooking.seatingArea)}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-amber-500/20 text-xs">
              <span className="text-slate-400">{t('contactName')}: </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {confirmedBooking.customerName} ({confirmedBooking.customerPhone})
              </span>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-4">
            <button
              onClick={handleReset}
              className="py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition"
            >
              Book Another Table
            </button>
          </div>
        </motion.div>
      ) : (
        /* Reservation Booking Form */
        <form
          onSubmit={handleSubmit}
          className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-2 border-b border-slate-100 dark:border-slate-800 pb-6">
            <h2 className="font-serif text-3xl font-bold text-slate-900 dark:text-white">
              {t('reservationTitle')}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              {t('reservationSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Schedule & Party */}
            <div className="space-y-6">
              {/* Date selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  <Calendar className="w-4 h-4 inline-block me-1.5 text-amber-500" />
                  {t('dateLabel')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={date}
                  onBlur={() => handleBlur('date', date)}
                  onChange={(e) => handleChange('date', e.target.value, setDate)}
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-sm font-medium focus:outline-none dark:text-white transition ${
                    errors.date && touched.date
                      ? 'border-rose-500 focus:border-rose-500 ring-1 ring-rose-500'
                      : 'border-slate-200 dark:border-slate-700 focus:border-amber-500'
                  }`}
                />
                {errors.date && touched.date && (
                  <p className="text-rose-500 text-[11px] mt-1.5 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.date}</span>
                  </p>
                )}
              </div>

              {/* Guest Count */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  <Users className="w-4 h-4 inline-block me-1.5 text-amber-500" />
                  {t('partySizeLabel')}
                </label>
                <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setGuests(prev => Math.max(1, prev - 1))}
                    className="w-10 h-10 rounded-lg bg-white dark:bg-slate-700 font-bold text-lg text-slate-700 dark:text-slate-200 shadow-sm hover:bg-amber-500 hover:text-slate-950 transition"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-bold text-base text-slate-800 dark:text-slate-100">
                    {guests} {guests === 1 ? 'Guest' : t('guestCount')}
                  </span>
                  <button
                    type="button"
                    onClick={() => setGuests(prev => Math.min(16, prev + 1))}
                    className="w-10 h-10 rounded-lg bg-white dark:bg-slate-700 font-bold text-lg text-slate-700 dark:text-slate-200 shadow-sm hover:bg-amber-500 hover:text-slate-950 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  <Clock className="w-4 h-4 inline-block me-1.5 text-amber-500" />
                  {t('timeLabel')} <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.value}
                      type="button"
                      onClick={() => {
                        setTime(slot.value);
                        if (errors.time) setErrors(prev => ({ ...prev, time: '' }));
                      }}
                      className={`py-2 px-1 text-center text-xs font-semibold rounded-xl border transition ${
                        time === slot.value
                          ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/30'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-500/50'
                      }`}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
                {errors.time && touched.time && (
                  <p className="text-rose-500 text-[11px] mt-1.5 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.time}</span>
                  </p>
                )}
              </div>

              {/* Seating Area */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  <MapPin className="w-4 h-4 inline-block me-1.5 text-amber-500" />
                  {t('seatingAreaLabel')}
                </label>
                <div className="space-y-2">
                  {seatingOptions.map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                        seatingArea === opt.id
                          ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-medium'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="seating"
                        value={opt.id}
                        checked={seatingArea === opt.id}
                        onChange={(e) => setSeatingArea(e.target.value)}
                        className="text-amber-500 focus:ring-amber-500"
                      />
                      <span className="text-xs">{opt.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Occasion & Contact Details */}
            <div className="space-y-6">
              {/* Occasion */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  <Sparkles className="w-4 h-4 inline-block me-1.5 text-amber-500" />
                  {t('occasionLabel')}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {occasionOptions.map((occ) => {
                    const Icon = occ.icon;
                    return (
                      <button
                        key={occ.id}
                        type="button"
                        onClick={() => setOccasion(occ.id)}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition ${
                          occasion === occ.id
                            ? 'bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400 font-bold'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <Icon className="w-4 h-4 mb-1" />
                        <span className="text-[11px] text-center">{occ.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Guest Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t('contactName')} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onBlur={() => handleBlur('name', name)}
                    onChange={(e) => handleChange('name', e.target.value, setName)}
                    className={`w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs focus:outline-none dark:text-white transition ${
                      errors.name && touched.name
                        ? 'border-rose-500 focus:border-rose-500 ring-1 ring-rose-500'
                        : 'border-slate-200 dark:border-slate-700 focus:border-amber-500'
                    }`}
                  />
                  {errors.name && touched.name && (
                    <p className="text-rose-500 text-[11px] mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t('contactEmail')} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onBlur={() => handleBlur('email', email)}
                      onChange={(e) => handleChange('email', e.target.value, setEmail)}
                      className={`w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs focus:outline-none dark:text-white transition ${
                        errors.email && touched.email
                          ? 'border-rose-500 focus:border-rose-500 ring-1 ring-rose-500'
                          : 'border-slate-200 dark:border-slate-700 focus:border-amber-500'
                      }`}
                    />
                    {errors.email && touched.email && (
                      <p className="text-rose-500 text-[11px] mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t('contactPhone')} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onBlur={() => handleBlur('phone', phone)}
                      onChange={(e) => handleChange('phone', e.target.value, setPhone)}
                      className={`w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs focus:outline-none dark:text-white transition ${
                        errors.phone && touched.phone
                          ? 'border-rose-500 focus:border-rose-500 ring-1 ring-rose-500'
                          : 'border-slate-200 dark:border-slate-700 focus:border-amber-500'
                      }`}
                    />
                    {errors.phone && touched.phone && (
                      <p className="text-rose-500 text-[11px] mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t('specialInstructions')}
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Dietary requirements, high chair needed, anniversary surprise..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-amber-500 dark:text-white resize-none"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/25 transition transform hover:-translate-y-0.5"
              >
                {t('reserveButton')}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
