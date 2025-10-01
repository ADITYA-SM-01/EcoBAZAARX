import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useProductContext } from '../context/ProductContext';
import { useNavigate } from 'react-router-dom';
import { 
  Leaf, 
  Heart, 
  User, 
  Search, 
  LogOut, 
  Settings, 
  Palette,
  Crown,
  Store,
  Trophy,
  BarChart3,
  Users,
  Package,
  ShoppingCart,
  Filter,
  SortAsc,
  SortDesc,
  X
} from 'lucide-react';
import { SortOption } from '../types/product';
import { getImageUrl } from '../services/ProductService';

interface NavigationProps {
  onSearch: (query: string) => void;
  onCartOpen?: () => void;
  onWishlistClick?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onSearch, onCartOpen, onWishlistClick }) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showSellerConfirm, setShowSellerConfirm] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const { user, isAuthenticated, logout, updateUser } = useAuth();
  const { totalItems } = useCart();
  const { currentTheme, setTheme, availableThemes } = useTheme();
  const { filterOptions, sortProducts, searchProducts, products, setCO2MaxFilter, setMinCO2Filter } = useProductContext();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [co2Range, setCo2Range] = useState({ min: 0, max: 1000 });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchFocus = () => {
    setShowSuggestions(true);
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  // Removed unused handleSellerDashboardClick

  const handleProfileClick = useCallback(() => {
    if (isAuthenticated && user) {
      navigate('/profile');
      setShowUserMenu(false);
    } else {
      // Redirect to login if not authenticated
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchProducts(searchQuery);
      onSearch(searchQuery);
      setShowSuggestions(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    searchProducts('');
    onSearch('');
    setShowSuggestions(false);
  };

  const sortOptions: { value: SortOption; label: string; icon: React.ReactNode }[] = [
    { value: 'carbon-low', label: 'Lowest Carbon', icon: <Leaf className="w-4 h-4" /> },
    { value: 'carbon-high', label: 'Highest Carbon', icon: <SortDesc className="w-4 h-4" /> },
    { value: 'price-low', label: 'Price: Low to High', icon: <SortAsc className="w-4 h-4" /> },
    { value: 'price-high', label: 'Price: High to Low', icon: <SortDesc className="w-4 h-4" /> },
    { value: 'name', label: 'Name: A to Z', icon: <SortAsc className="w-4 h-4" /> }
  ];

  const handleSortChange = (sortBy: SortOption) => {
    sortProducts(sortBy);
  };

  const handleCO2RangeChange = (type: 'min' | 'max', value: number) => {
    setCo2Range(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleCO2RangeFilter = () => {
    // Apply both min and max CO2 filters
    setMinCO2Filter(co2Range.min > 0 ? co2Range.min : undefined);
    setCO2MaxFilter(co2Range.max > 1000 ? co2Range.max : undefined);
  };

  const handleBecomeSeller = async () => {
    try {
      if (!user?.name) return;
      
      const response = await fetch(`http://localhost:8090/req/users/${encodeURIComponent(user.name)}/become-seller`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to become a seller');
      }

      const updatedUser = {
        ...user,
        isSeller: true,
        role: 'seller' as const
      };
      updateUser(updatedUser);
      setShowSellerConfirm(false);
      setShowUserMenu(false);
      setShowCelebration(true);
      
      // Hide celebration after 5 seconds and navigate
      setTimeout(() => {
        setShowCelebration(false);
        navigate('/seller');
      }, 5000);
    } catch (error) {
      console.error('Error becoming a seller:', error);
      setShowSellerConfirm(false);
      alert('Failed to become a seller. Please try again.');
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    setShowUserMenu(false);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-purple-600" />;
      case 'seller':
        return <Store className="w-4 h-4 text-blue-600" />;
      default:
        return <User className="w-4 h-4 text-eco-600" />;
    }
  };

  const getFilteredSuggestions = () => {
    if (!searchQuery.trim()) {
      return products.slice(0, 8);
    }
    
    const suggestions = products.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 8);

    return suggestions;
  };

  const [showThemeMenu, setShowThemeMenu] = useState(false);
  return (
    <header className="navbar-glass sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">EcoBAZZARX</h1>
              <p className="text-xs text-white/80 -mt-1">Sustainable Shopping</p>
            </div>
          </div>

          {/* Filter & Sort Section */}
          <div className="hidden lg:flex flex-grow mx-8">
            <div className="relative group" ref={searchRef}>
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                <input
                  type="text"
                  placeholder="Search Eco-Products"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  className="w-full min-w-[600px] pl-10 pr-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-transparent text-white placeholder-white/60 transition-all duration-300"
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-white/60 hover:text-white/80 transition-colors "
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Search Suggestions Dropdown */}
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-[60] max-h-96 overflow-y-auto min-w-[600px]">
                  {/* Quick Category Filters */}
                  <div className="p-3 border-b border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Filter className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Quick Filters</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['All', 'Kitchen', 'Fashion', 'Electronics', 'Home', 'Beauty'].slice(0, 6).map(category => (
                        <button
                          key={category}
                          onClick={() => {
                            const newQuery = category === 'All' ? searchQuery : `${searchQuery} ${category}`.trim();
                            setSearchQuery(newQuery);
                            searchProducts(newQuery);
                          }}
                          className="px-3 py-1 text-xs bg-eco-100 text-eco-700 rounded-full hover:bg-eco-200 transition-colors"
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Product Suggestions */}
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Search className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {searchQuery.trim() !== '' ? 'Search Results' : 'All Products'}
                      </span>
                    </div>
                    {getFilteredSuggestions().length > 0 ? (
                      getFilteredSuggestions().map(product => (
                        <button
                          key={product.id}
                          onClick={() => {
                            setSearchQuery(product.name);
                            searchProducts(product.name);
                            setShowSuggestions(false);
                          }}
                          className="w-full p-3 hover:bg-gray-50 rounded-lg text-left transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={getImageUrl(product)}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 truncate">{product.name}</div>
                              <div className="text-sm text-gray-500 truncate">{product.category}</div>
                              <div className="text-sm font-semibold text-eco-600">${product.price}</div>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-eco-600">
                              <Leaf className="w-3 h-3" />
                              <span>{product.carbonFootprint}g CO₂</span>
                            </div>
                          </div>
                        </button>
                      ))
                    ) : searchQuery.trim() !== '' ? (
                      <div className="text-center py-6 text-gray-500">
                        <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p>No products found for "{searchQuery}"</p>
                        <p className="text-sm">Try different keywords or browse categories</p>
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p>No products available</p>
                        <p className="text-sm">Please check back later</p>
                      </div>
                    )}
                  </div>

                  {/* Search Button */}
                  {searchQuery.trim() !== '' && (
                    <div className="p-3 border-t border-gray-100">
                      <button
                        onClick={() => {
                          handleSearch({ preventDefault: () => {} } as any);
                          setShowSuggestions(false);
                        }}
                        className="w-full bg-eco-600 text-white py-2 px-4 rounded-lg hover:bg-eco-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Search className="w-4 h-4" />
                        Search for "{searchQuery}"
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Expanded Filter & Sort Options on Hover */}
              <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm border border-white/30 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 min-w-[600px]">
                <div className="p-4">
                  {/* Quick Sort Options */}
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <Filter className="w-4 h-4 text-eco-600" />
                      Quick Sort Options
                    </h3>
                    <div className="flex flex-wrap gap-2">
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
                  </div>

                  {/* CO2 Range Filters */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-eco-600" />
                        CO2 Impact Range (g CO₂)
                      </h3>
                      {(co2Range.min > 0 || co2Range.max > 1000) && (
                        <button
                          onClick={() => {
                            setCo2Range({ min: 0, max: 1000 });
                            setMinCO2Filter(undefined);
                            setCO2MaxFilter(undefined);
                          }}
                          className="text-xs text-eco-600 hover:text-eco-800 transition-colors"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    
                    {/* Min-Max Range Inputs */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-600 mb-1">Min CO₂</label>
                          <input
                            type="number"
                            min="0"
                            max={co2Range.max}
                            value={co2Range.min}
                            onChange={(e) => handleCO2RangeChange('min', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-transparent"
                            placeholder="0"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-gray-600 mb-1">Max CO₂</label>
                          <input
                            type="number"
                            min={co2Range.min}
                            max="5000"
                            value={co2Range.max}
                            onChange={(e) => handleCO2RangeChange('max', parseInt(e.target.value) || 1000)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-transparent"
                            placeholder="1000"
                          />
                        </div>
                      </div>
                      
                      {/* Range Slider */}
                      <div className="relative">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>0</span>
                          <div className="flex-1 relative">
                            <div className="h-2 bg-gray-200 rounded-full">
                              <div 
                                className="h-2 bg-eco-500 rounded-full transition-all duration-200"
                                style={{ 
                                  width: `${Math.min(100, Math.max(0, ((co2Range.max - co2Range.min) / Math.max(co2Range.max, 1000)) * 100))}%`,
                                  marginLeft: `${Math.min(100, Math.max(0, (co2Range.min / Math.max(co2Range.max, 1000)) * 100))}%`
                                }}
                              ></div>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max={Math.max(co2Range.max, 1000)}
                              value={co2Range.min}
                              onChange={(e) => handleCO2RangeChange('min', parseInt(e.target.value))}
                              className="absolute top-0 w-full h-2 opacity-0 cursor-pointer"
                            />
                            <input
                              type="range"
                              min="0"
                              max={Math.max(co2Range.max, 1000)}
                              value={co2Range.max}
                              onChange={(e) => handleCO2RangeChange('max', parseInt(e.target.value))}
                              className="absolute top-0 w-full h-2 opacity-0 cursor-pointer"
                            />
                          </div>
                          <span>{Math.max(co2Range.max, 1000)}+</span>
                        </div>
                      </div>
                      
                      {/* Apply Button */}
                      <button
                        onClick={handleCO2RangeFilter}
                        className="w-full bg-eco-600 text-white py-2 px-4 rounded-lg hover:bg-eco-700 transition-colors text-sm font-medium"
                      >
                        Apply CO₂ Filter
                      </button>
                    </div>
                  </div>

                  {/* Eco-friendly Message */}
                  <div className="flex items-center justify-between text-sm text-gray-600 pt-3 border-t border-gray-200">
                    <span className="flex items-center gap-2">
                      🌱 Choose products with lower carbon footprint for a greener planet!
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-eco-500"></div>
                      <span>Low Impact</span>
                      <div className="w-3 h-3 rounded-full bg-carbon-500"></div>
                      <span>High Impact</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="lg:hidden flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                className="w-full pl-10 pr-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-transparent text-white placeholder-white/60"
              />
            </form>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            {/* Theme Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="p-2 text-gray-600 hover:text-eco-600 transition-colors rounded-lg hover:bg-gray-100"
                title="Change Theme"
              >
                <Palette className="w-5 h-5" />
              </button>
              
              {showThemeMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {availableThemes.map((theme) => (
                    <button
                      key={theme.name}
                      onClick={() => {
                        setTheme(theme.name);
                        setShowThemeMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                        currentTheme.name === theme.name ? 'text-eco-600 bg-eco-50' : 'text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: theme.primary }}
                        />
                        {theme.name}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Wishlist */}
            <button 
              onClick={onWishlistClick}
              className="p-2 text-gray-600 hover:text-eco-600 transition-colors rounded-lg hover:bg-gray-100"
            >
              <Heart className="w-5 h-5" />
            </button>

            {/* Cart */}
            <button 
              onClick={onCartOpen}
              className="relative p-2 text-gray-600 hover:text-eco-600 transition-colors rounded-lg hover:bg-gray-100"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-eco-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-eco-100 to-eco-200 rounded-lg hover:from-eco-200 hover:to-eco-300 transition-all duration-200"
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-eco-500 to-eco-600 rounded-full flex items-center justify-center">
                    {getRoleIcon(user?.role || 'customer')}
                  </div>
                  <span className="text-sm font-medium text-eco-800">{user?.name}</span>
                  <span className="text-xs text-eco-600 bg-white px-2 py-1 rounded-full capitalize">
                    {user?.role}
                  </span>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-eco-500 to-eco-600 rounded-full flex items-center justify-center">
                          {getRoleIcon(user?.role || 'customer')}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user?.name}</p>
                          <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="py-2">
                      {/* Profile */}
                      <button
                        onClick={handleProfileClick}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </button>                      

                      {/* Role-specific Navigation */}
                      {user?.role === 'admin' && (
                        <React.Fragment>
                          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Manage Users
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Manage Products
                          </button>
                          <button 
                            onClick={() => {
                              navigate('/admin/sellers');
                              setShowUserMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                          >
                            <Store className="w-4 h-4" />
                            Seller Management
                          </button>
                          <button 
                            onClick={() => {
                              navigate('/admin/analytics');
                              setShowUserMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                          >
                            <BarChart3 className="w-4 h-4" />
                            Analytics
                          </button>
                        </React.Fragment>
                      )}

                      {user?.role === 'seller' && (
                        <>
                          <button 
                            onClick={() => {
                              navigate('/seller/dashboard');
                              setShowUserMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                          >
                            <Package className="w-4 h-4" />
                            Seller Dashboard
                          </button>
                          <button 
                            onClick={() => {
                              navigate('/seller/analytics');
                              setShowUserMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                          >
                            <BarChart3 className="w-4 h-4" />
                            Sales Analytics
                          </button>
                        </>
                      )}

                      {user?.role === 'customer' && (
                        <>
                          <button 
                            onClick={() => {
                              navigate('/orders');
                              setShowUserMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            My Orders
                          </button>
                          <button 
                            onClick={() => {
                              navigate('/leaderboard');
                              setShowUserMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                            <Trophy className="w-4 h-4" />
                            Leaderboard
                          </button>
                          {!user?.isSeller && (
                            <button 
                              onClick={() => setShowSellerConfirm(true)}
                              className="w-full text-left px-4 py-2 text-sm text-eco-600 hover:bg-eco-50 transition-colors flex items-center gap-2"
                            >
                              <Store className="w-4 h-4" />
                              Become a Seller
                            </button>
                          )}
                        </>
                      )}

                      {/* Settings */}
                      <button 
                        onClick={() => {
                          navigate('/settings');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>
                    </div>

                    {/* Role Switch */}
                    {user?.isSeller && (
                      <div className="border-t border-gray-200 pt-2">
                        <button
                          onClick={() => {
                            updateUser({ ...user, role: user.role === 'seller' ? 'customer' : 'seller' });
                            navigate(user.role === 'seller' ? '/' : '/seller');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-eco-600 hover:bg-eco-50 transition-colors flex items-center gap-2"
                        >
                          {user.role === 'seller' ? <User className="w-4 h-4" /> : <Store className="w-4 h-4" />}
                          Switch to {user.role === 'seller' ? 'Customer' : 'Seller'} View
                        </button>
                      </div>
                    )}

                    {/* Logout */}
                    <div className="border-t border-gray-200 pt-2">
                      <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
      {/* Become Seller Confirmation Modal */}
      {showSellerConfirm && (
        <div className="fixed inset-0 z-[9999] overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm" />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all scale-100 opacity-100 animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-6 bg-eco-100 rounded-full flex items-center justify-center">
              <Store className="w-8 h-8 text-eco-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white text-center">Become a Seller?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
              Are you ready to start your journey as a seller on EcoBAZZARX? You'll be able to list and sell your eco-friendly products.
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition-colors duration-200"
                onClick={() => setShowSellerConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2.5 rounded-xl bg-eco-600 text-white hover:bg-eco-700 font-medium transition-colors duration-200 shadow-lg shadow-eco-600/20"
                onClick={handleBecomeSeller}
              >
                Let's Go!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Celebration Animation */}
      {showCelebration && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm animate-fade-in pointer-events-none" />
          <div className="relative text-center">
            {/* Confetti particles */}
            <div className="absolute -inset-20 overflow-hidden pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-confetti"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: '-20px',
                    width: '8px',
                    height: '8px',
                    borderRadius: Math.random() > 0.5 ? '50%' : '0',
                    backgroundColor: ['#22c55e', '#eab308', '#3b82f6', '#ec4899', '#8b5cf6'][Math.floor(Math.random() * 5)],
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${3 + Math.random() * 2}s`
                  }}
                />
              ))}
            </div>

            <div className="animate-bounce-custom mb-4">
              <div className="w-24 h-24 bg-eco-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                <Store className="w-12 h-12 text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4 animate-fade-in-up">
              Congratulations!
            </h2>
            <p className="text-xl text-white/90 animate-fade-in-up delay-200">
              You are now a seller on EcoBAZZARX!
            </p>
            <button
              onClick={() => setShowCelebration(false)}
              className="mt-8 px-6 py-3 bg-white text-eco-500 text-lg rounded-full hover:bg-eco-50 transition-all hover:scale-105 animate-fade-in-up delay-300"
            >
              Start Your Seller Journey
            </button>
            <div className="absolute inset-0 -z-10 animate-confetti">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: ['#16a34a', '#2563eb', '#9333ea', '#f59e0b'][i % 4],
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `confetti 1s ease-out ${Math.random() * 3}s`,
                    transform: `rotate(${Math.random() * 360}deg)`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[9999] overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm" />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all scale-100 opacity-100 animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <LogOut className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Sign Out?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Are you sure you want to sign out from your account?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition-colors duration-200"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 font-medium transition-colors duration-200 shadow-lg shadow-red-600/20"
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button className="eco-button text-sm">
                Sign In
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navigation;

