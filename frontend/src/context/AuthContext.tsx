import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginCredentials, SignupCredentials } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signup: (credentials: SignupCredentials) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  console.log('AuthProvider render:', authState);

  // Simulate loading from localStorage on mount
  useEffect(() => {
    console.log('AuthProvider useEffect running...');
    const savedUser = localStorage.getItem('ecobazzarx_user');
    console.log('Saved user from localStorage:', savedUser);
    
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        console.log('Parsed user:', user);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('ecobazzarx_user');
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    } else {
      console.log('No saved user found, setting loading to false');
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication logic
      if (credentials.email === 'admin@ecobazzarx.com' && credentials.password === 'admin123') {
        const user: User = {
          id: '1',
          email: credentials.email,
          name: 'Admin User',
          role: 'admin',
          createdAt: new Date(),
          ecoPoints: 0,
          totalCarbonSaved: 0,
          productsPurchased: 0,
          joinDate: new Date(),
          isVerified: true
        };
        
        localStorage.setItem('ecobazzarx_user', JSON.stringify(user));
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
        return true;
      } else if (credentials.email === 'seller@ecobazzarx.com' && credentials.password === 'seller123') {
        const user: User = {
          id: '2',
          email: credentials.email,
          name: 'Seller User',
          role: 'seller',
          createdAt: new Date(),
          ecoPoints: 0,
          totalCarbonSaved: 0,
          productsPurchased: 0,
          joinDate: new Date(),
          isVerified: true
        };
        
        localStorage.setItem('ecobazzarx_user', JSON.stringify(user));
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
        return true;
      } else if (credentials.email === 'customer@ecobazzarx.com' && credentials.password === 'customer123') {
        const user: User = {
          id: '3',
          email: credentials.email,
          name: 'Customer User',
          role: 'customer',
          createdAt: new Date(),
          ecoPoints: 0,
          totalCarbonSaved: 0,
          productsPurchased: 0,
          joinDate: new Date(),
          isVerified: true
        };
        
        localStorage.setItem('ecobazzarx_user', JSON.stringify(user));
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
        return true;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const signup = async (credentials: SignupCredentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock signup logic
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      const user: User = {
        id: Date.now().toString(),
        email: credentials.email,
        name: credentials.name,
        role: credentials.role,
        createdAt: new Date(),
        ecoPoints: 0,
        totalCarbonSaved: 0,
        productsPurchased: 0,
        joinDate: new Date(),
        isVerified: false
      };
      
      localStorage.setItem('ecobazzarx_user', JSON.stringify(user));
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false
      });
      return true;
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('ecobazzarx_user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  const updateUser = (user: User) => {
    localStorage.setItem('ecobazzarx_user', JSON.stringify(user));
    setAuthState(prev => ({
      ...prev,
      user,
      isAuthenticated: !!user
    }));
  };

  const value: AuthContextType = {
    ...authState,
    login,
    signup,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
