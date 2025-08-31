import airplayIcon from "@iconify/icons-lucide/airplay";
import userIcon from "@iconify/icons-lucide/user";
import ShiledIcon from "@iconify/icons-lucide/shield-check";
import StickyNote from "@iconify/icons-lucide/sticky-note";
import Card from "@iconify/icons-lucide/credit-card";
import Receipt from "@iconify/icons-lucide/receipt";
import Users from "@iconify/icons-lucide/users";
import UserCheck from "@iconify/icons-lucide/user-check";
import { routes } from "@app/lib/routes";
import { IMenuItem } from "../admin";

export const adminMenuItems: IMenuItem[] = [
  {
    key: "dashboard",
    icon: airplayIcon,
    label: "Dashboard",
    url: routes.dashboard.statistics,
  },
  {
    key: "apps-creator",
    icon: userIcon,
    label: "Accounts",
    children: [
      {
        key: "apps-creator-index",
        icon: Users,
        label: "Creator Management",
        url: routes.dashboard.creators.index,
      },
      {
        key: "apps-Users",
        icon: UserCheck,
        label: "User Management",
        url: routes.dashboard.users.index,
      },
    ],
  },
  {
    key: "apps-payments",
    icon: Receipt,
    label: "Payments",
    children: [
      {
        key: "apps-payments-index",
        label: "Payments Console",
        url: routes.dashboard.payments.index,
        icon: Card,
      },
    ],
  },

  {
    key: "apps-manage",
    icon: userIcon,
    label: "Manage",
    children: [
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
