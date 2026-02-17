import React from "react";
import type { Metadata } from "next";
import Layout from "@/components/layout/Layout";
import ContactPage from "@/components/containers/contact/ContactPage";

export const metadata: Metadata = {
  title: "Contact | Ensotek",
};

export default function ContactRoutePage() {
  return (
    <Layout header={1} footer={1}>
      <ContactPage />
    </Layout>
  );
}
