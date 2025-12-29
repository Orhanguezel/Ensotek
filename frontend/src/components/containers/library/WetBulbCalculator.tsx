// =============================================================
// FILE: src/components/containers/library/WetBulbCalculator.tsx
// Ensotek – Wet-Bulb Temperature Calculator (Hava sıcaklığı + RH)
// - SCSS aligned: no styled-jsx, no inline styles
// - i18n: site_settings.ui_library
// =============================================================

'use client';

import React, { useState } from 'react';

// i18n helper’lar
import { useResolvedLocale } from '@/i18n/locale';
import { useUiSection } from '@/i18n/uiDb';

const WetBulbCalculator: React.FC = () => {
  const locale = useResolvedLocale();
  const { ui } = useUiSection('ui_library', locale);

  const [temperature, setTemperature] = useState<string>('');
  const [humidity, setHumidity] = useState<string>('');
  const [result, setResult] = useState<string>(''); // "xx.xx °C"
  const [error, setError] = useState<string>('');

  const tLabel = ui(
    'ui_library_wb_temperature_label',
    locale === 'de' ? 'Hava Sıcaklığı (°C)' : 'Air Temperature (°C)',
  );
  const hLabel = ui(
    'ui_library_wb_humidity_label',
    locale === 'de' ? 'Nem Oranı (%)' : 'Relative Humidity (%)',
  );
  const btnLabel = ui('ui_library_wb_calculate_button', locale === 'de' ? 'Hesapla' : 'Calculate');

  const heading = ui(
    'ui_library_wb_title',
    locale === 'de' ? 'Yaş Termometre Sıcaklığı Hesaplayıcı' : 'Wet-Bulb Temperature Calculator',
  );

  const subTitle = ui(
    'ui_library_wb_subtitle',
    locale === 'de'
      ? 'Hava sıcaklığı ve bağıl nemi girerek yaklaşık yaş termometre sıcaklığını hesaplayın.'
      : 'Enter air temperature and relative humidity to estimate wet-bulb temperature.',
  );

  const resultPrefix = ui(
    'ui_library_wb_result_label',
    locale === 'de' ? 'Yaş termometre sıcaklığı:' : 'Wet-bulb temperature:',
  );

  const placeholderT = ui(
    'ui_library_wb_temperature_placeholder',
    locale === 'de' ? 'Hava Sıcaklığı (°C)' : 'Air temperature (°C)',
  );

  const placeholderH = ui(
    'ui_library_wb_humidity_placeholder',
    locale === 'de' ? 'Nem Oranı (%)' : 'Relative humidity (%)',
  );

  const errorText = ui(
    'ui_library_wb_error_invalid_input',
    locale === 'de' ? 'Lütfen geçerli değerler girin.' : 'Please enter valid values.',
  );

  const subLabel = ui('ui_library_wb_sublabel', 'Psychrometric Tools');

  const emptyResultText = ui(
    'ui_library_wb_result_placeholder',
    locale === 'de' ? 'Sonuç burada görünecektir.' : 'Result will be shown here.',
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const t = parseFloat(temperature.replace(',', '.'));
    const rh = parseFloat(humidity.replace(',', '.'));

    if (Number.isNaN(t) || Number.isNaN(rh) || rh < 0 || rh > 100) {
      setError(errorText);
      setResult('');
      return;
    }

    setError('');

    // Ampirik aproximasyon
    const wb =
      t * Math.atan(0.151977 * Math.sqrt(rh + 8.313659)) +
      Math.atan(t + rh) -
      Math.atan(rh - 1.676331) +
      0.00391838 * Math.pow(rh, 1.5) * Math.atan(0.023101 * rh) -
      4.686035;

    const value = wb.toFixed(2).replace('.', locale === 'de' ? ',' : '.');
    setResult(`${value} °C`);
  };

  return (
    <section className="features__area p-relative features-bg pt-60 pb-120">
      <div className="container">
        <div className="row justify-content-center mb-40">
          <div className="col-xl-8 col-lg-9">
            <div className="section__title-wrapper text-center">
              <span className="section__subtitle">
                <span>{ui('ui_library_subprefix', 'Ensotek')}</span> {subLabel}
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
                  <label className="wetbulb__label">{tLabel}</label>
                  <input
                    type="number"
                    step="any"
                    className="wetbulb__input"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    placeholder={placeholderT}
                    inputMode="decimal"
                  />
                </div>

                <div className="col-md-4 col-sm-6">
                  <label className="wetbulb__label">{hLabel}</label>
                  <input
                    type="number"
                    step="any"
                    className="wetbulb__input"
                    value={humidity}
                    onChange={(e) => setHumidity(e.target.value)}
                    placeholder={placeholderH}
                    inputMode="decimal"
                  />
                </div>

                <div className="col-md-4 col-sm-12">
                  <button type="submit" className="solid__btn w-100 wetbulb__btn">
                    {btnLabel}
                  </button>
                </div>
              </form>
            </div>

            <div className="wetbulb__result" aria-live="polite">
              {error && <span className="wetbulb__result-error">{error}</span>}

              {!error && result && (
                <>
                  <span className="wetbulb__result-label">{resultPrefix} </span>
                  <strong className="wetbulb__result-value">{result}</strong>
                </>
              )}

              {!error && !result && (
                <span className="wetbulb__result-placeholder">{emptyResultText}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WetBulbCalculator;
