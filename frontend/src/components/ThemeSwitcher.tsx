
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Sparkles } from 'lucide-react';

const ThemeSwitcher = () => {
  const { currentTheme, setTheme, availableThemes } = useTheme();

  const themeOptions = availableThemes.map((theme) => ({
    ...theme,
    icon: theme.name.toLowerCase().includes('dark') ? Moon : 
          theme.name.toLowerCase().includes('twilight') ? Sparkles : Sun,
  }));

  return (
    <div className="relative">
      <motion.div
        className="flex space-x-2 bg-white/10 backdrop-blur-lg p-2 rounded-full shadow-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {themeOptions.map((theme) => {
          const Icon = theme.icon;
          const isActive = theme.name === currentTheme.name;

          return (
            <motion.button
              key={theme.name}
              onClick={() => setTheme(theme.name)}
              className={`relative p-2 rounded-full transition-colors
                ${isActive ? 'text-white' : 'text-white/50 hover:text-white/80'}
              `}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      background: theme.gradientPrimary
                    }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </AnimatePresence>
              
              <Icon className="w-5 h-5 relative z-10" />
              
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 30 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-2 py-1 rounded text-xs whitespace-nowrap"
                  >
                    {theme.name}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
};

export default ThemeSwitcher;