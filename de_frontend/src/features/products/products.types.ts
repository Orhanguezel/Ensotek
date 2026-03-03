import { Category } from '../categories/categories.types';

export interface Product {
    id: string;
    slug: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    images: ProductImage[];
    category?: Category;
    category_id: string;
    is_featured: boolean;
    specs?: ProductSpec[];
}

export interface ProductImage {
    id: string;
    url: string;
    alt?: string;
    is_primary: boolean;
}

export interface ProductSpec {
    key: string;
    value: string;
}

export interface ProductListParams {
    page?: number;
    limit?: number;
    category_slug?: string;
    search?: string;
    sort?: string;
}

export interface ProductListResponse {
    data: Product[];
    meta: {
        total: number;
        page: number;
        limit: number;
        total_pages: number;
    };
}
