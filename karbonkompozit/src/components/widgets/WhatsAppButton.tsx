'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

export function WhatsAppButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!WHATSAPP_NUMBER || !visible) return null;

  const url = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fab-success fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95"
    >
      <MessageCircle className="size-7" />
    </a>
  );
}
