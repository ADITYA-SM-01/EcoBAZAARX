import React, { useState } from 'react';
import { useProductContext } from '../context/ProductContext';
import { SortOption, FilterOptions } from '../types/product';
import { categories } from '../data/products';
import { Filter, Leaf, RefreshCw, SortAsc, SortDesc,} from 'lucide-react';
import SearchBar from './SearchBar';

const ProductFilters: React.FC = () => {
  const { filterOptions, setFilterOptions, sortProducts, filterByCategory, resetFilters } = useProductContext();
  const [isExpanded, setIsExpanded] = useState(false);

  const sortOptions: { value: SortOption; label: string; icon: React.ReactNode }[] = [
    { value: 'carbon-low', label: 'Lowest Carbon Footprint', icon: <Leaf className="w-4 h-4" /> },
    { value: 'carbon-high', label: 'Highest Carbon Footprint', icon: <SortDesc className="w-4 h-4" /> },
    { value: 'price-low', label: 'Price: Low to High', icon: <SortAsc className="w-4 h-4" /> },
    { value: 'price-high', label: 'Price: High to Low', icon: <SortDesc className="w-4 h-4" /> },
    { value: 'name', label: 'Name: A to Z', icon: <SortAsc className="w-4 h-4" /> }
  ];

  const handleSortChange = (sortBy: SortOption) => {
    sortProducts(sortBy);
  };

  const handleCategoryChange = (category: string) => {
    filterByCategory(category);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseFloat(e.target.value) : undefined;
    setFilterOptions((prev: FilterOptions) => ({ ...prev, maxPrice: value }));
  };

  const handleMaxCarbonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseFloat(e.target.value) : undefined;
    setFilterOptions((prev: FilterOptions) => ({ ...prev, maxCarbon: value }));
  };

  return (
    <div className="gradient-card rounded-xl shadow-lg border border-eco-200 p-6 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-eco-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filter & Sort Products</h2>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="eco-button-secondary text-sm"
        >
          {isExpanded ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <SearchBar 
          placeholder="Search products by name, description, or category..."
          variant="default"
          showSuggestions={true}
        />
      </div>

      {/* Quick Sort Options */}
      <div className="flex flex-wrap gap-2 mb-4">
        {sortOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSortChange(option.value)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterOptions.sortBy === option.value
                ? 'bg-eco-600 text-white'
                : 'bg-eco-100 text-eco-700 hover:bg-eco-200'
            }`}
          >
            {option.icon}
            {option.label}
          </button>
        ))}
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-eco-200">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterOptions.category === category
                      ? 'bg-eco-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Price and Carbon Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Price ($)
              </label>
              <input
                type="number"
                placeholder="No limit"
                value={filterOptions.maxPrice || ''}
                onChange={handleMaxPriceChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Carbon Footprint (kg CO₂)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="No limit"
                value={filterOptions.maxCarbon || ''}
                onChange={handleMaxCarbonChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex justify-end">
            <button
              onClick={resetFilters}
              className="eco-button-secondary flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reset All Filters
            </button>
          </div>
        </div>
      )}

      {/* Eco-friendly Stats */}
      <div className="mt-4 pt-4 border-t border-eco-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>🌱 Choose products with lower carbon footprint for a greener planet!</span>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-eco-500"></div>
            <span>Low Impact</span>
            <div className="w-3 h-3 rounded-full bg-carbon-500"></div>
            <span>High Impact</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
