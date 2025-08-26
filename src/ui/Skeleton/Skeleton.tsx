import { HTMLAttributes, ReactElement, forwardRef } from "react";

import { cn } from "@app/helpers";

import { IComponentBaseProps } from "../types";

export type SkeletonProps = HTMLAttributes<HTMLDivElement> & IComponentBaseProps & {};

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
    ({ dataTheme, className, children, ...props }, ref): ReactElement => {
        const classes = cn("skeleton", className);

        return (
            <div {...props} data-theme={dataTheme} className={classes} ref={ref}>
                {children}
            </div>
        );
    },
);

Skeleton.displayName = "Skeleton";

export default Skeleton;
