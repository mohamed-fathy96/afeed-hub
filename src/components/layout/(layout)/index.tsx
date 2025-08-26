import { useLayoutContext } from "@app/store/globale/layout";
import { adminMenuItems } from "./menu";
import { Leftbar } from "./slots/Leftbar";
import { Topbar } from "./slots/Topbar";
import { useEffect } from "react";

const AdminLayout = ({ children }: { children: any }) => {
  const pathname = window.location.pathname;

  const { hideLeftbar, hideMobileLeftbar } = useLayoutContext();

  useEffect(() => {
    hideMobileLeftbar();
  }, [pathname]);

  return (
    <>
      {
        <div className="size-full">
          <div className="flex overflow-hidden">
            <Leftbar menuItems={adminMenuItems} />
            <div className="main-wrapper overflow-auto">
                <Topbar />
              <div className="flex h-full flex-col">
                <div className="content-wrapper">{children}</div>
              </div>
            </div>
          </div>
          <div
            className="leftbar-backdrop"
            role="button"
            tabIndex={0}
            onClick={() => hideLeftbar()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                hideLeftbar();
              }
            }}
          ></div>
        </div>
      }
    </>
  );
};
export default AdminLayout;
