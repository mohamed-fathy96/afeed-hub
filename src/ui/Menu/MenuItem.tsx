import { LiHTMLAttributes, forwardRef } from "react";

import { cn } from "@app/helpers";

import { IComponentBaseProps } from "../types";

export type MenuItemProps = LiHTMLAttributes<HTMLLIElement> &
    IComponentBaseProps & {
        disabled?: boolean;
    };

const MenuItem = forwardRef<HTMLLIElement, MenuItemProps>(({ className, disabled, ...props }, ref) => {
    const classes = cn(className, {
        disabled: disabled,
    });

    return <li className={classes} {...props} ref={ref} />;
});

MenuItem.displayName = "Menu Item";

export default MenuItem;
