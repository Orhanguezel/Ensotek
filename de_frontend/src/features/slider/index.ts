export interface Slider {
  id: string;
  title: string;
  description: string;
  image_url: string;
  button_text?: string;
  button_url?: string;
  order: number;
}

export const sliderService = {
  getAll: async (): Promise<Slider[]> => {
    // const response = await import('@/lib/axios').then(m => m.default.get<Slider[]>('/sliders'));
    // return response.data;
    return [];
  }
};

import { useQuery } from '@tanstack/react-query';

export const useSliders = () => {
    return useQuery({
        queryKey: ['sliders'],
        queryFn: sliderService.getAll,
        initialData: []
    });
};
