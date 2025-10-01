/**
 * Utility functions for the EcoBazaarX application
 */

import { Product } from '../types/product';
import { SearchHistoryItem } from '../types/app';

/**
 * Format currency based on user's locale and currency preference
 */
export const formatCurrency = (amount: number, currency = 'USD', locale = 'en-US'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Format date relative to current time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (timestamp: number): string => {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const diff = timestamp - Date.now();
  const diffInSeconds = diff / 1000;
  const diffInMinutes = diffInSeconds / 60;
  const diffInHours = diffInMinutes / 60;
  const diffInDays = diffInHours / 24;

  if (Math.abs(diffInDays) >= 1) {
    return rtf.format(Math.round(diffInDays), 'day');
  }
  if (Math.abs(diffInHours) >= 1) {
    return rtf.format(Math.round(diffInHours), 'hour');
  }
  if (Math.abs(diffInMinutes) >= 1) {
    return rtf.format(Math.round(diffInMinutes), 'minute');
  }
  return rtf.format(Math.round(diffInSeconds), 'second');
};

/**
 * Sort products by various criteria
 */
export const sortProducts = (products: Product[], sortBy: string): Product[] => {
  return [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'carbon-low':
        return a.carbonFootprint - b.carbonFootprint;
      case 'carbon-high':
        return b.carbonFootprint - a.carbonFootprint;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });
};

/**
 * Filter products by search term
 */
export const filterProductsBySearch = (products: Product[], searchTerm: string): Product[] => {
  const term = searchTerm.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(term) ||
    product.description.toLowerCase().includes(term) ||
    product.category.toLowerCase().includes(term)
  );
};

/**
 * Calculate carbon impact statistics
 */
export const calculateCarbonStats = (products: Product[]) => {
  const totalCarbon = products.reduce((sum, p) => sum + p.carbonFootprint, 0);
  const averageCarbon = totalCarbon / products.length;
  const lowestCarbon = Math.min(...products.map(p => p.carbonFootprint));
  const highestCarbon = Math.max(...products.map(p => p.carbonFootprint));

  return {
    totalCarbon,
    averageCarbon,
    lowestCarbon,
    highestCarbon
  };
};

/**
 * Get unique categories from products
 */
export const getUniqueCategories = (products: Product[]): string[] => {
  return Array.from(new Set(products.map(p => p.category)));
};

/**
 * Group products by category
 */
export const groupByCategory = (products: Product[]): Record<string, Product[]> => {
  return products.reduce((acc, product) => {
    const category = product.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);
};

/**
 * Format search history items
 */
export const formatSearchHistory = (history: SearchHistoryItem[]): string => {
  return history
    .map(item => `${item.term} (${formatRelativeTime(item.timestamp)})`)
    .join(', ');
};

/**
 * Validate product data
 */
export const validateProduct = (product: Partial<Product>): string[] => {
  const errors: string[] = [];
  
  if (!product.name || product.name.length < 3) {
    errors.push('Name must be at least 3 characters long');
  }
  
  if (!product.price || product.price <= 0) {
    errors.push('Price must be greater than 0');
  }
  
  if (!product.description || product.description.length < 10) {
    errors.push('Description must be at least 10 characters long');
  }
  
  if (typeof product.carbonFootprint !== 'number' || product.carbonFootprint < 0) {
    errors.push('Carbon footprint must be a non-negative number');
  }
  
  return errors;
};