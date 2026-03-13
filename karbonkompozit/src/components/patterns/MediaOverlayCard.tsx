import type { ReactNode } from 'react';
import Link from 'next/link';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

type MediaOverlayCardProps = {
  href: string;
  src: string;
  alt: string;
  title: string;
  description?: string;
  meta?: ReactNode;
  sizes: string;
  aspectClassName?: string;
};

export function MediaOverlayCard({
  href,
  src,
  alt,
  title,
  description,
  meta,
  sizes,
  aspectClassName = 'aspect-[3/2]',
}: MediaOverlayCardProps) {
  return (
    <Link
      href={href}
      className={`group relative overflow-hidden rounded-xl bg-[var(--color-bg-dark)] ${aspectClassName}`}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform group-hover:scale-105"
        sizes={sizes}
      />
      <div className="media-overlay absolute inset-0" />
      <div className="absolute bottom-4 left-4 right-4">
        <h3 className="media-overlay-title text-lg font-semibold">{title}</h3>
        {description ? <p className="media-overlay-text mt-1 text-sm line-clamp-2">{description}</p> : null}
        {meta ? <div className="media-overlay-text mt-1 text-sm">{meta}</div> : null}
      </div>
    </Link>
  );
}
