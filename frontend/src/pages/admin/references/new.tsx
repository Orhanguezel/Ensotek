// =============================================================
// FILE: src/pages/admin/references/new.tsx
// Ensotek – Yeni Referans Oluşturma Sayfası
// (SubCategory new page pattern)
// =============================================================

'use client';

import React from 'react';
import { useRouter } from 'next/router';

import ReferencesFormPage from '@/components/admin/references/ReferencesFormPage';

const AdminReferencesCreatePage: React.FC = () => {
  const router = useRouter();

  const handleDone = () => {
    router.push('/admin/references');
  };

  return (
    <ReferencesFormPage mode="create" initialData={null} loading={false} onDone={handleDone} />
  );
};

export default AdminReferencesCreatePage;
