'use client';

import React, { useMemo } from 'react';
import Login from '@/components/containers/auth/Login';

import { useResolvedLocale } from '@/i18n/locale';
import { useUiSection } from '@/i18n/uiDb';

const toLocaleShort = (l: unknown) =>
  String(l || 'de')
    .trim()
    .toLowerCase()
    .split('-')[0] || 'de';

const LoginPage: React.FC = () => {
  const resolvedLocale = useResolvedLocale();
  const locale = useMemo(() => toLocaleShort(resolvedLocale), [resolvedLocale]);

  const { ui } = useUiSection('ui_auth', locale);

  // Layout kaldırıldığı için şimdilik sadece hesaplanıyor (istersen next/head ile basarız)
  void ui('ui_auth_login_meta_title', 'Sign In | Ensotek');
  void ui('ui_auth_login_meta_description', 'Sign in to your Ensotek account.');

  return <Login />;
};

export default LoginPage;
