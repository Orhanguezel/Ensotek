'use client';

import React from 'react';
import Layout from '@/components/layout/Layout';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function LocaleNotFound() {
  const t = useTranslations('ensotek.notFoundPage');

  return (
    <Layout header={1} footer={1}>
      <div className="pt-120 pb-120">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-6 text-center">
              <h1 className="display-1 fw-bold" style={{ fontSize: '8rem', color: 'var(--clr-theme-1)' }}>
                404
              </h1>
              <h2 className="mb-4">{t('title')}</h2>
              <p className="mb-5 text-muted">{t('description')}</p>
              <Link
                href="/"
                className="border-btn text-dark border border-dark text-center ms-3 borderc-btn d-inline-flex"
              >
                {t('backToHome')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
