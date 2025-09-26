// src/components/layout/Header.tsx
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-gray-800">
          EcoMarket
        </Link>
        
        {/* Centered Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="#features" className="text-gray-600 hover:text-green-600">
            Features
          </Link>
          <Link href="#how-it-works" className="text-gray-600 hover:text-green-600">
            How It Works
          </Link>
          <Link href="/buy" className="text-gray-600 hover:text-green-600">
            Buy/Sell
          </Link>
          <Link href="#contact" className="text-gray-600 hover:text-green-600">
            Contact
          </Link>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-gray-600 font-medium hover:text-green-600">
            Log In
          </Link>
          <Link href="/signup" className="bg-green-600 text-white px-5 py-2 rounded-full font-medium hover:bg-green-700 transition duration-300">
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;