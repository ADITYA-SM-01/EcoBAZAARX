/**
 * Enhanced ProductCatalogue Component with Thematic UI, Glowing Animations, and Improved Design
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useLikes } from '../context/LikesContext';
import { Product } from '../types/product';

import Navigation from '../components/Navigation';
import ProductGrid from '../components/ProductGrid';
import ProductForm from '../components/ProductForm';
import CartModal from '../components/CartModal';
import ProductDetail from '../components/ProductDetail';
import Wishlist from '../components/Wishlist';
import CategoryCarousel from '../components/CategoryCarousel';

import { Leaf, ShoppingBag, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';


const ProductCatalogue: React.FC = () => {
  const { } = useAuth();
  const { selectedProduct, setSelectedProduct, addToLastViewed } = useApp();
  const { isLiked, toggleLike } = useLikes();
  const { currentTheme } = useTheme();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [productGridKey, setProductGridKey] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleProductFormSave = () => {
    setShowAddProduct(false);
    setProductGridKey(prev => prev + 1);
  };

  const handleProductFormCancel = () => setShowAddProduct(false);
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    addToLastViewed(product);
  };
  const handleCloseProductDetail = () => setSelectedProduct(null);
  const handleWishlistClick = () => setShowWishlist(true);
  const handleBackFromWishlist = () => setShowWishlist(false);

  return (
    <div 
      className="min-h-screen transition-all duration-300"
      style={{ 
        background: currentTheme.background,
        color: currentTheme.text
      }}
    >
      <Navigation 
        onSearch={() => {}} 
        onCartOpen={() => setIsCartOpen(true)}
        onWishlistClick={handleWishlistClick}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-12"
        >
          <h2 
            className="text-5xl font-extrabold mb-4"
            style={{ color: currentTheme.primary }}
          >
            Discover Sustainable Products
          </h2>
          <p 
            className="text-lg max-w-3xl mx-auto transition-colors"
            style={{ color: currentTheme.text }}
          >
            Shop confidently with eco-friendly products. Reduce your carbon footprint
            while enjoying premium quality and design.
          </p>
        </motion.div>

        {/* Category Section */}
        <div className="mb-8 relative">
          <CategoryCarousel onSelectCategories={setSelectedCategories} />
          {selectedCategories.length > 0 && (
            <div className="mt-4 text-center">
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm inline-flex items-center gap-2"
                style={{ color: currentTheme.secondary }}
              >
                Showing products in <span className="font-semibold">{selectedCategories.join(", ")}</span>
                <button 
                  onClick={() => setSelectedCategories([])}
                  className="ml-2 text-xs py-1 px-2 rounded-full bg-opacity-10 hover:bg-opacity-20 transition-all"
                  style={{ backgroundColor: currentTheme.secondary + '20' }}
                >
                  Clear filters
                </button>
              </motion.p>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="space-y-8">
          <ProductGrid key={productGridKey} onProductClick={handleProductClick} category={selectedCategories} />
        </div>

        {/* Add Product Modal */}
        {showAddProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-br from-eco-700 to-eco-600 rounded-2xl shadow-2xl p-10 w-full max-w-xl relative"
            >
              <button
                className="absolute top-4 right-4 text-gray-200 hover:text-white text-2xl font-bold"
                onClick={handleProductFormCancel}
                aria-label="Close"
              >
                &times;
              </button>
              <h3 className="text-2xl font-bold mb-6 text-white">Add New Product</h3>
              <ProductForm onSave={handleProductFormSave} onCancel={handleProductFormCancel} />
            </motion.div>
          </div>
        )}

        {/* Eco Impact Summary */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="mt-16 p-10 rounded-3xl shadow-xl border transition-all duration-300"
          style={{ 
            background: currentTheme.gradientPrimary,
            borderColor: currentTheme.accent
          }}
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5 }}
              className="mx-auto mb-6 w-16 h-16"
            >
              <Leaf className="w-16 h-16 text-eco-50 drop-shadow-xl" />
            </motion.div>
            <h3 className="text-3xl font-bold mb-4 text-white drop-shadow-md">Your Shopping Makes a Difference</h3>
            <p className="text-white/90 max-w-2xl mx-auto mb-8">
              Every eco-friendly choice contributes to a healthier planet. Shop consciously and
              make a positive impact with every purchase.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {[
                { icon: Leaf, title: 'Eco-Friendly', desc: 'Sustainable design and products' },
                { icon: ShoppingBag, title: 'Quality Assured', desc: 'Premium, durable items' },
                { icon: Heart, title: 'Planet Positive', desc: 'Reduce environmental impact' }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-6 rounded-2xl shadow-lg border transition-all duration-300"
                  style={{ 
                    background: currentTheme.cardBg,
                    borderColor: currentTheme.accent,
                    color: currentTheme.text
                  }}
                >
                  <div 
                    className="w-14 h-14 mx-auto mb-3 flex items-center justify-center rounded-full transition-colors"
                    style={{ 
                      background: currentTheme.cardBg,
                      boxShadow: currentTheme.boxShadow
                    }}
                  >
                    <item.icon 
                      className="w-6 h-6" 
                      style={{ color: currentTheme.primary }}
                    />
                  </div>
                  <h4 
                    className="font-semibold mb-1"
                    style={{ color: currentTheme.primary }}
                  >
                    {item.title}
                  </h4>
                  <p 
                    className="text-sm"
                    style={{ color: currentTheme.text }}
                  >
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer 
        className="mt-16 transition-all duration-300"
        style={{ 
          background: currentTheme.gradientSecondary,
          color: 'white'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                  style={{ background: currentTheme.primary }}
                >
                  <Leaf className="w-5 h-5 text-white drop-shadow-md" />
                </div>
                <span className="text-xl font-bold text-white drop-shadow-md">EcoBAZZARX</span>
              </div>
              <p className="text-gray-400 text-sm">
                Sustainable shopping made easy. Explore eco-friendly products with style.
              </p>
            </div>
            <div>
              <h4 
                className="font-semibold mb-4 text-white drop-shadow-md"
                style={{ textShadow: `0 2px 4px ${currentTheme.secondary}40` }}
              >
                Quick Links
              </h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Sustainability</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Kitchen</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Fashion</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Electronics</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <p className="text-white/80 text-sm mb-4">
                Stay updated with the latest eco-friendly products.
              </p>
              <button 
                className="w-full transition-all shadow-lg py-2 rounded-lg border"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`,
                  borderColor: currentTheme.accent
                }}
              >
                Subscribe to Newsletter
              </button>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-white/80">
            <p>&copy; 2024 EcoBAZZARX. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      {selectedProduct && (
        <ProductDetail
          productId={Number(selectedProduct.id)}
          onClose={handleCloseProductDetail}
          onAddToLikes={(productId: number) => toggleLike(String(productId))}
          isLiked={isLiked(String(selectedProduct.id))}
        />
      )}
      <Wishlist isOpen={showWishlist} onClose={handleBackFromWishlist} />
    </div>
  );
};

export default ProductCatalogue;