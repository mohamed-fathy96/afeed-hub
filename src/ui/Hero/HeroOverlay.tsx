import { HTMLAttributes, ReactElement, forwardRef } from "react";

import { cn } from "@app/helpers";

import { IComponentBaseProps } from "../types";

export type HeroOverlayProps = HTMLAttributes<HTMLDivElement> & IComponentBaseProps;

const HeroOverlay = forwardRef<HTMLDivElement, HeroOverlayProps>(
    ({ dataTheme, className, children, ...props }, ref): ReactElement => {
        const classes = cn("hero-overlay", className);

        return (
            <div {...props} data-theme={dataTheme} className={classes} ref={ref}>
                {children}
            </div>
        );
    },
);

HeroOverlay.displayName = "Hero Overlay";

export default HeroOverlay;
