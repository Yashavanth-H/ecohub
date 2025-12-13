'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Loader2, AlertTriangle, Package, TrendingUp, BarChart2 } from 'lucide-react';
import Link from 'next/link';

// Define the interface for our product data, including the new AI fields
interface Product {
  product_id: string;
  title: string;
  status: string;
  category_name: string;
  ai_estimated_lifecycle_months: number | null;
  ai_total_lifecycle_months: number | null;
}

// --- (FIXED) Helper function to format months into a readable string ---
const formatMonthsToYears = (months: number | null): string => {
  // Handle null, undefined, or 0
  if (!months || months <= 0) return 'N/A';
  const years = months / 12;
  return `${years.toFixed(1)} years`;
};

// --- (FIXED) Helper function to format remaining months ---
const formatRemaining = (months: number | null): string => {
  // Handle null, undefined, or negative numbers
  if (months === null || months === undefined || months < 0) return 'N/A';
  if (months === 0) return '0 months'; // Explicitly handle 0
  if (months < 24) {
    return `~${months} months`;
  }
  const years = (months / 12).toFixed(1);
  return `~${years} years`;
};

const UserDashboard = () => {
  const { isLoaded, userId, getToken } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProducts = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      
      // This is the endpoint we upgraded in Step 2
      const response = await fetch('http://localhost:5001/api/products/user', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch products.');
      }

      const data = await response.json();
      setProducts(data.products);

    } catch (err: any) {
      console.error('Fetch error:', err);
      setError('Failed to load your products. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [userId, getToken]);
  
  useEffect(() => {
    if (isLoaded && userId) {
      fetchUserProducts();
    }
  }, [isLoaded, userId, fetchUserProducts]);


  if (!isLoaded || loading) {
    return (
      <div className="text-center p-10">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin mx-auto mb-4" />
        <p>Loading user dashboard...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-10 text-red-600 font-semibold">{error}</div>;
  }
  
  if (products.length === 0) {
    return (
      <div className="text-center p-10 text-gray-500">
        <Package className="w-12 h-12 mx-auto mb-4" />
        <h3 className="text-xl font-semibold">You haven't listed any items yet.</h3>
        <p className="mt-2">Use the Sell tab to get started!</p>
      </div>
    );
  }

  // --- Main Dashboard View (matches your screenshot) ---
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Product LifeTracker Dashboard</h1>

      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {products.map((product) => {
          // --- (FIXED) Percentage calculation ---
          const total = product.ai_total_lifecycle_months;
          const remaining = product.ai_estimated_lifecycle_months;
          let percentage = 0;
          let percentageText = "N/A";

          // Only calculate if we have valid, positive data
          if (total && total > 0 && remaining !== null && remaining >= 0) {
            percentage = Math.max(0, Math.min(100, (remaining / total) * 100));
            percentageText = `${percentage.toFixed(0)}%`;
          } else if (product.status === 'sold' || product.status === 'archived' || remaining === 0) {
            // Handle items that are used up or sold
            percentage = 0;
            percentageText = "Used";
          }
          // --- End of Fix ---
          
          const getBarColor = (perc: number) => {
            if (perc > 75) return 'bg-green-500';
            if (perc > 25) return 'bg-yellow-500';
            if (perc > 0) return 'bg-red-500';
            return 'bg-gray-300'; // Color for N/A or 0%
          };

          return (
            <Link href={`/dashboard/lifecycle/${product.product_id}`} key={product.product_id} className="block bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-2xl transition-shadow">
              <h3 className="font-semibold text-gray-800 truncate">{product.title}</h3>
              <p className="text-3xl font-bold my-2">
                {/* Apply text color based on bar color */}
                <span className={`px-2 py-1 rounded ${
                  percentage > 0 ? 'text-white' : 'text-gray-700'
                } ${getBarColor(percentage)}`}>
                  {percentageText}
                </span> lifespan left
              </p>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 my-3">
                <div 
                  className={`h-2.5 rounded-full ${getBarColor(percentage)}`} 
                  style={{ width: `${percentage}%` }} // percentage is 0 if data is N/A
                ></div>
              </div>
              
              <p className="text-sm text-gray-500">
                {formatRemaining(remaining)} remaining (out of {formatMonthsToYears(total)} est.)
              </p>
            </Link>
          );
        })}
      </div>

      {/* All Products Overview Table */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <BarChart2 className="w-6 h-6 mr-3 text-gray-700"/>
          All Products Overview
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Total Life</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lifecycle</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.product_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatMonthsToYears(product.ai_total_lifecycle_months)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{formatRemaining(product.ai_estimated_lifecycle_months)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.status === 'available' ? 'bg-green-100 text-green-800' : 
                      product.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/dashboard/lifecycle/${product.product_id}`} className="text-indigo-600 hover:text-indigo-900">
                      View / Log Event
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

