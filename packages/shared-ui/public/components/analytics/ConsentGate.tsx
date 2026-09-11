'use client';

import { clearLeadAttribution, setLeadAnalyticsContext } from '../../lib/lead-tracking';
import { useEffect, useState, type ReactNode } from 'react';

const KEY = 'ensotek.analytics-consent.v1';
const OPEN_PREFERENCES = 'ensotek:open-consent-preferences';
type Choice = 'granted' | 'denied';
type TrackingWindow = Window & { dataLayer?: unknown[] };
const copy = {
  tr: { title: 'Çerez tercihleri', text: 'Site kullanımını ölçmek için isteğe bağlı analiz çerezleri kullanmak istiyoruz. Tercihinizi istediğiniz zaman değiştirebilirsiniz.', accept: 'Analize izin ver', reject: 'Reddet', settings: 'Çerez tercihleri' },
  de: { title: 'Cookie-Einstellungen', text: 'Mit Ihrer Zustimmung verwenden wir optionale Analyse-Cookies zur Messung der Websitenutzung. Sie können Ihre Auswahl jederzeit ändern.', accept: 'Analyse erlauben', reject: 'Ablehnen', settings: 'Cookie-Einstellungen' },
  en: { title: 'Cookie preferences', text: 'With your permission, we use optional analytics cookies to measure website use. You can change your choice at any time.', accept: 'Allow analytics', reject: 'Reject', settings: 'Cookie preferences' },
};
function consent(choice: Choice, mode: 'default' | 'update') {
  const target = window as TrackingWindow;
  target.dataLayer ??= [];
  // gtag commands are Arguments objects, unlike GTM event objects.
  function gtag(..._args: unknown[]) { target.dataLayer!.push(arguments); }
  gtag('consent', mode, { analytics_storage: choice, ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
}
function clearAnalyticsCookies() {
  const host = location.hostname.split('.');
  const domains = ['', ...host.slice(0, -1).map((_, index) => host.slice(index).join('.'))];
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.split('=')[0]?.trim();
    if (!name || !/^(_ga|_gid|_gat|_gcl_|_fbp)/.test(name)) continue;
    for (const domain of domains) document.cookie = `${name}=; Max-Age=0; path=/;${domain ? ` domain=${domain};` : ''}`;
  }
}
export function ConsentGate({ children, locale = 'en' }: { children: ReactNode; locale?: string }) {
  const [choice, setChoice] = useState<Choice | null>(null);
  const [visible, setVisible] = useState(false);
  const t = copy[locale as keyof typeof copy] || copy.en;
  useEffect(() => {
    consent('denied', 'default');
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (saved && (saved.value === 'granted' || saved.value === 'denied') && saved.expires > Date.now()) {
        consent(saved.value, 'update'); setChoice(saved.value); return;
      }
    } catch { /* Storage can be unavailable; keep tracking disabled. */ }
    setVisible(true);
  }, []);
  useEffect(() => {
    const open = () => setVisible(true);
    window.addEventListener(OPEN_PREFERENCES, open);
    return () => window.removeEventListener(OPEN_PREFERENCES, open);
  }, []);
  function choose(value: Choice) {
    try { localStorage.setItem(KEY, JSON.stringify({ value, expires: Date.now() + 180 * 86400000 })); } catch { /* Session-only consent. */ }
    consent(value, 'update');
    if (value === 'denied') { clearAnalyticsCookies(); clearLeadAttribution(); setLeadAnalyticsContext(); }
    const reload = choice === 'granted' && value === 'denied';
    setChoice(value); setVisible(false);
    // Unload already executed third-party code after withdrawal.
    if (reload) location.reload();
  }
  return <>
    {choice === 'granted' ? children : null}
    {visible && <section role="dialog" aria-modal="false" aria-label={t.title} style={{ position: 'fixed', bottom: 8, left: 8, right: 8, zIndex: 10000, maxWidth: 620, padding: 20, background: '#fff', color: '#172033', border: '1px solid #64748b', borderRadius: 8, boxShadow: '0 4px 24px #0003' }}>
      <strong>{t.title}</strong><p style={{ margin: '10px 0', fontSize: 14 }}>{t.text}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <button type="button" onClick={() => choose('denied')} style={{ padding: '12px 18px', border: '1px solid #172033', borderRadius: 6 }}>{t.reject}</button>
        <button type="button" onClick={() => choose('granted')} style={{ padding: '12px 18px', border: '1px solid #172033', borderRadius: 6 }}>{t.accept}</button>
      </div>
    </section>}
  </>;
}

/** An ordinary footer control; never pinned over page content. */
export function ConsentPreferences({ locale = 'en' }: { locale?: string }) {
  const t = copy[locale as keyof typeof copy] || copy.en;
  return <button type="button" data-consent-preferences onClick={() => window.dispatchEvent(new Event(OPEN_PREFERENCES))} style={{ background: 'transparent', border: 0, color: 'inherit', font: 'inherit', fontSize: 13, textDecoration: 'underline', cursor: 'pointer', padding: '12px 0' }}>{t.settings}</button>;
}
