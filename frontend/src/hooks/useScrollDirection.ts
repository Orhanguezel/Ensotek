'use client';

import { useState, useEffect } from 'react';

export function useScrollDirection() {
  const [scrollDir, setScrollDir] = useState<'up' | 'down'>('up');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const updateScrollDir = () => {
      const y = window.scrollY;
      setScrollY(y);
      if (Math.abs(y - lastScrollY) < 5) return;
      setScrollDir(y > lastScrollY ? 'down' : 'up');
      lastScrollY = y > 0 ? y : 0;
    };
    window.addEventListener('scroll', updateScrollDir, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollDir);
  }, []);

  return { scrollDir, scrollY };
}
