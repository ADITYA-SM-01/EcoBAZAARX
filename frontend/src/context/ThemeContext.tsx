import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme } from '../types/auth';

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeName: string) => void;
  availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const availableThemes: Theme[] = [
  {
    name: 'Forest Breeze',
    primary: '#10b981',
    secondary: '#059669',
    accent: '#34d399',
    background: 'linear-gradient(120deg, #f0fdf4 0%, #ecfdf5 100%)',
    text: '#064e3b',
    gradientPrimary: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    gradientSecondary: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    boxShadow: '0 8px 32px rgba(16, 185, 129, 0.1)'
  },
  {
    name: 'Ocean Depth',
    primary: '#0ea5e9',
    secondary: '#0284c7',
    accent: '#38bdf8',
    background: 'linear-gradient(120deg, #f0f9ff 0%, #e0f2fe 100%)',
    text: '#075985',
    gradientPrimary: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
    gradientSecondary: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    boxShadow: '0 8px 32px rgba(14, 165, 233, 0.1)'
  },
  {
    name: 'Twilight Rose',
    primary: '#f43f5e',
    secondary: '#e11d48',
    accent: '#fb7185',
    background: 'linear-gradient(120deg, #fff1f2 0%, #ffe4e6 100%)',
    text: '#9f1239',
    gradientPrimary: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
    gradientSecondary: 'linear-gradient(135deg, #fb7185 0%, #f43f5e 100%)',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    boxShadow: '0 8px 32px rgba(244, 63, 94, 0.1)'
  },
  {
    name: 'Aurora Night',
    primary: '#8b5cf6',
    secondary: '#7c3aed',
    accent: '#a78bfa',
    background: 'linear-gradient(120deg, #f5f3ff 0%, #ede9fe 100%)',
    text: '#5b21b6',
    gradientPrimary: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    gradientSecondary: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    boxShadow: '0 8px 32px rgba(139, 92, 246, 0.1)'
  },
  {
    name: 'Dark Cosmos',
    primary: '#6366f1',
    secondary: '#4f46e5',
    accent: '#818cf8',
    background: 'linear-gradient(120deg, #1e1b4b 0%, #1e1b4b 100%)',
    text: '#e0e7ff',
    gradientPrimary: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    gradientSecondary: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
    cardBg: 'rgba(30, 27, 75, 0.9)',
    boxShadow: '0 8px 32px rgba(99, 102, 241, 0.1)'
  }
];

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(availableThemes[0]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('ecobazzarx_theme');
    if (savedTheme) {
      const theme = availableThemes.find(t => t.name === savedTheme);
      if (theme) {
        setCurrentTheme(theme);
      }
    }
  }, []);

  useEffect(() => {
    // Apply theme to CSS custom properties
    const root = document.documentElement;
    root.style.setProperty('--color-primary', currentTheme.primary);
    root.style.setProperty('--color-secondary', currentTheme.secondary);
    root.style.setProperty('--color-accent', currentTheme.accent);
    root.style.setProperty('--color-background', currentTheme.background);
    root.style.setProperty('--color-text', currentTheme.text);
    
    localStorage.setItem('ecobazzarx_theme', currentTheme.name);
  }, [currentTheme]);

  const setTheme = (themeName: string) => {
    const theme = availableThemes.find(t => t.name === themeName);
    if (theme) {
      setCurrentTheme(theme);
    }
  };

  const value: ThemeContextType = {
    currentTheme,
    setTheme,
    availableThemes
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
