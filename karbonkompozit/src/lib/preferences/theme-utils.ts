import { THEME_DEFAULTS, THEME_PRESET_VALUES, type ThemeMode, type ThemePreset } from './theme';

function withTransitionGuard(fn: () => void) {
  const doc = document.documentElement;
  doc.classList.add('disable-transitions');
  fn();
  requestAnimationFrame(() => {
    doc.classList.remove('disable-transitions');
  });
}

export function readThemeMode(): ThemeMode {
  if (typeof document === 'undefined') return THEME_DEFAULTS.mode;
  return document.documentElement.getAttribute('data-theme-mode') === 'dark'
    ? 'dark'
    : 'light';
}

export function readThemePreset(): ThemePreset {
  if (typeof document === 'undefined') return THEME_DEFAULTS.preset;
  const value = document.documentElement.getAttribute('data-theme-preset');
  return THEME_PRESET_VALUES.includes(value as ThemePreset)
    ? (value as ThemePreset)
    : THEME_DEFAULTS.preset;
}

export function applyThemeMode(mode: ThemeMode) {
  withTransitionGuard(() => {
    const doc = document.documentElement;
    doc.setAttribute('data-theme-mode', mode);
    doc.style.colorScheme = mode;
    document.body?.setAttribute('data-theme-mode', mode);
    if (document.body) {
      document.body.style.colorScheme = mode;
    }
  });
}

export function applyThemePreset(preset: ThemePreset) {
  withTransitionGuard(() => {
    document.documentElement.setAttribute('data-theme-preset', preset);
  });
}
