import { useEffect, useMemo, useRef } from "react";
import SimpleBarCore from "simplebar-core";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import Logo from "@app/assets/images/logo.png";
import { Icon } from "@app/ui/Icon";
import { Menu, MenuDetails, MenuItem, MenuTitle } from "@app/ui";
import { cn, menuHelper } from "@app/helpers";
import { routes } from "@app/lib/routes";
import { Link, useLocation } from "react-router-dom";
import { IconifyIcon } from "@iconify/react/dist/iconify.js";
export type IMenuItem = {
  key: string;
  icon?: IconifyIcon;
  label: string;
  isTitle?: boolean;
  url?: string;
  children?: IMenuItem[];
};
const ProBadge = ({ url }: { url: string | undefined }) => {
  return <>{url != routes.dashboard.statistics && !url?.includes("/docs")}</>;
};

const LeftMenuItem = ({
  menuItem,
  activated,
}: {
  menuItem: IMenuItem;
  activated: Set<string>;
}) => {
  const { icon, isTitle, label, children, url } = menuItem;

  const selected = activated.has(menuItem.key);

  if (isTitle) {
    return <MenuTitle className="font-semibold">{label}</MenuTitle>;
  }

  if (!children) {
    return (
      <MenuItem className="mb-0.5">
        <Link
          to={url ?? ""}
          className={cn({
            active: selected,
          })}
        >
          <div className="flex items-center gap-2">
            {icon && <Icon icon={icon} fontSize={18} />}
            {label}
            <ProBadge url={url} />
          </div>
        </Link>
      </MenuItem>
    );
  }

  return (
    <MenuItem className="mb-0.5">
      <MenuDetails
        open={selected}
        label={
          <div className="flex items-center gap-2">
            {icon && <Icon icon={icon} fontSize={18} />}
            {label}
            <ProBadge url={url} />
          </div>
        }
      >
        {children.map((item, index) => (
          <LeftMenuItem menuItem={item} key={index} activated={activated} />
        ))}
      </MenuDetails>
    </MenuItem>
  );
};

const Leftbar = ({ menuItems }: { menuItems: IMenuItem[] }) => {
  const { pathname } = useLocation();
  const scrollRef = useRef<SimpleBarCore | null>(null);

  const activatedParents = useMemo(
    () => new Set(menuHelper.getActivatedItemParentKeys(menuItems, pathname)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname]
  );

  useEffect(() => {
    setTimeout(() => {
      const contentElement = scrollRef.current?.getContentElement();
      const scrollElement = scrollRef.current?.getScrollElement();
      if (contentElement) {
        const activatedItem =
          contentElement.querySelector<HTMLElement>(".active");
        const top = activatedItem?.getBoundingClientRect().top;
        if (activatedItem && scrollElement && top && top !== 0) {
          scrollElement.scrollTo({
            top: scrollElement.scrollTop + top - 300,
            behavior: "smooth",
          });
        }
      }
    }, 100);
  }, [activatedParents]);

  return (
    <div className={cn("leftmenu-wrapper")}>
      <Link
        to={routes.dashboard.statistics}
        className="flex h-16 items-center justify-start px-4 mx-auto"
      >
        <img className="w-[80px]" src={Logo} alt="logo" />
      </Link>
      <SimpleBar
        ref={scrollRef}
        className="h-[calc(100vh-64px)] lg:h-[calc(100vh-230px)]"
      >
        <Menu className="mb-6">
          {menuItems.map((item, index) => (
            <LeftMenuItem
              menuItem={item}
              key={index}
              activated={activatedParents}
            />
          ))}
        </Menu>
      </SimpleBar>
    </div>
  );
};

export { Leftbar };
