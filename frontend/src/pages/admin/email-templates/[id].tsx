// =============================================================
// FILE: src/pages/admin/email-templates/[id].tsx
// Ensotek – Admin Email Template Düzenleme Sayfası
// =============================================================

"use client";

import React from "react";
import { useRouter } from "next/router";
import { EmailTemplateFormPage } from "@/components/admin/email-templates/EmailTemplateFormPage";

const EmailTemplateEditPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id || typeof id !== "string") {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-warning mb-0">
          Geçersiz email template ID.
        </div>
      </div>
    );
  }

  return <EmailTemplateFormPage mode="edit" id={id} />;
};

export default EmailTemplateEditPage;
