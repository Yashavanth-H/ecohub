'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useParams, useRouter } from 'next/navigation';
import { Package, X, Loader2, DollarSign } from 'lucide-react';

interface OrderItem {
  title: string;
  price_at_purchase: number;
  image_url: string;
  quantity: number;
  category_name: string;
}

const OrderDetailsPage = () => {
  const { getToken, userId } = useAuth();
  const params = useParams();
  const router = useRouter();
  
  const orderId = params.orderId as string;
  
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // --- Fetch Items Data ---
  const fetchOrderItems = useCallback(async () => {
    if (!userId || !orderId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const response = await fetch(`http://localhost:5001/api/orders/${orderId}/items`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch order details.');
      }

      const data = await response.json();
      setItems(data.items);
    } catch (err: any) {
      console.error('Order item fetch error:', err);
      setError('Error loading item details. Access denied or order ID is invalid.');
    } finally {
      setLoading(false);
    }
  }, [userId, orderId, getToken]);

  useEffect(() => {
    fetchOrderItems();
  }, [fetchOrderItems]);

  const calculateTotal = (orderItems: OrderItem[]) => {
    return orderItems.reduce((total, item) => total + (item.price_at_purchase * item.quantity), 0);
  };
  
  if (loading) {
    return <div className="text-center p-16"><Loader2 className="w-8 h-8 text-green-600 animate-spin mx-auto mb-4" /></div>;
  }

  if (error) {
    return <div className="text-center p-16 text-red-600 font-semibold">{error}</div>;
  }

  const total = calculateTotal(items);

  // --- Main Order Items View ---
  return (
    <div className="container mx-auto p-6 md:p-10">
      <div className="bg-white shadow-xl rounded-xl max-w-3xl mx-auto">
        <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Order Items</h2>
            <button 
                onClick={() => router.back()} // Go back to the order history page
                className="p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100"
            >
                <X className="w-6 h-6" />
            </button>
        </div>
        
        <div className="p-6 space-y-4">
            {items.map((item, index) => (
                <div key={index} className="flex items-start border-b pb-4 last:border-b-0">
                    <img 
                        src={item.image_url} 
                        alt={item.title} 
                        className="w-20 h-20 object-cover rounded-md mr-4"
                    />
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <p className="text-sm text-gray-500 capitalize">{item.category_name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                            {/* FIX 1: Parse the price string to a float before multiplication and formatting */}
                            ${(parseFloat(item.price_at_purchase) * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-400">
                            {/* FIX 2: Parse the price string to a float before formatting */}
                            @ ${parseFloat(item.price_at_purchase).toFixed(2)}
                        </p>
                    </div>
                </div>
            ))}
        </div>
        
        {/* Summary Footer */}
        <div className="p-6 bg-gray-50 border-t">
            <div className="flex justify-between text-xl font-extrabold text-gray-900">
                <span>Total Paid</span>
                {/* FIX 3: Parse the 'total' variable (which might be a string from reduce) and format it */}
                <span>${parseFloat(total).toFixed(2)}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;