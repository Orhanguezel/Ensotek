// Backend: references + references_i18n + reference_images + reference_images_i18n
export interface Reference {
  id: string;
  is_published: boolean;
  is_featured: boolean;
  display_order: number;
  featured_image: string | null;
  featured_image_asset_id: string | null;
  website_url: string | null;
  category_id: string | null;
  sub_category_id: string | null;
  // i18n
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  featured_image_alt: string | null;
  meta_title: string | null;
  meta_description: string | null;
  locale: string;
  created_at: string;
  updated_at: string;
  // optional relation
  images?: ReferenceImage[];
}

export interface ReferenceImage {
  id: string;
  reference_id: string;
  asset_id: string;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
  // i18n
  alt: string | null;
  caption: string | null;
  created_at: string;
  updated_at: string;
}
