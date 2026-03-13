export const THEME_MODE_OPTIONS = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
] as const;

export const THEME_MODE_VALUES = THEME_MODE_OPTIONS.map((option) => option.value);
export type ThemeMode = (typeof THEME_MODE_VALUES)[number];

export const THEME_PRESET_OPTIONS = [
  {
    label: 'Default',
    value: 'default',
    primary: {
      light: 'var(--primary-600)',
      dark: 'var(--primary-400)',
    },
  },
] as const;

export const THEME_PRESET_VALUES = THEME_PRESET_OPTIONS.map((option) => option.value);
export type ThemePreset = (typeof THEME_PRESET_VALUES)[number];

export const THEME_STORAGE_KEYS = {
  mode: 'theme_mode',
  preset: 'theme_preset',
} as const;

export const THEME_DEFAULTS = {
  mode: 'light' as ThemeMode,
  preset: 'default' as ThemePreset,
} as const;
