import { HTMLAttributes, ReactElement, forwardRef } from "react";

import { cn } from "@app/helpers";

import { ComponentSize, IComponentBaseProps } from "../types";

export type KbdProps = HTMLAttributes<HTMLElement> &
    IComponentBaseProps & {
        size?: ComponentSize;
    };

const Kbd = forwardRef<HTMLElement, KbdProps>(
    ({ children, size, dataTheme, className, ...props }, ref): ReactElement => {
        const classes = cn("kbd", className, {
            "kbd-lg": size === "lg",
            "kbd-md": size === "md",
            "kbd-sm": size === "sm",
            "kbd-xs": size === "xs",
        });

        return (
            <kbd {...props} data-theme={dataTheme} className={classes} ref={ref}>
                {children}
            </kbd>
        );
    },
);

Kbd.displayName = "Kbd";

export default Kbd;
