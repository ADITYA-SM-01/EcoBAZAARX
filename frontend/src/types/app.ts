import { User } from './auth';
import { Product } from './product';

/**
 * Global Application State Types
 */

// User preferences type
export interface UserPreferences {
  theme: 'light' | 'dark';
  currency: string;
  language: string;
  notifications: boolean;
}

// Search history item type
export interface SearchHistoryItem {
  term: string;
  timestamp: number;
}

// Application state type
export interface AppState {
  currentUser: User | null;
  selectedProduct: Product | null;
  lastViewedProducts: Product[];
  searchHistory: SearchHistoryItem[];
  userPreferences: UserPreferences;
  isLoading: boolean;
  error: string | null;
}

// App context methods type
export interface AppContextMethods {
  setCurrentUser: (user: User | null) => void;
  setSelectedProduct: (product: Product | null) => void;
  addToLastViewed: (product: Product) => void;
  clearLastViewed: () => void;
  addToSearchHistory: (term: string) => void;
  clearSearchHistory: () => void;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
  setError: (error: string | null) => void;
}

// Combined app context type
export interface AppContextType extends AppState, AppContextMethods {}