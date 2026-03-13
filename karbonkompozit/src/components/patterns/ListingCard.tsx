import type { ReactNode } from 'react';
import Link from 'next/link';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

type ListingCardProps = {
  href: string;
  title: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageSizes?: string;
  imageAspectClassName?: string;
  footer?: ReactNode;
};

export function ListingCard({
  href,
  title,
  description,
  imageSrc,
  imageAlt = '',
  imageSizes = '(max-width: 768px) 100vw, 33vw',
  imageAspectClassName = 'aspect-[4/3]',
  footer,
}: ListingCardProps) {
  return (
    <Link
      href={href}
      className="surface-card group overflow-hidden rounded-xl transition-shadow hover:shadow-lg"
    >
      {imageSrc ? (
        <div className={`relative overflow-hidden bg-[var(--color-border)] ${imageAspectClassName}`}>
          <OptimizedImage
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes={imageSizes}
          />
        </div>
      ) : null}
      <div className="p-5">
        <h3 className="font-semibold line-clamp-2">{title}</h3>
        {description ? (
          <p className="mt-2 text-sm text-[var(--color-text-secondary)] line-clamp-3">{description}</p>
        ) : null}
        {footer ? <div className="mt-3">{footer}</div> : null}
      </div>
    </Link>
  );
}
