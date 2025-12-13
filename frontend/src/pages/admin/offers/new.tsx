// =============================================================
// FILE: src/pages/admin/offer/new.tsx
// Ensotek – Offer Admin Create Page
// =============================================================

"use client";

import React from "react";
import { OfferFormPage } from "@/components/admin/offer/OfferFormPage";

const OfferCreatePage: React.FC = () => {
  return <OfferFormPage mode="create" />;
};

export default OfferCreatePage;
