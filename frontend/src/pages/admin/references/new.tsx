// =============================================================
// FILE: src/pages/admin/references/new.tsx
// Ensotek – Yeni Referans Oluşturma Sayfası
// =============================================================

"use client";

import React from "react";
import ReferencesFormPage from "@/components/admin/references/ReferencesFormPage";

const AdminReferencesCreatePage: React.FC = () => {
  return <ReferencesFormPage mode="create" />;
};

export default AdminReferencesCreatePage;
