'use client';

import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

export function WhatsAppFloating({ number }: { number?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const finalNumber = number || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!finalNumber || !visible) return null;

  const url = `https://wa.me/${finalNumber.replace(/\D/g, '')}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-6 left-6 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 active:scale-95 animate-pulse"
    >
      <MessageCircle className="size-6" />
    </a>
  );
}
