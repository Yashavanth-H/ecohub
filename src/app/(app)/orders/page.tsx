'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { Loader2, List, Package, DollarSign } from 'lucide-react';

// This interface matches the data from your GET /api/orders endpoint
interface Order {
  order_id: string;
  total_price: string; // Comes from DB as string
  status: string;
  created_at: string;
  shipping_address: string;
}

const OrderHistoryPage = () => {
  const { isLoaded, userId, getToken } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Fetch Orders Data ---
  const fetchOrders = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");

      const response = await fetch('http://localhost:5001/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch order history.');
      }

      const data = await response.json();
      setOrders(data.orders);
    } catch (err: any) {
      console.error('Order history fetch error:', err);
      setError('Error loading order history. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [userId, getToken]);

  useEffect(() => {
    if (isLoaded) {
      fetchOrders();
    }
  }, [isLoaded, fetchOrders]);
  
  // Helper to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', { // Use 'en-IN' for Indian date format
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  // Helper to style status badge
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // --- Render States ---
  if (!isLoaded || loading) {
    return (
      <div className="text-center p-16">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin mx-auto mb-4" />
        <p>Loading your order history...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-16 text-red-600 font-semibold">{error}</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center p-16 text-gray-500">
        <List className="w-12 h-12 mx-auto mb-4" />
        <h3 className="text-xl font-semibold">You have no past orders.</h3>
        <p className="mt-2">Start your circular economy journey on the Buy page!</p>
      </div>
    );
  }

  // --- Main Order History View ---
  return (
    <div className="container mx-auto p-6 md:p-10">
      <h2 className="text-3xl font-bold mb-8 flex items-center">
        <List className="w-8 h-8 text-green-600 mr-3" /> Your Order History ({orders.length})
      </h2>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.order_id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-md transition hover:shadow-lg">
            
            <div className="flex justify-between items-start border-b pb-4 mb-4">
              {/* Order ID and Date */}
              <div>
                <p className="text-sm text-gray-500">Order Placed:</p>
                <p className="font-semibold text-gray-800">{formatDate(order.created_at)}</p>
                <p className="text-xs text-gray-400 mt-1">ID: {order.order_id.substring(0, 8)}...</p>
              </div>
              
              {/* Status Badge */}
              <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusStyle(order.status)}`}>
                {order.status}
              </span>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                
                <p>
                    <span className="font-medium text-gray-600 flex items-center mb-1"><DollarSign className="w-4 h-4 mr-1"/> Total Paid:</span>
                    {/* Fix: Parse string to float before formatting */}
                    <span className="text-xl font-extrabold text-green-600">₹{parseFloat(order.total_price).toFixed(2)}</span>
                </p>

                <p className="md:col-span-2">
                    <span className="font-medium text-gray-600 flex items-center mb-1"><Package className="w-4 h-4 mr-1"/> Ship To:</span>
                    <span className="text-gray-700">{order.shipping_address}</span>
                </p>
            </div>
            
            {/* This button will link to the Order Details page we built */}
            <Link href={`/orders/${order.order_id}`} className="mt-4 text-sm text-blue-600 hover:underline inline-block">
                View Item Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
// ```

// ---

// ### Step 2: Add a Link to Your Navigation

// Finally, let's add a permanent link to this new page in your `DashboardNav`.

// **File:** `ecohub/src/components/dashboard/DashboardNav.tsx`
// **Action:** Add the `<Link href="/orders">` component inside the `<SignedIn>` block.

// ```tsx
// // Inside DashboardNav.tsx, in the main links section
// // ...
//               <SignedIn>
//                 <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-green-600 font-medium">
//                   <LayoutDashboard className="w-5 h-5 mr-1" /> Dashboard
//                 </Link>

//                 {/* --- ADD THIS NEW LINK --- */}
//                 <Link href="/orders" className="flex items-center text-gray-600 hover:text-green-600 font-medium">
//                     <List className="w-5 h-5 mr-1" /> Orders
//                 </Link>
//                 {/* --- END OF NEW LINK --- */}
                
//               </SignedIn>

//               <Link href="/sell" className="flex items-center text-gray-600 hover:text-green-600">
// // ...
