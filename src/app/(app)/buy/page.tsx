'use client';

import { useState, useEffect, useCallback } from 'react';
import ProductCard from '@/components/marketplace/ProductCard';
import FilterBar from '@/components/marketplace/FilterBar';
import { Frown } from 'lucide-react';

interface Product {
  product_id: string;
  title: string;
  price: string;
  condition: string;
  image_url: string;
  category_name: string;
  seller_username: string;
}

export type Filters = {
  search: string;
  category: string | undefined;
  condition: string | undefined;
};

const BuyPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<Filters>({
    search: '',
    category: undefined,
    condition: undefined,
  });

  const fetchProducts = useCallback(async (currentFilters: Filters) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (currentFilters.search) params.append('search', currentFilters.search);
      if (currentFilters.category) params.append('category', String(currentFilters.category));
      if (currentFilters.condition) params.append('condition', currentFilters.condition);

      const queryString = params.toString();
      const url = `http://localhost:5001/api/products${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch marketplace products.');

      const data = await response.json();
      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Could not connect to the marketplace. Please check the backend server.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // refetch when filters change
  useEffect(() => {
    fetchProducts(filters);
  }, [fetchProducts, filters]);

  // only update when filters actually change
  const handleFilterChange = useCallback((newFilters: Filters) => {
    setFilters((prev) => {
      if (
        prev.search === newFilters.search &&
        prev.category === newFilters.category &&
        prev.condition === newFilters.condition
      ) {
        return prev;
      }
      return newFilters;
    });
  }, []);

  if (loading) {
    return <div className="text-center p-10 text-lg font-medium">Loading the circular marketplace...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-600 font-semibold">{error}</div>;
  }

  return (
    <div className="mx-auto p-6 pt-10">
      <h2 className="text-3xl font-bold mb-4">Marketplace</h2>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <FilterBar onFilterChange={handleFilterChange} productsCount={products.length} />
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="text-center p-10 text-gray-500 mt-10">
              <Frown className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold">No items match your search criteria.</h3>
              <p className="mt-2">Try resetting the filters or checking back later.</p>
            </div>
          ) : (
            <>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.product_id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyPage;
