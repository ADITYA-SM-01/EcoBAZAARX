import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { Product, SortOption, FilterOptions } from '../types/product';
import { products as initialProducts } from '../data/products';

interface ProductContextType {
  products: Product[];
  filteredProducts: Product[];
  filterOptions: FilterOptions;
  setFilterOptions: (options: FilterOptions | ((prev: FilterOptions) => FilterOptions)) => void;
  sortProducts: (option: SortOption) => void;
  filterByCategory: (category: string) => void;
  resetFilters: () => void;
  searchProducts: (query: string) => void;
  setCO2MaxFilter: (maxCO2: number | undefined) => void;
  setMinCO2Filter: (minCO2: number | undefined) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductsBySeller: (sellerId: string) => Product[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    sortBy: 'carbon-low',
    category: 'All',
    searchQuery: ''
  });

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search by name and description
    if (filterOptions.searchQuery && filterOptions.searchQuery.trim() !== '') {
      const searchTerm = filterOptions.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by category
    if (filterOptions.category && filterOptions.category !== 'All') {
      filtered = filtered.filter(product => product.category === filterOptions.category);
    }

    // Filter by max price
    if (filterOptions.maxPrice) {
      filtered = filtered.filter(product => product.price <= filterOptions.maxPrice!);
    }

    // Filter by max carbon footprint
    if (filterOptions.maxCarbon) {
      filtered = filtered.filter(product => product.carbonFootprint <= filterOptions.maxCarbon!);
    }

    // Filter by CO2 max range
    if (filterOptions.co2Max) {
      filtered = filtered.filter(product => product.carbonFootprint <= filterOptions.co2Max!);
    }

    // Filter by CO2 min range
    if (filterOptions.minCO2) {
      filtered = filtered.filter(product => product.carbonFootprint >= filterOptions.minCO2!);
    }

    // Sort products
    switch (filterOptions.sortBy) {
      case 'carbon-low':
        filtered.sort((a, b) => a.carbonFootprint - b.carbonFootprint);
        break;
      case 'carbon-high':
        filtered.sort((a, b) => b.carbonFootprint - a.carbonFootprint);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return filtered;
  }, [products, filterOptions]);

  const sortProducts = (option: SortOption) => {
    setFilterOptions(prev => ({ ...prev, sortBy: option }));
  };

  const filterByCategory = (category: string) => {
    setFilterOptions(prev => ({ ...prev, category }));
  };

  const resetFilters = () => {
    setFilterOptions({
      sortBy: 'carbon-low',
      category: 'All',
      searchQuery: '',
      maxPrice: undefined,
      maxCarbon: undefined,
      co2Max: undefined,
      minCO2: undefined
    });
  };

  const searchProducts = (query: string) => {
    setFilterOptions(prev => ({ ...prev, searchQuery: query }));
  };

  const setCO2MaxFilter = (maxCO2: number | undefined) => {
    setFilterOptions(prev => ({ ...prev, co2Max: maxCO2 }));
  };

  const setMinCO2Filter = (minCO2: number | undefined) => {
    setFilterOptions(prev => ({ ...prev, minCO2 }));
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString()
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, product: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...product } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const getProductsBySeller = (sellerId: string) => {
    // In a real app, this would filter by actual seller ID
    // For now, return all products as mock data
    return products;
  };

  const value: ProductContextType = {
    products,
    filteredProducts,
    filterOptions,
    setFilterOptions,
    sortProducts,
    filterByCategory,
    resetFilters,
    searchProducts,
    setCO2MaxFilter,
    setMinCO2Filter,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductsBySeller
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
