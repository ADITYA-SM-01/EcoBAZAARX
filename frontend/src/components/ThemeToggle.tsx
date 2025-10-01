import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Paintbrush } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const { currentTheme, setTheme, availableThemes } = useTheme();

  return (
    <div className="relative group">
      <button 
        className="theme-transition p-2 rounded-full hover:bg-opacity-10 hover:bg-current"
        aria-label="Toggle theme"
      >
        <Paintbrush className="w-5 h-5" />
      </button>
      
      <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-50">
        {availableThemes.map((theme) => (
          <button
            key={theme.name}
            onClick={() => setTheme(theme.name)}
            className={`w-full px-4 py-2 text-left hover:bg-opacity-10 theme-transition flex items-center space-x-2
              ${currentTheme.name === theme.name ? 'bg-opacity-10 bg-current' : ''}`}
            style={{
              background: currentTheme.name === theme.name ? theme.gradientPrimary : 'transparent',
              WebkitBackgroundClip: currentTheme.name === theme.name ? 'text' : 'unset',
              WebkitTextFillColor: currentTheme.name === theme.name ? 'transparent' : 'currentColor'
            }}
          >
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ background: theme.gradientPrimary }}
            />
            <span>{theme.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeToggle;