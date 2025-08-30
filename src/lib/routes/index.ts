const routes = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
  },

  dashboard: {
    statistics: "/",

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

    creators: {
      index: "/creators",
      edit: (id: number | string) => `/creators/${id}`,
    },
  },
};

export { routes };
