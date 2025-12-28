'use client';

import React from 'react';
import Login from '@/components/containers/auth/Login';

import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';

const LoginPage: React.FC = () => {
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_auth', locale as any);

  // Layout kaldırıldığı için şimdilik sadece hesaplanıyor (istersen next/head ile basarız)
  void ui('ui_auth_login_meta_title', 'Sign In | Ensotek');
  void ui('ui_auth_login_meta_description', 'Sign in to your Ensotek account.');

  return <Login />;
};

export default LoginPage;
