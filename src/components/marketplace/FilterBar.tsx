// src/components/marketplace/FilterBar.tsx
'use client';

// In a real app, these would come from your database
const categories = ['All', 'Furniture', 'Home Decor', 'Transport', 'Accessories', 'Electronics'];
const conditions = ['All', 'New', 'Used - Like New', 'Used - Good'];

type FilterBarProps = {
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onConditionChange: (condition: string) => void;
  productCount: number;
};

const FilterBar = ({ onSearchChange, onCategoryChange, onConditionChange, productCount }: FilterBarProps) => {
  return (
    <div className="w-full md:w-1/4 lg:w-1/5 p-6 bg-white rounded-lg shadow">
      <h3 className="text-xl font-bold mb-4">Filters</h3>
      <div className="space-y-6">
        {/* Search Input */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search</label>
          <input
            type="text"
            id="search"
            placeholder="e.g., wooden chair"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        {/* Category Select */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <select
            id="category"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md"
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        {/* Condition Select */}
        <div>
          <label htmlFor="condition" className="block text-sm font-medium text-gray-700">Condition</label>
          <select
            id="condition"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md"
            onChange={(e) => onConditionChange(e.target.value)}
          >
            {conditions.map(con => <option key={con} value={con}>{con}</option>)}
          </select>
        </div>
      </div>
      <div className="mt-8 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">{productCount} products found</p>
      </div>
    </div>
  );
};

export default FilterBar;