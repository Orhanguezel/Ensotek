// =============================================================
// FILE: src/pages/admin/slider/new.tsx
// Ensotek – Yeni Slider Oluşturma Sayfası
// =============================================================

'use client';

import React from 'react';
import SliderFormPage from '@/components/admin/slider/SliderFormPage';

const AdminSliderCreatePage: React.FC = () => {
  return <SliderFormPage mode="create" initialData={null} loading={false} />;
};

export default AdminSliderCreatePage;
