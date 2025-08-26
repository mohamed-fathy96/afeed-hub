import { HTMLAttributes, forwardRef } from "react";

import { cn } from "@app/helpers";

import { ComponentSize, IComponentBaseProps } from "../types";

export type MenuProps = HTMLAttributes<HTMLUListElement> &
    IComponentBaseProps & {
        vertical?: boolean; // Vertical menu (default)
        horizontal?: boolean; // Horizontal menu
        responsive?: boolean;
        size?: ComponentSize;
    };

const Menu = forwardRef<HTMLUListElement, MenuProps>(
    ({ responsive, horizontal, vertical, dataTheme, className, size, ...props }, ref) => {
        const classes = cn("menu", className, {
            "menu-vertical lg:menu-horizontal": responsive,
            "menu-lg": size === "lg",
            "menu-md": size === "md",
            "menu-sm": size === "sm",
            "menu-xs": size === "xs",
            "menu-vertical": vertical,
            "menu-horizontal": horizontal,
        });

        return <ul data-theme={dataTheme} className={classes} {...props} ref={ref} />;
    },
);

Menu.displayName = "Menu";

export default Menu;
