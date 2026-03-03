import axios from '@/lib/axios';
import { Product, ProductDetailParams, ProductListParams, ProductListResponse } from './products.type';

function toProductListResponse(payload: Product[] | ProductListResponse): ProductListResponse {
  if (Array.isArray(payload)) {
    return {
      data: payload,
      total: payload.length,
      page: 1,
      limit: payload.length,
      totalPages: 1,
    };
  }

  if (!payload || !Array.isArray(payload.data)) {
    return { data: [], total: 0, page: 1, limit: 0, totalPages: 0 };
  }

  return payload;
}

export const productsService = {
  getAll: async (params?: ProductListParams): Promise<ProductListResponse> => {
    const response = await axios.get<Product[] | ProductListResponse>('/products', { params });
    return toProductListResponse(response.data);
  },

  getBySlug: async (slug: string, params?: ProductDetailParams): Promise<Product> => {
    const response = await axios.get<Product>(`/products/by-slug/${slug}`, { params });
    return response.data;
  },

  getFeatured: async (): Promise<Product[]> => {
    const response = await axios.get<Product[]>('/products', { 
        params: { is_featured: true, limit: 10 } 
    });
    // Backend returns flat array, not paginated
    return Array.isArray(response.data) ? response.data : (response.data as any).data || [];
  },

  getById: async (id: string, params?: ProductDetailParams): Promise<Product> => {
    const response = await axios.get<Product>(`/products/id/${id}`, { params });
    return response.data;
  },

  getFaqs: async (params: any): Promise<any> => {
    const response = await axios.get('/product_faqs', { params });
    return response.data;
  },

  getSpecs: async (params: any): Promise<any> => {
    const response = await axios.get('/product_specs', { params });
    return response.data;
  },

  getReviews: async (params: any): Promise<any> => {
    const response = await axios.get('/product_reviews', { params });
    return response.data;
  }
};
