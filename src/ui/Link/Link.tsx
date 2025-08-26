import { AnchorHTMLAttributes, ReactElement, forwardRef } from "react";

import { cn } from "@app/helpers";

import { ComponentColor, IComponentBaseProps } from "../types";

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
    IComponentBaseProps & {
        color?: "neutral" | ComponentColor;
        hover?: boolean;
    };

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
    ({ children, href, color, hover = true, dataTheme, className, ...props }, ref): ReactElement => {
        const classes = cn("link", className, {
            "link-neutral": color === "neutral",
            "link-primary": color === "primary",
            "link-secondary": color === "secondary",
            "link-accent": color === "accent",
            "link-info": color === "info",
            "link-success": color === "success",
            "link-warning": color === "warning",
            "link-error": color === "error",
            "link-hover": hover,
        });

        return (
            <a rel="noopener noreferrer" {...props} href={href} data-theme={dataTheme} className={classes} ref={ref}>
                {children}
            </a>
        );
    },
);

Link.displayName = "Link";

export default Link;
