// =============================================================
// FILE: src/components/admin/services/serviceForm/serviceForm.types.ts
// Ensotek – Admin Service Form Types (FINAL)
// =============================================================

import type { AdminLocaleOption } from '@/components/common/AdminLocaleSelect';

export type ServiceFormValues = {
  id?: string;
  locale: string;

  // i18n
  name: string;
  slug: string;
  description: string;

  material: string;
  price: string;
  includes: string;
  warranty: string;
  image_alt: string;

  // i18n extras (services_i18n)
  tags: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;

  // parent
  category_id: string;
  sub_category_id: string;

  is_active: boolean;
  featured: boolean;
  display_order: string;

  // cover (string in UI)
  featured_image: string;
  image_url: string;
  image_asset_id: string;

  // teknik
  area: string;
  duration: string;
  maintenance: string;
  season: string;
  equipment: string;

  // i18n ops
  replicate_all_locales: boolean;
  apply_all_locales: boolean;
};

export type ServiceFormProps = {
  mode: 'create' | 'edit';
  initialData?: import('@/integrations/types/services.types').ServiceDto;
  loading: boolean;
  saving: boolean;

  locales: AdminLocaleOption[];
  localesLoading?: boolean;

  defaultLocale?: string;

  // submit payload UI'dan türetilir (null-safe normalize edildiği için any bırakmak OK)
  onSubmit: (values: any) => void | Promise<void>;

  onCancel?: () => void;
  onLocaleChange?: (locale: string) => void;
};
