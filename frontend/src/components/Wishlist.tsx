import React, { useState } from 'react';
import { useLikes } from '../context/LikesContext';
import { useProductContext } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import ProductCard from './ProductCard';
import { Heart, ShoppingBag, ArrowLeft, Filter, SortAsc, SortDesc, Trash2, Sparkles } from 'lucide-react';

interface WishlistProps {
  isOpen: boolean;
  onClose: () => void;
}

const Wishlist: React.FC<WishlistProps> = ({ isOpen, onClose }) => {
  const { likedProducts, removeFromLikes } = useLikes();
  const { products } = useProductContext();
  const { addToCart } = useCart();

  const [sortBy, setSortBy] = useState<'name' | 'price' | 'carbon' | 'rating'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const likedProductsData = products.filter(product => likedProducts.includes(product.id));



  const handleRemoveFromLikes = (productId: string) => {
    removeFromLikes(productId);
  };

  // Sort and filter products
  const sortedAndFilteredProducts = likedProductsData
    .filter(product => filterCategory === 'all' || product.category === filterCategory)
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'carbon':
          aValue = a.carbonFootprint;
          bValue = b.carbonFootprint;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const categories = ['all', ...Array.from(new Set(likedProductsData.map(p => p.category)))];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative gradient-modal rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6 sticky top-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Close wishlist"
          >
            <ArrowLeft className="w-5 h-5 rotate-180" />
            Close
          </button>
        </div>

        <div className="text-center mb-6">
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your collection of favorite eco-friendly products. Keep track of items you love and want to purchase later.
          </p>
        </div>

        {/* Stats */}
        <div className="gradient-card rounded-xl shadow-lg border border-eco-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-eco-600 mb-2 flex items-center justify-center gap-2">
                {likedProductsData.length}
                <Sparkles className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="text-gray-600">Liked Products</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                ${likedProductsData.reduce((sum, product) => sum + product.price, 0).toFixed(2)}
              </div>
              <div className="text-gray-600">Total Value</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {likedProductsData.filter(p => p.carbonFootprint <= 1.5).length}
              </div>
              <div className="text-gray-600">Low Impact Items</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {likedProductsData.filter(p => p.carbonFootprint <= 0.8).length}
              </div>
              <div className="text-gray-600">Eco Champions</div>
            </div>
          </div>
        </div>

        {/* Filters and Sorting */}
        {likedProductsData.length > 0 && (
          <div className="gradient-card rounded-xl shadow-lg border border-eco-200 p-6 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Filter:</span>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-eco-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-eco-500 focus:border-transparent"
                >
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="carbon">Carbon Footprint</option>
                  <option value="rating">Rating</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                  title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                >
                  {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {sortedAndFilteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedAndFilteredProducts.map((product) => (
              <div key={product.id} className="relative group">
                <ProductCard product={product} />
                <button
                  onClick={() => handleRemoveFromLikes(product.id)}
                  className="absolute top-4 right-4 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-300 z-10 opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-8">
              Start exploring our eco-friendly products and add your favorites to your wishlist!
            </p>
            <button
              onClick={onClose}
              className="eco-button flex items-center gap-2 mx-auto"
            >
              <ShoppingBag className="w-5 h-5" />
              Browse Products
            </button>
          </div>
        )}

        {/* Quick Actions */}
        {likedProductsData.length > 0 && (
          <div className="mt-8 gradient-card rounded-xl shadow-lg border border-eco-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => {
                  likedProductsData.forEach(product => addToCart(product.id));
                }}
                className="gradient-button-primary flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <ShoppingBag className="w-5 h-5" />
                Add All to Cart
              </button>
              <button
                onClick={() => setShowClearConfirm(true)}
                className="gradient-button-danger px-6 py-2 font-medium flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <Trash2 className="w-5 h-5" />
                Clear Wishlist
              </button>
            </div>
          </div>
        )}

        {/* Clear Confirmation Modal */}
        {showClearConfirm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowClearConfirm(false)} />
            <div className="relative bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Clear Wishlist?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to remove all {likedProductsData.length} items from your wishlist? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    likedProductsData.forEach(product => removeFromLikes(product.id));
                    setShowClearConfirm(false);
                  }}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
