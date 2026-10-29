import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { initialReservations } from '../data/mockData';

const ReservationContext = createContext();

export function ReservationProvider({ children }) {
  const [reservations, setReservations] = useLocalStorage('savoria_reservations', initialReservations);

  const createReservation = (bookingData) => {
    const newReservation = {
      id: `RES-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      status: 'Confirmed',
      ...bookingData,
    };

    setReservations(prev => [newReservation, ...prev]);
    return newReservation;
  };

  const updateReservationStatus = (id, newStatus) => {
    setReservations(prev =>
      prev.map(res => (res.id === id ? { ...res, status: newStatus } : res))
    );
  };

  const getUserReservations = (email) => {
    if (!email) return [];
    return reservations.filter(r => r.customerEmail?.toLowerCase() === email.toLowerCase());
  };

  return (
    <ReservationContext.Provider
      value={{
        reservations,
        createReservation,
        updateReservationStatus,
        getUserReservations,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
}

export function useReservations() {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error('useReservations must be used within a ReservationProvider');
  }
  return context;
}
