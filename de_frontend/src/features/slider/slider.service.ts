import api from '@/lib/axios';
import type { Slider } from './slider.type';

const BASE = '/sliders';

export const sliderService = {
  getAll: () => api.get<Slider[]>(BASE).then((r) => r.data),
  getByIdOrSlug: (v: string) => api.get<Slider>(`${BASE}/${v}`).then((r) => r.data),
};
