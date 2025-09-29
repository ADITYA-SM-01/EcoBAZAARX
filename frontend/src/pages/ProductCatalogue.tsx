import React, { useState } from 'react';

import { useAuth } from '../context/AuthContext';

import Navigation from '../components/Navigation';
import ProductGrid from '../components/ProductGrid';
import ProductForm from '../components/ProductForm';
import CartModal from '../components/CartModal';
import ProductDetail from '../components/ProductDetail';
import Wishlist from '../components/Wishlist';

import { useLikes } from '../context/LikesContext';
import { Leaf, ShoppingBag, Heart } from 'lucide-react';

const ProductCatalogue: React.FC = () => {
  const { isLiked, toggleLike } = useLikes();
  const { user } = useAuth();
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [productGridKey, setProductGridKey] = useState(0); // for refreshing grid
  const handleAddProductClick = () => {
    setShowAddProduct(true);
  };

  const handleProductFormSave = () => {
    setShowAddProduct(false);
    setProductGridKey(prev => prev + 1); // force ProductGrid to reload
  };

  const handleProductFormCancel = () => {
    setShowAddProduct(false);
  };

  const handleSearch = (_query: string) => {
    // Filter products based on search query
    // This would be implemented in the ProductContext
  };

  const handleThemeChange = () => {
    // Theme change functionality
  };

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
  };

  const handleCloseProductDetail = () => {
    setSelectedProduct(null);
  };

  const handleWishlistClick = () => {
    setShowWishlist(true);
  };

  const handleBackFromWishlist = () => {
    setShowWishlist(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-50 via-blue-50 to-purple-50">
      {/* Navigation */}
      <Navigation 
        onSearch={handleSearch} 
        onCartOpen={() => setIsCartOpen(true)}
        onWishlistClick={handleWishlistClick}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Sustainable Products
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Shop with confidence knowing every product's environmental impact. 
            Choose products with lower carbon footprints to make a positive difference for our planet.
          </p>
        </div>

        {/* Add Product Button
        <div className="flex justify-end mb-4">
          <button
            className="gradient-button-primary px-6 py-3 rounded-lg font-medium shadow hover:scale-105 transition-transform"
            onClick={handleAddProductClick}
          >
            + Add Product
          </button> *
        </div>/}
        {/* Filters and Products */}
        <div className="space-y-8">
          <ProductGrid key={productGridKey} onProductClick={handleProductClick} />
        </div>

        {/* Add Product Modal */}
        {showAddProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-xl relative">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
                onClick={handleProductFormCancel}
                aria-label="Close"
              >
                &times;
              </button>
              <h3 className="text-xl font-bold mb-4">Add New Product</h3>
              <ProductForm onSave={handleProductFormSave} onCancel={handleProductFormCancel} />
            </div>
          </div>
        )}

        {/* Eco Impact Summary */}
        <div className="mt-16 gradient-card rounded-xl shadow-lg border border-eco-200 p-8">
          <div className="text-center">
            <Leaf className="w-16 h-16 text-eco-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Your Shopping Makes a Difference
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              By choosing products with lower carbon footprints, you're actively contributing to 
              environmental conservation. Every purchase is a step towards a more sustainable future.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-eco-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Leaf className="w-6 h-6 text-eco-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Eco-Friendly</h4>
                <p className="text-sm text-gray-600">Products designed with sustainability in mind</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-eco-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag className="w-6 h-6 text-eco-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Quality Assured</h4>
                <p className="text-sm text-gray-600">Premium products that last longer</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-eco-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-eco-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Planet Positive</h4>
                <p className="text-sm text-gray-600">Reducing environmental impact together</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-eco-500 rounded-lg flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">EcoBAZZARX</span>
              </div>
              <p className="text-gray-400 text-sm">
                Your destination for sustainable shopping. Making eco-friendly choices easier and more accessible.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sustainability</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Kitchen</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Fashion</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Electronics</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <p className="text-gray-400 text-sm mb-4">
                Stay updated with our latest eco-friendly products and sustainability tips.
              </p>
              <button className="eco-button w-full">
                Subscribe to Newsletter
              </button>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 EcoBAZZARX. All rights reserved. Committed to a sustainable future.</p>
          </div>
        </div>
      </footer>

      {/* Cart Modal */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Product Detail Modal */}
        {selectedProduct && (
          <ProductDetail
            productId={Number(selectedProduct.id)}
            onClose={handleCloseProductDetail}
            onAddToLikes={(productId: number) => toggleLike(String(productId))}
            isLiked={isLiked(String(selectedProduct.id))}
          />
        )}

        {/* Wishlist Modal */}
      <Wishlist isOpen={showWishlist} onClose={handleBackFromWishlist} />
    </div>
  );
};

export default ProductCatalogue;
