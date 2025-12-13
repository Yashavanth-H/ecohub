'use client';

import { useState, useEffect } from 'react';
// 1. Import 'useUser' - this is the hook we've been missing
import { useAuth, useUser } from '@clerk/nextjs'; 
import { Loader2, AlertTriangle, ShieldCheck, Check, X, Users, Package } from 'lucide-react';

// (AdminDashboard component remains the same, it still needs useAuth for getToken)
const AdminDashboard = () => {
  const { getToken } = useAuth();
  const [pendingProducts, setPendingProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'products' | 'users'>('products');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');

      const productsRes = await fetch('http://localhost:5001/api/admin/pending-products', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!productsRes.ok) throw new Error('Failed to fetch products');
      const productsData = await productsRes.json();
      setPendingProducts(productsData);

      const usersRes = await fetch('http://localhost:5001/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!usersRes.ok) throw new Error('Failed to fetch users');
      const usersData = await usersRes.json();
      setUsers(usersData);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [getToken]);

  const handleModerate = async (productId: string, newStatus: 'available' | 'rejected') => {
    const originalProducts = [...pendingProducts];
    setPendingProducts(prev => prev.filter(p => p.product_id !== productId));
    try {
      const token = await getToken();
      const response = await fetch(`http://localhost:5001/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newStatus })
      });
      if (!response.ok) throw new Error('Failed to update status.');
    } catch (err: any) {
      alert(`Error: ${err.message}. Reverting changes.`);
      setPendingProducts(originalProducts);
    }
  };

  if (loading) {
    return <div className="p-10 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>;
  }
  if (error) {
    return <div className="p-10 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 flex items-center"><ShieldCheck className="w-8 h-8 mr-3 text-blue-600"/>Admin Panel</h1>
      <div className="flex border-b mb-6">
        <button
          onClick={() => setView('products')}
          className={`py-2 px-4 ${view === 'products' ? 'border-b-2 border-blue-600 font-semibold' : 'text-gray-500'}`}
        >
          <Package className="w-5 h-5 mr-2 inline" />
          Pending Products ({pendingProducts.length})
        </button>
        <button
          onClick={() => setView('users')}
          className={`py-2 px-4 ${view === 'users' ? 'border-b-2 border-blue-600 font-semibold' : 'text-gray-500'}`}
        >
          <Users className="w-5 h-5 mr-2 inline" />
          All Users ({users.length})
        </button>
      </div>
      {view === 'products' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          {pendingProducts.length === 0 ? (
            <p className="text-gray-500">No products are pending review. Good job!</p>
          ) : (
            <ul className="space-y-4">
              {pendingProducts.map((product: any) => (
                <li key={product.product_id} className="flex items-center space-x-4 border-b pb-4 last:border-b-0">
                  <img src={product.image_url} alt={product.title} className="w-16 h-16 object-cover rounded-md" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{product.title}</h3>
                    <p className="text-sm text-gray-600">${product.price} | Seller: {product.seller_id.substring(0, 10)}...</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleModerate(product.product_id, 'rejected')}
                      className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200" title="Reject">
                      <X className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleModerate(product.product_id, 'available')}
                      className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200" title="Approve">
                      <Check className="w-5 h-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {view === 'users' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <ul className="space-y-4">
            {users.map((user: any) => (
              <li key={user.clerk_id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <h3 className="font-semibold">{user.username || 'No Username'}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <p className="text-sm text-gray-400">Joined: {new Date(user.created_at).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};


// --- THIS IS THE FIXED PAGE WRAPPER ---
// It now uses 'useUser' which is the correct hook for 'publicMetadata'
const AdminPageProtected = () => {
  // 1. We use 'useUser' to get the user's data object
  const { isLoaded, isSignedIn, user } = useUser();

  // 2. Check if Clerk is loaded
  if (!isLoaded) {
    return <div className="p-10 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>;
  }

  // 3. This is the new, correct check.
  // We check the 'user' object directly for the metadata.
  const isAdmin = isSignedIn && user?.publicMetadata?.role === 'admin';

  if (isAdmin) {
    // 4. If they are an admin, show the real dashboard
    return <AdminDashboard />;
  }

  // 5. If they are not an admin, show the "Access Denied" fallback
  return (
    <div className="text-center p-16">
      <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold">Access Denied</h1>
      <p className="text-gray-600 mt-2">You are logged in, but your user account is missing the 'admin' role.</p>
    </div>
  );
};

export default AdminPageProtected;