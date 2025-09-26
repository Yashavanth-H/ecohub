// src/app/(app)/buy/page.tsx
'use client';

import { useState, useMemo } from 'react';
import FilterBar from '@/components/marketplace/FilterBar';
import ProductGrid from '@/components/marketplace/ProductGrid';
import { ProductCardProps } from '@/components/products/ProductCard';

// This is our mock database of all products
const allProducts: ProductCardProps[] = [
  { id: '1', name: 'Upcycled Wooden Chair', category: 'Furniture', price: 85.00, imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1965&auto=format&fit=crop' },
  { id: '2', name: 'Recycled Glass Vases', category: 'Home Decor', price: 35.50, imageUrl: 'https://images.unsplash.com/photo-1586799054333-e6315b494f6f?q=80&w=1964&auto=format&fit=crop' },
  { id: '3', name: 'Refurbished Classic Bicycle', category: 'Transport', price: 199.99, imageUrl: 'https://images.unsplash.com/photo-1559348331-46b0a1a0d389?q=80&w=2070&auto=format&fit=crop' },
  { id: '4', name: 'Organic Cotton Tote Bag', category: 'Accessories', price: 15.00, imageUrl: 'https://images.unsplash.com/photo-1594499468121-f45e83e5b1b4?q=80&w=1974&auto=format&fit=crop' },
  { id: '5', name: 'Second-hand Laptop', category: 'Electronics', price: 450.00, imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1926&auto=format&fit=crop' },
  { id: '6', name: 'Reclaimed Wood Coffee Table', category: 'Furniture', price: 220.00, imageUrl: 'https://images.unsplash.com/photo-1549488344-cbb6c144a475?q=80&w=1974&auto=format&fit=crop' },
  { id: '7', name: 'Vintage Leather Jacket', category: 'Accessories', price: 120.00, imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1887&auto=format&fit=crop' },
  { id: '8', name: 'Used Android Smartphone', category: 'Electronics', price: 150.00, imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=1965&auto=format&fit=crop' },
];


export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All'); // We can add this to the data later

  // useMemo will re-calculate the filtered products only when a filter changes
  const filteredProducts = useMemo(() => {
    let products = allProducts;

    if (searchQuery) {
      products = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (selectedCategory !== 'All') {
      products = products.filter(p => p.category === selectedCategory);
    }
    
    // Condition filter would go here if we add 'condition' to the product data

    return products;
  }, [searchQuery, selectedCategory]);

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Marketplace</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <FilterBar 
          onSearchChange={setSearchQuery}
          onCategoryChange={setSelectedCategory}
          onConditionChange={setSelectedCondition}
          productCount={filteredProducts.length}
        />
        <div className="w-full">
          <ProductGrid products={filteredProducts} />
        </div>
      </div>
    </div>
  );
}