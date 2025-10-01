import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLikes } from '../context/LikesContext';
import { useProductContext } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import ProductCard from './ProductCard';
import { Heart, ShoppingBag, ArrowLeft, Filter, SortAsc, SortDesc, Trash2, Sparkles } from 'lucide-react';
import { Product } from '../types/product';

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
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  const likedProductsData = products.filter(product => likedProducts.includes(String(product.id)));

  const handleRemoveFromLikes = async (productId: string) => {
    setIsRemoving(productId);
    await new Promise(resolve => setTimeout(resolve, 300));
    removeFromLikes(productId);
    setIsRemoving(null);
  };

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
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="relative bg-white dark:bg-gray-800 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl transform transition-all duration-300"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 p-6 sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-eco-500/10 to-eco-600/10">
          <div className="flex items-center gap-4">
            <motion.div 
              whileHover={{ rotate: 12, scale: 1.05 }}
              className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-xl transform hover:rotate-0 transition-transform duration-300"
            >
              <Heart className="w-6 h-6 text-white drop-shadow" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Wishlist</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{likedProductsData.length} items saved</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            aria-label="Close wishlist"
          >
            <ArrowLeft className="w-5 h-5 rotate-180" />
            Close
          </button>
        </div>

        <div className="p-6 pt-2">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600"
          >
            <span className="font-medium">✨ Pro Tip:</span> Keep track of your favorite eco-friendly products and get notified when they go on sale.
            {likedProductsData.length === 0 && " Start by clicking the heart icon on products you love!"}
          </motion.p>
        </div>

        {/* Stats */}
        <div className="px-6 pb-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-eco-50 to-eco-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-eco-200 dark:border-gray-600 p-6 overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-grid opacity-5" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center relative z-10">
              <div>
                <div className="text-3xl font-bold text-eco-600 dark:text-eco-400 mb-2 flex items-center justify-center gap-2">
                  {likedProductsData.length}
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="text-gray-600 dark:text-gray-400">Liked Products</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  ${likedProductsData.reduce((sum, product) => sum + product.price, 0).toFixed(2)}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Total Value</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {likedProductsData.filter(p => p.carbonFootprint <= 1.5).length}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Low Impact Items</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {likedProductsData.filter(p => p.carbonFootprint <= 0.8).length}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Eco Champions</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters and Sorting */}
        {likedProductsData.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 mb-6 mx-6"
          >
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-eco-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-eco-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="carbon">Carbon Footprint</option>
                  <option value="rating">Rating</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                >
                  {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Content */}
        <div className="overflow-y-auto">
          {sortedAndFilteredProducts.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6 pt-0"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.05
                  }
                }
              }}
            >
              {sortedAndFilteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  className="relative group"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                  <button
                    onClick={() => handleRemoveFromLikes(String(product.id))}
                    className={`absolute top-4 right-4 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
                      isRemoving === String(product.id)
                        ? 'opacity-0 scale-95 transform -translate-x-4'
                        : 'opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100'
                    }`}
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16 px-4">
              <motion.div
                initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ 
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100 
                }}
                className="relative w-32 h-32 mx-auto mb-8"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 to-red-600/20 rounded-3xl transform rotate-12" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Heart className="w-16 h-16 text-red-500 drop-shadow-lg" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400/20 rounded-full flex items-center justify-center"
                >
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                </motion.div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Your wishlist is waiting
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                  Discover our eco-friendly products and start building your sustainable wishlist. Save your favorites and track their environmental impact!
                </p>
                <button
                  onClick={onClose}
                  className="bg-gradient-to-r from-eco-500 to-eco-600 text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2 mx-auto hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Explore Products
                </button>
              </motion.div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {likedProductsData.length > 0 && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-4 justify-end">
              <button
                onClick={() => {
                  likedProductsData.forEach(product => addToCart(String(product.id)));
                }}
                className="px-4 py-2 bg-eco-500 hover:bg-eco-600 text-white rounded-lg flex items-center gap-2 transition-colors duration-200"
              >
                <ShoppingBag className="w-4 h-4" />
                Add All to Cart
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Wishlist;