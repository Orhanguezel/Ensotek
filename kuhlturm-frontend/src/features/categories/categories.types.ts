export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url?: string;
  icon?: string;
  parent_id?: string;
  children?: Category[];
}

export interface CategoryListResponse {
  data: Category[];
  total: number;
}
