// =============================================================
// FILE: src/components/admin/references/ReferencesFormHeader.tsx
// Ensotek – References Form Header (Category/SubCategory pattern)
// =============================================================

'use client';

import React from 'react';

export type ReferencesFormEditMode = 'form' | 'json';

export type ReferencesFormHeaderProps = {
  mode: 'create' | 'edit';
  locale: string; // sadece gösterim için (formState.locale)

  editMode: ReferencesFormEditMode;
  onChangeEditMode: (m: ReferencesFormEditMode) => void;

  saving: boolean;

  // locales query loading (DB settings read)
  localesLoading?: boolean;

  // edit locale content fetch loading
  isLocaleChanging?: boolean;

  onCancel: () => void;
};

export const ReferencesFormHeader: React.FC<ReferencesFormHeaderProps> = ({
  mode,
  locale,
  editMode,
  onChangeEditMode,
  saving,
  localesLoading,
  isLocaleChanging,
  onCancel,
}) => {
  const title = mode === 'create' ? 'Yeni Referans Oluştur' : 'Referans Düzenle';

  const badgeText = isLocaleChanging
    ? 'Dil değiştiriliyor...'
    : localesLoading
    ? 'Diller yükleniyor...'
    : saving
    ? 'Kaydediliyor...'
    : '';

  return (
    <div className="card-header py-2 d-flex justify-content-between align-items-center">
      <div>
        <h1 className="h5 mb-0">{title}</h1>
        <div className="small text-muted">
          Dil: <strong>{locale ? String(locale).toUpperCase() : '-'}</strong>
        </div>
      </div>

      <div className="d-flex align-items-center gap-2">
        <div className="btn-group btn-group-sm" role="group">
          <button
            type="button"
            className={`btn btn-outline-secondary ${editMode === 'form' ? 'active' : ''}`}
            onClick={() => onChangeEditMode('form')}
            disabled={saving}
          >
            Form
          </button>
          <button
            type="button"
            className={`btn btn-outline-secondary ${editMode === 'json' ? 'active' : ''}`}
            onClick={() => onChangeEditMode('json')}
            disabled={saving}
          >
            JSON
          </button>
        </div>

        {!!badgeText && <span className="badge bg-secondary small">{badgeText}</span>}

        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          disabled={saving}
          onClick={onCancel}
        >
          ← Geri
        </button>
      </div>
    </div>
  );
};
