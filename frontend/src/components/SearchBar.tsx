import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Filter, TrendingUp, Leaf, Package } from 'lucide-react';
import { useProductContext } from '../context/ProductContext';
import { Product } from '../types/product';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
  showSuggestions?: boolean;
  variant?: 'default' | 'compact' | 'hero';
  value?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search eco-friendly products...",
  onSearch,
  className = "",
  showSuggestions: showSuggestionsProp = true,
  variant = 'default',
  value,
  onChange,
  onClear,
}) => {
  const { products, searchProducts, filterOptions } = useProductContext();
  const [searchQuery, setSearchQuery] = useState(filterOptions.searchQuery || '');
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Product[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Get unique categories for quick filters
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSuggestionsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSuggestions([]);
      return;
    }

    const suggestions = products.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);

    setFilteredSuggestions(suggestions);
  }, [searchQuery, products]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    searchProducts(query);
    if (onSearch) onSearch(query);
    setIsSuggestionsVisible(false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    searchProducts('');
    if (onSearch) onSearch('');
    setFilteredSuggestions([]);
    if (onClear) onClear();
  };

  const handleSuggestionClick = (product: Product) => {
    handleSearch(product.name);
  };

  const handleCategoryFilter = (category: string) => {
    if (category === 'All') {
      handleSearch(searchQuery);
    } else {
      const newQuery = `${searchQuery} ${category}`.trim();
      handleSearch(newQuery);
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'compact':
        return 'py-2 text-sm';
      case 'hero':
        return 'py-4 text-lg shadow-lg';
      default:
        return 'py-3';
    }
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder={placeholder}
          value={value || searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsSuggestionsVisible(true);
            if (onChange) onChange(e.target.value);
          }}
          onFocus={() => setIsSuggestionsVisible(true)}
          className={`w-full pl-10 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-transparent transition-colors bg-white ${getVariantClasses()}`}
        />
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Suggestions */}
      {showSuggestionsProp && isSuggestionsVisible && (searchQuery.trim() !== '' || filteredSuggestions.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          {/* Quick Category Filters */}
          <div className="p-3 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Quick Filters</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 6).map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryFilter(category)}
                  className="px-3 py-1 text-xs bg-eco-100 text-eco-700 rounded-full hover:bg-eco-200 transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Search Results */}
          {filteredSuggestions.length > 0 && (
            <div className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Products</span>
              </div>
              {filteredSuggestions.map(product => (
                <button
                  key={product.id}
                  onClick={() => handleSuggestionClick(product)}
                  className="w-full p-2 hover:bg-gray-50 rounded-lg text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{product.name}</div>
                      <div className="text-sm text-gray-500 truncate">{product.category}</div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-eco-600">
                      <Leaf className="w-3 h-3" />
                      <span>{product.carbonFootprint}g CO₂</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {searchQuery.trim() !== '' && filteredSuggestions.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>No products found for "{searchQuery}"</p>
              <p className="text-sm">Try different keywords or browse categories</p>
            </div>
          )}

          {/* Search Button */}
          <div className="p-3 border-t border-gray-100">
            <button
              onClick={() => handleSearch(searchQuery)}
              className="w-full bg-eco-600 text-white py-2 px-4 rounded-lg hover:bg-eco-700 transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              Search for "{searchQuery}"
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
