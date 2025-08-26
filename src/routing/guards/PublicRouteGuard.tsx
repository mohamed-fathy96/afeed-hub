import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "@app/lib/helpers/constants/helpers";
import { routes } from "@app/lib/routes";

interface AuthRouteGuardProps {
  restricted: boolean;
  children?: ReactNode;
  redirect?: string;
}

const AuthRouteGuard: React.FC<AuthRouteGuardProps> = ({
  children,
  redirect,
}) => {
  const location = useLocation();

  // Redirect if specified
  return redirect ? (
    <Navigate replace to={redirect} />
  ) : isAuthenticated() ? (
    // Redirect to home page if authenticated
    <Navigate
      replace
      to={routes.dashboard.statistics}
      state={{ from: location }}
    />
  ) : (
    // Render children if not authenticated
    <>{children}</>
  );
};

export default AuthRouteGuard;
