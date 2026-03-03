import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string, locale = 'tr-TR') {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function truncate(str: string, length: number) {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
}

export function getImageUrl(path: string | null | undefined, fallback = '/app/img/placeholder.jpg') {
  if (!path) return fallback;
  if (path.startsWith('http')) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}/storage/public/${path}`;
}

export function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, '');
}
