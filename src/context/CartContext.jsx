import React, { createContext, useContext, useState, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { validCoupons } from '../data/mockData';
import { dishImages } from '../data/mockMenu';
import dish1 from '../assets/dishes/dish-1.jpg';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [rawCartItems, setCartItems] = useLocalStorage('savoria_cart_items_v2', [
    // Preload with 1 delicious item so user sees active state
    {
      id: "dish-1",
      name: "Truffle Ribeye & Smoked Bone Marrow",
      nameAr: "ستيك ريب آي بالترافل ونخاع العظم المدخن",
      price: 44.50,
      quantity: 1,
      image: dish1,
      notes: "Medium-rare please"
    }
  ]);

  // Ensure cart items use local assets if available
  const cartItems = useMemo(() => {
    if (!Array.isArray(rawCartItems)) return [];
    return rawCartItems.map(item => {
      if (dishImages[item.id] && (!item.image || item.image.includes('unsplash.com'))) {
        return { ...item, image: dishImages[item.id] };
      }
      return item;
    });
  }, [rawCartItems]);

  const [appliedCoupon, setAppliedCoupon] = useLocalStorage('savoria_cart_coupon', null);
  const [orderType, setOrderType] = useLocalStorage('savoria_order_type', 'delivery');
  const [tableNumber, setTableNumber] = useLocalStorage('savoria_table_number', '7');
  const [deliveryAddress, setDeliveryAddress] = useLocalStorage('savoria_delivery_addr', '742 Evergreen Terrace, Apt 4B');
  const [orderNotes, setOrderNotes] = useLocalStorage('savoria_order_notes', '');

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(prev => !prev);

  const openCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };
  const closeCheckout = () => setIsCheckoutOpen(false);

  // Cart operations
  const addToCart = (dish, quantity = 1, customNotes = '') => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === dish.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          notes: customNotes || updated[existingIndex].notes,
        };
        return updated;
      }
      return [
        ...prev,
        {
          id: dish.id,
          name: dish.name,
          nameAr: dish.nameAr,
          price: dish.price,
          quantity,
          image: dish.image,
          notes: customNotes,
        },
      ];
    });
  };

  const updateQuantity = (id, delta) => {
    setCartItems(prev => {
      return prev
        .map(item => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  // Coupon handling
  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    const couponInfo = validCoupons[cleanCode];

    if (!couponInfo) {
      return { success: false, message: 'invalidCoupon' };
    }

    if (subtotal < couponInfo.minSpend) {
      return {
        success: false,
        message: `Min spend of $${couponInfo.minSpend} required for code ${cleanCode}`
      };
    }

    setAppliedCoupon({ code: cleanCode, ...couponInfo });
    return { success: true, message: 'couponApplied' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const discountAmount =
    appliedCoupon && subtotal >= appliedCoupon.minSpend
      ? (subtotal * appliedCoupon.discountPercent) / 100
      : 0;

  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const taxAmount = discountedSubtotal * 0.05;

  const deliveryFee =
    orderType === 'delivery'
      ? (subtotal >= 50 || subtotal === 0 ? 0 : 4.99)
      : 0;

  const totalAmount = discountedSubtotal + taxAmount + deliveryFee;
  const totalItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        isCheckoutOpen,
        openCheckout,
        closeCheckout,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        orderType,
        setOrderType,
        tableNumber,
        setTableNumber,
        deliveryAddress,
        setDeliveryAddress,
        orderNotes,
        setOrderNotes,
        subtotal,
        discountAmount,
        taxAmount,
        deliveryFee,
        totalAmount,
        totalItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
