import { HTMLAttributes, ReactElement, forwardRef } from "react";

import { cn } from "@app/helpers";

import { ComponentSize, IComponentBaseProps } from "../types";

export type BottomNavigationProps = HTMLAttributes<HTMLDivElement> &
    IComponentBaseProps & {
        size?: ComponentSize;
    };

const BottomNavigation = forwardRef<HTMLDivElement, BottomNavigationProps>(
    ({ size, dataTheme, className, children, ...props }, ref): ReactElement => {
        const classes = cn(
            "btm-nav",
            {
                "btm-nav-lg": size === "lg",
                "btm-nav-md": size === "md",
                "btm-nav-sm": size === "sm",
                "btm-nav-xs": size === "xs",
            },
            className,
        );

        return (
            <div {...props} role="navigation" data-theme={dataTheme} className={classes} ref={ref}>
                {children}
            </div>
        );
    },
);

BottomNavigation.displayName = "BottomNavigation";

export default BottomNavigation;
