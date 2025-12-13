'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import ProductCard from '@/components/marketplace/ProductCard'; 
import Link from 'next/link';
import { Heart, Loader2 } from 'lucide-react';

// This interface now matches the ProductCard's full requirements
interface FavoriteProduct {
  product_id: string;
  title: string;
  price: string;
  image_url: string;
  category_name: string; 
  seller_username: string; 
  condition: string; 
}

const FavoritesPage = () => {
  const { isLoaded, userId, getToken } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const response = await fetch('http://localhost:5001/api/favorites', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch favorites.');
      }

      const data = await response.json();
      
      // The API now sends all data directly, so no placeholders are needed.
      setFavorites(data.favorites);

    } catch (err: any) {
      console.error('Favorites fetch error:', err);
      setError('Error loading favorites. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [userId, getToken]);

  useEffect(() => {
    if (isLoaded) {
      fetchFavorites();
    }
  }, [isLoaded, fetchFavorites]);

  if (!isLoaded || loading) {
    return (
      <div className="text-center p-16">
        <Loader2 className="w-8 h-8 text-red-600 animate-spin mx-auto mb-4" />
        <p>Loading your favorites...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-16 text-red-600 font-semibold">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 flex items-center text-red-600">
        <Heart className="w-8 h-8 mr-3 fill-red-600" /> Your Wishlist ({favorites.length})
      </h2>
      
      {favorites.length === 0 ? (
        <div className="text-center p-10 text-gray-500 border border-dashed rounded-lg mt-10">
          <p className="text-xl font-semibold">Your favorites list is empty.</p>
          <p className="mt-2">Click the heart icon on any product to save it here!</p>
          <Link href="/buy" className="mt-4 inline-block text-blue-600 hover:underline">
            Browse the Marketplace
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favorites.map((product) => (
            // We pass initialIsFavorite={true} to keep the heart red
            <ProductCard 
                key={product.product_id} 
                product={product} 
                initialIsFavorite={true} 
            /> 
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;

