export const adminApiRoutes = Object.freeze({
  auth: {
    login: "/api/admin/auth/login",
    logout: "/api/admin/auth/logout",
    refreshToken: "/api/admin/auth/refresh-token",
  },
  category: {
    base: "/api/admin/category",
    create: "/api/admin/category/create",
    update: (id: string) => `/api/admin/category/update/${id}`,
    toggle: (id: string) => `/api/admin/category/toggle/${id}`,
  },
  brand: {
    base: "/api/admin/brand",
    create: "/api/admin/brand/create",
    update: (id: string) => `/api/admin/brand/update/${id}`,
    toggle: (id: string) => `/api/admin/brand/toggle/${id}`,
  },
  product: {
    base: "/api/admin/product",
    create: "/api/admin/product/create",
    update: (id: string) => `/api/admin/product/update/${id}`,
    toggle: (id: string) => `/api/admin/product/toggle/${id}`,
    getById: (id: string) => `/api/admin/product/${id}`,
    addVariant: (id: string) => `/api/admin/product/${id}/variant/add`,
    updateVariant: (productId: string, variantId: string) =>
      `/api/admin/product/${productId}/variant/update/${variantId}`,
    toggleVariant: (productId: string, variantId: string) =>
      `/api/admin/product/${productId}/variant/toggle/${variantId}`,
  },
  order: {
    base: "/api/admin/order",
    getById: (id: string) => `/api/admin/order/${id}`,
    updateStatus: (id: string) => `/api/admin/order/status/${id}`,
    approvePayment: (id: string) => `/api/admin/order/approve-payment/${id}`,
    rejectPayment: (id: string) => `/api/admin/order/reject-payment/${id}`,
    pendingPayments: "/api/admin/order/pending-payments",
    createManual: "/api/admin/order/manual/create",
  },
  purchaseDetail: {
    base: "/api/admin/purchase-details",
    create: "/api/admin/purchase-details/create",
    update: (id: string) => `/api/admin/purchase-details/update/${id}`,
    delete: (id: string) => `/api/admin/purchase-details/delete/${id}`,
  },
  user: {
    base: "/api/admin/users",
    getById: (id: string) => `/api/admin/users/${id}`,
    block: (id: string) => `/api/admin/users/block/${id}`,
    unblock: (id: string) => `/api/admin/users/unblock/${id}`,
    getOrders: (id: string) => `/api/admin/users/${id}/orders`,
  },
  storeConfig: {
    get: "/api/admin/store-config",
    update: "/api/admin/store-config/update",
  },
  analytics: {
    overview: "/api/admin/analytics/overview",
    salesChart: "/api/admin/analytics/sales-chart",
    dailySales: "/api/admin/analytics/daily-sales",
    topProducts: "/api/admin/analytics/top-products",
    orderStatus: "/api/admin/analytics/order-status",
    paymentStatus: "/api/admin/analytics/payment-status",
    recentOrders: "/api/admin/analytics/recent-orders",
  },
});

export const sidebarMenus = [
  { name: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },
  { name: "Categories", path: "/categories", icon: "Tag" },
  { name: "Brands", path: "/brands", icon: "Bookmark" },
  { name: "Products", path: "/products", icon: "Package" },
  { name: "Orders", path: "/orders", icon: "ShoppingBag" },
  { name: "Users", path: "/users", icon: "Users" },
  { name: "Purchase Details", path: "/purchase-details", icon: "ReceiptText" },
  { name: "Store Config", path: "/store-config", icon: "Settings" },
] as const;
