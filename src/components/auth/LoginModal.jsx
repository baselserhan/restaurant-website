import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { Lock, Mail, Shield, UserCheck, AlertCircle } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }) {
  const { login, quickLogin, authError } = useAuth();
  const { t } = useLanguage();
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (field, val) => {
    let err = '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (field === 'email') {
      if (!val || !val.trim()) err = t('valRequired');
      else if (!emailRegex.test(val.trim())) err = t('valEmailInvalid');
    }
    if (field === 'password') {
      if (!val) err = t('valRequired');
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

    const emailErr = validateField('email', email);
    const passErr = validateField('password', password);

    if (emailErr || passErr) {
      setFieldErrors({ email: emailErr, password: passErr });
      setTouched({ email: true, password: true });
      return;
    }

    const result = login(email, password);
    if (result.success) {
      addToast(`${t('welcome')}, ${result.user.name}!`, 'success');
      onClose();
    } else {
      setError(t('loginError'));
    }
  };

  const handleQuickLogin = (role) => {
    const result = quickLogin(role);
    if (result.success) {
      addToast(`${t('welcome')}, ${result.user.name}! (${role === 'admin' ? t('adminBadge') : t('customerBadge')})`, 'success');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('loginTitle')}>
      <div className="space-y-6">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {t('loginSubtitle')}
        </p>

        {/* Demo Quick Logins Callout */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2.5">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            {t('quickLogin')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-sm transition"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin (Manager)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('customer')}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm transition"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Guest (Customer)</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {(error || authError) && (
          <div className="flex items-center gap-2 p-3 text-xs rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error || authError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="e.g. guest@savoria.com"
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
              {t('passwordPlaceholder')} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onBlur={() => handleBlur('password', password)}
                onChange={(e) => handleChange('password', e.target.value, setPassword)}
                placeholder="••••••••"
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
            {t('login')}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span>{t('dontHaveAccount')} </span>
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-bold text-amber-600 dark:text-amber-400 hover:underline"
          >
            {t('register')}
          </button>
        </div>
      </div>
    </Modal>
  );
}
