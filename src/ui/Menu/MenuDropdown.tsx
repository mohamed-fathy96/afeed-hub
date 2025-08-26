import { HTMLAttributes, ReactNode, forwardRef } from "react";

import { cn } from "@app/helpers";

import { IComponentBaseProps } from "../types";

export type MenuDropdownProps = HTMLAttributes<HTMLSpanElement> &
    IComponentBaseProps & {
        label: ReactNode;
        open?: boolean;
    };

const MenuDropdown = forwardRef<HTMLSpanElement, MenuDropdownProps>(
    ({ className, label, open, children, ...props }, ref) => {
        const classes = cn("menu-dropdown-toggle", className, { "menu-dropdown-show": open });

        return (
            <>
                <span {...props} className={classes} ref={ref}>
                    {label}
                </span>
                <ul className={cn("menu-dropdown", { "menu-dropdown-show": open })}>{children}</ul>
            </>
        );
    },
);

MenuDropdown.displayName = "Menu Dropdown";

export default MenuDropdown;
