import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { Lock, Mail, User, Phone, AlertCircle } from 'lucide-react';

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
  const { register } = useAuth();
  const { t } = useLanguage();
  const { addToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (field, val) => {
    let err = '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    switch (field) {
      case 'name':
        if (!val || val.trim().length < 2) err = t('valNameRequired');
        break;
      case 'email':
        if (!val || !val.trim()) err = t('valRequired');
        else if (!emailRegex.test(val.trim())) err = t('valEmailInvalid');
        break;
      case 'password':
        if (!val || val.length < 6) err = t('valPasswordMin');
        break;
      case 'phone':
        if (val && val.replace(/\D/g, '').length < 7) err = t('valPhoneInvalid');
        break;
      default:
        break;
    }
    return err;
  };

  const handleBlur = (field, val) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const err = validateField(field, val);
    setFieldErrors(prev => ({ ...prev, [field]: err }));
  };

  const handleChange = (field, val, setter) => {
    setter(val);
    if (touched[field]) {
      const err = validateField(field, val);
      setFieldErrors(prev => ({ ...prev, [field]: err }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const nameErr = validateField('name', name);
    const emailErr = validateField('email', email);
    const passErr = validateField('password', password);
    const phoneErr = validateField('phone', phone);

    if (nameErr || emailErr || passErr || phoneErr) {
      setFieldErrors({ name: nameErr, email: emailErr, password: passErr, phone: phoneErr });
      setTouched({ name: true, email: true, password: true, phone: true });
      return;
    }

    const result = register({ name, email, password, phone });
    if (result.success) {
      addToast(t('registerSuccess'), 'success');
      onClose();
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('registerTitle')}>
      <div className="space-y-6">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {t('registerSubtitle')}
        </p>

        {error && (
          <div className="flex items-center gap-2 p-3 text-xs rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {t('namePlaceholder')} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onBlur={() => handleBlur('name', name)}
                onChange={(e) => handleChange('name', e.target.value, setName)}
                placeholder="e.g. Marcus Aurelius"
                className={`w-full px-4 py-2.5 ps-10 rounded-xl bg-slate-50 dark:bg-slate-800/80 border text-sm focus:outline-none dark:text-white transition ${
                  fieldErrors.name && touched.name
                    ? 'border-rose-500 focus:border-rose-500 ring-1 ring-rose-500'
                    : 'border-slate-200 dark:border-slate-700 focus:border-amber-500'
                }`}
              />
              <User className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5" />
            </div>
            {fieldErrors.name && touched.name && (
              <p className="text-rose-500 text-[11px] mt-1.5 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{fieldErrors.name}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {t('emailPlaceholder')} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onBlur={() => handleBlur('email', email)}
                onChange={(e) => handleChange('email', e.target.value, setEmail)}
                placeholder="e.g. user@example.com"
                className={`w-full px-4 py-2.5 ps-10 rounded-xl bg-slate-50 dark:bg-slate-800/80 border text-sm focus:outline-none dark:text-white transition ${
                  fieldErrors.email && touched.email
                    ? 'border-rose-500 focus:border-rose-500 ring-1 ring-rose-500'
                    : 'border-slate-200 dark:border-slate-700 focus:border-amber-500'
                }`}
              />
              <Mail className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5" />
            </div>
            {fieldErrors.email && touched.email && (
              <p className="text-rose-500 text-[11px] mt-1.5 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{fieldErrors.email}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {t('phonePlaceholder')}
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onBlur={() => handleBlur('phone', phone)}
                onChange={(e) => handleChange('phone', e.target.value, setPhone)}
                placeholder="+1 (555) 000-0000"
                className={`w-full px-4 py-2.5 ps-10 rounded-xl bg-slate-50 dark:bg-slate-800/80 border text-sm focus:outline-none dark:text-white transition ${
                  fieldErrors.phone && touched.phone
                    ? 'border-rose-500 focus:border-rose-500 ring-1 ring-rose-500'
                    : 'border-slate-200 dark:border-slate-700 focus:border-amber-500'
                }`}
              />
              <Phone className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5" />
            </div>
            {fieldErrors.phone && touched.phone && (
              <p className="text-rose-500 text-[11px] mt-1.5 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{fieldErrors.phone}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {t('passwordPlaceholder')} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onBlur={() => handleBlur('password', password)}
                onChange={(e) => handleChange('password', e.target.value, setPassword)}
                placeholder="Minimum 6 characters"
                className={`w-full px-4 py-2.5 ps-10 rounded-xl bg-slate-50 dark:bg-slate-800/80 border text-sm focus:outline-none dark:text-white transition ${
                  fieldErrors.password && touched.password
                    ? 'border-rose-500 focus:border-rose-500 ring-1 ring-rose-500'
                    : 'border-slate-200 dark:border-slate-700 focus:border-amber-500'
                }`}
              />
              <Lock className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5" />
            </div>
            {fieldErrors.password && touched.password && (
              <p className="text-rose-500 text-[11px] mt-1.5 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{fieldErrors.password}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/25 transition"
          >
            {t('register')}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span>{t('haveAccount')} </span>
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-bold text-amber-600 dark:text-amber-400 hover:underline"
          >
            {t('login')}
          </button>
        </div>
      </div>
    </Modal>
  );
}
