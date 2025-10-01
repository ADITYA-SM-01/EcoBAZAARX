import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppState, AppContextType, UserPreferences } from '../types/app';
import { Product } from '../types/product';
import { User } from '../types/auth';

// Default user preferences
const defaultPreferences: UserPreferences = {
  theme: 'light',
  currency: 'USD',
  language: 'en',
  notifications: true
};

// Create the context with an initial undefined value
const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial state for the application
const initialState: AppState = {
  currentUser: null,
  selectedProduct: null,
  lastViewedProducts: [],
  searchHistory: [],
  userPreferences: defaultPreferences,
  isLoading: false,
  error: null
};

// Provider component that wraps the app and makes state available to all child components
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state with our initial values
  const [state, setState] = useState<AppState>(initialState);

  // User management methods
  const setCurrentUser = (user: User | null) => {
    setState(prev => ({ ...prev, currentUser: user }));
  };

  // Product management methods
  const setSelectedProduct = (product: Product | null) => {
    setState(prev => ({ ...prev, selectedProduct: product }));
  };

  const addToLastViewed = (product: Product) => {
    setState(prev => ({
      ...prev,
      lastViewedProducts: [
        product,
        ...prev.lastViewedProducts.filter(p => p.id !== product.id)
      ].slice(0, 10)
    }));
  };

  const clearLastViewed = () => {
    setState(prev => ({ ...prev, lastViewedProducts: [] }));
  };

  // Search history management
  const addToSearchHistory = (term: string) => {
    setState(prev => ({
      ...prev,
      searchHistory: [
        { term, timestamp: Date.now() },
        ...prev.searchHistory.filter(item => item.term !== term)
      ].slice(0, 10)
    }));
  };

  const clearSearchHistory = () => {
    setState(prev => ({ ...prev, searchHistory: [] }));
  };

  // User preferences management
  const updateUserPreferences = (preferences: Partial<UserPreferences>) => {
    setState(prev => ({
      ...prev,
      userPreferences: { ...prev.userPreferences, ...preferences }
    }));
  };

  // Error management
  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error }));
  };

  // Create the value object that will be provided to consumers
  const value: AppContextType = {
    ...state,
    setCurrentUser,
    setSelectedProduct,
    addToLastViewed,
    clearLastViewed,
    addToSearchHistory,
    clearSearchHistory,
    updateUserPreferences,
    setError
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the app context
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};