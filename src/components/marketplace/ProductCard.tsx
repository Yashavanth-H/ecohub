'use client';

import Link from 'next/link';
import { ShoppingCart, User, Tag, Heart } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { useState } from 'react';
// 1. Import the new hook
import { useUserActivity } from '@/context/UserActivityContext';

interface Product {
  product_id: string;
  title: string;
  price: string;
  condition: string;
  image_url: string;
  category_name: string;
  seller_username: string;
}

// 1. Define the props interface to include the optional new prop
interface ProductCardProps {
    product: Product;
    initialIsFavorite?: boolean; // <-- NEW PROP ADDED
}

// 2. Accept the new prop and set its default value
const ProductCard = ({ product, initialIsFavorite = false }: ProductCardProps) => {
  const { userId, getToken } = useAuth();
  
  // 3. Initialize state using the prop
  const [isFavorited, setIsFavorited] = useState(initialIsFavorite); 
  // 4. Use the hook to get the "refetch" functions
  const { fetchCartCount, fetchFavoritesCount } = useUserActivity();
  
  // NOTE: This handles the visual state for BOTH the Buy page (where it defaults to false) 
  // and the Favorites page (where the parent sets it to true).

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); // Stop click from propagating to the parent Link

    if (!userId) {
      alert("Please sign in to add items to your cart.");
      return;
    }

    try {
        const token = await getToken();
        if (!token) return;

        const baseOptions: RequestInit = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId: product.product_id, quantity: 1 }),
        };

        const response = await fetch('http://localhost:5001/api/cart/items', baseOptions);

        if (response.ok) {
            alert(`${product.title} added to cart!`);
            // 5. UPDATE THE GLOBAL COUNT
            fetchCartCount();
        } else {
            const errorData = await response.json();
            alert(`Failed to add item: ${errorData.error}`);
        }

    } catch (error) {
        console.error('Cart API error:', error);
        alert('An unexpected error occurred while adding to cart.');
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 

    if (!userId) {
      alert("Please sign in to add items to your favorites.");
      return;
    }
    
    const method = isFavorited ? 'DELETE' : 'POST';
    const url = isFavorited 
      ? `http://localhost:5001/api/favorites/${product.product_id}`
      : `http://localhost:5001/api/favorites`;

    // Define base options and initialize headers
    const baseOptions: RequestInit = {
        method: method,
        headers: {
            'Authorization': `Bearer ${await getToken()}`,
        },
    };

    // Add Content-Type and Body only for POST
    if (method === 'POST') {
        (baseOptions.headers as Record<string, string>)['Content-Type'] = 'application/json';
        baseOptions.body = JSON.stringify({ productId: product.product_id });
    }
    
    try {
      const response = await fetch(url, baseOptions);

      if (response.ok) {
        setIsFavorited(prev => !prev);
        // 6. UPDATE THE GLOBAL COUNT
        fetchFavoritesCount();
        // alert(isFavorited ? 'Removed from favorites.' : 'Added to favorites!');
      } else {
        const responseText = await response.text();
        console.error('API Error Response:', responseText);
        throw new Error(`Failed to toggle favorite status. Server responded with: ${response.status}`);
      }
    } catch (error: any) {
      console.error('Favorites API error:', error);
      alert(`Error: ${error.message}`);
    }
  };


  return (
    <Link href={`/product/${product.product_id}`} className="block">
      <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden transition transform hover:shadow-xl hover:scale-[1.02]">
        
        {/* Product Image and Favorite Button */}
        <div className="relative">
          <img 
            src={product.image_url} 
            alt={product.title} 
            className="w-full h-56 object-cover"
          />
          {/* Favorite Button (Heart Icon) */}
          <button 
            onClick={handleToggleFavorite}
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg transition"
            title="Add to Favorites"
          >
            {/* Change color based on favorited state */}
            <Heart className={`w-6 h-6 transition-colors ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`} />
          </button>
        </div>


        <div className="p-4">
          
          {/* Title and Price */}
          <h3 className="text-xl font-extrabold text-gray-900 truncate mb-1">
            {product.title}
          </h3>
          <p className="text-3xl font-extrabold text-green-600 mb-3">
            {/* 7. CURRENCY FIX */}
            ₹{parseFloat(product.price).toFixed(2)}
          </p>

          {/* Details */}
          <div className="text-sm text-gray-600 space-y-1">
            <p className="flex items-center capitalize">
              <Tag className="w-4 h-4 text-green-500 mr-2" />
              {product.category_name}
            </p>
            <p className="flex items-center capitalize">
              <User className="w-4 h-4 text-gray-500 mr-2" />
              Seller: {product.seller_username}
            </p>
            <p className="capitalize">
              Condition: <span className="font-semibold text-blue-600">{product.condition}</span>
            </p>
          </div>
          
          {/* 8. ACTION BUTTON (NOW FUNCTIONAL) */}
          <button 
            onClick={handleAddToCart} 
            className="mt-4 w-full flex items-center justify-center bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

