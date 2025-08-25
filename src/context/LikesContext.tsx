import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LikesContextType {
  likedProducts: string[];
  addToLikes: (productId: string) => void;
  removeFromLikes: (productId: string) => void;
  isLiked: (productId: string) => boolean;
  toggleLike: (productId: string) => void;
}

const LikesContext = createContext<LikesContextType | undefined>(undefined);

export const useLikes = () => {
  const context = useContext(LikesContext);
  if (!context) {
    throw new Error('useLikes must be used within a LikesProvider');
  }
  return context;
};

interface LikesProviderProps {
  children: ReactNode;
}

export const LikesProvider: React.FC<LikesProviderProps> = ({ children }) => {
  const [likedProducts, setLikedProducts] = useState<string[]>([]);

  // Load liked products from localStorage on mount
  useEffect(() => {
    const savedLikes = localStorage.getItem('ecobazzarx_likes');
    if (savedLikes) {
      try {
        const likes = JSON.parse(savedLikes);
        setLikedProducts(likes);
      } catch (error) {
        console.error('Failed to load likes:', error);
        localStorage.removeItem('ecobazzarx_likes');
      }
    }
  }, []);

  // Save liked products to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ecobazzarx_likes', JSON.stringify(likedProducts));
  }, [likedProducts]);

  const addToLikes = (productId: string) => {
    setLikedProducts(prev => {
      if (!prev.includes(productId)) {
        return [...prev, productId];
      }
      return prev;
    });
  };

  const removeFromLikes = (productId: string) => {
    setLikedProducts(prev => prev.filter(id => id !== productId));
  };

  const isLiked = (productId: string): boolean => {
    return likedProducts.includes(productId);
  };

  const toggleLike = (productId: string) => {
    setLikedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const value: LikesContextType = {
    likedProducts,
    addToLikes,
    removeFromLikes,
    isLiked,
    toggleLike
  };

  return (
    <LikesContext.Provider value={value}>
      {children}
    </LikesContext.Provider>
  );
};



