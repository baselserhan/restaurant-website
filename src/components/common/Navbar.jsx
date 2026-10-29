import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Utensils,
  Sun,
  Moon,
  Globe,
  ShoppingBag,
  User,
  ShieldCheck,
  Menu as MenuIcon,
  X,
  LogOut,
  ChevronDown,
  Clock,
  CalendarCheck
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar({ activePage, setActivePage, onOpenLogin, onOpenRegister }) {
  const { theme, toggleTheme, isDark } = useTheme();
  const { language, toggleLanguage, isRtl, t } = useLanguage();
  const { currentUser, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItemCount, openCart } = useCart();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: t('home') },
    { id: 'menu', label: t('menu') },
    { id: 'reservations', label: t('reservations') },
  ];

  if (isAuthenticated && !isAdmin) {
    navLinks.push({ id: 'orders', label: t('myOrders') });
  }

  if (isAdmin) {
    navLinks.push({ id: 'admin', label: t('adminDashboard'), isSpecial: true });
  }

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setIsMobileMenuOpen(false);
    setIsUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-200 glass border-b border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-300 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center">
                <Utensils className="w-5 h-5 text-amber-500 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                {t('brandName')}
              </span>
              <span className="block text-[10px] tracking-widest uppercase font-semibold text-amber-600 dark:text-amber-400">
                {t('tagline')}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    link.isSpecial
                      ? isActive
                        ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/30'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20'
                      : isActive
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {link.isSpecial && (
                    <ShieldCheck className="w-4 h-4 inline-block me-1.5 text-amber-500" />
                  )}
                  {link.label}
                  {isActive && !link.isSpecial && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-amber-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Desktop Right Action Controls */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            {/* LTR / RTL Language Toggle */}
            <button
              onClick={toggleLanguage}
              title={`Switch to ${language === 'en' ? 'Arabic (RTL)' : 'English (LTR)'}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              <Globe className="w-3.5 h-3.5 text-amber-500" />
              <span>{language === 'en' ? 'العربية' : 'English'}</span>
            </button>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${isDark ? 'Light Mode' : 'Dark Mode'}`}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 transition"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Cart Trigger Button */}
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-amber-500 transition group"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {totalItemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={totalItemCount}
                  className="absolute -top-1 -end-1 w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center shadow-md shadow-amber-500/40"
                >
                  {totalItemCount}
                </motion.span>
              )}
            </button>

            {/* User Profile / Auth State */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(prev => !prev)}
                  className="flex items-center gap-2 p-1.5 ps-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-700"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-amber-500/30"
                  />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[90px] truncate">
                    {currentUser.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isUserDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={`absolute top-full mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 ${
                        isRtl ? 'left-0' : 'right-0'
                      }`}
                    >
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {t('welcome')},
                        </p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {currentUser.name}
                        </p>
                        <span
                          className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isAdmin
                              ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                              : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                          }`}
                        >
                          {isAdmin ? t('adminBadge') : t('customerBadge')}
                        </span>
                      </div>

                      {isAdmin && (
                        <button
                          onClick={() => handleNavClick('admin')}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 rounded-xl transition"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          {t('adminDashboard')}
                        </button>
                      )}

                      <button
                        onClick={() => handleNavClick('orders')}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                      >
                        <Clock className="w-4 h-4 text-amber-500" />
                        {t('myOrders')}
                      </button>

                      <button
                        onClick={() => handleNavClick('reservations')}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                      >
                        <CalendarCheck className="w-4 h-4 text-amber-500" />
                        {t('reservations')}
                      </button>

                      <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setIsUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition"
                        >
                          <LogOut className="w-4 h-4" />
                          {t('logout')}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenLogin}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-amber-500 dark:hover:text-amber-400 transition"
                >
                  {t('login')}
                </button>
                <button
                  onClick={onOpenRegister}
                  className="px-4 py-2 text-xs font-semibold rounded-full bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/20 transition"
                >
                  {t('register')}
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu & Cart Triggers */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={openCart}
              className="relative p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemCount > 0 && (
                <span className="absolute -top-1 -end-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                  {totalItemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 overflow-hidden shadow-2xl"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-start font-medium text-sm transition ${
                    activePage === link.id
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.isSpecial && <ShieldCheck className="w-4 h-4 text-amber-500" />}
                </button>
              ))}
            </div>

            {/* Switchers in Mobile Menu */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                <Globe className="w-4 h-4 text-amber-500" />
                <span>{language === 'en' ? 'العربية' : 'English'}</span>
              </button>

              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
                <span>{isDark ? 'Light' : 'Dark'}</span>
              </button>
            </div>

            {/* Mobile Auth Button */}
            <div className="pt-2">
              {isAuthenticated ? (
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {currentUser.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {currentUser.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full mt-2 py-2 text-xs font-bold text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg transition"
                  >
                    {t('logout')}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenLogin();
                    }}
                    className="py-2.5 text-xs font-bold text-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                  >
                    {t('login')}
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenRegister();
                    }}
                    className="py-2.5 text-xs font-bold text-center rounded-xl bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  >
                    {t('register')}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
