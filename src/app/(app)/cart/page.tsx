// src/app/(app)/cart/page.tsx
import CartClientPage from '@/components/cart/CartClientPage';

export default function CartPage() {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Shopping Cart
      </h1>
      <CartClientPage />
    </div>
  );
}