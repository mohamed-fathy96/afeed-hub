import { HTMLAttributes, ReactElement, forwardRef } from "react";

import { cn } from "@app/helpers";

import { IComponentBaseProps } from "../types";

export type HeroContentProps = HTMLAttributes<HTMLDivElement> & IComponentBaseProps;

const HeroContent = forwardRef<HTMLDivElement, HeroContentProps>(
    ({ dataTheme, className, children, ...props }, ref): ReactElement => {
        const classes = cn("hero-content", className);

        return (
            <div {...props} data-theme={dataTheme} className={classes} ref={ref}>
                {children}
            </div>
        );
    },
);

HeroContent.displayName = "Hero Content";

export default HeroContent;
