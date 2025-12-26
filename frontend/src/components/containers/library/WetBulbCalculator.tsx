// =============================================================
// FILE: src/components/containers/library/WetBulbCalculator.tsx
// Ensotek – Wet-Bulb Temperature Calculator (Hava sıcaklığı + RH)
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
  const [result, setResult] = useState<string>(''); // sadece "xx.xx °C"
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const t = parseFloat(temperature.replace(',', '.'));
    const rh = parseFloat(humidity.replace(',', '.'));

    if (isNaN(t) || isNaN(rh) || rh < 0 || rh > 100) {
      setError(errorText);
      setResult('');
      return;
    }

    setError('');

    // Feuchtkugel ampirik aproximasyon
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
              <p className="mt-10" style={{ fontSize: 15, opacity: 0.85 }}>
                {subTitle}
              </p>
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
                  />
                </div>

                <div className="col-md-4 col-sm-12">
                  <button type="submit" className="solid__btn w-100 wetbulb__btn">
                    {btnLabel}
                  </button>
                </div>
              </form>
            </div>

            <div className="wetbulb__result">
              {error && <span className="wetbulb__result-error">{error}</span>}

              {!error && result && (
                <>
                  <span className="wetbulb__result-label">{resultPrefix} </span>
                  <strong className="wetbulb__result-value">{result}</strong>
                </>
              )}

              {!error && !result && (
                <span className="wetbulb__result-placeholder">
                  {locale === 'de' ? 'Sonuç burada görünecektir.' : 'Result will be shown here.'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .wetbulb__box {
          background: #ffffff;
          border-radius: 18px;
          padding: 24px 26px;
          box-shadow: 0 18px 45px rgba(3, 4, 28, 0.06);
        }

        .wetbulb__label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 6px;
          opacity: 0.8;
        }

        .wetbulb__input {
          width: 100%;
          border-radius: 10px;
          border: 1px solid rgba(15, 24, 40, 0.1);
          padding: 10px 12px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          background: #fff;
        }

        .wetbulb__input:focus {
          border-color: #5a57ff;
          box-shadow: 0 0 0 1px rgba(90, 87, 255, 0.25);
        }

        .wetbulb__btn {
          margin-top: 22px;
          justify-content: center;
          width: 100%;
        }

        .wetbulb__result {
          margin-top: 12px;
          border-radius: 18px;
          background: #234361;
          color: #ffffff;
          padding: 14px 22px;
          text-align: center;
          font-size: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 52px;
        }

        .wetbulb__result-label {
          opacity: 0.9;
          margin-right: 6px;
        }

        .wetbulb__result-value {
          font-weight: 600;
        }

        .wetbulb__result-placeholder {
          opacity: 0.8;
        }

        .wetbulb__result-error {
          color: #ffd5d5;
          font-weight: 500;
        }

        @media (prefers-color-scheme: dark) {
          .wetbulb__box {
            background: #111827;
            box-shadow: 0 18px 45px rgba(0, 0, 0, 0.6);
          }
          .wetbulb__input {
            background: #020617;
            border-color: rgba(148, 163, 184, 0.35);
            color: #e5e7eb;
          }
          .wetbulb__input::placeholder {
            color: rgba(148, 163, 184, 0.7);
          }
          .wetbulb__result {
            background: linear-gradient(135deg, #1f2937, #020617);
          }
        }
      `}</style>
    </section>
  );
};

export default WetBulbCalculator;
