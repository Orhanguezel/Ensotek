// =============================================================
// FILE: src/pages/admin/slider/new.tsx
// Ensotek – Yeni Slider Oluşturma Sayfası
// Tüm layout + header + JSON + image = SliderFormPage
// =============================================================

"use client";

import React from "react";
import SliderFormPage from "@/components/admin/slider/SliderFormPage";

const AdminSliderCreatePage: React.FC = () => {
  return <SliderFormPage mode="create" />;
};

export default AdminSliderCreatePage;
