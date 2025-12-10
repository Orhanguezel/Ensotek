// =============================================================
// FILE: src/pages/admin/library/new.tsx
// Ensotek – Yeni Library Oluşturma Sayfası
// =============================================================

"use client";

import React from "react";
import LibraryFormPage from "@/components/admin/library/LibraryFormPage";

const AdminLibraryCreatePage: React.FC = () => {
  return <LibraryFormPage mode="create" />;
};

export default AdminLibraryCreatePage;
