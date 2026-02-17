// Backend: library + library_i18n + library_images + library_images_i18n + library_files
export interface LibraryItem {
  id: string;
  type: string;              // 'catalog' | 'manual' | 'brochure' | 'other'
  category_id: string | null;
  sub_category_id: string | null;
  featured: boolean;
  is_published: boolean;
  is_active: boolean;
  display_order: number;
  featured_image: string | null;
  image_url: string | null;
  image_asset_id: string | null;
  views: number;
  download_count: number;
  published_at: string | null;
  // i18n
  slug: string;
  name: string;
  description: string | null;
  image_alt: string | null;
  tags: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  locale: string;
  created_at: string;
  updated_at: string;
}

export interface LibraryImage {
  id: string;
  library_id: string;
  image_asset_id: string | null;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
  // i18n
  title: string | null;
  alt: string | null;
  caption: string | null;
  created_at: string;
  updated_at: string;
}

export interface LibraryFile {
  id: string;
  library_id: string;
  asset_id: string | null;
  file_url: string | null;
  name: string;
  size_bytes: number | null;
  mime_type: string | null;
  tags_json: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
