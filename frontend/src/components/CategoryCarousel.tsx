import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from '../context/ThemeContext';

const categories = [
  { name: "Electronics", icon: "💡" },
  { name: "Clothing", icon: "👗" },
  { name: "Home & Garden", icon: "🏡" },
  { name: "Beauty & Personal Care", icon: "💄" },
  { name: "Sports & Outdoors", icon: "🏀" },
  { name: "Books & Media", icon: "📚" },
  { name: "Food & Beverages", icon: "🍎" },
  { name: "Automotive", icon: "🚗" },
  { name: "Health & Wellness", icon: "🧘" },
  { name: "Toys & Games", icon: "🧸" },
  { name: "Others", icon: "✨" },
];

interface CategoryCarouselProps {
  onSelectCategories?: (categories: string[]) => void;
}

const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ onSelectCategories }) => {
  const { currentTheme } = useTheme();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleSelect = (cat: string) => {
    let newSelectedCategories;
    if (selectedCategories.includes(cat)) {
      // Deselect if clicking the same category
      newSelectedCategories = selectedCategories.filter(c => c !== cat);
    } else {
      // Select new category
      newSelectedCategories = [...selectedCategories, cat];
    }
    setSelectedCategories(newSelectedCategories);
    onSelectCategories?.(newSelectedCategories);
  };

  const handleNext = () => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const maxScroll = container.scrollWidth - container.clientWidth;
      const newPosition = scrollPosition + 220;

      if (newPosition >= maxScroll) {
        container.scrollTo({ left: 0, behavior: 'auto' });
        setScrollPosition(0);
      } else {
        container.scrollBy({ left: 220, behavior: 'smooth' });
        setScrollPosition(newPosition);
      }
    }
  };

  const handlePrev = () => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const newPosition = scrollPosition - 220;

      if (newPosition < 0) {
        const maxScroll = container.scrollWidth - container.clientWidth;
        container.scrollTo({ left: maxScroll, behavior: 'auto' });
        setScrollPosition(maxScroll);
      } else {
        container.scrollBy({ left: -220, behavior: 'smooth' });
        setScrollPosition(newPosition);
      }
    }
  };

  const [scrollPosition, setScrollPosition] = useState(0);

  // Continuous auto-scroll
  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const container = carouselRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;
        
        // If we're at the end, reset to start
        if (scrollPosition >= maxScroll) {
          container.scrollTo({ left: 0, behavior: 'auto' });
          setScrollPosition(0);
        } else {
          container.scrollBy({ left: 220, behavior: 'smooth' });
          setScrollPosition(prev => prev + 220);
        }
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [scrollPosition]);

  return (
    <div className="relative mb-10">
      {/* Navigation Arrows - Centered Vertically */}
      <motion.button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-3 shadow-lg transition-all z-10"
        style={{
          background: currentTheme.cardBg,
          color: currentTheme.text,
          boxShadow: currentTheme.boxShadow
        }}
        whileHover={{
          scale: 1.1,
          backgroundColor: currentTheme.primary,
          color: '#ffffff'
        }}
      >
        <ChevronLeft size={22} />
      </motion.button>
      <motion.button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-3 shadow-lg transition-all z-10"
        style={{
          background: currentTheme.cardBg,
          color: currentTheme.text,
          boxShadow: currentTheme.boxShadow
        }}
        whileHover={{
          scale: 1.1,
          backgroundColor: currentTheme.primary,
          color: '#ffffff'
        }}
      >
        <ChevronRight size={22} />
      </motion.button>

      {/* Scrollable Categories */}
      <div
        ref={carouselRef}
        className="flex gap-6 overflow-x-hidden px-14 py-6 scroll-smooth"
      >
        {categories.map((cat) => (
          <motion.button
            key={cat.name}
            whileHover={{ scale: 1.08, boxShadow: "0 4px 24px rgba(0,0,0,0.12)" }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`px-6 py-4 min-w-[160px] rounded-2xl font-bold text-lg shadow-lg border-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-300`}
            style={{
              background: selectedCategories.includes(cat.name) ? currentTheme.gradientPrimary : currentTheme.cardBg,
              borderColor: currentTheme.accent,
              color: selectedCategories.includes(cat.name) ? 'white' : currentTheme.text,
              boxShadow: currentTheme.boxShadow
            }}
            onClick={() => handleSelect(cat.name)}
          >
            <span className="text-3xl mb-2">{cat.icon}</span>
            {cat.name}
            <AnimatePresence>
              {selectedCategories.includes(cat.name) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="mt-2 text-xs px-3 py-1 rounded-full font-semibold shadow"
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                  }}
                >
                  Selected
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CategoryCarousel;
