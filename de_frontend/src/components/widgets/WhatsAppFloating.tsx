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
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        left: '1.5rem',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '3.5rem',
        height: '3.5rem',
        borderRadius: '50%',
        backgroundColor: '#25D366',
        color: '#fff',
        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
        transition: 'transform 0.2s',
      }}
    >
      <MessageCircle size={24} />
    </a>
  );
}
