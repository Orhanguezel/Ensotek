'use client';
import { useEffect } from 'react';
import { setLeadAnalyticsContext, getLeadAttribution, emitLeadEvent } from '../../lib/lead-tracking';

/** Mount only after analytics consent. A click is never a saved lead. */
export function LeadEvents({ measurementId, locale }: { measurementId: string; locale: string }) {
  useEffect(() => {
    if (!/^G-[A-Z0-9]+$/.test(measurementId)) return;
    setLeadAnalyticsContext({ measurementId, locale });
    getLeadAttribution();
    const click = (event: MouseEvent) => {
      const a = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (href.startsWith('tel:')) emitLeadEvent('click_phone');
      else if (href.startsWith('mailto:')) emitLeadEvent('click_email');
      else if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//i.test(href)) emitLeadEvent('click_whatsapp');
      else if (/\.pdf(?:[?#]|$)/i.test(href)) emitLeadEvent('file_download', { file_extension: 'pdf' });
    };
    document.addEventListener('click', click);
    return () => { document.removeEventListener('click', click); setLeadAnalyticsContext(); };
  }, [measurementId, locale]);
  return null;
}
