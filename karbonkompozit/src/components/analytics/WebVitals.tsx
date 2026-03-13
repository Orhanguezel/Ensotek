'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Send to analytics endpoint in production
    if (process.env.NODE_ENV === 'production') {
      const body = {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
        navigationType: metric.navigationType,
      };

      // Use sendBeacon for reliable delivery
      if (typeof navigator.sendBeacon === 'function') {
        navigator.sendBeacon(
          '/api/vitals',
          new Blob([JSON.stringify(body)], { type: 'application/json' }),
        );
      }
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      const color =
        metric.rating === 'good'
          ? '\x1b[32m'
          : metric.rating === 'needs-improvement'
            ? '\x1b[33m'
            : '\x1b[31m';
      console.log(`${color}[${metric.name}]\x1b[0m ${metric.value.toFixed(1)}ms (${metric.rating})`);
    }
  });

  return null;
}
