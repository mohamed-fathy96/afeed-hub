import airplayIcon from "@iconify/icons-lucide/airplay";
import userIcon from "@iconify/icons-lucide/user";
import ShiledIcon from "@iconify/icons-lucide/shield-check";
import StickyNote from "@iconify/icons-lucide/sticky-note";
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
        label: "Creator Management",
        url: routes.dashboard.creators.index,
      },
    ],
  },

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
