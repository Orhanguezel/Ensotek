// =============================================================
// FILE: src/hooks/useWebVitals.tsx
// React hook for Web Vitals tracking in components
// =============================================================

'use client';

import { useEffect } from 'react';
import { initWebVitals } from '@/utils/webVitals';

interface UseWebVitalsOptions {
  enabled?: boolean;
  debug?: boolean;
}

export function useWebVitals(options: UseWebVitalsOptions = {}) {
  const { enabled = true, debug = false } = options;

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // Initialize web vitals tracking
    initWebVitals();

    if (debug) {
      console.log('Web Vitals tracking initialized');
    }
  }, [enabled, debug]);
}

export default useWebVitals;