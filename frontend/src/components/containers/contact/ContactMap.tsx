// =============================================================
// FILE: src/components/containers/contact/ContactMap.tsx
// Ensotek – Contact Map (Dynamic via site_settings.contact_map)
// =============================================================
'use client';

import React, { useMemo } from 'react';
import { useUiSection } from '@/i18n/uiDb';

export type ContactMapConfig = {
  embed_url?: string; // recommended: Google Maps embed URL
  query?: string; // address string fallback
  lat?: number;
  lng?: number;
  zoom?: number;
  height?: number; // px
  title?: string; // optional
};

type Props = {
  config?: ContactMapConfig;
  locale: string; // short locale
};

const ContactMap: React.FC<Props> = ({ config, locale }) => {
  const { ui } = useUiSection('ui_contact', locale);

  const height = useMemo(() => {
    const h = Number((config as any)?.height);
    return Number.isFinite(h) && h > 200 ? h : 420;
  }, [config]);

  const title = useMemo(() => {
    return String(
      config?.title || ui('ui_contact_map_title','Location'),
    ).trim();
  }, [config?.title, ui]);

  const src = useMemo(() => {
    const embed = String(config?.embed_url || '').trim();
    if (embed) return embed;

    const q = String(config?.query || '').trim();
    if (q) {
      // No-key Google maps embed fallback. If blocked, user should provide embed_url.
      const encoded = encodeURIComponent(q);
      return `https://www.google.com/maps?q=${encoded}&output=embed`;
    }

    // Last resort: empty
    return '';
  }, [config?.embed_url, config?.query]);

  if (!src) return null;

  return (
    <section className="map__area">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div
              className="contact-map__frame"
              style={{
                width: '100%',
                borderRadius: 18,
                overflow: 'hidden',
                boxShadow: '0 10px 28px rgba(0,0,0,0.12)',
              }}
            >
              <iframe
                title={title}
                src={src}
                width="100%"
                height={height}
                style={{ border: 0, display: 'block' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMap;
