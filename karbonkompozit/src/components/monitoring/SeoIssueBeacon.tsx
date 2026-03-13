'use client';

import { useEffect } from 'react';

type SeoIssueType = '404' | 'soft-404';

export function SeoIssueBeacon({
  type,
  pathname,
  reason,
}: {
  type: SeoIssueType;
  pathname: string;
  reason: string;
}) {
  useEffect(() => {
    const payload = JSON.stringify({
      type,
      pathname,
      reason,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      timestamp: new Date().toISOString(),
    });

    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon('/api/monitoring/seo-issues', blob);
      return;
    }

    void fetch('/api/monitoring/seo-issues', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: payload,
      keepalive: true,
    }).catch(() => undefined);
  }, [pathname, reason, type]);

  return null;
}
