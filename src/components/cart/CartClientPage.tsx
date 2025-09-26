// src/components/cart/CartClientPage.tsx
'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus } from 'lucide-react';
import { ProductCardProps } from '@/components/products/ProductCard';

// Add a 'quantity' property to our product type for the cart
type CartItemProps = ProductCardProps & {
  quantity: number;
};

// Mock data for items in the cart
const initialCartItems: CartItemProps[] = [
  { id: '1', name: 'Upcycled Wooden Chair', category: 'Furniture', price: 85.00, imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1965&auto=format&fit=crop', quantity: 1 },
  { id: '4', name: 'Organic Cotton Tote Bag', category: 'Accessories', price: 15.00, imageUrl: 'https://images.unsplash.com/photo-1594499468121-f45e83e5b1b4?q=80&w=1974&auto=format&fit=crop', quantity: 3 },
];

const CartClientPage = () => {
  const [cartItems, setCartItems] = useState<CartItemProps[]>(initialCartItems);

  const subtotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const shippingCost = subtotal > 0 ? 5.00 : 0;
  const total = subtotal + shippingCost;

  // Handlers for cart actions (for now they just log to console)
  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    console.log(`Removed item ${id}`);
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
    console.log(`Changed quantity for item ${id} to ${newQuantity}`);
  };
  
  // Handle Empty Cart
  if (cartItems.length === 0) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/buy" className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items List (Left/Main Column) */}
      <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Your Items ({cartItems.length})</h2>
        <div className="space-y-4">
          {cartItems.map(item => (
            <div key={item.id} className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center space-x-4">
                <Image src={item.imageUrl} alt={item.name} width={80} height={80} className="rounded-md object-cover" />
                <div>
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded-md">
                  <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)} className="px-2 py-1"><Minus size={16}/></button>
                  <span className="px-3">{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)} className="px-2 py-1"><Plus size={16}/></button>
                </div>
                <button onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-700"><Trash2 size={20}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary (Right/Side Column) */}
      <div className="bg-white p-6 rounded-lg shadow-md h-fit">
        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between"><p>Subtotal</p><p>${subtotal.toFixed(2)}</p></div>
          <div className="flex justify-between"><p>Shipping</p><p>${shippingCost.toFixed(2)}</p></div>
          <div className="border-t my-2"></div>
          <div className="flex justify-between font-bold text-lg"><p>Total</p><p>${total.toFixed(2)}</p></div>
        </div>
        <button className="w-full mt-6 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartClientPage;