export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  ecoPoints: number;
  totalCarbonSaved: number;
  productsPurchased: number;
  joinDate: Date;
  isVerified: boolean;
  // Role permission flags
  isAdmin?: boolean;
  isSeller?: boolean;
  phone?: string;
  address?: string;
  bio?: string;
  // Seller specific fields
  productsListed?: number;
  totalSales?: number;
  rating?: number;
  salesHistory?: Array<{
    id: string;
    date: Date;
    amount: number;
    product: string;
  }>;
  // Admin specific fields
  totalUsers?: number;
  activeSellers?: number;
  ordersToday?: number;
  recentActivity?: Array<{
    id: string;
    type: string;
    description: string;
    date: Date;
  }>;
  // Social stats
  followers?: number;
  following?: number;
  reviews?: Array<{
    id: string;
    rating: number;
    comment: string;
    author: string;
    date: Date;
  }>;
}

export type UserRole = 'admin' | 'seller' | 'customer';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

export interface CartItem {
  productId: string;
  quantity: number;
  addedAt: Date;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface PurchaseHistory {
  id: string;
  productId: string;
  quantity: number;
  purchaseDate: Date;
  totalPrice: number;
  carbonFootprint: number;
  ecoPointsEarned: number;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  ecoPoints: number;
  totalCarbonSaved: number;
  productsPurchased: number;
  rank: number;
}

export interface SellerInfo {
  id: string;
  name: string;
  email: string;
  totalProducts: number;
  totalSales: number;
  rating: number;
  isVerified: boolean;
  joinDate: Date;
}

export interface Theme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  gradientPrimary: string;
  gradientSecondary: string;
  cardBg: string;
  boxShadow: string;
}
