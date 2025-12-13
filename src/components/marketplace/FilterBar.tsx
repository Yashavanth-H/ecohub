'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, ChevronDown } from 'lucide-react';

interface Category {
  category_id: number;
  name: string;
}

interface FilterBarProps {
  onFilterChange: (filters: { search: string; category: string | undefined; condition: string | undefined }) => void;
  productsCount: number;
}

const FilterBar = ({ onFilterChange, productsCount }: FilterBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCondition, setSelectedCondition] = useState(''); // new condition state
  const [categories, setCategories] = useState<Category[]>([]);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch categories on load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data: Category[] = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error('Category fetch error:', err);
      }
    };
    fetchCategories();
  }, []);

  // Debounced filter change function
  const triggerFilterChange = useCallback(
    (newSearch: string, newCategory: string, newCondition: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onFilterChange({
          search: newSearch,
          category: newCategory || undefined,
          condition: newCondition || undefined,
        });
      }, 500);
    },
    [onFilterChange]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    triggerFilterChange(value, selectedCategory, selectedCondition);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCategory(value);
    triggerFilterChange(searchTerm, value, selectedCondition);
  };

  const handleConditionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCondition(value);
    triggerFilterChange(searchTerm, selectedCategory, value);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col space-y-5 sticky top-20 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 border-b pb-3">Filters</h3>

      {/* Search Filter */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Search
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="e.g., wooden chair"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Category
        </label>
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="appearance-none w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm bg-white cursor-pointer focus:ring-green-500 focus:border-green-500"
          >
            <option value="">All</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={String(cat.category_id)}>
                {cat.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
        </div>
      </div>

      {/* Condition Filter (wired up) */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Condition
        </label>
        <div className="relative">
          <select
            value={selectedCondition}
            onChange={handleConditionChange}
            className="appearance-none w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm bg-white cursor-pointer focus:ring-green-500 focus:border-green-500"
          >
            <option value="">All</option>
            <option value="new">New</option>
            <option value="used">Used</option>
            <option value="refurbished">Refurbished</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
        </div>
      </div>

      {/* Product Count (dynamic) */}
      <div className="pt-4 border-t text-sm font-medium text-gray-500">
        {productsCount} product{productsCount === 1 ? '' : 's'} found
      </div>
    </div>
  );
};

export default FilterBar;
