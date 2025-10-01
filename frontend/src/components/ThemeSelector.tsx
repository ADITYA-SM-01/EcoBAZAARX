import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { Palette } from 'lucide-react';

const ThemeSelector: React.FC = () => {
  const { currentTheme, setTheme, availableThemes } = useTheme();

  return (
    <div className="relative group">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-opacity-20 hover:bg-opacity-30 transition-all"
      >
        <Palette className="w-5 h-5" />
        <span className="hidden md:inline">Theme</span>
      </motion.button>

      <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {availableThemes.map((theme) => (
          <button
            key={theme.name}
            onClick={() => setTheme(theme.name)}
            className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              currentTheme.name === theme.name ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ background: theme.gradientPrimary }}
              />
              <span>{theme.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;