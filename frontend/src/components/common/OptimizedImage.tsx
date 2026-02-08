// =============================================================
// FILE: src/components/common/OptimizedImage.tsx
// Optimized Image Component for better SEO and Core Web Vitals
// Auto-detects above-the-fold images and applies appropriate loading strategy
// =============================================================

'use client';

import Image, { type ImageProps } from 'next/image';
import { useState, useEffect, useRef } from 'react';

interface OptimizedImageProps extends Omit<ImageProps, 'loading' | 'priority'> {
  loading?: 'lazy' | 'eager' | 'auto';
  priority?: boolean | 'auto';
  fallbackSrc?: string;
  onLoadError?: (error: Error) => void;
  index?: number; // For auto-detecting above-the-fold images
}

// Auto-detect which images should be priority based on index
const shouldBePriority = (index?: number): boolean => {
  if (typeof index !== 'number') return false;
  return index < 3; // First 3 images are typically above-the-fold
};

// Determine loading strategy
const determineLoading = (
  loading?: 'lazy' | 'eager' | 'auto',
  priority?: boolean | 'auto',
  index?: number,
): { finalLoading: 'lazy' | 'eager'; finalPriority: boolean } => {
  if (loading === 'eager' || priority === true) {
    return { finalLoading: 'eager', finalPriority: true };
  }
  
  if (loading === 'lazy' || priority === false) {
    return { finalLoading: 'lazy', finalPriority: false };
  }
  
  // Auto mode
  if (priority === 'auto' || loading === 'auto') {
    const isAboveFold = shouldBePriority(index);
    return {
      finalLoading: isAboveFold ? 'eager' : 'lazy',
      finalPriority: isAboveFold,
    };
  }
  
  return { finalLoading: 'lazy', finalPriority: false };
};

export function OptimizedImage({
  src,
  alt,
  loading = 'auto',
  priority = 'auto',
  fallbackSrc = '/img/fallback/placeholder.jpg',
  onLoadError,
  index,
  onError,
  ...props
}: OptimizedImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const { finalLoading, finalPriority } = determineLoading(loading, priority, index);

  // Reset error state when src changes
  useEffect(() => {
    setHasError(false);
    setCurrentSrc(src);
  }, [src]);

  const handleError = (error: any) => {
    setHasError(true);
    
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    }
    
    if (onLoadError) {
      onLoadError(new Error(`Failed to load image: ${src}`));
    }
    
    if (onError) {
      onError(error);
    }
  };

  // Enhanced alt text for SEO
  const enhancedAlt = hasError && currentSrc === fallbackSrc 
    ? `${alt || 'Image'} (fallback)` 
    : alt || 'Image';
  
  return (
    <Image
      ref={imgRef}
      src={currentSrc}
      alt={enhancedAlt}
      loading={finalLoading}
      priority={finalPriority}
      onError={handleError}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
      style={{
        ...props.style,
        ...(hasError && {
          filter: 'grayscale(50%) opacity(0.8)',
          border: '1px solid #e5e5e5'
        })
      }}
      {...props}
    />
  );
}

// Legacy image component for gradual migration
interface LegacyImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
  index?: number;
  onError?: (error: any) => void;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  [key: string]: any;
}

export function LegacyImage({
  src,
  alt,
  className,
  style,
  loading = 'lazy',
  index,
  onError,
  width,
  height,
  fill = false,
  sizes,
  ...props
}: LegacyImageProps) {
  const shouldEager = shouldBePriority(index);
  const finalLoading = shouldEager ? 'eager' : loading;

  const handleError = (error: any) => {
    console.warn(`Failed to load image: ${src}`);
    if (onError) {
      onError(error);
    }
  };

  // Default dimensions if not provided and not using fill
  const defaultWidth = fill ? undefined : width || 400;
  const defaultHeight = fill ? undefined : height || 300;

  return (
    <Image
      src={src}
      alt={alt || 'Image'}
      className={className}
      style={style}
      width={defaultWidth}
      height={defaultHeight}
      fill={fill}
      loading={finalLoading as 'lazy' | 'eager'}
      priority={shouldEager}
      sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
      onError={handleError}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
      {...props}
    />
  );
}

export default OptimizedImage;