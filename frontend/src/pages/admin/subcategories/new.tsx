// =============================================================
// FILE: src/pages/admin/subcategories/new.tsx
// Ensotek – Yeni Alt Kategori Oluşturma Sayfası
// =============================================================

"use client";

import React from "react";
import { useRouter } from "next/router";
import SubCategoryFormPage from "@/components/admin/subcategories/SubCategoryFormPage";

const AdminSubCategoryCreatePage: React.FC = () => {
  const router = useRouter();

  const handleDone = () => {
    router.push("/admin/subcategories");
  };

  return (
    <SubCategoryFormPage
      mode="create"
      initialData={null}
      loading={false}
      onDone={handleDone}
    />
  );
};

export default AdminSubCategoryCreatePage;
