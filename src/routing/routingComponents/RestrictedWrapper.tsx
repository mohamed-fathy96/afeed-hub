import React, { ReactNode } from "react";
import { HasPermission } from "../RoutingHelpers";
import LocalStorageManager from "@app/localStore/LocalStorageManger";
import { LocalStorageKeys } from "@app/lib/helpers/constants/helpers";

interface RestrictedWrapperProps {
  requiredPermissions: string;
  action: string;
  children: ReactNode;
  notPermittedComponent?: ReactNode;
}

const RestrictedWrapper: React.FC<RestrictedWrapperProps> = ({
  requiredPermissions,
  action,
  children,
  notPermittedComponent,
}) => {
  const permissionsList = LocalStorageManager.getItem(
    LocalStorageKeys.PERMISSIONS
  );

  if (HasPermission(permissionsList, requiredPermissions, action)) {
    return <>{children}</>;
  }

  return <>{notPermittedComponent}</>;
};

export default RestrictedWrapper;
