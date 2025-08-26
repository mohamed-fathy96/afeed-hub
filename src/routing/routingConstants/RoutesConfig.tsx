import React from "react";
import PublicRouteGuard from "../guards/PublicRouteGuard";
// import PrivateRouteGuard from "../guards/PrivateRouteGuard";
//urls
//pages
import LoginPage from "@app/pages/login";
import DashboardPage from "@app/pages/dashboard";
import { routes } from "@app/lib/routes";
import CategoriesPage from "@app/pages/categories";
import EditCategoryPage from "@app/pages/categories/edit";
import CreateCategoryPage from "@app/pages/categories/create";
import SlidersPage from "@app/pages/sliders";
import EditSliderPage from "@app/pages/sliders/edit";
import CreateSliderPage from "@app/pages/sliders/create";
import StoresPage from "@app/pages/stores";
import EditStorePage from "@app/pages/stores/edit";
import CreateStorePage from "@app/pages/stores/create";
import {
  GroupPermissionsPage,
  PagePermissionsPage,
} from "@app/pages/permissions";
import RestrictedRouteGuard from "../guards/RestrictedRouteGuard";
import EditGroupPage from "@app/pages/permissions/groupPermissions/actions/EditGroup";
import UsersPage from "@app/pages/users";
import EditUserPage from "@app/pages/users/edit";
import CouponsPage from "@app/pages/coupons";
import EditCouponPage from "@app/pages/coupons/edit";
import CreateCouponPage from "@app/pages/coupons/create";
import InvnetoryUploadPage from "@app/pages/inventory-bulk/upload-inventory";
import ProductsPage from "@app/pages/products";
import EditProductPage from "@app/pages/products/edit";
import CreateProductPage from "@app/pages/products/create";
import OffersPage from "@app/pages/offers";
import OffersUploadPage from "@app/pages/offers/upload-offers";
import OrdersPage from "@app/pages/orders";
import InventoryBulkPage from "@app/pages/inventory-bulk";
import InventoryPage from "@app/pages/invnetory";
import ProductUploadPage from "@app/pages/products/upload-products";
import ConfirmationOrderPage from "@app/pages/orders/not-confirmed";
import MapMaster from "@app/pages/map-master";
import DropboxPage from "@app/pages/dropbox";
import ESupplierPage from "@app/pages/e-suppliers";
import { OrderDetailsPage } from "@app/pages/orders/details";
import TimeSlotsPage from "@app/pages/timeSlots";
import { EditTimeSlotPage } from "@app/pages/timeSlots/actions/EditTimeSlot";
import { AddTimeSlotPage } from "@app/pages/timeSlots/actions/AddTimeSlot";
import HubUsersPage from "@app/pages/users/hubUsers";
import BrandsPage from "@app/pages/brands";
import EditBrandPage from "@app/pages/brands/edit";
import CreateBrandPage from "@app/pages/brands/create";
import CategoryExplorer from "@app/pages/category-explorer";
import { CreateOrderPage } from "@app/pages/orders/create";

const publicRoutes = [
  {
    element: (
      <PublicRouteGuard restricted>
        <LoginPage />
      </PublicRouteGuard>
    ),
    path: routes.auth.login,
  },
];
const privateRoutes = [
  {
    element: (
      <RestrictedRouteGuard requiredPermissions="dashboard">
        <DashboardPage />
      </RestrictedRouteGuard>
    ),
    path: () => routes.dashboard.statistics,
  },
  {
    element: (
      <RestrictedRouteGuard requiredPermissions="categories">
        <CategoriesPage />
      </RestrictedRouteGuard>
    ),
    path: () => routes.dashboard.categories.index,
  },
  {
    element: (
      <RestrictedRouteGuard requiredPermissions="categories">
        <EditCategoryPage />
      </RestrictedRouteGuard>
    ),
    path: (id: string) => routes.dashboard.categories.show(id),
  },
  {
    element: (
      <RestrictedRouteGuard requiredPermissions="categories">
        <CreateCategoryPage />
      </RestrictedRouteGuard>
    ),
    path: routes.dashboard.categories.create,
  },
  // Products routes
  {
    element: (
      <RestrictedRouteGuard requiredPermissions="products">
        <ProductsPage />
      </RestrictedRouteGuard>
    ),
    path: () => routes.dashboard.products.index,
  },
  {
    element: (
      <RestrictedRouteGuard requiredPermissions="products">
        <ESupplierPage />
      </RestrictedRouteGuard>
    ),
    path: () => routes.dashboard.suppliers.index,
  },
  {
    element: (
      <RestrictedRouteGuard requiredPermissions="products">
        <ProductUploadPage />
      </RestrictedRouteGuard>
    ),
    path: () => routes.dashboard.products.bulkUpload,
  },
  {
    element: (
      <RestrictedRouteGuard requiredPermissions="products">
        <EditProductPage />
      </RestrictedRouteGuard>
    ),
    path: (id: string) => routes.dashboard.products.edit(id),
  },
  {
    element: (
      <RestrictedRouteGuard requiredPermissions="products">
        <CreateProductPage />
      </RestrictedRouteGuard>
    ),
    path: routes.dashboard.products.create,
  },
  // Brands routes
  // Products routes
  {
    element: (
      <RestrictedRouteGuard requiredPermissions="products">
        <BrandsPage />
      </RestrictedRouteGuard>
    ),
    path: () => routes.dashboard.brands.index,
  },
  {
    element: (
      <RestrictedRouteGuard requiredPermissions="products">
        <EditBrandPage />
      </RestrictedRouteGuard>
    ),
    path: (id: string) => routes.dashboard.brands.edit(id),
  },
  {
    element: (
      <RestrictedRouteGuard requiredPermissions="products">
        <CreateBrandPage />
      </RestrictedRouteGuard>
    ),
    path: routes.dashboard.brands.create,
  },
  // Sliders routes
  {
    element: (
      <RestrictedRouteGuard requiredPermissions="sliders">
        <SlidersPage />
      </RestrictedRouteGuard>
    ),
    path: () => routes.dashboard.sliders.index,
  },
  {
    element: (
      <RestrictedRouteGuard requiredPermissions="sliders">
        <EditSliderPage />
      </RestrictedRouteGuard>
    ),
    path: (id: string) => routes.dashboard.sliders.show(id),
  },
  {
    element: (
      <RestrictedRouteGuard requiredPermissions="sliders">
        <CreateSliderPage />
      </RestrictedRouteGuard>
    ),
    path: routes.dashboard.sliders.create,
  },
  // Stores routes
  {
    element: (
      <RestrictedRouteGuard requiredPermissions="stores">
        <StoresPage />
      </RestrictedRouteGuard>
    ),
    path: () => routes.dashboard.stores.index,
  },
  {
    element: (
      <RestrictedRouteGuard requiredPermissions="stores">
        <EditStorePage />
      </RestrictedRouteGuard>
    ),
    path: (id: string) => routes.dashboard.stores.show(id),
  },
  {
    element: (
      <RestrictedRouteGuard requiredPermissions="stores">
        <CreateStorePage />
      </RestrictedRouteGuard>
    ),
    path: routes.dashboard.stores.create,
  },
  {
    element: (
      <RestrictedRouteGuard requiredPermissions="permissions">
        <GroupPermissionsPage />
      </RestrictedRouteGuard>
    ),
    path: routes.dashboard.permissions.group.index,
  },
  {
    element: (
      <RestrictedRouteGuard requiredPermissions="permissions">
        <PagePermissionsPage />
      </RestrictedRouteGuard>
    ),
    path: routes.dashboard.permissions.page.index,
  },

  {
    element: (
      <RestrictedRouteGuard requiredPermissions="permissions">
        <EditGroupPage />
      </RestrictedRouteGuard>
    ),
    path: (id: string) => routes.dashboard.permissions.group.edit(id),
  },
  {
    element: (
      <RestrictedRouteGuard requiredPermissions="users">
        <HubUsersPage />
      </RestrictedRouteGuard>
    ),
    path: routes.dashboard.hubUsers.index,
  },
  {
    element: (
      <RestrictedRouteGuard requiredPermissions="users">
        <UsersPage />
      </RestrictedRouteGuard>
    ),
    path: routes.dashboard.users.index,
  },
  {
    element: (
      <RestrictedRouteGuard requiredPermissions="users">
        <EditUserPage />
      </RestrictedRouteGuard>
    ),
    path: (id: string) => routes.dashboard.users.edit(id),
  },
  // Coupons routes
  {
    element: (
      <RestrictedRouteGuard requiredPermissions="coupons">
        <CouponsPage />
      </RestrictedRouteGuard>
    ),
    path: routes.dashboard.coupons.index,
  },
  {
    element: (
      <RestrictedRouteGuard requiredPermissions="coupons">
        <CreateCouponPage />
      </RestrictedRouteGuard>
    ),
    path: routes.dashboard.coupons.create,
  },
  {
    element: (
      <RestrictedRouteGuard requiredPermissions="coupons">
        <EditCouponPage />
      </RestrictedRouteGuard>
    ),
    path: (id: string) => routes.dashboard.coupons.edit(id),
  },
  // Bulk Inventory routes
  {
    element: (
      <RestrictedRouteGuard requiredPermissions="inventory">
        <InventoryBulkPage />
      </RestrictedRouteGuard>
    ),
    path: routes.dashboard.invnetory.bulkInventory,
  },
  {
    element: (
      <RestrictedRouteGuard requiredPermissions="inventory">
        <InventoryPage />
      </RestrictedRouteGuard>
    ),
    path: routes.dashboard.invnetory.index,
  },
  {
    element: (
      <RestrictedRouteGuard requiredPermissions="inventory">
        <InvnetoryUploadPage />
      </RestrictedRouteGuard>
    ),
    path: routes.dashboard.invnetory.bulkCreate,
  },
  // Bulk Offers routes
  {
    element: (
      <RestrictedRouteGuard requiredPermissions="offers">
        <OffersPage />
      </RestrictedRouteGuard>
    ),
    path: routes.dashboard.offers.index,
  },
  {
    element: (
      <RestrictedRouteGuard requiredPermissions="offers">
        <OffersUploadPage />
      </RestrictedRouteGuard>
    ),
    path: routes.dashboard.offers.create,
  },
  // Orders routes
  {
    element: (
      <RestrictedRouteGuard requiredPermissions="orders">
        <OrdersPage />
      </RestrictedRouteGuard>
    ),
    path: routes.dashboard.orders.index,
  },
  {
    element: (
      <RestrictedRouteGuard requiredPermissions="orders">
        <ConfirmationOrderPage />
      </RestrictedRouteGuard>
    ),
    path: routes.dashboard.orders.confirm,
  },
  {
    element: (
      <RestrictedRouteGuard requiredPermissions="orders">
        <OrderDetailsPage />
      </RestrictedRouteGuard>
    ),
    path: (id: string) => routes.dashboard.orders.edit(id),
  },
  {
    element: (
      <RestrictedRouteGuard requiredPermissions="orders">
        <CreateOrderPage />
      </RestrictedRouteGuard>
    ),
    path: routes.dashboard.orders.create,
  },
  {
    element: (
      <RestrictedRouteGuard requiredPermissions="orders">
        <MapMaster />
      </RestrictedRouteGuard>
    ),

    path: routes.dashboard.map.index,
  },
  {
    element: (
      <RestrictedRouteGuard requiredPermissions="dropbox">
        <DropboxPage />
      </RestrictedRouteGuard>
    ),
    path: routes.dashboard.dropbox.index,
  },
  {
    element: (
      <RestrictedRouteGuard requiredPermissions="orders">
        <TimeSlotsPage />
      </RestrictedRouteGuard>
    ),
    path: routes.dashboard.timeSlots.index,
  },
  {
    element: (
      <RestrictedRouteGuard requiredPermissions="orders">
        <EditTimeSlotPage />
      </RestrictedRouteGuard>
    ),
    path: (id: string) => routes.dashboard.timeSlots.edit(id),
  },
  {
    element: (
      <RestrictedRouteGuard requiredPermissions="orders">
        <AddTimeSlotPage />
      </RestrictedRouteGuard>
    ),
    path: routes.dashboard.timeSlots.create,
  },
  {
    element: (
      <RestrictedRouteGuard requiredPermissions="categories">
        <CategoryExplorer />
      </RestrictedRouteGuard>
    ),
    path: routes.dashboard.categoryExplorer.index,
  },
];

export const allRoutes = [...publicRoutes, ...privateRoutes];
