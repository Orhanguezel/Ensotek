// =============================================================
// FILE: src/pages/admin/catalog-requests/[id].tsx
// Ensotek – Admin Catalog Request Detail Page
// =============================================================

'use client';

import React, { useMemo } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { CatalogRequestFormPage } from '@/components/admin/catalog/CatalogRequestFormPage';

const AdminCatalogRequestDetailPage: NextPage = () => {
  const router = useRouter();
  const rawId = router.query.id;

  const id = useMemo(() => {
    if (typeof rawId === 'string') return rawId;
    if (Array.isArray(rawId)) return rawId[0] ?? '';
    return '';
  }, [rawId]);

  if (!router.isReady) {
    return (
      <div className="container-fluid py-3">
        <div className="text-muted small">Yükleniyor...</div>
      </div>
    );
  }

  if (!id) {
    return (
      <div className="container-fluid py-3">
        <div className="alert alert-warning mb-0">Geçersiz id.</div>
      </div>
    );
  }

  return <CatalogRequestFormPage id={id} />;
};

export default AdminCatalogRequestDetailPage;
