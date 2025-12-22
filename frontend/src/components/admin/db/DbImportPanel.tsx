// =============================================================
// FILE: src/components/admin/db/DbImportPanel.tsx
// Ensotek – Admin DB SQL Import Paneli (Text / URL / File)
// Fix: responsive header/tabs/controls + SSR-safe confirm + file reset
// =============================================================

'use client';

import React, { useMemo, useState, FormEvent } from 'react';
import { toast } from 'sonner';
import {
  useImportSqlTextMutation,
  useImportSqlUrlMutation,
  useImportSqlFileMutation,
} from '@/integrations/rtk/hooks';

type TabKey = 'text' | 'url' | 'file';

const askConfirm = (message: string): boolean => {
  if (typeof window === 'undefined') return false;
  return window.confirm(message);
};

export const DbImportPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('text');

  // TEXT import state
  const [sqlText, setSqlText] = useState('');
  const [truncateText, setTruncateText] = useState(true);
  const [dryRunText, setDryRunText] = useState(false);

  // URL import state
  const [url, setUrl] = useState('');
  const [truncateUrl, setTruncateUrl] = useState(true);
  const [dryRunUrl, setDryRunUrl] = useState(false);

  // FILE import state
  const [file, setFile] = useState<File | null>(null);
  const [truncateFile, setTruncateFile] = useState(true);

  // file input reset helper
  const [fileInputKey, setFileInputKey] = useState(0);

  const [importText, { isLoading: isImportingText }] = useImportSqlTextMutation();
  const [importUrl, { isLoading: isImportingUrl }] = useImportSqlUrlMutation();
  const [importFile, { isLoading: isImportingFile }] = useImportSqlFileMutation();

  const busy = isImportingText || isImportingUrl || isImportingFile;

  const activeLabel = useMemo(() => {
    if (activeTab === 'text') return 'SQL Metni';
    if (activeTab === 'url') return "URL'den";
    return 'Dosyadan';
  }, [activeTab]);

  /* ---------------- TEXT IMPORT ---------------- */

  const handleSubmitText = async (e: FormEvent) => {
    e.preventDefault();
    if (!sqlText.trim()) {
      toast.error('SQL metni boş olamaz.');
      return;
    }

    if (!dryRunText) {
      const ok = askConfirm(
        "Bu SQL script'i doğrudan veritabanına uygulamak üzeresin.\n\n" +
          `Truncate: ${truncateText ? 'EVET (tüm tabloları boşalt)' : 'Hayır'}\n` +
          'Devam etmek istiyor musun?',
      );
      if (!ok) return;
    }

    try {
      const res = await importText({
        sql: sqlText,
        truncateBefore: truncateText,
        dryRun: dryRunText,
      }).unwrap();

      if (!res?.ok) {
        toast.error(res?.error || 'SQL import (metin) sırasında hata oluştu.');
        return;
      }

      if (res.dryRun) {
        toast.success("Dry run başarılı. Değişiklikler geriye alındı (DB'ye uygulanmadı).");
      } else {
        toast.success('SQL metni başarıyla içe aktarıldı.');
        setSqlText('');
      }
    } catch (err: any) {
      const msg =
        err?.data?.error ||
        err?.message ||
        'SQL import (metin) sırasında beklenmeyen bir hata oluştu.';
      toast.error(msg);
    }
  };

  /* ---------------- URL IMPORT ---------------- */

  const handleSubmitUrl = async (e: FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toast.error("Önce geçerli bir .sql veya .sql.gz URL'i gir.");
      return;
    }

    if (!dryRunUrl) {
      const ok = askConfirm(
        "Bu URL'den indirilen SQL dump veritabanına uygulanacak.\n\n" +
          `URL: ${url}\n` +
          `Truncate: ${truncateUrl ? 'EVET (tüm tabloları boşalt)' : 'Hayır'}\n\n` +
          'Devam etmek istiyor musun?',
      );
      if (!ok) return;
    }

    try {
      const res = await importUrl({
        url: url.trim(),
        truncateBefore: truncateUrl,
        dryRun: dryRunUrl,
      }).unwrap();

      if (!res?.ok) {
        toast.error(res?.error || 'SQL import (URL) sırasında hata oluştu.');
        return;
      }

      if (res.dryRun) {
        toast.success("Dry run başarılı. Değişiklikler geriye alındı (DB'ye uygulanmadı).");
      } else {
        toast.success("URL'den SQL dump başarıyla içe aktarıldı.");
        setUrl('');
      }
    } catch (err: any) {
      const msg =
        err?.data?.error ||
        err?.message ||
        'SQL import (URL) sırasında beklenmeyen bir hata oluştu.';
      toast.error(msg);
    }
  };

  /* ---------------- FILE IMPORT ---------------- */

  const handleSubmitFile = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Önce .sql veya .gz dosyası seç.');
      return;
    }

    const ok = askConfirm(
      'Seçtiğin SQL dosyası veritabanına uygulanacak.\n\n' +
        `Dosya: ${file.name}\n` +
        `Truncate: ${truncateFile ? 'EVET (tüm tabloları boşalt)' : 'Hayır'}\n\n` +
        'Bu işlem geri alınamaz. Devam etmek istiyor musun?',
    );
    if (!ok) return;

    try {
      const res = await importFile({
        file,
        truncateBefore: truncateFile,
      }).unwrap();

      if (!res?.ok) {
        toast.error(res?.error || 'SQL import (dosya) sırasında hata oluştu.');
        return;
      }

      toast.success('Dosyadan SQL dump başarıyla içe aktarıldı.');
      setFile(null);
      setFileInputKey((k) => k + 1); // input reset
    } catch (err: any) {
      const msg =
        err?.data?.error ||
        err?.message ||
        'SQL import (dosya) sırasında beklenmeyen bir hata oluştu.';
      toast.error(msg);
    }
  };

  return (
    <div className="card mb-3">
      <div className="card-header py-2 d-flex justify-content-between align-items-center flex-wrap gap-2">
        <span className="small fw-semibold">
          SQL İçe Aktar (IMPORT) <span className="text-muted">— {activeLabel}</span>
        </span>
        {busy && <span className="badge bg-secondary small">İşlem devam ediyor...</span>}
      </div>

      <div className="card-body">
        <p className="text-muted small mb-3">
          <strong>DİKKAT:</strong> Bu işlemler veritabanı içeriğini kalıcı olarak değiştirebilir.
          Özellikle <code>truncate</code> işaretliyken devam etmeden önce mutlaka bir snapshot
          almanı öneririm.
        </p>

        <ul className="nav nav-tabs small mb-3 flex-wrap">
          <li className="nav-item">
            <button
              type="button"
              className={'nav-link py-1 px-2 ' + (activeTab === 'text' ? 'active' : '')}
              onClick={() => setActiveTab('text')}
              disabled={busy}
            >
              SQL Metni
            </button>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className={'nav-link py-1 px-2 ' + (activeTab === 'url' ? 'active' : '')}
              onClick={() => setActiveTab('url')}
              disabled={busy}
            >
              URL&apos;den
            </button>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className={'nav-link py-1 px-2 ' + (activeTab === 'file' ? 'active' : '')}
              onClick={() => setActiveTab('file')}
              disabled={busy}
            >
              Dosyadan
            </button>
          </li>
        </ul>

        {activeTab === 'text' && (
          <form onSubmit={handleSubmitText}>
            <div className="mb-2">
              <label className="form-label small">
                SQL Script (utf8) <span className="text-danger">*</span>
              </label>
              <textarea
                className="form-control form-control-sm"
                rows={8}
                value={sqlText}
                onChange={(e) => setSqlText(e.target.value)}
                placeholder="Buraya tam SQL script'ini yapıştır."
                disabled={busy}
              />
            </div>

            <div className="d-flex flex-wrap gap-3 mb-3">
              <div className="form-check">
                <input
                  id="import-text-truncate"
                  className="form-check-input"
                  type="checkbox"
                  checked={truncateText}
                  onChange={(e) => setTruncateText(e.target.checked)}
                  disabled={busy}
                />
                <label className="form-check-label small" htmlFor="import-text-truncate">
                  İşlemden önce TÜM tabloları <strong>TRUNCATE</strong> et
                </label>
              </div>

              <div className="form-check">
                <input
                  id="import-text-dryrun"
                  className="form-check-input"
                  type="checkbox"
                  checked={dryRunText}
                  onChange={(e) => setDryRunText(e.target.checked)}
                  disabled={busy}
                />
                <label className="form-check-label small" htmlFor="import-text-dryrun">
                  Dry run (prova, değişiklikleri geriye al)
                </label>
              </div>
            </div>

            <button type="submit" className="btn btn-danger btn-sm" disabled={busy}>
              {isImportingText ? 'İçe aktarılıyor...' : "SQL'i Uygula"}
            </button>
          </form>
        )}

        {activeTab === 'url' && (
          <form onSubmit={handleSubmitUrl}>
            <div className="mb-2">
              <label className="form-label small">
                SQL Dump URL (.sql veya .sql.gz) <span className="text-danger">*</span>
              </label>
              <input
                type="url"
                className="form-control form-control-sm"
                placeholder="https://.../dump.sql veya dump.sql.gz"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={busy}
              />
            </div>

            <div className="d-flex flex-wrap gap-3 mb-3">
              <div className="form-check">
                <input
                  id="import-url-truncate"
                  className="form-check-input"
                  type="checkbox"
                  checked={truncateUrl}
                  onChange={(e) => setTruncateUrl(e.target.checked)}
                  disabled={busy}
                />
                <label className="form-check-label small" htmlFor="import-url-truncate">
                  İşlemden önce TÜM tabloları <strong>TRUNCATE</strong> et
                </label>
              </div>

              <div className="form-check">
                <input
                  id="import-url-dryrun"
                  className="form-check-input"
                  type="checkbox"
                  checked={dryRunUrl}
                  onChange={(e) => setDryRunUrl(e.target.checked)}
                  disabled={busy}
                />
                <label className="form-check-label small" htmlFor="import-url-dryrun">
                  Dry run (prova, değişiklikleri geriye al)
                </label>
              </div>
            </div>

            <button type="submit" className="btn btn-danger btn-sm" disabled={busy}>
              {isImportingUrl ? 'İçe aktarılıyor...' : "URL'den İçe Aktar"}
            </button>
          </form>
        )}

        {activeTab === 'file' && (
          <form onSubmit={handleSubmitFile}>
            <div className="mb-2">
              <label className="form-label small">
                SQL Dump Dosyası (.sql veya .gz) <span className="text-danger">*</span>
              </label>
              <input
                key={fileInputKey}
                type="file"
                className="form-control form-control-sm"
                accept=".sql,.gz,.sql.gz"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                disabled={busy}
              />
              {file && (
                <div className="text-muted small mt-1">
                  Seçili dosya: <code>{file.name}</code>
                </div>
              )}
            </div>

            <div className="form-check mb-3">
              <input
                id="import-file-truncate"
                className="form-check-input"
                type="checkbox"
                checked={truncateFile}
                onChange={(e) => setTruncateFile(e.target.checked)}
                disabled={busy}
              />
              <label className="form-check-label small" htmlFor="import-file-truncate">
                İşlemden önce TÜM tabloları <strong>TRUNCATE</strong> et
              </label>
            </div>

            <button type="submit" className="btn btn-danger btn-sm" disabled={busy}>
              {isImportingFile ? 'İçe aktarılıyor...' : 'Dosyadan İçe Aktar'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
