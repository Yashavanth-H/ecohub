// src/components/favorites/FavoritesClientPage.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import ProductCard, { ProductCardProps } from '@/components/products/ProductCard';

// Mock data for favorite items
const initialFavorites: ProductCardProps[] = [
  { id: '3', name: 'Refurbished Classic Bicycle', category: 'Transport', price: 199.99, imageUrl: 'https://images.unsplash.com/photo-1559348331-46b0a1a0d389?q=80&w=2070&auto=format&fit=crop' },
  { id: '7', name: 'Vintage Leather Jacket', category: 'Accessories', price: 120.00, imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1887&auto=format&fit=crop' },
  { id: '6', name: 'Reclaimed Wood Coffee Table', category: 'Furniture', price: 220.00, imageUrl: 'https://images.unsplash.com/photo-1549488344-cbb6c144a475?q=80&w=1974&auto=format&fit=crop' },
];

const FavoritesClientPage = () => {
  const [favorites, setFavorites] = useState<ProductCardProps[]>(initialFavorites);

  // In a real app, a "Remove" button on each card would call this function
  const handleRemoveFavorite = (id: string) => {
    setFavorites(favorites.filter(item => item.id !== id));
    console.log(`Removed favorite ${id}`);
  };

  if (favorites.length === 0) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">You have no favorites yet.</h2>
        <p className="text-gray-600 mb-6">Browse the marketplace and click the heart on any item to save it here.</p>
        <Link href="/buy" className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700">
          Find Items to Love
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {favorites.map((product) => (
        // Here we could wrap ProductCard to add a "Remove" button,
        // but for now we'll just display the card.
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
};

export default FavoritesClientPage;