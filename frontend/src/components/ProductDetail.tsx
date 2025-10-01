import React, { useEffect, useState } from 'react';
import { Product } from '../types/product';
import { useCart } from '../context/CartContext';
import { fetchProductById, getImageUrl } from '../services/ProductService';

import { 
  Leaf, 
  Star, 
  ShoppingCart, 
  TrendingDown, 
  Check, 
  Heart, 
  Share2, 
  ArrowLeft,
  Package,
  Truck,
  Shield,
  Users
} from 'lucide-react';

interface ProductDetailProps {
  productId: number;
  onClose: () => void;
  onAddToLikes: (productId: number) => void;
  isLiked: boolean;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId, onClose, onAddToLikes, isLiked }) => {
  const { addToCart, items } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showAdded, setShowAdded] = useState(false);

  useEffect(() => {
    fetchProductById(productId)
      .then(setProduct)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) return <div>Loading product...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!product) return <div>Product not found.</div>;

  const isLowImpact = product.carbonFootprint <= 1.5;
  const isVeryLowImpact = product.carbonFootprint <= 0.8;
  const isInCart = items.some(item => item.productId === product.id);

  const getImpactBadge = () => {
    if (isVeryLowImpact) {
      return (
        <div className="bg-eco-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 animate-float">
          <Leaf className="w-4 h-4" />
          Very Low Impact
        </div>
      );
    } else if (isLowImpact) {
      return (
        <div className="bg-eco-400 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
          <Leaf className="w-4 h-4" />
          Low Impact
        </div>
      );
    } else {
      return (
        <div className="bg-carbon-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
          <TrendingDown className="w-4 h-4" />
          High Impact
        </div>
      );
    }
  };

  const handleAddToCart = async () => {
    if (isInCart) return;
    setIsAddingToCart(true);
    addToCart(String(product.id));
    setShowAdded(true);
    setTimeout(() => setShowAdded(false), 2000);
    setIsAddingToCart(false);
  };

  const handleLike = () => {
    if (product) {
      onAddToLikes(Number(product.id));
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this eco-friendly product: ${product.name}`,
        url: window.location.href
      });
    }
  };

  const features = [
    { icon: Package, title: 'Sustainable Packaging', description: '100% recyclable materials' },
    { icon: Truck, title: 'Carbon Neutral Shipping', description: 'Offset delivery emissions' },
    { icon: Shield, title: 'Quality Guarantee', description: '30-day satisfaction guarantee' },
    { icon: Users, title: 'Community Impact', description: 'Supports local artisans' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Products
            </button>
            <div className="flex items-center gap-3">
              {getImpactBadge()}
              <button
                onClick={handleShare}
                className="p-2 text-gray-600 hover:text-eco-600 transition-colors rounded-lg hover:bg-gray-100"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                <img
                  src={getImageUrl(product)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-lg text-gray-600 mb-4">{product.description}</p>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{product.rating}</span>
                    <span className="text-gray-500">({product.reviews} reviews)</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500">Category: {product.category}</span>
                </div>
              </div>

              {/* Price and Carbon Info */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                  <div className="flex items-center gap-2">
                    <Leaf className={`w-5 h-5 ${isLowImpact ? 'text-eco-600' : 'text-carbon-600'}`} />
                    <span className={`font-medium ${isLowImpact ? 'text-eco-600' : 'text-carbon-600'}`}>
                      {product.carbonFootprint} kg CO₂
                    </span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600">
                  {isVeryLowImpact && (
                    <p className="text-eco-600 font-medium">🌟 Excellent eco-friendly choice!</p>
                  )}
                  {isLowImpact && !isVeryLowImpact && (
                    <p className="text-eco-600 font-medium">🌱 Good environmental impact</p>
                  )}
                  {!isLowImpact && (
                    <p className="text-carbon-600 font-medium">⚠️ Consider lower impact alternatives</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || isInCart}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                    isInCart
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-eco-600 hover:bg-eco-700 text-white'
                  }`}
                >
                  {isAddingToCart ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : showAdded ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <ShoppingCart className="w-5 h-5" />
                  )}
                  {isInCart ? 'In Cart' : showAdded ? 'Added!' : 'Add to Cart'}
                </button>

                <button
                  onClick={handleLike}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                    isLiked
                      ? 'border-red-500 bg-red-50 text-red-600'
                      : 'border-gray-300 hover:border-red-300 hover:bg-red-50'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Success Message */}
              {showAdded && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl animate-pulse">
                  <div className="flex items-center gap-2 text-green-700">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">Added to cart successfully!</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose This Product?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="text-center p-6 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-eco-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-eco-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Environmental Impact */}
          <div className="mt-12 bg-gradient-to-r from-eco-500 to-eco-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Environmental Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{product.carbonFootprint} kg</div>
                <div className="text-eco-100">Carbon Footprint</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {isVeryLowImpact ? 'Excellent' : isLowImpact ? 'Good' : 'High'}
                </div>
                <div className="text-eco-100">Environmental Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">100%</div>
                <div className="text-eco-100">Sustainable Materials</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
