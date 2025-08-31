//api end points
export const endPoints = {
  global: {
    getStoresDDL: `catalog/api/hub/store/ddl`,
    getGroupsDDL: `api/hub/Users/roles/store-level/groups-dll`,
    getCityGroupsDDL: `api/hub/Users/roles/city-level/groups-dll`,
    getCityDDL: `catalog/api/hub/City/ddl`,
    getCategoriesDDL: `catalog/api/hub/Category/all-categories/ddl`,
    getSupplierDDL: `catalog/api/hub/productDetails/e-suppliers/status`,
    getBrandsDDL: `catalog/api/hub/brand/list`,
    getFlatCategoriesDDL: `catalog/api/hub/Category/all`,
  },
  // Dashboard
  dashboard: {
    getMetaBase: `ordering/api/Metabase/dashboard-url`,
  },
  //auth
  identity: {
    getLoginUser: `api/hub/login`,
    registerUser: `app/register`,
    addCompanyAccount: `app/company`,
    forgetPassword: `app/forget-password`,
    resetPassword: `app/reset-password`,
    verifyToken: `app/verify`,
    sendEmailToVerify: `app/send-verification-email`,
  },
  // Users
  user: {
    getAll: "api/hub/users/list",
    getByID: "api/hub/users/{0}",
    getAssignedRoleByID: "api/hub/Users/{0}/roles/store-level",
    assignGroupToStore: "api/hub/Users/roles/store-level/assign/{0}",
    removeRole: "api/hub/Users/{0}/roles/store-level/remove/{1}",
    getUserTransactions: "api/hub/Wallet/{0}/transactions",
    getUserBalance: "api/hub/wallet/{0}/balance",
    assignCityToUser: "api/hub/Users/roles/city-level/assign/{0}",
    removeAssignedCity: "api/hub/Users/roles/city-level/assign/{0}",
    deductUserBalance: "api/hub/Wallet/{0}/deduct-balance",
    addUserBalance: "api/hub/Wallet/{0}/add-balance",
    blockUser: "api/hub/users/{0}/block",
    resetPassword: "api/hub/users/{0}/reset-password",
    changePassword: "api/account/change-password",
  },
  // Permissions
  permissions: {
    getAllPermissions: `api/hub/Permissions/all`,
    getGroupsList: `api/hub/Permissions/groups`,
    getGroupNameById: `api/hub/permissions/{0}/group/permissions`,
    removePermission: `api/hub/Permissions/{0}/remove-permission`,
    addNewPermission: `api/hub/Permissions/add-permission`,
    getGroupDetailsById: `api/hub/Permissions/{0}/group/permissions`,
    assignActionsToGroup: `api/hub/Permissions/group/{0}/assign-permissions`,
    getCurrentUserPermissions: `api/hub/Account/current-permissions`,
  },

  // Creators
  creators: {
    getAll: "api/hub/creators/list",
    getById: "api/hub/creators/{0}/overview",
    getCreatorProduct: "api/hub/creators/{0}/products",
    getCreatorCustomers: "api/hub/creators/{0}/customers",
    impersonateCreator: "api/hub/creators/{0}/impersonate",
  },
  payments: {
    getCreatorUserPayments: "api/hub/payments/user-creator",
    getPendingPayments: "api/hub/payments/payouts/pending",
    getSubscriptionBilling: "api/hub/payments/creator/subscriptions",
    settlementLog: "api/hub/payments/settlements",
    updatePayouts: "api/hub/payments/creator/payout",
  },
};
