import { HTMLAttributes, forwardRef } from "react";

import { cn } from "@app/helpers";

import { IComponentBaseProps } from "../types";

export type FooterProps = HTMLAttributes<HTMLDivElement> &
    IComponentBaseProps & {
        center?: boolean;
    };

const Footer = forwardRef<HTMLDivElement, FooterProps>(({ center, dataTheme, className, ...props }, ref) => {
    const classes = cn("footer", className, {
        "footer-center": center,
    });

    return <div role="contentinfo" {...props} data-theme={dataTheme} className={classes} ref={ref} />;
});

Footer.displayName = "Footer";

export default Footer;
