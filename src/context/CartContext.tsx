import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { CartItem, CartState } from '../types/auth';
import { Product } from '../types/product';
import { products } from '../data/products';

interface CartContextType extends CartState {
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartProduct: (productId: string) => Product | undefined;
  getCartProducts: () => (Product & { quantity: number; addedAt: Date })[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('ecobazzarx_cart');
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        setCartItems(items);
      } catch (error) {
        localStorage.removeItem('ecobazzarx_cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ecobazzarx_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (productId: string, quantity: number = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.productId === productId);
      
      if (existingItem) {
        // Update existing item quantity
        return prev.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        return [...prev, {
          productId,
          quantity,
          addedAt: new Date()
        }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prev =>
      prev.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartProduct = (productId: string) => {
    return products.find(product => product.id === productId);
  };

  const getCartProducts = () => {
    return cartItems.map(item => {
      const product = getCartProduct(item.productId);
      if (!product) return null;
      
      return {
        ...product,
        quantity: item.quantity,
        addedAt: item.addedAt
      };
    }).filter(Boolean) as (Product & { quantity: number; addedAt: Date })[];
  };

  const totalItems = useMemo(() => 
    cartItems.reduce((total, item) => total + item.quantity, 0), 
    [cartItems]
  );

  const totalPrice = useMemo(() => {
    const cartProducts = getCartProducts();
    return cartProducts.reduce((total, item) => 
      total + (item.price * item.quantity), 0
    );
  }, [cartItems]);

  const value: CartContextType = {
    items: cartItems,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartProduct,
    getCartProducts
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

