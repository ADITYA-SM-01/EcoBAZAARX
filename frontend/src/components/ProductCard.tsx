import React, { useState } from 'react';
import { Product } from '../types/product';
import { useCart } from '../context/CartContext';
import { useLikes } from '../context/LikesContext';
import { Leaf, Star, ShoppingCart, TrendingDown, Check, Heart, Share2, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onProductClick?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick }) => {
  const { addToCart, items } = useCart();
  const { isLiked, toggleLike } = useLikes();

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showAdded, setShowAdded] = useState(false);
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);

  const isLowImpact = product.carbonFootprint <= 1.5;
  const isVeryLowImpact = product.carbonFootprint <= 0.8;
  
  const cartItem = items.find(item => item.productId === product.id);
  const isInCart = !!cartItem;
  const productIsLiked = isLiked(String(product.id));

  const getImpactBadge = () => {
    if (isVeryLowImpact) {
      return (
        <div className="absolute top-3 left-3 bg-eco-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 animate-float z-10">
          <Leaf className="w-3 h-3" />
          Very Low Impact
        </div>
      );
    } else if (isLowImpact) {
      return (
        <div className="absolute top-3 left-3 bg-eco-400 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 z-10">
          <Leaf className="w-3 h-3" />
          Low Impact
        </div>
      );
    } else {
      return (
        <div className="absolute top-3 left-3 bg-carbon-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 z-10">
          <TrendingDown className="w-3 h-3" />
          High Impact
        </div>
      );
    }
  };

  const getCarbonColor = () => {
    if (isVeryLowImpact) return 'text-eco-600';
    if (isLowImpact) return 'text-eco-500';
    return 'text-carbon-600';
  };

  const handleAddToCart = async () => {
    if (isInCart) return;
    setIsAddingToCart(true);
  addToCart(String(product.id));
    setShowAdded(true);
    
    // Show enhanced popup notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    notification.innerHTML = `
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
        </svg>
        <span class="font-medium">${product.name} added to cart!</span>
      </div>
    `;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
    
    setTimeout(() => setShowAdded(false), 2000);
    setIsAddingToCart(false);
  };

  const handleLike = () => {
    setIsHeartAnimating(true);
  toggleLike(String(product.id));
    
    // Show wishlist notification
    const isNowLiked = !productIsLiked;
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    notification.innerHTML = `
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
        </svg>
        <span class="font-medium">${isNowLiked ? 'Added to wishlist!' : 'Removed from wishlist'}</span>
      </div>
    `;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 2000);
    
    // Reset animation state
    setTimeout(() => setIsHeartAnimating(false), 300);
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

  return (
    <div 
      className={`gradient-card product-card-hover group relative overflow-hidden cursor-pointer ${
        isLowImpact ? 'low-impact' : 'high-impact'
      }`}
      onClick={() => onProductClick && onProductClick(product)}
    >
      
      {/* Product Image with Hover Effects */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="group-hover:hidden">{getImpactBadge()}</div>
        
        {/* Eco-friendly overlay for very low impact products */}
        {isVeryLowImpact && (
          <div className="absolute inset-0 bg-gradient-to-t from-eco-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        )}

        {/* Quick Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center wishlist-heart ${
              productIsLiked 
                ? 'bg-red-500 text-white shadow-lg scale-110 liked' 
                : 'bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white hover:scale-110'
            } ${isHeartAnimating ? 'animate-heart-beat' : ''}`}
            title={productIsLiked ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-4 h-4 ${productIsLiked ? 'fill-current' : ''} transition-all duration-300`} />
            {productIsLiked && (
              <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300 animate-ping" />
            )}
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}
            className="w-8 h-8 rounded-full bg-white/90 text-gray-600 hover:bg-eco-500 hover:text-white transition-all duration-200 flex items-center justify-center"
            title="Share product"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Carbon Footprint Indicator */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium">
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${
              isVeryLowImpact ? 'bg-eco-500' : isLowImpact ? 'bg-eco-400' : 'bg-carbon-500'
            }`} />
            {product.carbonFootprint} kg CO₂
          </div>
        </div>

        {/* Hover Detailed View */}
        <div className="absolute inset-0 bg-black bg-opacity-75 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <div className="text-center text-white p-4">
            <h4 className="font-bold text-lg mb-2">{product.name}</h4>
            <p className="text-sm mb-3 line-clamp-3">{product.description}</p>
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">
                  {typeof product.rating === 'number' && !isNaN(product.rating)
                    ? product.rating.toFixed(1)
                    : (!isNaN(parseFloat(String(product.rating))) ? parseFloat(String(product.rating)).toFixed(1) : 'N/A')}
                </span>
              </div>
              <span className="text-sm">
                {typeof product.price === 'number' && !isNaN(product.price)
                  ? `$${product.price.toFixed(2)}`
                  : (!isNaN(parseFloat(String(product.price))) ? `$${parseFloat(String(product.price)).toFixed(2)}` : '$0.00')}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                isVeryLowImpact ? 'bg-eco-500' : isLowImpact ? 'bg-eco-400' : 'bg-carbon-500'
              }`} />
              <span className="text-sm">{product.carbonFootprint} kg CO₂</span>
            </div>
            <div className="mt-3 text-xs opacity-75">Click to view details</div>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">
          {product.category}
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-eco-700 transition-colors">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-700">
              {typeof product.rating === 'number' && !isNaN(product.rating)
                ? product.rating.toFixed(1)
                : (!isNaN(parseFloat(String(product.rating))) ? parseFloat(String(product.rating)).toFixed(1) : 'N/A')}
            </span>
          </div>
          <span className="text-xs text-gray-500">({product.reviews} reviews)</span>
        </div>

        {/* Carbon Footprint */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              isVeryLowImpact ? 'bg-eco-500' : isLowImpact ? 'bg-eco-400' : 'bg-carbon-500'
            }`} />
            <span className="text-sm text-gray-600">Carbon Footprint:</span>
            <span className={`text-sm font-semibold ${getCarbonColor()}`}>
              {product.carbonFootprint} kg CO₂
            </span>
          </div>
        </div>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-gray-900">
            {typeof product.price === 'number' && !isNaN(product.price)
              ? `$${product.price.toFixed(2)}`
              : (!isNaN(parseFloat(String(product.price))) ? `$${parseFloat(String(product.price)).toFixed(2)}` : '$0.00')}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            disabled={isAddingToCart || isInCart}
            className={`flex items-center gap-2 text-sm transition-all duration-300 ${
              isInCart
                ? 'gradient-button-success cursor-default'
                : 'gradient-button-primary hover:scale-105 active:scale-95'
            } ${isAddingToCart ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isAddingToCart ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : isInCart ? (
              <Check className="w-4 h-4" />
            ) : (
              <ShoppingCart className="w-4 h-4" />
            )}
            {isInCart ? 'Added to Cart' : isAddingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>

        {/* Eco-friendly highlight for very low impact */}
        {isVeryLowImpact && (
          <div className="mt-3 p-2 bg-eco-50 border border-eco-200 rounded-lg">
            <div className="flex items-center gap-2 text-eco-700">
              <Leaf className="w-4 h-4" />
              <span className="text-xs font-medium">Eco Champion! This product has minimal environmental impact.</span>
            </div>
          </div>
        )}

        {/* Success Message */}
        {showAdded && (
          <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg animate-pulse">
            <div className="flex items-center gap-2 text-green-700">
              <Check className="w-4 h-4" />
              <span className="text-xs font-medium">Added to cart successfully!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
