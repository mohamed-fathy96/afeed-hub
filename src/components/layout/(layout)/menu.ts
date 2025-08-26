import airplayIcon from "@iconify/icons-lucide/airplay";

import storeIcon from "@iconify/icons-lucide/store";
// import imageIcon from "@iconify/icons-lucide/image";
import userIcon from "@iconify/icons-lucide/user";
import ShiledIcon from "@iconify/icons-lucide/shield-check";
import PackageSearch from "@iconify/icons-lucide/package-search";
import StickyNote from "@iconify/icons-lucide/sticky-note";
import CouponIcon from "@iconify/icons-lucide/badge-percent";
import OffersIcon from "@iconify/icons-lucide/percent";
import OrderIcon from "@iconify/icons-lucide/bring-to-front";
import MapIcon from "@iconify/icons-lucide/map";
import TimeSlots from "@iconify/icons-lucide/alarm-clock";
import PackageIcon from "@iconify/icons-lucide/package";
import ImageIcon from "@iconify/icons-lucide/image";
import ZapIcon from "@iconify/icons-lucide/zap";
// import DropboxIcon from "@iconify/icons-lucide/monitor-up";

import { routes } from "@app/lib/routes";
import { IMenuItem } from "../admin";
import { OrderStatusEnum } from "@app/lib/types/orders";

export const adminMenuItems: IMenuItem[] = [
  // {
  //   key: "dashboard",
  //   icon: airplayIcon,
  //   label: "Dashboard",
  //   url: routes.dashboard.statistics,
  // },
  // {
  //   key: "apps-sliders",
  //   icon: imageIcon,
  //   label: "Sliders",
  //   url: routes.dashboard.sliders.index,
  // },

  // {
  //   key: "apps-map-master",
  //   icon: MapIcon,
  //   label: "Map Master",
  //   url: routes.dashboard.map.index,
  // },

  // {
  //   key: "apps-catalog",
  //   icon: storeIcon,
  //   label: "Catalog",
  //   children: [
  //     {
  //       key: "apps-catalog-category",
  //       label: "Categories",
  //       url: routes.dashboard.categories.index,
  //       icon: PackageSearch,
  //     },
  //     {
  //       key: "apps-catalog-category-explorer",
  //       label: "Category Explorer",
  //       url: routes.dashboard.categoryExplorer.index,
  //       icon: ZapIcon,
  //     },
  //     {
  //       key: "apps-products",
  //       label: "Products",
  //       url: routes.dashboard.products.index,
  //       icon: PackageIcon,
  //     },
  //     {
  //       key: "apps-brands",
  //       label: "Brands",
  //       url: routes.dashboard.brands.index,
  //       icon: ImageIcon,
  //     },
  //     {
  //       key: "apps-suppliers",
  //       label: "E-Suppliers",
  //       url: routes.dashboard.suppliers.index,
  //       icon: PackageSearch,
  //     },
  //   ],
  // },
  // {
  //   key: "apps-inventroy",
  //   label: "Inventory",
  //   icon: InventoryIcon,
  //   children: [
  //     {
  //       key: "apps-inventory",
  //       label: "Inventory",
  //       url: routes.dashboard.invnetory.index,
  //     },
  //     {
  //       key: "apps-bulk-inventory",
  //       label: "Bulk Inventory",
  //       url: routes.dashboard.invnetory.bulkInventory,
  //     },
  //   ],
  // },

  // {
  //   key: "apps-Dropbox",
  //   label: "Dropbox",
  //   icon: DropboxIcon,
  //   url: routes.dashboard.dropbox.index,
  // },

  {
    key: "apps-manage",
    icon: userIcon,
    label: "Manage",
    children: [
      {
        key: "apps-Users",
        icon: userIcon,
        label: "Users",
        url: routes.dashboard.users.index,
      },
      {
        key: "apps-HubUsers",
        icon: userIcon,
        label: "Hub Users",
        url: routes.dashboard.hubUsers.index,
      },
      {
        key: "apps-Store",
        icon: storeIcon,
        label: "Stores",
        url: routes.dashboard.stores.index,
      },
      {
        key: "apps-permissions",
        icon: ShiledIcon,
        label: "Permissions",
        children: [
          {
            key: "apps-permissions-page",
            icon: StickyNote,
            label: "Page",
            url: routes.dashboard.permissions.page.index,
          },
          {
            key: "apps-permissions-group",
            label: "Groups",
            url: routes.dashboard.permissions.group.index,
          },
        ],
      },
    ],
  },
];
