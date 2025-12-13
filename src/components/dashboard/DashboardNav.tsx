'use client';

import Link from 'next/link';
import { Home, ShoppingCart, Heart, Search, PackagePlus, LayoutDashboard, List } from 'lucide-react';
import { 
  SignedIn, 
  SignedOut, 
  SignInButton, 
  SignUpButton, 
  UserButton 
} from '@clerk/nextjs';
// 1. Import the new hook
import { useUserActivity } from '@/context/UserActivityContext';

const DashboardNav = () => {
  // 2. Use the hook to get the live counts
  const { cartCount, favoritesCount } = useUserActivity();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          {/* Left Side: Logo & Main Links */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-green-600">
              EcoMarket
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className="flex items-center text-gray-600 hover:text-green-600">
                <Home className="w-5 h-5 mr-1" /> Home
              </Link>
              <Link href="/buy" className="flex items-center text-gray-600 hover:text-green-600">
                <ShoppingCart className="w-5 h-5 mr-1" /> Buy
              </Link>

              <SignedIn>
                <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-green-600 font-medium">
                  <LayoutDashboard className="w-5 h-5 mr-1" /> Dashboard
                </Link>
              </SignedIn>

              <Link href="/sell" className="flex items-center text-gray-600 hover:text-green-600">
                <PackagePlus className="w-5 h-5 mr-1" /> Sell
              </Link>
              <SignedIn>
                <Link href="/orders" className="flex items-center text-gray-600 hover:text-green-600 font-medium">
                    <List className="w-5 h-5 mr-1" /> Orders
                </Link>
              </SignedIn>
            </div>
          </div>

          {/* Right Side: Search, Actions & Profile */}
          <div className="flex items-center space-x-5">
            <div className="relative hidden md:block">
              <input 
                type="text" 
                placeholder="Search..." 
                className="px-3 py-2 border border-gray-300 rounded-full text-sm focus:ring-green-500 focus:border-green-500"
              />
              <Search className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            
            {/* 3. Favorites Link with Badge */}
            <Link href="/favorites" className="relative text-gray-600 hover:text-red-600">
              <Heart className="w-6 h-6" />
              {favoritesCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white">
                  {favoritesCount}
                </span>
              )}
            </Link>
            
            {/* 4. Cart Link with Badge */}
            <Link href="/cart" className="relative text-gray-600 hover:text-green-600">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-green-600 text-white text-xs rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* ... Aut Buttons ... */}
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <div className="flex items-center space-x-3">
                <SignInButton mode="modal">
                  <button className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-green-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-green-700">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default DashboardNav;



