// =============================================================
// FILE: src/layout/SiteLogo.tsx
// Ensotek – Dynamic Site Logo (GLOBAL '*') [FINAL]
// - ✅ site_logo / site_logo_dark / site_logo_light from site_settings
// - ✅ No inline styles
// =============================================================

'use client';

import React, { useMemo } from 'react';
import Image, { type StaticImageData } from 'next/image';

import { useGetSiteSettingByKeyQuery } from '@/integrations/rtk/hooks';
import type { SettingValue } from '@/integrations/types';
import { pickSettingValue, useSiteSettingsContext } from '@/layout/SiteSettingsContext';

type Variant = 'default' | 'dark' | 'light';

export type SiteLogoProps = {
  variant?: Variant;
  overrideSrc?: StaticImageData | string;
  alt?: string;
  className?: string;
  priority?: boolean;
};


const DEFAULT_W = 160;
const DEFAULT_H = 60;

const variantKeyMap: Record<Variant, string> = {
  default: 'site_logo',
  dark: 'site_logo_dark',
  light: 'site_logo_light',
};

const safeStr = (v: unknown) => (v === null || v === undefined ? '' : String(v).trim());

function extractMedia(val: SettingValue | null | undefined): {
  url: string;
  width?: number;
  height?: number;
} {
  if (val === null || val === undefined) return { url: '' };

  if (typeof val === 'string') {
    const s = val.trim();
    if (!s) return { url: '' };

    const looksJson =
      (s.startsWith('{') && s.endsWith('}')) || (s.startsWith('[') && s.endsWith(']'));

    if (!looksJson) return { url: s };

    try {
      const parsed = JSON.parse(s);
      const url = safeStr((parsed as any)?.url);
      const width = (parsed as any)?.width;
      const height = (parsed as any)?.height;
      return {
        url,
        width: typeof width === 'number' ? width : undefined,
        height: typeof height === 'number' ? height : undefined,
      };
    } catch {
      return { url: s };
    }
  }

  if (typeof val === 'object') {
    const obj = val as any;
    const url = safeStr(obj?.url);
    const width = obj?.width;
    const height = obj?.height;
    return {
      url,
      width: typeof width === 'number' ? width : undefined,
      height: typeof height === 'number' ? height : undefined,
    };
  }

  return { url: '' };
}

export const SiteLogo: React.FC<SiteLogoProps> = ({
  variant = 'default',
  overrideSrc,
  alt = 'Ensotek',
  className,
  priority = true,
}) => {
  const key = variantKeyMap[variant];

  const settingsCtx = useSiteSettingsContext();

  // ✅ GLOBAL logo
  const { data: setting } = useGetSiteSettingByKeyQuery(
    {
      key,
      locale: '*',
    },
    { skip: !!settingsCtx },
  );

  const settingValue = settingsCtx ? pickSettingValue(settingsCtx, key) : setting?.value;

  const { url, width, height } = useMemo(
    () => extractMedia((settingValue as SettingValue) ?? null),
    [settingValue],
  );

  let finalSrc: StaticImageData | string = '';
  let finalW = DEFAULT_W;
  let finalH = DEFAULT_H;

  if (overrideSrc) {
    if (typeof overrideSrc === 'string') {
      finalSrc = overrideSrc;
    } else {
      finalSrc = overrideSrc;
      finalW = overrideSrc.width ?? DEFAULT_W;
      finalH = overrideSrc.height ?? DEFAULT_H;
    }
  } else {
    const u = safeStr(url);
    finalSrc = u || '';
    finalW = width || DEFAULT_W;
    finalH = height || DEFAULT_H;
  }

  // Don't render anything if no logo available
  if (!finalSrc) {
    return <span className="header__logo-text">ENSOTEK</span>;
  }

  return (
    <Image
      key={typeof finalSrc === 'string' ? finalSrc : 'settings-logo'}
      src={finalSrc}
      alt={alt}
      width={finalW}
      height={finalH}
      className={className}
      sizes="(max-width: 992px) 120px, 160px"
      priority={priority}
    />
  );
};

SiteLogo.displayName = 'SiteLogo';
