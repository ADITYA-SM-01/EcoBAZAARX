export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  carbonFootprint: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
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

