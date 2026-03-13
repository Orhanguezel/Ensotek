type FallbackItem = {
  title: string;
  description: string;
};

type FallbackGalleryItem = FallbackItem & {
  imageSrc: string;
};

type LocaleKey = 'tr' | 'en';

const fallbackProducts: Record<LocaleKey, FallbackItem[]> = {
  tr: [
    {
      title: 'Kompozit Panel ve Muhafaza Cozumleri',
      description: 'Kabin, kapak ve muhafaza uygulamalarinda hafiflik, yuzey kalitesi ve dayanim beklentisini birlikte karsilayan panel tabanli cozumler.',
    },
    {
      title: 'Ozel Kalip, Numune ve Prototip Parcalar',
      description: 'Numune dogrulama, revizyon ve seri uretim oncesi proses testleri icin karbon fiber ve cam elyaf takviyeli prototip parcalar.',
    },
    {
      title: 'Endustriyel Tasiyici ve Koruyucu Bilesenler',
      description: 'Makine, enerji ve altyapi ekipmanlarinda kullanilmak uzere ozel olculu kompozit tasiyici, koruyucu ve servis kolayligi sunan bilesenler.',
    },
    {
      title: 'CTP Profil ve Hat Bilesenleri',
      description: 'Kimyasal dayanim, elektriksel yalitim ve dis ortam performansi gerektiren endustriyel hatlar icin CTP profil ve yardimci bilesen cozumleri.',
    },
  ],
  en: [
    {
      title: 'Composite Panel and Enclosure Solutions',
      description: 'Panel-based solutions for cabins, covers and housings where lightweighting, surface quality and durability must work together.',
    },
    {
      title: 'Custom Tooling, Sample and Prototype Parts',
      description: 'Carbon fiber and fiberglass reinforced prototype parts for sample validation, revisions and pre-production process checks.',
    },
    {
      title: 'Industrial Structural and Protective Parts',
      description: 'Custom-sized composite structural, protective and service-friendly parts for machinery, energy and infrastructure equipment.',
    },
    {
      title: 'FRP Profiles and Line Components',
      description: 'FRP profile and auxiliary component solutions for industrial lines that require chemical resistance, electrical insulation and outdoor durability.',
    },
  ],
};

const fallbackBlogPosts: Record<LocaleKey, FallbackItem[]> = {
  tr: [
    {
      title: 'Karbon Fiber ve Cam Elyaf Arasinda Malzeme Secimi',
      description: 'Maliyet, mukavemet, agirlik ve yuzey gereksinimine gore hangi kompozit yapinin daha uygun olduguna dair karar destekleyici karsilastirma.',
    },
    {
      title: 'Prototipten Seri Uretime Geciste Kritik Kontrol Noktalari',
      description: 'Kalip, numune dogrulama, tolerans ve proses tekrar edilebilirligi acisindan B2B projelerde dikkat edilmesi gereken temel kontrol basliklari.',
    },
    {
      title: 'Kompozit Parcalarda Yuzey Kalitesi ve Termin Dengesi',
      description: 'Yuzey beklentisi arttikca proses, maliyet ve termin planlamasinin nasil degistigine dair uygulama odakli notlar.',
    },
    {
      title: 'CTP ve Hibrit Yapilarda Uretim Rotasi Nasil Secilir?',
      description: 'Parca geometrisi, adet, servis ortami ve kalite beklentisine gore uygun uretim rotasini belirlerken degerlendirilmesi gereken noktalar.',
    },
  ],
  en: [
    {
      title: 'Choosing Between Carbon Fiber and Fiberglass',
      description: 'A decision-oriented comparison of cost, strength, weight and finish expectations when selecting the right composite structure.',
    },
    {
      title: 'Critical Checks from Prototype to Series Production',
      description: 'Key B2B checkpoints around tooling, sample validation, tolerances and repeatable production planning.',
    },
    {
      title: 'Balancing Surface Quality and Lead Time in Composite Parts',
      description: 'Application-focused notes on how finish requirements influence process design, cost and delivery planning.',
    },
    {
      title: 'How to Choose the Right FRP or Hybrid Production Route',
      description: 'What to evaluate across part geometry, quantity, service environment and quality targets when choosing the right production route.',
    },
  ],
};

const fallbackGalleries: Record<LocaleKey, FallbackGalleryItem[]> = {
  tr: [
    {
      title: 'Panel ve Muhafaza Uygulamalari',
      description: 'Yuzey kalitesi, hafiflik ve servis kolayligi gerektiren panel ve muhafaza cozumlerinden secilen uygulama ornekleri.',
      imageSrc: '/media/gallery-placeholder.svg',
    },
    {
      title: 'Prototip ve Numune Dogrulama',
      description: 'Numune revizyonu, kalip kontrolu ve seri uretim oncesi dogrulama asamalarini yansitan proje goruntuleri.',
      imageSrc: '/media/gallery-placeholder.svg',
    },
    {
      title: 'Hat ve Saha Bilesenleri',
      description: 'Enerji, altyapi ve makina uygulamalarinda kullanilan kompozit tasiyici ve koruyucu bilesenlerden secilen kareler.',
      imageSrc: '/media/gallery-placeholder.svg',
    },
  ],
  en: [
    {
      title: 'Panel and Enclosure Applications',
      description: 'Selected application visuals from panel and enclosure solutions that require finish quality, lightweighting and service access.',
      imageSrc: '/media/gallery-placeholder.svg',
    },
    {
      title: 'Prototype and Sample Validation',
      description: 'Project visuals reflecting sample revisions, tooling checks and pre-production validation stages.',
      imageSrc: '/media/gallery-placeholder.svg',
    },
    {
      title: 'Line and Field Components',
      description: 'Selected images from composite structural and protective components used in energy, infrastructure and machinery applications.',
      imageSrc: '/media/gallery-placeholder.svg',
    },
  ],
};

function normalizeLocale(locale: string): LocaleKey {
  return locale.startsWith('en') ? 'en' : 'tr';
}

export function getFallbackProducts(locale: string): FallbackItem[] {
  return fallbackProducts[normalizeLocale(locale)];
}

export function getFallbackBlogPosts(locale: string): FallbackItem[] {
  return fallbackBlogPosts[normalizeLocale(locale)];
}

export function getFallbackGalleries(locale: string): FallbackGalleryItem[] {
  return fallbackGalleries[normalizeLocale(locale)];
}
