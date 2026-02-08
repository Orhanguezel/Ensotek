// =============================================================
// FILE: src/utils/webVitals.ts
// Core Web Vitals measurement and reporting
// =============================================================

import { onCLS, onFID, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';

export type MetricType = 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB';

// Analytics endpoint for reporting (adjust based on your analytics setup)
const ANALYTICS_ENDPOINT = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT;
const isDevelopment = process.env.NODE_ENV === 'development';

// Report to analytics service
function sendToAnalytics(metric: Metric, options?: { debug?: boolean }) {
  if (isDevelopment && options?.debug) {
    console.log('Web Vital:', metric.name, metric.value, 'ms');
  }

  // Send to Google Analytics if gtag is available
  if (typeof window !== 'undefined' && 'gtag' in window) {
    const gtag = (window as any).gtag;
    gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }

  // Send to custom analytics endpoint
  if (ANALYTICS_ENDPOINT && typeof window !== 'undefined') {
    fetch(ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'web-vital',
        metric: metric.name,
        value: metric.value,
        id: metric.id,
        url: window.location.href,
        timestamp: Date.now(),
      }),
      keepalive: true,
    }).catch(error => {
      if (isDevelopment) {
        console.warn('Failed to send web vital:', error);
      }
    });
  }
}

// Main function to start web vitals tracking
export function trackWebVitals(options: { debug?: boolean } = {}) {
  try {
    onCLS((metric) => sendToAnalytics(metric, options));
    onFID((metric) => sendToAnalytics(metric, options));
    onFCP((metric) => sendToAnalytics(metric, options));
    onLCP((metric) => sendToAnalytics(metric, options));
    onTTFB((metric) => sendToAnalytics(metric, options));
  } catch (error) {
    if (isDevelopment) {
      console.warn('Web vitals tracking error:', error);
    }
  }
}

// Performance observer for detailed metrics
export function observePerformance() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return;
  }

  // Observe layout shifts
  try {
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      for (const entry of entries) {
        if ((entry as any).hadRecentInput) continue;
        if (isDevelopment) {
          console.log('Layout shift detected:', entry);
        }
      }
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  } catch (error) {
    if (isDevelopment) {
      console.warn('Could not observe layout shifts:', error);
    }
  }

  // Observe largest contentful paint
  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (isDevelopment) {
        console.log('LCP candidate:', lastEntry);
      }
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch (error) {
    if (isDevelopment) {
      console.warn('Could not observe LCP:', error);
    }
  }

  // Observe resource loading
  try {
    const resourceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries() as PerformanceResourceTiming[];
      
      if (isDevelopment) {
        // Find slow resources
        const slowResources = entries.filter(entry => 
          entry.duration > 1000 || entry.responseEnd - entry.requestStart > 2000
        );
        
        if (slowResources.length > 0) {
          console.warn('Slow resources detected:', slowResources);
        }
      }
    });
    resourceObserver.observe({ entryTypes: ['resource'] });
  } catch (error) {
    if (isDevelopment) {
      console.warn('Could not observe resources:', error);
    }
  }
}

// Helper to check if Core Web Vitals are good
export function getWebVitalsStatus(metrics: Record<MetricType, number>) {
  const thresholds = {
    LCP: { good: 2500, poor: 4000 },
    FID: { good: 100, poor: 300 },
    CLS: { good: 0.1, poor: 0.25 },
    FCP: { good: 1800, poor: 3000 },
    TTFB: { good: 800, poor: 1800 },
  };

  const status: Record<MetricType, 'good' | 'needs-improvement' | 'poor'> = {} as any;

  Object.entries(metrics).forEach(([name, value]) => {
    const threshold = thresholds[name as MetricType];
    if (value <= threshold.good) {
      status[name as MetricType] = 'good';
    } else if (value <= threshold.poor) {
      status[name as MetricType] = 'needs-improvement';
    } else {
      status[name as MetricType] = 'poor';
    }
  });

  return status;
}

// Initialize web vitals tracking
export function initWebVitals() {
  if (typeof window === 'undefined') return;

  // Track metrics on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      trackWebVitals({ debug: isDevelopment });
      observePerformance();
    });
  } else {
    trackWebVitals({ debug: isDevelopment });
    observePerformance();
  }

  // Track metrics on page visibility change (for SPA navigation)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      trackWebVitals({ debug: isDevelopment });
    }
  });
}