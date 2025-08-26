import React, { ReactNode, useState, useEffect, useCallback } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "@app/lib/helpers/constants/helpers";
import RestrictedWrapper from "../routingComponents/RestrictedWrapper";
import { SectionLoader } from "@app/ui/SectionLoader";
import { routes } from "@app/lib/routes";
import PermissionsCannotAccess from "../routingComponents/PermissionsCannotAccess";

interface RestrictedRouteGuardProps {
  children: ReactNode;
  requiredPermissions: string;
}

const RestrictedRouteGuard: React.FC<RestrictedRouteGuardProps> = ({
  children,
  requiredPermissions,
}) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  // Memoize the function to avoid recreating it on each render
  const checkAuthenticationAndPermissions = useCallback(async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate async operation
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthenticationAndPermissions();
  }, [checkAuthenticationAndPermissions]);

  if (isLoading) {
    return <SectionLoader />;
  }

  if (isAuthenticated()) {
    return (
      <RestrictedWrapper
        requiredPermissions={requiredPermissions}
        action="view"
        notPermittedComponent={
          <PermissionsCannotAccess requiredPermissions={requiredPermissions} />
        }
      >
        {children}
      </RestrictedWrapper>
    );
  } else {
    return (
      <Navigate replace to={routes.auth.login} state={{ from: location }} />
    );
  }
};

export default RestrictedRouteGuard;
