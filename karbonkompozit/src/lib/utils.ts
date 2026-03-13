import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8086/api';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.karbonkompozit.com.tr';

export function absoluteAssetUrl(value?: string | null): string | null {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  const normalized = value.startsWith('/') ? value : `/${value}`;
  return `${API_BASE_URL.replace(/\/api\/?$/, '')}${normalized}`;
}
