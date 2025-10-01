import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLeaderboard } from '../context/LeaderboardContext';
import { motion } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingCart, Leaf } from 'lucide-react';
import { getImageUrl } from '../services/ProductService';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { 
    items, 
    totalItems, 
    totalPrice, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    getCartProduct 
  } = useCart();
  
  const { user } = useAuth();
  const { leaderboard, updateUserPoints } = useLeaderboard();
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const navigate = useNavigate();

  const createOrder = async () => {
    if (!user?.id) {
      // If not logged in, redirect to login
      navigate('/login');
      return;
    }

    setIsCreatingOrder(true);
    try {
      const orderData = {
        totalAmount: totalPrice,
        items: items.map(item => {
          const product = getCartProduct(item.productId);
          return {
            productId: parseInt(item.productId),
            productName: product?.name || '',
            quantity: item.quantity,
            price: product?.price || 0,
            image: product?.image || ''
          };
        })
      };

      const response = await fetch(`http://localhost:8090/api/orders/${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      await response.json();
      
      // Calculate eco points and carbon saved
      let ecoPoints = 0;
      let carbonSaved = 0;
      items.forEach(item => {
        const product = getCartProduct(item.productId);
        if (product) {
          ecoPoints += Math.round((product.price * 0.1) * item.quantity); // 10% of price as points
          carbonSaved += (product.carbonFootprint || 0) * item.quantity;
        }
      });
      
      // Update user's leaderboard stats
      if (ecoPoints > 0 || carbonSaved > 0) {
        const currentStats = leaderboard.find(entry => entry.userId === user.id) || {
          userId: user.id,
          userName: user.name,
          ecoPoints: 0,
          totalCarbonSaved: 0,
          productsPurchased: 0,
          rank: 0
        };
        
        updateUserPoints(
          user.id,
          currentStats.ecoPoints + ecoPoints,
          currentStats.totalCarbonSaved + carbonSaved,
          currentStats.productsPurchased + items.reduce((sum, item) => sum + item.quantity, 0)
        );
      }

      clearCart();
      navigate('/profile?tab=orders');
    } catch (error) {
      console.error('Error creating order:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    setIsRemoving(productId);
    // Add a small delay for animation
    await new Promise(resolve => setTimeout(resolve, 300));
    removeFromCart(productId);
    setIsRemoving(null);
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl transform transition-all duration-300 animate-slide-up overflow-hidden"
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-eco-500/10 to-eco-600/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-eco-500 to-eco-600 rounded-xl flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform duration-300">
                <ShoppingCart className="w-6 h-6 text-white drop-shadow" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Shopping Cart
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="max-h-96 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-24 h-24 bg-gradient-to-br from-eco-500/10 to-eco-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-12"
                >
                  <ShoppingCart className="w-12 h-12 text-eco-500" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Your cart is empty
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Start shopping to add eco-friendly products to your cart
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => {
                  const product = useCart().getCartProduct(item.productId);
                  if (!product) return null;

                  return (
                    <motion.div
                      key={item.productId}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 ${
                        isRemoving === item.productId 
                          ? 'opacity-0 scale-95 transform -translate-x-4' 
                          : 'opacity-100 scale-100 transform translate-x-0'
                      }`}
                    >
                      {/* Product Image */}
                      <img
                        src={getImageUrl(product)}
                        alt={product.name}
                        className="w-14 h-14 object-cover rounded-md border border-gray-100"
                      />

                      {/* Product Name */}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 dark:text-white truncate">{product.name}</div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-sm font-bold">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right min-w-[70px]">
                        <div className="font-bold text-gray-900 dark:text-white">
                          ₹{(product.price * item.quantity).toFixed(2)}
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        className="p-2 text-gray-400 hover:text-red-500 rounded-lg"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-6">
              {/* Cart Summary */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-eco-600" />
                  <span className="text-sm text-gray-600">
                    Total Environmental Impact: {items.reduce((total, item) => {
                      const product = useCart().getCartProduct(item.productId);
                      return total + (product?.carbonFootprint || 0) * item.quantity;
                    }, 0).toFixed(1)} kg CO₂
                  </span>
                </div>
                <button
                  onClick={clearCart}
                  className="text-sm text-red-600 hover:text-red-700 transition-colors duration-200"
                >
                  Clear Cart
                </button>
              </div>

              {/* Total and Checkout */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-gray-900">
                    Total: ${totalPrice.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {totalItems} {totalItems === 1 ? 'item' : 'items'}
                  </div>
                </div>
                <button
                  className="eco-button px-8 py-3 text-base relative"
                  onClick={createOrder}
                  disabled={isCreatingOrder}
                >
                  {isCreatingOrder ? (
                    <>
                      <span className="opacity-0">Proceed to Checkout</span>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </>
                  ) : (
                    'Proceed to Checkout'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;

