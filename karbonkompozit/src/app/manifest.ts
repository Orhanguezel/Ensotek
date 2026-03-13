import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MOE Kompozit',
    short_name: 'MOE Kompozit',
    description: 'Industrial solutions in carbon fiber, FRP and fiberglass composite manufacturing.',
    start_url: '/tr',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#ea580c',
    icons: [
      {
        src: '/icon',
        sizes: '64x64',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
