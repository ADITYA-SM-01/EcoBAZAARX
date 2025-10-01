/**
 * Global configuration constants for the EcoBazaarX application
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: (import.meta.env?.VITE_API_URL as string) || 'http://localhost:3000',
  TIMEOUT: 5000, // milliseconds
  RETRY_ATTEMPTS: 3,
};

// Product Related Constants
export const PRODUCT_CONFIG = {
  MAX_RECENT_VIEWS: 10,
  ITEMS_PER_PAGE: 12,
  MAX_FEATURED_PRODUCTS: 6,
  MAX_RELATED_PRODUCTS: 4,
  DEFAULT_SORT: 'carbon-low' as const,
};

// Authentication Constants
export const AUTH_CONFIG = {
  TOKEN_KEY: 'ecobazaar_token',
  REFRESH_TOKEN_KEY: 'ecobazaar_refresh_token',
  TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes in milliseconds
};

// UI Constants
export const UI_CONFIG = {
  THEME: {
    PRIMARY_COLOR: '#34D399', // eco-600
    SECONDARY_COLOR: '#60A5FA', // blue-400
    DANGER_COLOR: '#EF4444', // red-500
    SUCCESS_COLOR: '#10B981', // green-500
  },
  ANIMATION: {
    DEFAULT_DURATION: 300,
    MODAL_DURATION: 200,
  },
};

// Cache Configuration
export const CACHE_CONFIG = {
  PRODUCT_CACHE_TIME: 5 * 60 * 1000, // 5 minutes
  CATEGORY_CACHE_TIME: 30 * 60 * 1000, // 30 minutes
  USER_PREFERENCES_KEY: 'user_preferences',
};

// Feature Flags
export const FEATURES = {
  ENABLE_ANALYTICS: true,
  ENABLE_DARK_MODE: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_SOCIAL_SHARING: true,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
  UNAUTHORIZED: 'Please log in to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  GENERAL_ERROR: 'An unexpected error occurred. Please try again later.',
} as const;

// Validation Constants
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  DESCRIPTION_MAX_LENGTH: 500,
  PRICE_MIN: 0,
  PRICE_MAX: 999999,
} as const;