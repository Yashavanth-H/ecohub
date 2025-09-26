// src/components/marketing/HowItWorks.tsx
import { PlusSquare, Eye, Repeat2 } from 'lucide-react';

const HowItWorks = () => {
  return (
    // Added a light gray background to make the white cards pop
    <section id="how-it-works" className="bg-gray-50 py-20">
      <div className="container mx-auto px-6">
        
        {/* 1. Added the main heading for the section */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Getting Started is Easy
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <PlusSquare className="w-16 h-16 text-green-500 mx-auto mb-6" strokeWidth={1.5} />
            {/* 2. Changed heading color to black (text-gray-900) */}
            <h3 className="text-xl font-bold text-gray-900 mb-2">1. Create a Listing</h3>
            <p className="text-gray-600">Easily list your recyclable or reusable products with a simple form.</p>
          </div>
          {/* Card 2 */}
          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <Eye className="w-16 h-16 text-green-500 mx-auto mb-6" strokeWidth={1.5} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">2. Discover & Connect</h3>
            <p className="text-gray-600">Browse a wide range of eco-friendly products and connect with sellers.</p>
          </div>
          {/* Card 3 */}
          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <Repeat2 className="w-16 h-16 text-green-500 mx-auto mb-6" strokeWidth={1.5} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">3. Trade & Thrive</h3>
            <p className="text-gray-600">Complete transactions and contribute to a sustainable world.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;