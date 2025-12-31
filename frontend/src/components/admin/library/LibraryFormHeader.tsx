// =============================================================
// FILE: src/components/admin/library/LibraryFormHeader.tsx
// Ensotek – Library Form Header (Create/Edit + Mode Switch)
// =============================================================

'use client';

import React from 'react';

export type LibraryFormEditMode = 'form' | 'json';

export type LibraryFormHeaderProps = {
  mode: 'create' | 'edit';
  editMode: LibraryFormEditMode;
  saving?: boolean;

  onChangeEditMode: (m: LibraryFormEditMode) => void;
  onCancel?: () => void;
};

export const LibraryFormHeader: React.FC<LibraryFormHeaderProps> = ({
  mode,
  editMode,
  saving,
  onChangeEditMode,
  onCancel,
}) => {
  return (
    <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-start gap-2">
      <div className="ensotek-min-w-0">
        <div className="fw-semibold">
          {mode === 'create' ? 'Yeni Library Kaydı' : 'Library Kaydı Düzenle'}
        </div>
        <div className="text-muted small">Form veya JSON modunda düzenleyebilirsin.</div>
      </div>

      <div className="d-flex align-items-center gap-2 flex-wrap justify-content-md-end">
        <div className="btn-group btn-group-sm">
          <button
            type="button"
            className={'btn btn-outline-secondary' + (editMode === 'form' ? ' active' : '')}
            onClick={() => onChangeEditMode('form')}
            disabled={!!saving}
          >
            Form
          </button>
          <button
            type="button"
            className={'btn btn-outline-secondary' + (editMode === 'json' ? ' active' : '')}
            onClick={() => onChangeEditMode('json')}
            disabled={!!saving}
          >
            JSON
          </button>
        </div>

        {onCancel && (
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={onCancel}
            disabled={!!saving}
          >
            Geri
          </button>
        )}
      </div>
    </div>
  );
};
