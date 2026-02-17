import React from "react";
import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { AVAILABLE_LOCALES, getLocaleMessages } from "../../i18n/locales";
import { getRuntimeLocaleSettings } from "../../i18n/locale-settings";

import { AosProvider } from '@/providers/AosProvider';
import { AppProviders } from '@/providers/AppProviders';
import { StackableWidgets } from '@/features/catalog';

// Global Styles
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/index-four.scss";
import "@/styles/main.scss";

export const metadata: Metadata = {
  title: "Ensotek",
  description: "Ensotek B2B Portal",
  icons: {
    icon: "/favicon.ico",
  },
};

export function generateStaticParams() {
  return AVAILABLE_LOCALES.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  const { activeLocales } = await getRuntimeLocaleSettings();
  if (!activeLocales.includes(locale)) notFound();

  setRequestLocale(locale);

  const messages = getLocaleMessages(locale);

  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <head>
        <link rel="stylesheet" href="/app/css/fontawesome-pro.css" />
      </head>
      <body suppressHydrationWarning={true}>
        <NextIntlClientProvider locale={locale} messages={messages}>
           <AppProviders>
              <AosProvider>
                {children}
                <StackableWidgets />
              </AosProvider>
           </AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
