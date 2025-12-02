// =============================================================
// FILE: src/pages/admin/categories/new.tsx
// Ensotek – Yeni Kategori Oluşturma Sayfası
// =============================================================

"use client";

import React from "react";
import { useRouter } from "next/router";
import CategoryFormPage from "@/components/admin/categories/CategoryFormPage";

const AdminCategoryCreatePage: React.FC = () => {
  const router = useRouter();

  const handleDone = () => {
    router.push("/admin/categories");
  };

  return (
    <CategoryFormPage
      mode="create"
      initialData={null}
      loading={false}
      onDone={handleDone}
    />
  );
};

export default AdminCategoryCreatePage;
