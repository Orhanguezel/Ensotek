import { AxiosRequestConfig } from 'axios';
import axios from '@/lib/axios';
import { CustomPage, CustomPageListParams, CustomPageListResponse } from './customPages.type';

export const customPagesService = {
  getAll: async (params?: CustomPageListParams, config?: AxiosRequestConfig): Promise<CustomPageListResponse> => {
    const response = await axios.get<CustomPage[] | CustomPageListResponse>('/custom_pages', { 
      params,
      ...config 
    });
    
    // Support both flat array and paginated response
    if (Array.isArray(response.data)) {
      return {
        data: response.data,
        meta: { total: response.data.length, page: 1, limit: response.data.length }
      };
    }
    
    return response.data; 
  },

  getBySlug: async (slug: string, config?: AxiosRequestConfig): Promise<CustomPage> => {
    const response = await axios.get<CustomPage>(`/custom_pages/by-slug/${slug}`, config);
    return response.data;
  },
};
