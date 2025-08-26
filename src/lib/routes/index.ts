const routes = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
  },

  dashboard: {
    statistics: "/",
    sliders: {
      index: "/sliders",
      create: "/slider/create",
      show: (id: number | string) => `/sliders/${id}`,
    },
    stores: {
      index: "/stores",
      create: "/stores/create",
      show: (id: number | string) => `/stores/${id}`,
    },
    categories: {
      index: "/categories",
      create: "/category/create",
      show: (id: number | string) => `/category/${id}`,
    },
    categoriesNoraml: {
      index: "/categories?type=0",
      create: "/category/create",
      show: (id: number | string) => `/category/${id}`,
    },
    categoryExplorer: {
      index: "/category-explorer",
    },
    products: {
      index: "/products",
      create: "/products/create",
      edit: (id: number | string) => `/products/${id}`,
      bulkUpload: "/bulk/products",
    },
    brands: {
      index: "/brands",
      create: "/brands/create",
      edit: (id: number | string) => `/brands/${id}`,
      bulkUpload: "/bulk/brands",
    },
    suppliers: {
      index: "/suppliers",
    },
    customers: {
      index: "/customers",
      create: "/customers/create",
      edit: (id: number | string) => `/customers/${id}`,
    },
    permissions: {
      index: "/permissions",
      page: {
        index: "/permissions/pages",
        create: "/permissions/pages/create",
        edit: (id: number | string) => `/permissions/pages/${id}`,
      },
      group: {
        index: "/permissions/groups",
        create: "/permissions/groups/create",
        edit: (id: number | string) => `/permissions/groups/${id}`,
      },
      create: "/permissions/create",
      edit: (id: number | string) => `/permissions/${id}`,
    },
    users: {
      index: "/users",
      create: "/users/create",
      edit: (id: number | string) => `/users/${id}`,
    },
    hubUsers: {
      index: "/hub-users",
    },
    coupons: {
      index: "/coupons",
      create: "/coupons/create",
      edit: (id: number | string) => `/coupons/${id}`,
    },
    invnetory: {
      index: "/inventory",
      bulkCreate: "/bulk/inventory/create",
      bulkInventory: "/bulk/inventory",
    },
    offers: {
      index: "/bulk/offers",
      create: "/bulk/offers/create",
    },
    orders: {
      index: "/orders",
      confirm: "/orders/unverify-order",
      create: "/orders/create",
      edit: (id: number | string) => `/orders/${id}`,
    },
    map: {
      index: "/map-master",
    },
    dropbox: {
      index: "/dropbox",
      create: "/dropbox/create",
    },
    timeSlots: {
      index: "/time-slots",
      create: "/time-slots/create",
      edit: (id: number | string) => `/time-slots/${id}`,
    },
  },

  externalLinks: {
    discord: "https://discord.com/invite/S6TZxycVHs",
    purchase: "https://daisyui.com/store/",
    daisyui: "https://daisyui.com",
  },
};

export { routes };
