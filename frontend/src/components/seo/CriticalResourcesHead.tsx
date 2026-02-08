// =============================================================
// FILE: src/components/seo/CriticalResourcesHead.tsx
// Critical resources preloading for Core Web Vitals optimization
// =============================================================

'use client';

import React from 'react';
import Head from 'next/head';

interface CriticalResourcesHeadProps {
  locale?: string;
  preloadImages?: string[];
  preloadFonts?: string[];
}

export function CriticalResourcesHead({
  preloadImages = [],
  preloadFonts = [],
}: CriticalResourcesHeadProps) {
  // Default critical fonts based on locale
  const defaultFonts = [
    '/fonts/fa-solid-900.woff2',
    '/fonts/fa-brands-400.woff2',
    // Add more fonts based on your setup
  ];

  const allFonts = [...defaultFonts, ...preloadFonts];

  return (
    <Head>
      {/* Critical font preloads */}
      {allFonts.map((fontUrl, index) => (
        <link
          key={`font-${index}`}
          rel="preload"
          href={fontUrl}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      ))}

      {/* Critical image preloads (for LCP optimization) */}
      {preloadImages.slice(0, 2).map((imageUrl, index) => (
        <link
          key={`img-${index}`}
          rel="preload"
          href={imageUrl}
          as="image"
        />
      ))}

      {/* Optimize font display to prevent FOIT */}
      <style jsx>{`
        @font-face {
          font-family: 'FontAwesome';
          src: url('/fonts/fa-solid-900.woff2') format('woff2');
          font-weight: 900;
          font-style: normal;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'FontAwesome Brands';
          src: url('/fonts/fa-brands-400.woff2') format('woff2');
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }
      `}</style>

      {/* Critical CSS for immediate render */}
      <style jsx>{`
        /* Prevent layout shift for common elements */
        .container, .container-fluid {
          max-width: 100%;
          box-sizing: border-box;
        }
        
        /* Image aspect ratio containers */
        .aspect-ratio-16-9 {
          aspect-ratio: 16 / 9;
        }
        
        .aspect-ratio-4-3 {
          aspect-ratio: 4 / 3;
        }
        
        .aspect-ratio-1-1 {
          aspect-ratio: 1 / 1;
        }
        
        /* Loading animation to improve perceived performance */
        .loading-shimmer {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        
        /* Prevent cumulative layout shift for images */
        img {
          max-width: 100%;
          height: auto;
        }
        
        img[width][height] {
          height: auto;
        }
        
        /* Optimize rendering for hero sections */
        .hero-section {
          contain: layout;
          will-change: transform;
        }
        
        /* Prevent layout shift for navigation */
        .main-navigation {
          contain: style layout;
        }
        
        /* Optimize form inputs */
        input, textarea, select {
          contain: layout style;
        }
        
        /* Performance optimizations for animations */
        .animated {
          will-change: transform, opacity;
        }
        
        .animated.finished {
          will-change: auto;
        }
      `}</style>
    </Head>
  );
}

export default CriticalResourcesHead;