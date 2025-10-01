import { useEffect, useRef, useState } from 'react';

interface UseAnimationOptions {
  threshold?: number;
  rootMargin?: string;
}

export const useInView = (options: UseAnimationOptions = {}) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px',
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options.threshold, options.rootMargin]);

  return { ref, isInView };
};

export const useScrollAnimation = () => {
  const scrollRef = useRef<HTMLElement | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current || hasAnimated) return;

      const element = scrollRef.current;
      const elementPosition = element.getBoundingClientRect();
      const isVisible = elementPosition.top < window.innerHeight;

      if (isVisible) {
        setHasAnimated(true);
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasAnimated]);

  return {
    ref: scrollRef,
    className: `transition-all duration-700 ${
      !hasAnimated ? 'opacity-0 translate-y-8' : ''
    }`,
  };
};

export const useSmoothTransition = (delay: number = 0) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return {
    className: `transition-all duration-500 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`,
  };
};

export const useHoverAnimation = () => {
  const [isHovered, setIsHovered] = useState(false);

  const hoverProps = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    className: `transition-transform duration-300 ${
      isHovered ? 'scale-105' : 'scale-100'
    }`,
  };

  return hoverProps;
};

export const useParallax = () => {
  const [offset, setOffset] = useState(0);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const scrollY = window.pageYOffset;
      const elementTop = ref.current.offsetTop;
      const relativeScroll = (scrollY - elementTop) * 0.5;

      setOffset(relativeScroll);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return {
    ref,
    style: { transform: `translateY(${offset}px)` },
  };
};