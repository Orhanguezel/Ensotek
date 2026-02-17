'use client';

import { useEffect } from 'react';

export function AosProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Dynamic import - AOS sadece client'ta yüklenecek
    import('aos').then((AOS) => {
      AOS.init({
        once: true, // Animasyon sadece 1 kez
        duration: 600, // Hızlı animasyon (performance)
        easing: 'ease-out-cubic',
        disable: 'mobile', // Mobilde disable (performance boost)
        offset: 100,
      });
    });
  }, []);

  return <>{children}</>;
}
