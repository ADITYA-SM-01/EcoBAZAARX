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
    name: 'Eco Green',
    primary: '#22c55e',
    secondary: '#16a34a',
    accent: '#84cc16',
    background: '#f0fdf4',
    text: '#14532d'
  },
  {
    name: 'Ocean Blue',
    primary: '#3b82f6',
    secondary: '#1d4ed8',
    accent: '#06b6d4',
    background: '#eff6ff',
    text: '#1e3a8a'
  },
  {
    name: 'Sunset Orange',
    primary: '#f97316',
    secondary: '#ea580c',
    accent: '#f59e0b',
    background: '#fff7ed',
    text: '#9a3412'
  },
  {
    name: 'Royal Purple',
    primary: '#8b5cf6',
    secondary: '#7c3aed',
    accent: '#a855f7',
    background: '#faf5ff',
    text: '#581c87'
  },
  {
    name: 'Midnight Dark',
    primary: '#6366f1',
    secondary: '#4f46e5',
    accent: '#8b5cf6',
    background: '#0f172a',
    text: '#e2e8f0'
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
