// =============================================================
// FILE: src/pages/admin/db/index.tsx
// Ensotek – Admin Veritabanı Yedekleme & Snapshot Sayfası
// Fix:
//  - Auth stabil olmadan /admin/db/snapshots çağrısını SKIP et (401 spam kesilir)
//  - Status stabilize olduktan sonra authed değilse /login redirect
// =============================================================

'use client';

import React, { useEffect } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import { DbAdminHeader } from '@/components/admin/db/DbAdminHeader';
import { DbSnapshotsTable } from '@/components/admin/db/DbSnapshotsTable';
import { DbImportPanel } from '@/components/admin/db/DbImportPanel';

import { useStatusQuery, useListDbSnapshotsQuery } from '@/integrations/rtk/hooks';

const AdminDbPage: NextPage = () => {
  const router = useRouter();

  // ✅ Auth status (SSR/CSR stabilizasyonu)
  const { data: statusData, isLoading: statusLoading, isError: statusError } = useStatusQuery();

  const authed = !!statusData?.authenticated;

  // Admin query’leri için ortak skip koşulu:
  // status bitmeden VEYA authed değilken hiçbir admin endpoint çağrılmasın
  const adminSkip = statusLoading || !authed;

  // ✅ Status stabil olduktan sonra redirect
  useEffect(() => {
    if (statusLoading) return;
    if (statusError || !authed) {
      router.push('/login');
    }
  }, [statusLoading, statusError, authed, router]);

  // ✅ 401 spam burada kesilir
  const {
    data: snapshots,
    isLoading,
    isFetching,
    refetch,
  } = useListDbSnapshotsQuery(undefined, { skip: adminSkip });

  const loading = isLoading || isFetching;

  // İlk yüklemede (status beklenirken) basit skeleton
  if (statusLoading || !statusData) {
    return (
      <div className="container-fluid py-3">
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: '16rem' }}
        >
          <div className="text-center">
            <div className="spinner-border text-secondary" role="status" />
            <div className="text-muted small mt-2">Admin paneli yükleniyor...</div>
          </div>
        </div>
      </div>
    );
  }

  // Redirect tetiklenirken UI flicker olmasın
  if (!authed) return null;

  // refetch’i child’lara verirken “await” gerekmiyor ama güvenli şekilde aynı fonksiyonu geçiriyoruz
  const handleRefetch = () => {
    // adminSkip false iken çağrılır; yine de defensif
    if (!adminSkip) refetch();
  };

  return (
    <div className="container-fluid py-3">
      {/* Başlık */}
      <div className="mb-3">
        <h4 className="h5 mb-1">Veritabanı Yönetimi</h4>
        <p className="text-muted small mb-0">
          Snapshot noktaları oluştur, mevcut snapshot&apos;ları geri yükle, tam veritabanı yedeği
          indir veya SQL dump içe aktar.
        </p>
      </div>

      {/* Snapshot oluşturma + Export (SQL / JSON) */}
      <DbAdminHeader onSnapshotCreated={handleRefetch} />

      {/* SQL import paneli (text / url / file) */}
      <DbImportPanel />

      {/* Snapshot listesi */}
      <DbSnapshotsTable items={snapshots ?? []} loading={loading} refetch={handleRefetch} />
    </div>
  );
};

export default AdminDbPage;
