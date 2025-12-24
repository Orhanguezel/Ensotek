'use client';

import React, { useMemo } from 'react';
import Logout from '@/components/containers/auth/Logout';

import { useResolvedLocale } from '@/i18n/locale';
import { useUiSection } from '@/i18n/uiDb';

const toLocaleShort = (l: unknown) =>
  String(l || 'tr')
    .trim()
    .toLowerCase()
    .split('-')[0] || 'tr';

const LogoutPage: React.FC = () => {
  const resolvedLocale = useResolvedLocale();
  const locale = useMemo(() => toLocaleShort(resolvedLocale), [resolvedLocale]);

  const { ui } = useUiSection('ui_auth', locale);

  // Layout kaldırıldığı için şimdilik sadece hesaplanıyor (istersen next/head ile basarız)
  void ui('ui_auth_logout_meta_title', 'Signing out | Ensotek');
  void ui('ui_auth_logout_meta_description', 'Signing you out of your Ensotek account.');

  return <Logout />;
};

export default LogoutPage;
