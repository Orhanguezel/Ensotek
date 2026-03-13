'use client';

import dynamic from 'next/dynamic';

export const BlogEngagementPanelClient = dynamic(
  () => import('@/components/blog/BlogEngagementPanel').then((mod) => mod.BlogEngagementPanel),
  { ssr: false },
);
