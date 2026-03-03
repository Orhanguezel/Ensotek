"use client";

import React, { useMemo, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

function safeStr(v: unknown): string {
  if (typeof v === "string") return v.trim();
  if (v == null) return "";
  return String(v).trim();
}

function parseDecimal(raw: string): number {
  const s = safeStr(raw).replace(",", ".");
  if (!s) return Number.NaN;
  return Number.parseFloat(s);
}

const WetBulbCalculator: React.FC = () => {
  const t = useTranslations("ensotek.library");

  const [temperature, setTemperature] = useState<string>("");
  const [humidity, setHumidity] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");

  const canSubmit = useMemo(
    () => safeStr(temperature).length > 0 && safeStr(humidity).length > 0,
    [temperature, humidity],
  );

  const handleSubmit = (e: FormEvent) => {
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
      setError(t("wbError"));
      setResult("");
      return;
    }

    setError("");

    const wb =
      tVal * Math.atan(0.151977 * Math.sqrt(rhVal + 8.313659)) +
      Math.atan(tVal + rhVal) -
      Math.atan(rhVal - 1.676331) +
      0.00391838 * Math.pow(rhVal, 1.5) * Math.atan(0.023101 * rhVal) -
      4.686035;

    setResult(`${wb.toFixed(2)} °C`);
  };

  return (
    <section className="features__area p-relative features-bg pt-60 pb-120">
      <div className="container">
        <div className="row justify-content-center mb-40">
          <div className="col-xl-8 col-lg-9">
            <div className="section__title-wrapper text-center">
              <span className="section__subtitle">
                <span>{t("subprefix")}</span> {t("wbSubLabel")}
              </span>
              <h2 className="section__title">{t("wbTitle")}</h2>
              <p className="wetbulb__subtitle mt-10">{t("wbDescription")}</p>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-xl-8 col-lg-9">
            <div className="wetbulb__box mb-25">
              <form className="row g-3 align-items-end" onSubmit={handleSubmit}>
                <div className="col-md-4 col-sm-6">
                  <label className="wetbulb__label" htmlFor="wetbulb-temp">
                    {t("wbTemperatureLabel")}
                  </label>
                  <input
                    id="wetbulb-temp"
                    type="text"
                    className="wetbulb__input"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    placeholder={t("wbTemperaturePlaceholder")}
                    inputMode="decimal"
                    autoComplete="off"
                  />
                </div>

                <div className="col-md-4 col-sm-6">
                  <label className="wetbulb__label" htmlFor="wetbulb-rh">
                    {t("wbHumidityLabel")}
                  </label>
                  <input
                    id="wetbulb-rh"
                    type="text"
                    className="wetbulb__input"
                    value={humidity}
                    onChange={(e) => setHumidity(e.target.value)}
                    placeholder={t("wbHumidityPlaceholder")}
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
                    {t("wbCalculate")}
                  </button>
                </div>
              </form>
            </div>

            <div className="wetbulb__result" aria-live="polite">
              {error ? <span className="wetbulb__result-error">{error}</span> : null}

              {!error && result ? (
                <>
                  <span className="wetbulb__result-label">{t("wbResultLabel")} </span>
                  <strong className="wetbulb__result-value">{result}</strong>
                </>
              ) : null}

              {!error && !result ? (
                <span className="wetbulb__result-placeholder">{t("wbResultPlaceholder")}</span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WetBulbCalculator;
