// Backend: sliders endpoint
export interface Slider {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  alt: string | null;
  buttonText: string | null;
  buttonLink: string | null;
  isActive: boolean;
  order: number;
  priority: string;
  showOnMobile: boolean;
  showOnDesktop: boolean;
  locale: string;
}
