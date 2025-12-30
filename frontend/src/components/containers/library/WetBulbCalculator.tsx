// =============================================================
// FILE: src/components/containers/library/WetBulbCalculator.tsx
// Ensotek – Wet-Bulb Temperature Calculator (Air T + RH)
// - SCSS aligned: NO styled-jsx, NO inline styles
// - i18n PATTERN: useLocaleShort + useUiSection('ui_library', locale as any)
// - UI: DB -> EN fallback only (NO locale branching)
// =============================================================

'use client';

import React, { useCallback, useMemo, useState, type FormEvent } from 'react';

// i18n (PATTERN)
import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';

function safeStr(v: unknown): string {
  if (typeof v === 'string') return v.trim();
  if (v == null) return '';
  return String(v).trim();
}

/** "12,3" -> 12.3 */
function parseDecimal(raw: string): number {
  const s = safeStr(raw).replace(',', '.');
  if (!s) return Number.NaN;
  return Number.parseFloat(s);
}

const WetBulbCalculator: React.FC = () => {
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_library', locale as any);

  const t = useCallback(
    (key: string, fallbackEn: string) => {
      const v = safeStr(ui(key, fallbackEn));
      return v || fallbackEn;
    },
    [ui],
  );

  const [temperature, setTemperature] = useState<string>('');
  const [humidity, setHumidity] = useState<string>('');
  const [result, setResult] = useState<string>(''); // "xx.xx °C"
  const [error, setError] = useState<string>('');

  // UI strings (DB -> EN fallback only)
  const subprefix = t('ui_library_subprefix', 'Ensotek');
  const subLabel = t('ui_library_wb_sublabel', 'Psychrometric Tools');

  const heading = t('ui_library_wb_title', 'Wet-Bulb Temperature Calculator');
  const subTitle = t(
    'ui_library_wb_subtitle',
    'Enter air temperature and relative humidity to estimate wet-bulb temperature.',
  );

  const tLabel = t('ui_library_wb_temperature_label', 'Air Temperature (°C)');
  const hLabel = t('ui_library_wb_humidity_label', 'Relative Humidity (%)');
  const btnLabel = t('ui_library_wb_calculate_button', 'Calculate');

  const resultPrefix = t('ui_library_wb_result_label', 'Wet-bulb temperature:');

  const placeholderT = t('ui_library_wb_temperature_placeholder', 'Air temperature (°C)');
  const placeholderH = t('ui_library_wb_humidity_placeholder', 'Relative humidity (%)');

  const errorText = t('ui_library_wb_error_invalid_input', 'Please enter valid values.');
  const emptyResultText = t('ui_library_wb_result_placeholder', 'Result will be shown here.');

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      const tVal = parseDecimal(temperature);
      const rhVal = parseDecimal(humidity);

      const invalid =
        Number.isNaN(tVal) ||
        Number.isNaN(rhVal) ||
        !Number.isFinite(tVal) ||
        !Number.isFinite(rhVal) ||
        rhVal < 0 ||
        rhVal > 100;

      if (invalid) {
        setError(errorText);
        setResult('');
        return;
      }

      setError('');

      // Empirical approximation (common wet-bulb approx)
      const wb =
        tVal * Math.atan(0.151977 * Math.sqrt(rhVal + 8.313659)) +
        Math.atan(tVal + rhVal) -
        Math.atan(rhVal - 1.676331) +
        0.00391838 * Math.pow(rhVal, 1.5) * Math.atan(0.023101 * rhVal) -
        4.686035;

      const value = wb.toFixed(2);
      setResult(`${value} °C`);
    },
    [temperature, humidity, errorText],
  );

  const canSubmit = useMemo(() => {
    // boş iken disable etmek istiyorsan
    return safeStr(temperature).length > 0 && safeStr(humidity).length > 0;
  }, [temperature, humidity]);

  return (
    <section className="features__area p-relative features-bg pt-60 pb-120">
      <div className="container">
        <div className="row justify-content-center mb-40">
          <div className="col-xl-8 col-lg-9">
            <div className="section__title-wrapper text-center">
              <span className="section__subtitle">
                <span>{subprefix}</span> {subLabel}
              </span>

              <h2 className="section__title">{heading}</h2>

              <p className="wetbulb__subtitle mt-10">{subTitle}</p>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-xl-8 col-lg-9">
            <div className="wetbulb__box mb-25">
              <form className="row g-3 align-items-end" onSubmit={handleSubmit}>
                <div className="col-md-4 col-sm-6">
                  <label className="wetbulb__label" htmlFor="wetbulb-temp">
                    {tLabel}
                  </label>
                  <input
                    id="wetbulb-temp"
                    type="text"
                    className="wetbulb__input"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    placeholder={placeholderT}
                    inputMode="decimal"
                    autoComplete="off"
                  />
                </div>

                <div className="col-md-4 col-sm-6">
                  <label className="wetbulb__label" htmlFor="wetbulb-rh">
                    {hLabel}
                  </label>
                  <input
                    id="wetbulb-rh"
                    type="text"
                    className="wetbulb__input"
                    value={humidity}
                    onChange={(e) => setHumidity(e.target.value)}
                    placeholder={placeholderH}
                    inputMode="decimal"
                    autoComplete="off"
                  />
                </div>

                <div className="col-md-4 col-sm-12">
                  <button
                    type="submit"
                    className="solid__btn w-100 wetbulb__btn"
                    disabled={!canSubmit}
                    aria-disabled={!canSubmit}
                  >
                    {btnLabel}
                  </button>
                </div>
              </form>
            </div>

            <div className="wetbulb__result" aria-live="polite">
              {error ? <span className="wetbulb__result-error">{error}</span> : null}

              {!error && result ? (
                <>
                  <span className="wetbulb__result-label">{resultPrefix} </span>
                  <strong className="wetbulb__result-value">{result}</strong>
                </>
              ) : null}

              {!error && !result ? (
                <span className="wetbulb__result-placeholder">{emptyResultText}</span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WetBulbCalculator;
