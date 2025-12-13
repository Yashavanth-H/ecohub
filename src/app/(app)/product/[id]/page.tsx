'use client';

// 1. Converted to Client Component
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth, useClerk } from '@clerk/nextjs';
import { useUserActivity } from '@/context/UserActivityContext';
// 1. Added TrendingUp and Brain icons
import { Package, Tag, DollarSign, User, Zap, XCircle, Loader2, ShoppingCart, TrendingUp, Brain } from 'lucide-react';

// Define the interface for the enriched product data
interface Product {
  product_id: string;
  title: string;
  description: string;
  price: string;
  condition: string;
  status: string;
  image_url: string;
  category_name: string;
  seller_username: string;
  // 2. Add AI fields to the interface
  ai_estimated_lifecycle_months: number | null;
}

export default function ProductDetailsPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const params = useParams();
  const router = useRouter();
  const { getToken, userId } = useAuth();
  const { openSignIn } = useClerk();
  const { fetchCartCount } = useUserActivity(); // Get cart update function
  const id = params.id as string;

  // Helper function to format remaining months
  const formatRemaining = (months: number | null): string => {
    if (months === null || months === undefined || months < 0) return 'N/A';
    if (months < 24) {
      return `${months} months`;
    }
    const years = (months / 12).toFixed(1);
    return `${years} years`;
  };

  // 2. Fetch data on the client side
  const getProductDetails = useCallback(async () => {
    if (!id) return; // Don't fetch if ID is not available yet
    setLoading(true);
    try {
      // This is a public endpoint, no token needed to fetch
      const response = await fetch(`http://localhost:5001/api/products/${id}`);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      const data = await response.json();
      setProduct(data.product);
    } catch (error) {
      console.error('Error fetching product details:', error);
      setError('Product not found or server error.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getProductDetails();
  }, [getProductDetails]);

  // --- Core Function: Add to Cart Logic ---
  const addItemToCart = async (productId: string) => {
    if (!userId) {
      openSignIn();
      return false;
    }
    const token = await getToken();
    if (!token) throw new Error("Authentication failed");

    const response = await fetch('http://localhost:5001/api/cart/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ productId: productId, quantity: 1 }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      // Assume 409 Conflict for "already in cart"
      if (response.status === 409) {
        console.log("Item already in cart. Proceeding.");
        return true; // Treat as success if already in cart
      }
      throw new Error(errorData.error || 'Failed to add item to cart.');
    }

    // Update the global cart count
    fetchCartCount();
    return true;

  };

  // 3. New "Buy Now" handler (Add to Cart + Redirect)
  const handleBuyNow = async () => {
    if (!product || product.status !== 'available') return;
    setIsSubmitting(true);
    try {
      const success = await addItemToCart(product.product_id);
      if (success) {
        router.push('/checkout'); // Redirect on success
      }
    } catch (error: any) {
      console.error('Buy Now error:', error);
      alert(`Error: ${error.message}`);
      setIsSubmitting(false);
    }
  };

  // 4. New "Add to Cart" handler (Add to Cart + Stay)
  const handleAddToCart = async () => {
    if (!product || product.status !== 'available') return;
    setIsSubmitting(true);
    try {
      const success = await addItemToCart(product.product_id);
      if (success) {
        alert(`${product.title} added to cart!`);
      }
    } catch (error: any) {
      console.error('Add to Cart error:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };


  // 5. Loading and Error states
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-16 h-16 text-green-600 animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center p-16">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold">Product Not Found</h1>
        <p className="text-gray-600 mt-2">{error || "The requested item may have been sold or removed."}</p>
      </div>
    );
  }

  // Helper for Tailwind condition colors
  const getConditionColor = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'refurbished': return 'bg-yellow-100 text-yellow-800';
      case 'used': return 'bg-gray-200 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 md:p-10">
      <div className="bg-white shadow-xl rounded-xl overflow-hidden max-w-4xl mx-auto">

        {/* Product Image and Header */}
        <div className="md:flex">
          <div className="md:w-1/2 p-4">
            <img
              src={product.image_url}
              alt={product.title}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Product Details Column */}
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{product.title}</h1>
            <p className="text-2xl font-bold text-green-600 mb-6 flex items-center">
              {/* CURRENCY FIX */}
              ₹{parseFloat(product.price).toFixed(2)}
            </p>

            {/* Key Information Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getConditionColor(product.condition)}`}>
                {product.condition}
              </span>
              <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-semibold uppercase flex items-center">
                <Tag className="w-3 h-3 mr-1" /> {product.category_name}
              </span>
              <span className="px-3 py-1 rounded-full bg-lime-100 text-lime-800 text-xs font-semibold uppercase flex items-center">
                <User className="w-3 h-3 mr-1" /> Seller: {product.seller_username}
              </span>

              {/* 3. NEW: AI Lifespan Badge */}
              {product.ai_estimated_lifecycle_months !== null && (
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold uppercase flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" /> Est. Life Left: {formatRemaining(product.ai_estimated_lifecycle_months)}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold border-b pb-1 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{product.description}</p>
            </div>

            {/* Spacer */}
            <div className="flex-grow"></div>

            {/* 6. ACTIONS (Buy Now + Add to Cart) */}
            <div className="flex gap-4">

              {/* Buy Now (Add to Cart + Redirect to Checkout) */}
              <button
                onClick={handleBuyNow}
                disabled={isSubmitting || product.status !== 'available'}
                className="flex-1 flex items-center justify-center bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  product.status === 'available' ? (
                    <>
                      <Zap className="w-5 h-5 mr-2" /> Buy Now
                    </>
                  ) : (
                    <XCircle className="w-5 h-5 mr-2" />
                  )
                )}
                {product.status !== 'available' && <span className="capitalize">{product.status}</span>}
              </button>

              {/* Add to Cart (Just adds to cart, keeps user on the page) */}
              <button
                onClick={handleAddToCart}
                disabled={isSubmitting || product.status !== 'available'}
                className="p-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition disabled:bg-gray-400"
                title="Add to Cart"
              >
                <ShoppingCart className="w-6 h-6" />
              </button>

            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="p-6 border-t bg-gray-50 text-sm text-gray-600">
          <p>Product ID: {product.product_id}</p>
          <p>Status: <span className="font-semibold capitalize">{product.status}</span></p>
        </div>

      </div>
    </div>
  );
}
