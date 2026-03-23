// =============================================================
// FILE: src/integrations/shared/themeAdmin.ts
// Admin theme editor helpers
// =============================================================

import { Sun, Moon, Monitor, type LucideIcon } from 'lucide-react';

export type ColorTokens = {
  primary: string;
  accent: string;
  background: string;
  foreground: string;
  textStrong: string;
  textMuted: string;
  textBody: string;
  border: string;
  navBg: string;
  navFg: string;
  footerBg: string;
  footerFg: string;
  surfaceBase: string;
  surfaceRaised: string;
  surfaceDarkBg: string;
  surfaceDarkHeading: string;
  surfaceDarkText: string;
};

export type ThemeConfig = {
  colors: ColorTokens;
  typography: {
    fontHeading: string;
    fontBody: string;
  };
  radius: string;
  darkMode: string;
};

const EMPTY_COLORS: ColorTokens = {
  primary: '#E8A598',
  accent: '#E8C57A',
  background: '#FFFFFF',
  foreground: '#1a1512',
  textStrong: '#1a1512',
  textMuted: '#71717a',
  textBody: '#3f3f46',
  border: '#e4e4e7',
  navBg: '#FFFFFF',
  navFg: '#1a1512',
  footerBg: '#1a1512',
  footerFg: '#fafafa',
  surfaceBase: '#fafafa',
  surfaceRaised: '#FFFFFF',
  surfaceDarkBg: '#1a1512',
  surfaceDarkHeading: '#fafafa',
  surfaceDarkText: '#a1a1aa',
};

export function toThemeDraft(apiResponse: unknown): ThemeConfig {
  const r = (apiResponse && typeof apiResponse === 'object' ? apiResponse : {}) as Record<string, unknown>;
  const s = (k: string, fb: string) => typeof r[k] === 'string' ? r[k] as string : fb;

  const colors: ColorTokens = {
    primary: s('primary', EMPTY_COLORS.primary),
    accent: s('accent', EMPTY_COLORS.accent),
    background: s('background', EMPTY_COLORS.background),
    foreground: s('foreground', EMPTY_COLORS.foreground),
    textStrong: s('textStrong', s('foreground', EMPTY_COLORS.textStrong)),
    textMuted: s('textMuted', s('mutedFg', EMPTY_COLORS.textMuted)),
    textBody: s('textBody', EMPTY_COLORS.textBody),
    border: s('border', EMPTY_COLORS.border),
    navBg: s('navBg', EMPTY_COLORS.navBg),
    navFg: s('navFg', EMPTY_COLORS.navFg),
    footerBg: s('footerBg', EMPTY_COLORS.footerBg),
    footerFg: s('footerFg', EMPTY_COLORS.footerFg),
    surfaceBase: s('surfaceBase', EMPTY_COLORS.surfaceBase),
    surfaceRaised: s('surfaceRaised', EMPTY_COLORS.surfaceRaised),
    surfaceDarkBg: s('surfaceDarkBg', EMPTY_COLORS.surfaceDarkBg),
    surfaceDarkHeading: s('surfaceDarkHeading', EMPTY_COLORS.surfaceDarkHeading),
    surfaceDarkText: s('surfaceDarkText', EMPTY_COLORS.surfaceDarkText),
  };

  // Handle nested colors object from API
  if (r.colors && typeof r.colors === 'object') {
    const c = r.colors as Record<string, unknown>;
    for (const k of Object.keys(colors) as (keyof ColorTokens)[]) {
      if (typeof c[k] === 'string') colors[k] = c[k] as string;
    }
  }

  let typography = { fontHeading: '', fontBody: '' };
  if (r.typography && typeof r.typography === 'object') {
    const t = r.typography as Record<string, unknown>;
    typography = {
      fontHeading: typeof t.fontHeading === 'string' ? t.fontHeading : (s('fontFamily', '') || ''),
      fontBody: typeof t.fontBody === 'string' ? t.fontBody : '',
    };
  } else {
    typography.fontHeading = s('fontFamily', '');
    typography.fontBody = s('fontBodyFamily', '');
  }

  return {
    colors,
    typography,
    radius: s('radius', '0.625rem'),
    darkMode: s('darkMode', 'light'),
  };
}

export function groupThemeColorTokens(): Map<string, (keyof ColorTokens)[]> {
  const m = new Map<string, (keyof ColorTokens)[]>();
  m.set('Brand', ['primary', 'accent']);
  m.set('Background', ['background', 'foreground', 'textStrong', 'textMuted', 'textBody', 'border']);
  m.set('Surface', ['surfaceBase', 'surfaceRaised', 'surfaceDarkBg', 'surfaceDarkHeading', 'surfaceDarkText']);
  m.set('Navigation', ['navBg', 'navFg']);
  m.set('Footer', ['footerBg', 'footerFg']);
  return m;
}

export const COLOR_TOKEN_LABELS: Record<keyof ColorTokens, { label: string }> = {
  primary: { label: 'Primary' },
  accent: { label: 'Accent' },
  background: { label: 'Background' },
  foreground: { label: 'Foreground' },
  textStrong: { label: 'Text Strong' },
  textMuted: { label: 'Text Muted' },
  textBody: { label: 'Text Body' },
  border: { label: 'Border' },
  navBg: { label: 'Nav Background' },
  navFg: { label: 'Nav Foreground' },
  footerBg: { label: 'Footer Background' },
  footerFg: { label: 'Footer Foreground' },
  surfaceBase: { label: 'Surface Base' },
  surfaceRaised: { label: 'Surface Raised' },
  surfaceDarkBg: { label: 'Dark Section BG' },
  surfaceDarkHeading: { label: 'Dark Section Heading' },
  surfaceDarkText: { label: 'Dark Section Text' },
};

export const THEME_COLOR_HEX_PLACEHOLDER = '#000000';

export const RADIUS_OPTIONS: readonly { value: string; label: string }[] = [
  { value: '0px', label: 'None (0px)' },
  { value: '0.25rem', label: 'XS (4px)' },
  { value: '0.375rem', label: 'S (6px)' },
  { value: '0.5rem', label: 'M (8px)' },
  { value: '0.625rem', label: 'Default (10px)' },
  { value: '0.75rem', label: 'L (12px)' },
  { value: '1rem', label: 'XL (16px)' },
  { value: '9999px', label: 'Full' },
];

export const THEME_FONT_HEADING_PLACEHOLDER = 'Poppins, sans-serif';
export const THEME_FONT_BODY_PLACEHOLDER = 'Inter, sans-serif';

export const THEME_RADIUS_PREVIEW_SIZES: readonly string[] = ['S', 'M', 'L'];

export const THEME_DARK_MODE_OPTIONS: readonly {
  value: string;
  icon: LucideIcon;
  labelKey: string;
}[] = [
  { value: 'light', icon: Sun, labelKey: 'admin.theme.darkMode.light' },
  { value: 'dark', icon: Moon, labelKey: 'admin.theme.darkMode.dark' },
  { value: 'system', icon: Monitor, labelKey: 'admin.theme.darkMode.system' },
];
