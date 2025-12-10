// =============================================================
// FILE: src/pages/admin/email-templates/new.tsx
// Ensotek – Admin Email Template Oluşturma Sayfası
// =============================================================

"use client";

import React from "react";
import { EmailTemplateFormPage } from "@/components/admin/email-templates/EmailTemplateFormPage";

const EmailTemplateNewPage: React.FC = () => {
  return <EmailTemplateFormPage mode="create" />;
};

export default EmailTemplateNewPage;
