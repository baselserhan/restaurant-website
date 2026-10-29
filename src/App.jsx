import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { MenuProvider } from './context/MenuContext';
import { CartProvider, useCart } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { ReservationProvider } from './context/ReservationContext';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ToastContainer from './components/common/Toast';

// Modals & Drawers
import CartDrawer from './components/cart/CartDrawer';
import CheckoutModal from './components/cart/CheckoutModal';
import LoginModal from './components/auth/LoginModal';
import RegisterModal from './components/auth/RegisterModal';

// Pages
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import ReservationPage from './pages/ReservationPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function AppContent() {
  const [activePage, setActivePage] = useState('home');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const { isCheckoutOpen, openCheckout, closeCheckout } = useCart();
  const { direction } = useLanguage();

  const handleNavigate = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7] dark:bg-[#0b0f17] text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans">
      {/* Dynamic Toast Notifications */}
      <ToastContainer />

      {/* Navigation Bar */}
      <Navbar
        activePage={activePage}
        setActivePage={handleNavigate}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
      />

      {/* Page Content with Framer Motion Transition */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {activePage === 'home' && <HomePage onNavigate={handleNavigate} />}
            {activePage === 'menu' && <MenuPage />}
            {activePage === 'reservations' && <ReservationPage />}
            {activePage === 'orders' && (
              <OrderHistoryPage onOpenLogin={() => setIsLoginOpen(true)} />
            )}
            {activePage === 'admin' && (
              <AdminDashboardPage onOpenLogin={() => setIsLoginOpen(true)} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Slide-over Cart Drawer */}
      <CartDrawer onProceedToCheckout={openCheckout} />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={closeCheckout}
        onOrderPlacedSuccess={() => handleNavigate('orders')}
      />

      {/* Auth Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <MenuProvider>
              <OrderProvider>
                <ReservationProvider>
                  <CartProvider>
                    <AppContent />
                  </CartProvider>
                </ReservationProvider>
              </OrderProvider>
            </MenuProvider>
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
