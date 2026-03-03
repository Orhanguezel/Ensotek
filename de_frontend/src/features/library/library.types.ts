export interface LibraryItem {
  id: string;
  type: string;
  category_id?: string;
  sub_category_id?: string;
  
  name: string;
  slug: string;
  description?: string;
  
  image_url?: string;
  featured_image?: string;
  
  file_url?: string;
  download_count: number;
  views: number;
  
  published_at?: string;
  created_at: string;
}

export interface LibraryFile {
    id: string;
    library_id: string;
    name: string;
    file_url: string;
    size_bytes?: number;
    mime_type?: string;
    display_order: number;
}

export interface LibraryImage {
    id: string;
    library_id: string;
    image_url: string;
    title?: string;
    alt?: string;
    display_order: number;
}

export interface LibraryListParams {
    page?: number;
    limit?: number;
    category_id?: string;
    search?: string;
    type?: string;
}

export interface LibraryListResponse {
    data: LibraryItem[];
    meta: {
        total: number;
        page: number;
        limit: number;
    };
}

export type LibraryListResult = LibraryListResponse | LibraryItem[];
