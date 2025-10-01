import React, { useState } from "react";
import { motion } from "framer-motion";
import { Product } from "../types/product";
import { useCart } from "../context/CartContext";
import { useLikes } from "../context/LikesContext";
import { getImageUrl } from "../services/ProductService";
import {
  Leaf,
  Star,
  ShoppingCart,
  TrendingDown,
  Check,
  Heart,
  Share2,
  Sparkles,
} from "lucide-react";

interface ProductCardProps {
  product: Product;
  onProductClick?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick }) => {
  const { addToCart, items } = useCart();
  const { isLiked, toggleLike } = useLikes();

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showAdded, setShowAdded] = useState(false);

  const isLowImpact = product.carbonFootprint <= 1.5;
  const isVeryLowImpact = product.carbonFootprint <= 0.8;

  const cartItem = items.find((item) => item.productId === product.id);
  const isInCart = !!cartItem;
  const productIsLiked = isLiked(String(product.id));

  const getImpactBadge = () => {
    if (isVeryLowImpact) {
      return (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-3 left-3 bg-eco-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg"
        >
          <Leaf className="w-3 h-3" />
          Eco Champion
        </motion.div>
      );
    } else if (isLowImpact) {
      return (
        <div className="absolute top-3 left-3 bg-eco-400 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md">
          <Leaf className="w-3 h-3" />
          Low Impact
        </div>
      );
    } else {
      return (
        <div className="absolute top-3 left-3 bg-carbon-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md">
          <TrendingDown className="w-3 h-3" />
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
    toggleLike(String(product.id));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this eco-friendly product: ${product.name}`,
        url: window.location.href,
      });
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03, rotate: 0.5 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="relative bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 overflow-hidden cursor-pointer group hover:shadow-2xl hover:-translate-y-1 transition-transform duration-300"
      onClick={() => onProductClick && onProductClick(product)}
    >
      {/* Product Image */}
      <div className="relative h-56 overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4 }}
          src={getImageUrl(product)}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {getImpactBadge()}

        {/* Quick Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all ${
              productIsLiked
                ? "bg-red-500 text-white"
                : "bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white"
            }`}
          >
            <Heart
              className={`w-5 h-5 ${
                productIsLiked ? "fill-current animate-ping-once" : ""
              }`}
            />
            {productIsLiked && (
              <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300 animate-ping" />
            )}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}
            className="w-9 h-9 rounded-full bg-white/80 text-gray-600 hover:bg-eco-500 hover:text-white flex items-center justify-center shadow-md"
          >
            <Share2 className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-5">
        <h3 className="font-semibold text-gray-900 text-lg mb-1 group-hover:text-eco-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm font-medium text-gray-700">
            {typeof product.rating === "number"
              ? product.rating.toFixed(1)
              : "N/A"}
          </span>
          <span className="text-xs text-gray-500 ml-1">
            ({product.reviews} reviews)
          </span>
        </div>

        {/* Price + Cart */}
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            disabled={isAddingToCart || isInCart}
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-md transition-all ${
              isInCart
                ? "bg-green-500 text-white cursor-default"
                : "bg-gradient-to-r from-eco-500 to-eco-400 text-white hover:shadow-lg"
            }`}
          >
            {isInCart ? (
              <>
                <Check className="w-4 h-4" /> Added
              </>
            ) : (
              <>
                {isAddingToCart ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <ShoppingCart className="w-4 h-4" />
                )}
                {isAddingToCart ? "Adding..." : "Add to Cart"}
              </>
            )}
          </motion.button>
        </div>

        {/* Added Success */}
        {showAdded && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span className="text-xs font-medium">
              Added to cart successfully!
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
