'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { Trash2, ShoppingCart, Loader2, Minus, Plus } from 'lucide-react';

// Interface for a single item in the cart
interface CartItem {
  cart_item_id: number;
  product_id: string;
  title: string;
  price: number;
  image_url: string;
  quantity: number;
  category_name: string;
}

const CartPage = () => {
  const { isLoaded, userId, getToken } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Fetch Cart Data ---
  const fetchCart = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const response = await fetch('http://localhost:5001/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart data.');
      }

      const data = await response.json();
      setCartItems(data.items);
    } catch (err: any) {
      console.error('Cart fetch error:', err);
      setError('Error loading cart. Please try logging out and back in.');
    } finally {
      setLoading(false);
    }
  }, [userId, getToken]);

  useEffect(() => {
    if (isLoaded) {
      fetchCart();
    }
  }, [isLoaded, fetchCart]);


  // --- Helper Functions ---

  const calculateTotal = (items: CartItem[]) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleRemoveItem = async (itemId: number) => {
    if (!confirm('Are you sure you want to remove this item?')) return;
    
    try {
        const token = await getToken();
        const response = await fetch(`http://localhost:5001/api/cart/items/${itemId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
            throw new Error('Failed to remove item.');
        }

        // Update the state locally by filtering out the removed item
        setCartItems(prev => prev.filter(item => item.cart_item_id !== itemId));
        alert('Item removed successfully!');

    } catch (err: any) {
        console.error('Remove item error:', err);
        alert(`Error removing item: ${err.message}`);
    }
  };

  // --------------------------------------------------------
  // --- UPDATED: Connects to the PATCH API endpoint ---
  // --------------------------------------------------------
  const handleUpdateQuantity = async (itemId: number, type: 'increase' | 'decrease') => {
      const itemToUpdate = cartItems.find(item => item.cart_item_id === itemId);
      if (!itemToUpdate) return;

      let newQuantity = type === 'increase' ? itemToUpdate.quantity + 1 : itemToUpdate.quantity - 1;
      if (newQuantity < 1) return; // Prevents negative quantity

      try {
          const token = await getToken();
          
          const response = await fetch(`http://localhost:5001/api/cart/items/${itemId}`, {
              method: 'PATCH', // Use PATCH verb for updating a resource
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({ newQuantity }),
          });

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Failed to update item quantity.');
          }

          // Update the state locally only after successful API response
          setCartItems(prev => prev.map(item => {
              if (item.cart_item_id === itemId) {
                  return { ...item, quantity: newQuantity };
              }
              return item;
          }));

      } catch (err: any) {
          console.error('Update quantity error:', err);
          alert(`Error updating quantity: ${err.message}`);
      }
  };
  // --------------------------------------------------------


  // --- Render States (JSX) ---

  if (!isLoaded || loading) {
    return (
      <div className="text-center p-16">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin mx-auto mb-4" />
        <p>Loading your cart...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-16 text-red-600 font-semibold">{error}</div>;
  }

  if (!userId) {
    return <div className="text-center p-16 text-gray-600">Please sign in to view your cart.</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center p-16 text-gray-500">
        <ShoppingCart className="w-12 h-12 mx-auto mb-4" />
        <h3 className="text-xl font-semibold">Your shopping cart is empty.</h3>
        <p className="mt-2">Time to find some great pre-owned items!</p>
        <Link href="/buy" className="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
            Start Shopping
        </Link>
      </div>
    );
  }

  const total = calculateTotal(cartItems);
  // --- NEW: Checkout Function ---
const handleCheckout = async () => {
    if (cartItems.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    // For MVP, we use a simple prompt for the address
    const address = prompt("Please enter your shipping address to confirm checkout:");
    if (!address) return; // User cancelled the prompt

    try {
        const token = await getToken();
        
        const response = await fetch('http://localhost:5001/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ shippingAddress: address }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Checkout failed.');
        }

        const data = await response.json();
        
        // On success, clear the cart and redirect/alert
        setCartItems([]); // Clear local cart state
        alert(`Order ${data.orderId} placed successfully! Total: $${data.totalPrice}`);

    } catch (error) {
        console.error('Checkout API error:', error);
        alert(`Checkout Failed: ${error}`);
    }
};

// ... inside the final return JSX ...
// Find the "Proceed to Checkout" button and update the onClick handler:

// Right Column: Summary & Checkout
<div className="w-full lg:w-80 bg-white p-6 rounded-xl shadow-lg border border-gray-200 sticky top-24 h-fit">
  {/* ... summary details ... */}
  
  <button 
    onClick={handleCheckout} // <-- ADD THIS HANDLER
    className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition"
    disabled={cartItems.length === 0} // Disable if cart is empty
  >
    Proceed to Checkout
  </button>
  
  {/* ... */}
</div>

  // --- Main Cart View ---
  return (
    <div className="container mx-auto p-6 md:p-10">
      <h2 className="text-3xl font-bold mb-8">Your Cart ({cartItems.length} items)</h2>
      
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Cart Items */}
        <div className="flex-1 space-y-6">
          {cartItems.map((item) => (
            <div key={item.cart_item_id} className="flex items-center bg-white border border-gray-200 rounded-xl p-4 shadow-md">
              
              {/* Item Image */}
              <img 
                src={item.image_url} 
                alt={item.title} 
                className="w-24 h-24 object-cover rounded-md mr-4 border"
              />
              
              {/* Item Details */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
                <p className="text-sm text-gray-500 capitalize">{item.category_name}</p>
                <p className="text-xl font-extrabold text-green-600 mt-1">${(item.price * item.quantity).toFixed(2)}</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center space-x-2 mx-4">
                <button 
                    // Updated handler to send the item ID and action type
                    onClick={() => handleUpdateQuantity(item.cart_item_id, 'decrease')}
                    className="p-2 border rounded-full hover:bg-gray-100 disabled:opacity-50"
                    disabled={item.quantity <= 1}
                >
                    <Minus className="w-4 h-4" />
                </button>
                <span className="font-semibold">{item.quantity}</span>
                <button 
                    // Updated handler to send the item ID and action type
                    onClick={() => handleUpdateQuantity(item.cart_item_id, 'increase')}
                    className="p-2 border rounded-full hover:bg-gray-100"
                >
                    <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Remove Button */}
              <button 
                onClick={() => handleRemoveItem(item.cart_item_id)}
                className="text-red-500 hover:text-red-700 ml-4 p-2 transition"
                title="Remove Item"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Right Column: Summary & Checkout */}
        <div className="w-full lg:w-80 bg-white p-6 rounded-xl shadow-lg border border-gray-200 sticky top-24 h-fit">
          <h3 className="text-xl font-bold mb-4 border-b pb-2">Order Summary</h3>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({cartItems.length} items)</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between text-2xl font-extrabold text-gray-900 border-t pt-3">
              <span>Order Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          
         <Link 
    href="/checkout" 
    className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition text-center block"
>
    Proceed to Checkout
</Link>
          
          <p className="text-xs text-gray-500 mt-4 text-center">
            *Shipping is free for all circular economy items.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartPage;