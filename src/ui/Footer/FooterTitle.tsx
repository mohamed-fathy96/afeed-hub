import { HTMLAttributes, forwardRef } from "react";

import { cn } from "@app/helpers";

export type FooterTitleProps = HTMLAttributes<HTMLSpanElement>;

const FooterTitle = forwardRef<HTMLSpanElement, FooterTitleProps>(({ className, ...props }, ref) => {
    const classes = cn("footer-title", className);

    return <span {...props} className={classes} ref={ref} />;
});

FooterTitle.displayName = "Footer Title";

export default FooterTitle;
