import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { demoUsers } from '../data/mockData';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usersDb, setUsersDb] = useLocalStorage('savoria_users_db', demoUsers);
  // Default with guest demo user preloaded for instant great UX, or null
  const [currentUser, setCurrentUser] = useLocalStorage('savoria_auth_user', demoUsers[1]); // Guest user
  const [authError, setAuthError] = useState(null);

  const login = (email, password) => {
    setAuthError(null);
    const found = usersDb.find(
      u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );

    if (found) {
      setCurrentUser(found);
      return { success: true, user: found };
    } else {
      const errorMsg = 'Invalid email or password';
      setAuthError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const quickLogin = (role = 'customer') => {
    setAuthError(null);
    const targetUser = usersDb.find(u => u.role === role) || demoUsers.find(u => u.role === role);
    if (targetUser) {
      setCurrentUser(targetUser);
      return { success: true, user: targetUser };
    }
    return { success: false };
  };

  const register = ({ name, email, password, phone = '' }) => {
    setAuthError(null);
    const normalizedEmail = email.trim().toLowerCase();
    const existing = usersDb.find(u => u.email.toLowerCase() === normalizedEmail);

    if (existing) {
      const errorMsg = 'An account with this email already exists';
      setAuthError(errorMsg);
      return { success: false, error: errorMsg };
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      nameAr: name.trim(),
      email: normalizedEmail,
      password,
      role: 'customer',
      avatar: `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(name)}`,
      phone: phone.trim(),
    };

    const updatedList = [...usersDb, newUser];
    setUsersDb(updatedList);
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
    setAuthError(null);
  };

  const updateProfile = (updatedFields) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);
    setUsersDb(prev => prev.map(u => (u.id === currentUser.id ? updated : u)));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        role: currentUser?.role || null,
        isAdmin: currentUser?.role === 'admin',
        isCustomer: currentUser?.role === 'customer',
        authError,
        login,
        quickLogin,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
