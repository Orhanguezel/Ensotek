'use client';

import React, { useEffect, useMemo, useState } from 'react';

type ConsentState = {
  necessary: true; // always true
  analytics: boolean;
};

type Props = {
  open: boolean;
  locale?: string;
  consent: ConsentState;

  title?: string;
  description?: string;

  labelNecessary?: string;
  descNecessary?: string;

  labelAnalytics?: string;
  descAnalytics?: string;

  btnSave?: string;
  btnCancel?: string;

  onClose: () => void;
  onSave: (next: ConsentState) => void;
};

export default function CookieSettingsModal({
  open,
  consent,
  onClose,
  onSave,

  title = 'Çerez Ayarları',
  description = 'Hangi çerez kategorilerine izin verdiğinizi seçebilirsiniz. Gerekli çerezler her zaman açıktır.',

  labelNecessary = 'Gerekli',
  descNecessary = 'Sitenin temel işlevleri (oturum, güvenlik, dil tercihi gibi) için zorunludur.',

  labelAnalytics = 'Analitik',
  descAnalytics = 'Site trafiğini ve performansı anlamamıza yardımcı olur (ör. sayfa görüntüleme).',

  btnSave = 'Kaydet',
  btnCancel = 'Vazgeç',
}: Props) {
  const [analytics, setAnalytics] = useState<boolean>(!!consent.analytics);

  // modal açılınca state sync
  useEffect(() => {
    if (!open) return;
    setAnalytics(!!consent.analytics);
  }, [open, consent.analytics]);

  // ESC ile kapatma
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const canRender = open;
  const nextState: ConsentState = useMemo(() => ({ necessary: true, analytics }), [analytics]);

  if (!canRender) return null;

  return (
    <div
      className="ccm__backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(e) => {
        // modal dışına tıklayınca kapat
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="ccm__modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="ccm__head">
          <div className="ccm__titles">
            <div className="ccm__title">{title}</div>
            <div className="ccm__desc">{description}</div>
          </div>

          <button type="button" className="ccm__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="ccm__content">
          {/* Necessary */}
          <div className="ccm__row">
            <div className="ccm__rowText">
              <div className="ccm__rowTitle">{labelNecessary}</div>
              <div className="ccm__rowDesc">{descNecessary}</div>
            </div>

            <div className="ccm__rowCtrl">
              <span className="ccm__pill ccm__pill--on">On</span>
            </div>
          </div>

          <div className="ccm__divider" />

          {/* Analytics */}
          <div className="ccm__row">
            <div className="ccm__rowText">
              <div className="ccm__rowTitle">{labelAnalytics}</div>
              <div className="ccm__rowDesc">{descAnalytics}</div>
            </div>

            <div className="ccm__rowCtrl">
              <label className="ccm__switch" aria-label={labelAnalytics}>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                />
                <span className="ccm__slider" />
              </label>
            </div>
          </div>
        </div>

        <div className="ccm__actions">
          <button type="button" className="ccm__btn ccm__btn--ghost" onClick={onClose}>
            {btnCancel}
          </button>

          <button
            type="button"
            className="ccm__btn ccm__btn--primary"
            onClick={() => onSave(nextState)}
          >
            {btnSave}
          </button>
        </div>
      </div>

      <style jsx>{`
        .ccm__backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          z-index: 9999;
        }

        .ccm__modal {
          width: min(720px, 100%);
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 22px 60px rgba(0, 0, 0, 0.25);
          overflow: hidden;
        }

        .ccm__head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          padding: 18px 18px 12px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        }

        .ccm__titles {
          flex: 1;
          min-width: 0;
        }

        .ccm__title {
          font-size: 18px;
          font-weight: 800;
          line-height: 1.2;
        }

        .ccm__desc {
          margin-top: 6px;
          font-size: 13px;
          opacity: 0.75;
          line-height: 1.45;
        }

        .ccm__close {
          border: 0;
          background: transparent;
          font-size: 26px;
          line-height: 1;
          cursor: pointer;
          opacity: 0.65;
          padding: 2px 8px;
        }
        .ccm__close:hover {
          opacity: 1;
        }

        .ccm__content {
          padding: 14px 18px;
        }

        .ccm__row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 12px 0;
        }

        .ccm__rowText {
          flex: 1;
          min-width: 0;
        }

        .ccm__rowTitle {
          font-weight: 700;
          font-size: 14px;
        }

        .ccm__rowDesc {
          margin-top: 4px;
          font-size: 13px;
          opacity: 0.75;
          line-height: 1.45;
        }

        .ccm__rowCtrl {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          min-width: 90px;
        }

        .ccm__divider {
          height: 1px;
          background: rgba(0, 0, 0, 0.08);
        }

        .ccm__pill {
          font-size: 12px;
          font-weight: 700;
          padding: 6px 10px;
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.06);
          color: rgba(0, 0, 0, 0.75);
          user-select: none;
        }

        .ccm__pill--on {
          background: rgba(90, 87, 255, 0.12);
          color: rgba(90, 87, 255, 0.95);
        }

        /* Switch */
        .ccm__switch {
          position: relative;
          display: inline-flex;
          align-items: center;
          width: 46px;
          height: 26px;
        }

        .ccm__switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .ccm__slider {
          position: absolute;
          inset: 0;
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.18);
          transition: 0.15s ease;
          cursor: pointer;
        }

        .ccm__slider:before {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          left: 3px;
          top: 3px;
          border-radius: 999px;
          background: #fff;
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.18);
          transition: 0.15s ease;
        }

        .ccm__switch input:checked + .ccm__slider {
          background: var(--tp-theme-1, #5a57ff);
        }
        .ccm__switch input:checked + .ccm__slider:before {
          transform: translateX(20px);
        }

        .ccm__actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 14px 18px 18px;
          border-top: 1px solid rgba(0, 0, 0, 0.08);
        }

        .ccm__btn {
          border-radius: 12px;
          padding: 10px 14px;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          border: 1px solid transparent;
          transition: 0.15s ease;
        }

        .ccm__btn--ghost {
          background: #fff;
          border-color: rgba(0, 0, 0, 0.14);
        }
        .ccm__btn--ghost:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 18px rgba(0, 0, 0, 0.08);
        }

        .ccm__btn--primary {
          background: var(--tp-theme-1, #5a57ff);
          color: #fff;
        }
        .ccm__btn--primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 22px rgba(0, 0, 0, 0.14);
        }
      `}</style>
    </div>
  );
}
