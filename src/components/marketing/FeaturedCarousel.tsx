// src/components/marketing/FeaturedCarousel.tsx
'use client';

// @ts-expect-error: Splide types are not properly exported
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';
import ProductCard, { ProductCardProps } from '@/components/products/ProductCard';
import Link from 'next/link'; 

// Import the Splide CSS
import '@splidejs/react-splide/css';

// ✅ Import your local images
import fridge from '@/app/assets/fridge.jpeg';
import gyser from '@/app/assets/gyser.jpeg';
import soundBar from '@/app/assets/soundBar.jpeg';
import washingmachine from '@/app/assets/washingmachine.jpeg';

// ✅ Use local images below — no other changes
const featuredProducts: ProductCardProps[] = [
  { id: '1', name: 'Smart Refrigerator', category: 'Appliances', price: 850.00, imageUrl: fridge.src },
  { id: '2', name: 'Instant Geyser', category: 'Home Appliances', price: 120.00, imageUrl: gyser.src },
  { id: '3', name: 'Dolby Sound Bar', category: 'Electronics', price: 299.99, imageUrl: soundBar.src },
  { id: '4', name: 'Washing Machine', category: 'Appliances', price: 450.00, imageUrl: washingmachine.src },
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
      1024: { perPage: 2 },
      768: { perPage: 1 },
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
