'use client';

import { MessageCircle } from 'lucide-react';

interface Props {
  phone: string; // international format, digits only e.g. "4915112345678"
  message: string;
  label: string;
  variant?: 'default' | 'outline';
}

function cleanPhone(raw: string): string {
  // Strip all non-digit chars, remove leading 00 or +
  return raw.replace(/\D/g, '').replace(/^00/, '');
}

export function WhatsAppButton({ phone, message, label, variant = 'default' }: Props) {
  const cleaned = cleanPhone(phone);
  const href = `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;

  const cls =
    variant === 'outline'
      ? 'inline-flex items-center gap-2 px-6 py-3 border-2 border-green-500 text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors'
      : 'inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors';

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      <MessageCircle size={16} />
      {label}
    </a>
  );
}
