export const ROUTES = {
  // Public Routes
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact",
  
  // Resources
  SERVICES: {
    ROOT: "/service",
    DETAIL: (slug: string) => `/service/${slug}`,
  },
  
  PRODUCTS: {
    ROOT: "/product",
    DETAIL: (slug: string) => `/product/${slug}`,
    CATEGORY: (slug: string) => `/product/category/${slug}`,
  },

  PROJECTS: {
    ROOT: "/project",
    DETAIL: (slug: string) => `/project/${slug}`,
  },
  
  BLOG: {
    ROOT: "/blog",
    DETAIL: (slug: string) => `/blog/${slug}`,
  },

  REFERENCES: {
    ROOT: "/references",
    DETAIL: (slug: string) => `/references/${slug}`,
  },

  PAGES: {
    DETAIL: (slug: string) => `/page/${slug}`,
  },

  ANALYSIS: "/analys",
  TEAM: "/team",
  TECHNICAL: "/technical",

  // Auth Routes
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    LOGOUT: "/logout",
    FORGOT_PASSWORD: "/contact",
    RESET_PASSWORD: "/login",
    VERIFY_EMAIL: "/login",
  },

  // User Profile
  PROFILE: {
    DASHBOARD: "/profile",
    ORDERS: "/profile/orders",
    SETTINGS: "/profile/settings",
    SUPPORT: "/profile/support",
  },

  // Admin Routes
  ADMIN: {
    DASHBOARD: "/admin",
    
    // Content Management
    SERVICES: {
      ROOT: "/admin/services",
      NEW: "/admin/services/new",
      EDIT: (id: string) => `/admin/services/${id}/edit`,
    },
    PRODUCTS: {
      ROOT: "/admin/products",
      NEW: "/admin/products/new",
      EDIT: (id: string) => `/admin/products/${id}/edit`,
    },
    CATEGORIES: {
      ROOT: "/admin/categories",
      NEW: "/admin/categories/new",
      EDIT: (id: string) => `/admin/categories/${id}/edit`,
    },
    SLIDERS: {
      ROOT: "/admin/sliders",
    },
    BLOG: {
      ROOT: "/admin/blog",
    },
    PAGES: {
      ROOT: "/admin/pages",
    },

    // Business
    OFFERS: {
      ROOT: "/admin/offers",
      DETAIL: (id: string) => `/admin/offers/${id}`,
    },
    CATALOG_REQUESTS: "/admin/catalog-requests",
    
    // User Relationship
    USERS: {
      ROOT: "/admin/users",
      DETAIL: (id: string) => `/admin/users/${id}`,
    },
    CONTACTS: "/admin/contacts",
    NEWSLETTER: "/admin/newsletter",
    REVIEWS: "/admin/reviews",
    SUPPORT_TICKETS: "/admin/support-tickets",

    // System
    SETTINGS: "/admin/settings",
    LOGS: "/admin/logs",
    FILE_MANAGER: "/admin/library",
  },
};
