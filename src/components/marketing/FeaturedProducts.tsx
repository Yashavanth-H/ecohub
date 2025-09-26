// src/components/marketing/FeaturedProducts.tsx
import ProductCard, { ProductCardProps } from '@/components/products/ProductCard';

// In a real application, you would fetch this data from an API
const mockProducts: ProductCardProps[] = [
  { id: '1', name: 'Upcycled Wooden Chair', category: 'Furniture', price: 85.00, imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1965&auto=format&fit=crop' },
  { id: '2', name: 'Recycled Glass Vases', category: 'Home Decor', price: 35.50, imageUrl: 'https://images.unsplash.com/photo-1586799054333-e6315b494f6f?q=80&w=1964&auto=format&fit=crop' },
  { id: '3', name: 'Refurbished Classic Bicycle', category: 'Transport', price: 199.99, imageUrl: 'https://images.unsplash.com/photo-1559348331-46b0a1a0d389?q=80&w=2070&auto=format&fit=crop' },
  { id: '4', name: 'Organic Cotton Tote Bag', category: 'Accessories', price: 15.00, imageUrl: 'https://images.unsplash.com/photo-1594499468121-f45e83e5b1b4?q=80&w=1974&auto=format&fit=crop' },
];

const FeaturedProducts = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;