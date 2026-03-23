'use client';

import { Printer, Share2 } from 'lucide-react';

export function PrintButton() {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <button 
      onClick={handlePrint} 
      className="hover:text-blue-600 transition-colors"
      title="Artikel drucken"
    >
      <Printer size={16} />
    </button>
  );
}

export function ShareButton() {
  const handleShare = () => {
    if (typeof window === 'undefined') return;
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link in Zwischenablage kopiert');
    }
  };

  return (
    <button 
      onClick={handleShare} 
      className="hover:text-blue-600 transition-colors"
      title="Artikel teilen"
    >
      <Share2 size={16} />
    </button>
  );
}
