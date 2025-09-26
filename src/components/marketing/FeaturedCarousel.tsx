// src/components/marketing/FeaturedCarousel.tsx
'use client';

import { Splide, SplideSlide } from '@splidejs/react-splide';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';
import ProductCard, { ProductCardProps } from '@/components/products/ProductCard';
import Link from 'next/link'; // <-- 1. Make sure Link is imported

// Import the Splide CSS
import '@splidejs/react-splide/css';

const featuredProducts: ProductCardProps[] = [
  { id: '1', name: 'Upcycled Wooden Chair', category: 'Furniture', price: 85.00, imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1965&auto.format&fit=crop' },
  { id: '2', name: 'Recycled Glass Vases', category: 'Home Decor', price: 35.50, imageUrl: 'https://images.unsplash.com/photo-1586799054333-e6315b494f6f?q=80&w=1964&auto.format&fit=crop' },
  { id: '3', name: 'Refurbished Classic Bicycle', category: 'Transport', price: 199.99, imageUrl: 'https://images.unsplash.com/photo-1559348331-46b0a1a0d389?q=80&w=2070&auto.format&fit=crop' },
  { id: '5', name: 'Second-hand Laptop', category: 'Electronics', price: 450.00, imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1926&auto.format&fit=crop' },
  { id: '6', name: 'Reclaimed Wood Coffee Table', category: 'Furniture', price: 220.00, imageUrl: 'https://images.unsplash.com/photo-1549488344-cbb6c144a475?q=80&w=1974&auto.format&fit=crop' },
  { id: '7', name: 'Vintage Leather Jacket', category: 'Accessories', price: 120.00, imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1887&auto.format&fit=crop' },
];

const FeaturedCarousel = () => {
  const splideOptions = {
    type: 'loop',
    drag: 'free',
    focus: 'center',
    gap: '1rem',
    perPage: 3,
    autoScroll: {
      speed: 4,
      pauseOnHover: true,
    },
    breakpoints: {
      1024: {
        perPage: 2,
      },
      768: {
        perPage: 1,
      },
    },
  };

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Freshly Listed Items
        </h2>
        <Splide options={splideOptions} extensions={{ AutoScroll }}>
          {featuredProducts.map((product) => (
            <SplideSlide key={product.id}>
              <ProductCard {...product} />
            </SplideSlide>
          ))}
        </Splide>
        
        {/* --- NEW BUTTON SECTION --- */}
        <div className="text-center mt-12">
          <Link
            href="/buy"
            className="bg-green-600 text-white font-bold py-4 px-10 rounded-full text-lg hover:bg-green-700 transition duration-300 inline-block shadow-lg transform hover:scale-105"
          >
            Explore All Products
          </Link>
        </div>
        
      </div>
    </section>
  );
};

export default FeaturedCarousel;