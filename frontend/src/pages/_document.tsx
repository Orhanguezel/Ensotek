// src/pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';
import { FALLBACK_LOCALE } from '@/i18n/config';

export default function Document() {
  return (
    <Html lang={FALLBACK_LOCALE}>
      <Head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
