import React, { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { allRoutes } from "./routingConstants/RoutesConfig";
import NotFoundPage from "../pages/notfound";
import App from "../App";
import { routes } from "@app/lib/routes";

const Router: React.FC = () => {
  const { pathname } = useLocation();



  return (
    <Routes>
      <Route path="/" element={<App />}>
        {allRoutes.map((route: any, routeIndex) => (
          <Route
            key={routeIndex}
            path={
              typeof route.path === "function"
                ? route.path(":id") // Use ":id" as a placeholder for dynamic routes
                : route.path
            }
            element={route.element}
          >
            {route?.children &&
              route.children.map((childRoute: any, childIndex: number) => (
                <Route
                  key={childIndex}
                  path={
                    typeof childRoute.path === "function"
                      ? childRoute.path(":id") // Placeholder for child dynamic paths
                      : childRoute.path
                  }
                  element={childRoute.element}
                />
              ))}
          </Route>
        ))}
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default Router;
