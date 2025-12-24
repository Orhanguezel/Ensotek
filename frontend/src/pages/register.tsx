'use client';

import React, { useMemo } from 'react';
import Register from '@/components/containers/auth/Register';

import { useResolvedLocale } from '@/i18n/locale';
import { useUiSection } from '@/i18n/uiDb';

const toLocaleShort = (l: unknown) =>
  String(l || 'tr')
    .trim()
    .toLowerCase()
    .split('-')[0] || 'tr';

const RegisterPage: React.FC = () => {
  const resolvedLocale = useResolvedLocale();
  const locale = useMemo(() => toLocaleShort(resolvedLocale), [resolvedLocale]);

  const { ui } = useUiSection('ui_auth', locale);

  // Layout kaldırıldığı için şimdilik sadece hesaplanıyor (istersen next/head ile basarız)
  void ui('ui_auth_register_meta_title', 'Sign Up | Ensotek');
  void ui('ui_auth_register_meta_description', 'Create your Ensotek account.');

  return <Register />;
};

export default RegisterPage;
