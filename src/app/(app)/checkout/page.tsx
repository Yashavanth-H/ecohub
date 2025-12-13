'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Loader2, Package, MapPin, ShieldCheck, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { MockPaymentGateway } from '@/components/checkout/MockPaymentGateway';

interface CartItem {
  cart_item_id: number;
  product_id: string;
  title: string;
  price: string;
  quantity: number;
  image_url: string;
}

const CheckoutPage = () => {
  const { isLoaded, userId, getToken } = useAuth();
  const router = useRouter();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingAddress, setShippingAddress] = useState('');
  const [loading, setLoading] = useState(true);

  // Payment Modal State
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // --- Fetch Cart Data ---
  const fetchCart = useCallback(async () => {
    if (!userId) return;
    try {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");

      const response = await fetch('http://localhost:5001/api/cart', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch cart data.');
      const data = await response.json();
      setCartItems(data.items);

    } catch (err: any) {
      console.error('Cart fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, getToken]);

  useEffect(() => {
    if (isLoaded && userId) {
      fetchCart();
    }
  }, [isLoaded, userId, fetchCart]);

  // --- Order Placement Logic ---
  const handlePaymentSuccess = async (paymentDetails: { method: string; transactionId: string }) => {
    setIsPlacingOrder(true);
    setShowPaymentGateway(false); // Close modal, show global loader if needed or just wait

    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication failed");

      const response = await fetch('http://localhost:5001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          shippingAddress: shippingAddress,
          paymentMethod: paymentDetails.method,
          transactionId: paymentDetails.transactionId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Order placement failed.');
      }

      const data = await response.json();

      // Success!
      setCartItems([]);
      router.push('/orders'); // Redirect to orders page

    } catch (error: any) {
      console.error('Order Error:', error);
      alert(`Order placement failed: ${error.message}`);
      setIsPlacingOrder(false);
    }
  };

  // --- Calculations ---
  const subtotal = cartItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  const orderTotal = subtotal; // Free shipping

  // --- Initial Loading ---
  if (!isLoaded || loading) {
    return <div className="h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 text-green-600 animate-spin" /></div>;
  }

  // --- Empty Cart ---
  if (cartItems.length === 0 && !loading && !isPlacingOrder) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <Package className="w-20 h-20 text-gray-300 mb-6" />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h3>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
        <Link href="/buy" className="px-8 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1">
          <ShoppingCart className="w-5 h-5 mr-2" /> Start Shopping
        </Link>
      </div>
    );
  }

  // --- Checkout UI ---
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
          <ShieldCheck className="w-8 h-8 text-green-600 mr-3" />
          Secure Checkout
        </h1>
        <div className="text-sm text-gray-500 flex items-center bg-gray-50 px-4 py-2 rounded-full border">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
          100% Safe & Secure Payments
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* Left Column: Shipping Address */}
        <div className="flex-1 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 flex items-center text-gray-800">
              <MapPin className="w-5 h-5 mr-2 text-blue-600" /> Shipping Address
            </h2>
            <div className="relative">
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Enter your full delivery address (House No, Street, City, Pincode)..."
                className="w-full border-2 border-gray-200 rounded-xl p-4 min-h-[150px] focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all text-gray-700 placeholder:text-gray-400 resize-none text-base"
                required
              />
              {!shippingAddress && (
                <div className="absolute top-4 right-4 text-xs text-red-500 font-medium">* Required</div>
              )}
            </div>
          </div>

          {/* Cart Items Preview (Mobile only, hidden on LG) */}
          <div className="lg:hidden bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Items ({cartItems.length})</h3>
            {cartItems.map(item => (
              <div key={item.product_id} className="flex gap-4 mb-4 last:mb-0">
                <img src={item.image_url} alt={item.title} className="w-16 h-16 object-cover rounded-md bg-gray-100" />
                <div>
                  <p className="text-sm font-medium line-clamp-1">{item.title}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  <p className="text-sm font-semibold">₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Order Summary & Actions */}
        <div className="w-full lg:w-[400px]">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Order Summary</h2>

            <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar hidden lg:block">
              {cartItems.map(item => (
                <div key={item.product_id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={item.image_url} alt="" className="w-10 h-10 rounded object-cover bg-gray-100" />
                      <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                        {item.quantity}
                      </span>
                    </div>
                    <span className="text-gray-600 truncate max-w-[140px]">{item.title}</span>
                  </div>
                  <span className="font-medium">₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600 font-medium">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between text-2xl font-bold text-gray-900 pt-3 border-t">
                <span>Total</span>
                <span>₹{orderTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setShowPaymentGateway(true)}
              disabled={!shippingAddress.trim() || isPlacingOrder}
              className="w-full mt-8 bg-black hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {isPlacingOrder ? (
                <><Loader2 className="animate-spin" /> Processing Order...</>
              ) : (
                <>Proceed to Payment &rarr;</>
              )}
            </button>

            {!shippingAddress.trim() && (
              <p className="text-xs text-center text-red-500 mt-3">
                Please enter a shipping address to proceed.
              </p>
            )}

            <div className="mt-6 flex justify-center gap-2 grayscale opacity-50">
              {/* Trust Badges */}
              <div className="h-6 w-10 bg-gray-200 rounded"></div>
              <div className="h-6 w-10 bg-gray-200 rounded"></div>
              <div className="h-6 w-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MOCK PAYMENT GATEWAY --- */}
      {showPaymentGateway && (
        <MockPaymentGateway
          amount={orderTotal}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setShowPaymentGateway(false)}
        />
      )}
    </div>
  );
};

export default CheckoutPage;

