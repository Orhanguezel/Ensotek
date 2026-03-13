'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const BLUR_DATA_URL =
  'data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 viewBox%3D%220 0 1 1%22%3E%3Crect fill%3D%22%23e2e8f0%22 width%3D%221%22 height%3D%221%22%2F%3E%3C%2Fsvg%3E';

type OptimizedImageProps = Omit<ImageProps, 'placeholder' | 'blurDataURL'> & {
  fallbackClassName?: string;
};

export function OptimizedImage({
  className,
  fallbackClassName,
  alt,
  onLoad,
  ...props
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-[var(--color-border)] text-[var(--color-text-muted)]',
          fallbackClassName ?? className,
        )}
        role="img"
        aria-label={alt}
      >
        <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
        </svg>
      </div>
    );
  }

  return (
    <Image
      {...props}
      alt={alt}
      className={cn(
        'transition-opacity duration-300',
        loaded ? 'opacity-100' : 'opacity-0',
        className,
      )}
      placeholder="blur"
      blurDataURL={BLUR_DATA_URL}
      onLoad={(e) => {
        setLoaded(true);
        if (typeof onLoad === 'function') onLoad(e);
      }}
      onError={() => setError(true)}
    />
  );
}
