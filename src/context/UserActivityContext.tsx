'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from '@clerk/nextjs';

// Define the shape of our context state
interface UserActivityContextType {
  cartCount: number;
  favoritesCount: number;
  fetchCartCount: () => void;
  fetchFavoritesCount: () => void;
}

// Create the context
const UserActivityContext = createContext<UserActivityContextType | undefined>(undefined);

// Create the Provider component
export const UserActivityProvider = ({ children }: { children: ReactNode }) => {
  const { getToken, userId } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);

  // Function to fetch cart count
  const fetchCartCount = useCallback(async () => {
    if (!userId) return;
    try {
      const token = await getToken();
      const response = await fetch('http://localhost:5001/api/cart', {
        headers: { 'Authorization': `Bearer ${token}` },
        cache: 'no-store', // Always get fresh data
      });
      if (response.ok) {
        const data = await response.json();
        setCartCount(data.items.length);
      }
    } catch (err) {
      console.error('Failed to fetch cart count', err);
    }
  }, [userId, getToken]);

  // Function to fetch favorites count
  const fetchFavoritesCount = useCallback(async () => {
    if (!userId) return;
    try {
      const token = await getToken();
      const response = await fetch('http://localhost:5001/api/favorites', {
        headers: { 'Authorization': `Bearer ${token}` },
        cache: 'no-store',
      });
      if (response.ok) {
        const data = await response.json();
        setFavoritesCount(data.favorites.length);
      }
    } catch (err) {
      console.error('Failed to fetch favorites count', err);
    }
  }, [userId, getToken]);

  // Fetch counts when the user first loads
  useEffect(() => {
    if (userId) {
      fetchCartCount();
      fetchFavoritesCount();
    }
  }, [userId, fetchCartCount, fetchFavoritesCount]);

  const value = {
    cartCount,
    favoritesCount,
    fetchCartCount,
    fetchFavoritesCount,
  };

  return (
    <UserActivityContext.Provider value={value}>
      {children}
    </UserActivityContext.Provider>
  );
};

// Create a custom hook to easily use the context
export const useUserActivity = () => {
  const context = useContext(UserActivityContext);
  if (context === undefined) {
    throw new Error('useUserActivity must be used within a UserActivityProvider');
  }
  return context;
};
