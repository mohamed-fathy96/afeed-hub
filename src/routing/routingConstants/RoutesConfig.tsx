import PublicRouteGuard from "../guards/PublicRouteGuard";
// import PrivateRouteGuard from "../guards/PrivateRouteGuard";
//urls
//pages
import LoginPage from "@app/pages/login";
import DashboardPage from "@app/pages/dashboard";
import { routes } from "@app/lib/routes";

import {
  GroupPermissionsPage,
  PagePermissionsPage,
} from "@app/pages/permissions";
import RestrictedRouteGuard from "../guards/RestrictedRouteGuard";
import EditGroupPage from "@app/pages/permissions/groupPermissions/actions/EditGroup";
import UsersPage from "@app/pages/users";
import EditUserPage from "@app/pages/users/edit";

import HubUsersPage from "@app/pages/users/hubUsers";
import CreatorsPage from "@app/pages/creators";
import CreatorDetailsPage from "@app/pages/creators/creator-details";

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
  {
    element: (
      <RestrictedRouteGuard requiredPermissions="creators">
        <CreatorsPage />
      </RestrictedRouteGuard>
    ),
    path: routes.dashboard.creators.index,
  },
   {
    element: (
      <RestrictedRouteGuard requiredPermissions="creators">
        <CreatorDetailsPage />
      </RestrictedRouteGuard>
    ),
    path: (id: string) => routes.dashboard.creators.edit(id),
  },
];

export const allRoutes = [...publicRoutes, ...privateRoutes];
