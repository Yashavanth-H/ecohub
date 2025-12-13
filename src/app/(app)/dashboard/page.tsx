'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Package, XCircle, Clock, CheckCircle, Edit, Trash2,TrendingUp, Loader2, Save } from 'lucide-react'; // Added Edit, Trash2, Save icons
import Link from 'next/link';
import DashboardNav from '@/components/dashboard/DashboardNav';
// Define a type for the enriched product data
interface Product {
  product_id: string;
  title: string;
  price: string;
  description: string;
  condition: string;
  status: string;
  image_url: string;
  category_name: string;
  seller_username: string;
  category_id: number;
}

const UserDashboard = () => {
  const { isLoaded, userId, getToken } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- New State for CRUD operations ---
  const [isEditingId, setIsEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Product>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  // --- End New State ---

  const fetchUserProducts = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();

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


  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-5 h-5 text-green-500 mr-2" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500 mr-2" />;
      case 'sold': return <XCircle className="w-5 h-5 text-red-500 mr-2" />;
      default: return <Package className="w-5 h-5 text-gray-500 mr-2" />;
    }
  };

  // --- DELETE Operation ---
  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to permanently delete this product listing?')) return;

    setIsSubmitting(true);
    try {
      const token = await getToken();
      const response = await fetch(`http://localhost:5001/api/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete product.');
      }

      // Update UI: remove the deleted product from the state
      setProducts(prev => prev.filter(p => p.product_id !== productId));
      alert('Product deleted successfully!');

    } catch (err: any) {
      console.error('Delete error:', err);
      alert(`Deletion failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- EDIT Setup ---
  const handleEditClick = (product: Product) => {
    setIsEditingId(product.product_id);
    // Use the String() constructor for description to prevent render errors
    setEditFormData({ ...product, description: String(product.description || '') });
  };

  // --- UPDATE Operation ---
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditingId) return;

    setIsSubmitting(true);
    try {
      const token = await getToken();

      // Only send fields that might have changed and ensure price is cast to float
      const updatePayload: Partial<Product> = {
        title: editFormData.title,
        // Safely parse the price string, handling potential null/undefined/empty string
        price: editFormData.price ? String(parseFloat(editFormData.price as string)) : undefined,
        description: String(editFormData.description || ''),
        condition: editFormData.condition,
        status: editFormData.status,
        category_id: editFormData.category_id
      };

      const response = await fetch(`http://localhost:5001/api/products/${isEditingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update product.');
      }

      const updatedProduct = (await response.json()).product;

      // Update UI: replace the old product object with the new one
      setProducts(prev => prev.map(p =>
        p.product_id === isEditingId ? { ...p, ...updatedProduct } : p
      ));

      setIsEditingId(null); // Exit edit mode
      alert('Product updated successfully!');

    } catch (err: any) {
      console.error('Update error:', err);
      alert(`Update failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };


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

  // --- Render Edit Form ---
  if (isEditingId) {
    return (
      <div className="container mx-auto p-6 flex justify-center">
        <form onSubmit={handleUpdate} className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
          <h3 className="text-2xl font-bold mb-6 border-b pb-2">Edit Listing: {editFormData.title}</h3>

          <div className="space-y-4">
            {/* Input for Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={editFormData.title || ''}
                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            {/* Input for Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                step="0.01"
                value={editFormData.price || ''}
                onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            {/* Input for Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={String(editFormData.description || '')}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                rows={3}
              />
            </div>
            {/* Input for Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={editFormData.status || ''}
                onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              >
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsEditingId(null)}
              className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center"
              disabled={isSubmitting}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // --- Main Dashboard View ---
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 flex items-center">
        <Package className="w-8 h-8 text-green-600 mr-3" /> Your Listed Items ({products.length})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.product_id} className="bg-white border rounded-lg shadow-md overflow-hidden transition transform hover:shadow-xl hover:scale-[1.02]">
            <img
              src={product.image_url}
              alt={product.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-bold text-gray-800 truncate mb-1">
                {product.title}
              </h3>
              <p className="text-2xl font-extrabold text-green-600 mb-3">
                ${product.price}
              </p>

              <div className="text-sm text-gray-500 space-y-1">
                <p className="flex items-center">
                  {getStatusIcon(product.status)}
                  <span className={`font-semibold capitalize ${product.status === 'available' ? 'text-green-500' : product.status === 'pending' ? 'text-yellow-500' : 'text-red-500'}`}>
                    {product.status}
                  </span>
                </p>
                <p className="capitalize">
                  <span className="font-medium text-gray-700">Category:</span> {product.category_name}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Condition:</span> {product.condition}
                </p>
              </div>

              {/* --- ACTION BUTTONS --- */}
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => handleEditClick(product)}
                  className="p-2 text-blue-600 hover:text-blue-800 transition rounded-full hover:bg-blue-50"
                  title="Edit Product"
                  disabled={isSubmitting}
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(product.product_id)}
                  className="p-2 text-red-600 hover:text-red-800 transition rounded-full hover:bg-red-50"
                  title="Delete Product"
                  disabled={isSubmitting}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <Link
                  href={`/dashboard/lifecycle/${product.product_id}`}
                  className="p-2 text-indigo-600 hover:text-indigo-800 transition rounded-full hover:bg-indigo-50"
                  title="Track Lifecycle"
                >
                  <TrendingUp className="w-5 h-5" />
                </Link>
              </div>
              {/* --- END ACTION BUTTONS --- */}

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;