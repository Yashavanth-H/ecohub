// src/components/dashboard/DashboardNav.tsx
'use client';

import Link from 'next/link';
import { Home, ShoppingCart, Heart, User, LogOut, Search, PackagePlus } from 'lucide-react';

const DashboardNav = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Left Side: Logo & Main Links */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-2xl font-bold text-green-600">
            EcoHub
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/home" className="flex items-center text-gray-600 hover:text-green-600">
              <Home className="w-5 h-5 mr-1" /> Home
            </Link>
            <Link href="/buy" className="flex items-center text-gray-600 hover:text-green-600">
              <ShoppingCart className="w-5 h-5 mr-1" /> Buy
            </Link>
            <Link href="/sell" className="flex items-center text-gray-600 hover:text-green-600">
              <PackagePlus className="w-5 h-5 mr-1" /> Sell
            </Link>
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
          <Link href="/favorites" className="text-gray-600 hover:text-green-600">
            <Heart className="w-6 h-6" />
          </Link>
          <Link href="/cart" className="text-gray-600 hover:text-green-600">
            <ShoppingCart className="w-6 h-6" />
          </Link>
          <div className="relative group">
            <button className="flex items-center text-gray-600 hover:text-green-600">
              <User className="w-6 h-6 rounded-full" />
            </button>
            {/* Profile Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Link href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <User className="w-4 h-4 mr-2" /> View Profile
              </Link>
              <Link href="/logout" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default DashboardNav;