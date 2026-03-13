import { THEME_DEFAULTS, THEME_STORAGE_KEYS } from '@/lib/preferences/theme';

declare global {
  interface Window {
    __THEME__?: {
      mode: 'light' | 'dark';
      preset: string;
    };
  }
}

export function ThemeBootScript() {
  const defaults = JSON.stringify(THEME_DEFAULTS);
  const storageKeys = JSON.stringify(THEME_STORAGE_KEYS);

  const code = `
    (function () {
      try {
        var root = document.documentElement;
        var DEFAULTS = ${defaults};
        var KEYS = ${storageKeys};

        function readLocal(name) {
          try {
            return window.localStorage.getItem(name);
          } catch (e) {
            return null;
          }
        }

        var rawMode = readLocal(KEYS.mode) || DEFAULTS.mode;
        var rawPreset = readLocal(KEYS.preset) || DEFAULTS.preset;

        var mode = rawMode === 'dark' ? 'dark' : 'light';
        var preset = rawPreset || DEFAULTS.preset;

        root.setAttribute('data-theme-mode', mode);
        root.setAttribute('data-theme-preset', preset);
        root.style.colorScheme = mode;
        if (document.body) {
          document.body.setAttribute('data-theme-mode', mode);
          document.body.style.colorScheme = mode;
        }

        window.__THEME__ = {
          mode: mode,
          preset: preset
        };
      } catch (e) {
        document.documentElement.setAttribute('data-theme-mode', 'light');
        document.documentElement.setAttribute('data-theme-preset', 'default');
        document.documentElement.style.colorScheme = 'light';
        if (document.body) {
          document.body.setAttribute('data-theme-mode', 'light');
          document.body.style.colorScheme = 'light';
        }
      }
    })();
  `;

  return <script id="theme-boot" dangerouslySetInnerHTML={{ __html: code }} />;
}
