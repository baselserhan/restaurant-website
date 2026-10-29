import React, { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { initialMenuItems, dishImages } from '../data/mockMenu';

const MenuContext = createContext();

export function MenuProvider({ children }) {
  const [rawMenuItems, setMenuItems] = useLocalStorage('savoria_menu_items_v2', initialMenuItems);

  // Guarantee that dishes with local assets always resolve to the imported image
  const menuItems = useMemo(() => {
    if (!Array.isArray(rawMenuItems) || rawMenuItems.length === 0) return initialMenuItems;
    return rawMenuItems.map(item => {
      if (dishImages[item.id] && (!item.image || item.image.includes('unsplash.com'))) {
        return { ...item, image: dishImages[item.id] };
      }
      return item;
    });
  }, [rawMenuItems]);

  const addMenuItem = (item) => {
    const newItem = {
      id: `dish-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
      isAvailable: true,
      ...item,
    };
    setMenuItems(prev => [newItem, ...prev]);
    return newItem;
  };

  const updateMenuItem = (id, updatedFields) => {
    setMenuItems(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updatedFields } : item))
    );
  };

  const toggleAvailability = (id) => {
    setMenuItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  const deleteMenuItem = (id) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  const resetToDefaultMenu = () => {
    setMenuItems(initialMenuItems);
  };

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        addMenuItem,
        updateMenuItem,
        toggleAvailability,
        deleteMenuItem,
        resetToDefaultMenu,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}
