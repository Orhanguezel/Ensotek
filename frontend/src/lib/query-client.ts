// =============================================================
// lib/query-client.ts — TanStack Query v5 config
// =============================================================

import { QueryClient, defaultShouldDehydrateQuery, isServer } from '@tanstack/react-query';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 min default
        gcTime: 5 * 60 * 1000, // 5 min garbage collection
        retry: 1,
        refetchOnWindowFocus: false,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/**
 * Returns the same QueryClient instance on the browser,
 * but creates a new one for every SSR request.
 */
export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}

// ── Query key factories ──────────────────────────────────────

export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
    status: () => [...queryKeys.auth.all, 'status'] as const,
  },
  profiles: {
    all: ['profiles'] as const,
    me: () => [...queryKeys.profiles.all, 'me'] as const,
  },
  siteSettings: {
    all: ['siteSettings'] as const,
    list: () => [...queryKeys.siteSettings.all, 'list'] as const,
    byKey: (key: string) => [...queryKeys.siteSettings.all, key] as const,
    locales: () => [...queryKeys.siteSettings.all, 'locales'] as const,
    defaultLocale: () => [...queryKeys.siteSettings.all, 'defaultLocale'] as const,
  },
  menuItems: {
    all: ['menuItems'] as const,
    list: () => [...queryKeys.menuItems.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.menuItems.all, id] as const,
  },
  slider: {
    all: ['slider'] as const,
    list: () => [...queryKeys.slider.all, 'list'] as const,
    detail: (idOrSlug: string) => [...queryKeys.slider.all, idOrSlug] as const,
  },
  categories: {
    all: ['categories'] as const,
    list: (params?: Record<string, unknown>) => [...queryKeys.categories.all, 'list', params] as const,
    detail: (id: string) => [...queryKeys.categories.all, id] as const,
    bySlug: (slug: string) => [...queryKeys.categories.all, 'slug', slug] as const,
  },
  subcategories: {
    all: ['subcategories'] as const,
    list: (params?: Record<string, unknown>) => [...queryKeys.subcategories.all, 'list', params] as const,
    detail: (id: string) => [...queryKeys.subcategories.all, id] as const,
    bySlug: (slug: string) => [...queryKeys.subcategories.all, 'slug', slug] as const,
  },
  products: {
    all: ['products'] as const,
    list: (params?: Record<string, unknown>) => [...queryKeys.products.all, 'list', params] as const,
    detail: (idOrSlug: string, params?: Record<string, unknown>) =>
      [...queryKeys.products.all, idOrSlug, params] as const,
    bySlug: (slug: string, params?: Record<string, unknown>) =>
      [...queryKeys.products.all, 'slug', slug, params] as const,
    faqs: (productId: string) => [...queryKeys.products.all, productId, 'faqs'] as const,
    specs: (productId: string) => [...queryKeys.products.all, productId, 'specs'] as const,
    reviews: (productId: string) => [...queryKeys.products.all, productId, 'reviews'] as const,
    images: (productId: string) => [...queryKeys.products.all, productId, 'images'] as const,
  },
  reviews: {
    all: ['reviews'] as const,
    list: (params?: Record<string, unknown>) => [...queryKeys.reviews.all, 'list', params] as const,
    detail: (id: string) => [...queryKeys.reviews.all, id] as const,
  },
  customPages: {
    all: ['customPages'] as const,
    list: (params?: Record<string, unknown>) => [...queryKeys.customPages.all, 'list', params] as const,
    detail: (id: string) => [...queryKeys.customPages.all, id] as const,
    bySlug: (slug: string) => [...queryKeys.customPages.all, 'slug', slug] as const,
  },
  faqs: {
    all: ['faqs'] as const,
    list: (params?: Record<string, unknown>) => [...queryKeys.faqs.all, 'list', params] as const,
    detail: (id: string) => [...queryKeys.faqs.all, id] as const,
    bySlug: (slug: string) => [...queryKeys.faqs.all, 'slug', slug] as const,
  },
  services: {
    all: ['services'] as const,
    list: (params?: Record<string, unknown>) => [...queryKeys.services.all, 'list', params] as const,
    detail: (id: string) => [...queryKeys.services.all, id] as const,
    bySlug: (slug: string) => [...queryKeys.services.all, 'slug', slug] as const,
    images: (serviceId: string) => [...queryKeys.services.all, serviceId, 'images'] as const,
  },
  references: {
    all: ['references'] as const,
    list: (params?: Record<string, unknown>) => [...queryKeys.references.all, 'list', params] as const,
    detail: (id: string) => [...queryKeys.references.all, id] as const,
    bySlug: (slug: string) => [...queryKeys.references.all, 'slug', slug] as const,
  },
  footerSections: {
    all: ['footerSections'] as const,
    list: () => [...queryKeys.footerSections.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.footerSections.all, id] as const,
    bySlug: (slug: string) => [...queryKeys.footerSections.all, 'slug', slug] as const,
  },
  library: {
    all: ['library'] as const,
    list: (params?: Record<string, unknown>) => [...queryKeys.library.all, 'list', params] as const,
    detail: (id: string) => [...queryKeys.library.all, id] as const,
    bySlug: (slug: string) => [...queryKeys.library.all, 'slug', slug] as const,
    images: (libraryId: string) => [...queryKeys.library.all, libraryId, 'images'] as const,
    files: (libraryId: string) => [...queryKeys.library.all, libraryId, 'files'] as const,
  },
  notifications: {
    all: ['notifications'] as const,
    list: () => [...queryKeys.notifications.all, 'list'] as const,
    unreadCount: () => [...queryKeys.notifications.all, 'unreadCount'] as const,
  },
  support: {
    all: ['support'] as const,
    tickets: (params?: Record<string, unknown>) => [...queryKeys.support.all, 'tickets', params] as const,
    ticket: (id: string) => [...queryKeys.support.all, 'ticket', id] as const,
    replies: (ticketId: string) => [...queryKeys.support.all, 'replies', ticketId] as const,
  },
  chat: {
    all: ['chat'] as const,
    threads: (params?: Record<string, unknown>) => [...queryKeys.chat.all, 'threads', params] as const,
    messages: (threadId: string, params?: Record<string, unknown>) =>
      [...queryKeys.chat.all, 'messages', threadId, params] as const,
  },
  chatAdmin: {
    all: ['chatAdmin'] as const,
    threads: (params?: Record<string, unknown>) => [...queryKeys.chatAdmin.all, 'threads', params] as const,
    messages: (threadId: string, params?: Record<string, unknown>) =>
      [...queryKeys.chatAdmin.all, 'messages', threadId, params] as const,
  },
  offers: {
    all: ['offers'] as const,
  },
  catalog: {
    all: ['catalog'] as const,
  },
  storage: {
    all: ['storage'] as const,
  },
} as const;
