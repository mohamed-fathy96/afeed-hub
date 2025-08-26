import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
// routes
import { isAuthenticated } from "@app/lib/helpers/constants/helpers";
import { routes } from "@app/lib/routes";

interface PrivateRouteGuardProps {
  children: ReactNode;
}

const PrivateRouteGuard: React.FC<PrivateRouteGuardProps> = ({ children }) => {
  const location = useLocation();

  // Redirect to login page if not authenticated
  return isAuthenticated() ? (
    // Render children if authenticated
    <>{children}</>
  ) : (
    // Redirect to login page with the current location as the "from" state
    <Navigate replace to={routes.auth.login} state={{ from: location }} />
  );
};

export default PrivateRouteGuard;
