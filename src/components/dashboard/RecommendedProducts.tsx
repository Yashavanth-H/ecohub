'use client';

// 1. We MUST import useCallback to prevent infinite loops
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';

// 2. THIS IS THE FIX: Use the correct project alias
import ProductCard from '@/components/marketplace/ProductCard'; 
import { Loader2, Lightbulb } from 'lucide-react';

// Define the Product interface to match what ProductCard expects
interface Product {
  product_id: string;
  title: string;
  price: string;
  condition: string;
  image_url: string;
  category_name: string;
  seller_username: string;
}

const RecommendedProducts = () => {
  const { getToken, userId } = useAuth();
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // 3. We wrap the fetch logic in useCallback.
  // This tells React that this function is stable and won't change
  // on every render, which stops the infinite loop.
  const fetchRecommendations = useCallback(async () => {
    // 4. We check for userId *before* setting loading to true
    if (!userId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const token = await getToken();
      // 5. We must check if the token exists before using it
      if (!token) {
        throw new Error("User token not found.");
      }

      const response = await fetch('http://localhost:5001/api/recommendations', {
        headers: { 'Authorization': `Bearer ${token}` }, // This is now safe
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations.');
      }

      const data = await response.json();
      
      // 6. We must check that data.recommendations is an array
      if (Array.isArray(data.recommendations)) {
        // Fill in the missing data required by ProductCard
        const fullProducts = data.recommendations.map((p: any) => ({
          ...p,
          condition: p.condition || 'Used',
          seller_username: p.seller_username || 'Marketplace'
        }));
        setRecommendations(fullProducts);
      } else {
        // If API returns a bad response, default to an empty array
        setRecommendations([]);
      }

    } catch (err: unknown) { // 7. Correct TypeScript error handling
      console.error(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userId, getToken]); // The function only re-runs if these change
  
  // 8. This useEffect now safely calls the memoized function ONCE
  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]); 

  if (loading) {
    return (
      <div className="text-center p-10">
        <Loader2 className="w-6 h-6 animate-spin mx-auto" />
      </div>
    );
  }

  if (recommendations.length === 0) {
    // Don't show anything if there are no recommendations
    return null; 
  }

  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold mb-8 flex items-center">
        <Lightbulb className="w-8 h-8 text-yellow-500 mr-3" /> Just For You
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((product) => (
          // 9. The props here (key, product) are correct
          <ProductCard 
            key={product.product_id} 
            product={product} 
          />
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;

