export interface Product {
  id: string | number;
  name: string;
  description: string;
  price: number;
  brand: string;
  sellerId: string | number;
  category: string;
  stock: number;
  carbonFootprint: number;
  sustainablePackaging: boolean;
  rating: number;
  reviews: number;
  imageUrl: string | null;
  isActive: boolean;
  unitsSold: number;
  image?: string; // for backward compatibility
  createdAt?: string;
  updatedAt?: string;
}

export type SortOption = 
  | 'carbon-low'
  | 'carbon-high'
  | 'price-low'
  | 'price-high'
  | 'name';

export interface FilterOptions {
  sortBy: SortOption;
  category?: string;
  maxPrice?: number;
  maxCarbon?: number;
  searchQuery?: string;
  co2Max?: number;
  minCO2?: number;
}

