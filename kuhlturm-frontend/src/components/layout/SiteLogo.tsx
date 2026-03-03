import { cn } from '@/lib/utils';

interface Props {
  src?: string | null;
  alt?: string;
  className?: string;
  /** Logo yüksekliği px olarak. Default: 32 */
  height?: number;
  /** true = beyaz metin/ikon (koyu arka plan için) */
  dark?: boolean;
}

export function SiteLogo({ src, alt = 'Kühlturm', className, height = 32, dark = false }: Props) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        style={{ height: `${height}px`, width: 'auto', display: 'block' }}
        className={className}
      />
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-display font-bold tracking-tight',
        dark ? 'text-white' : 'text-slate-900',
        className,
      )}
      style={{ fontSize: `${Math.round(height * 0.55)}px` }}
    >
      <svg
        width={height * 0.7}
        height={height * 0.7}
        viewBox="0 0 26 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <path d="M5 23L9 7h8l4 16H5z" fill="currentColor" fillOpacity="0.12" />
        <path
          d="M5 23L9 7h8l4 16"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M9 7C9 4.8 10.8 3 13 3C15.2 3 17 4.8 17 7"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M4 23h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="11" cy="2" r="0.8" fill="currentColor" fillOpacity="0.5" />
        <circle cx="13" cy="1" r="0.8" fill="currentColor" fillOpacity="0.5" />
        <circle cx="15" cy="2" r="0.8" fill="currentColor" fillOpacity="0.5" />
      </svg>
      Kühlturm
    </span>
  );
}
