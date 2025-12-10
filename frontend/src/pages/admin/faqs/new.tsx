// =============================================================
// FILE: src/pages/admin/faqs/new.tsx
// Ensotek – Yeni FAQ Oluşturma Sayfası
// =============================================================

"use client";

import React from "react";
import FaqsFormPage from "@/components/admin/faqs/FaqsFormPage";

const AdminFaqsCreatePage: React.FC = () => {
  return <FaqsFormPage mode="create" />;
};

export default AdminFaqsCreatePage;
