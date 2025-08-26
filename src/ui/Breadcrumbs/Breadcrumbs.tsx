import { HTMLAttributes, ReactElement, ReactNode, Ref, forwardRef } from "react";

import { cn } from "@app/helpers";

import { IComponentBaseProps } from "../types";

export type BreadcrumbsProps = HTMLAttributes<HTMLDivElement> &
    IComponentBaseProps & {
        children?: ReactNode;
        innerRef?: Ref<HTMLUListElement>;
        innerProps?: HTMLAttributes<HTMLUListElement>;
    };

const Breadcrumbs = forwardRef<HTMLDivElement, BreadcrumbsProps>(
    ({ children, dataTheme, className, innerProps, innerRef, ...props }, ref): ReactElement => {
        const classes = cn("breadcrumbs", "text-sm", className);

        return (
            <div aria-label="Breadcrumbs" {...props} data-theme={dataTheme} className={classes} ref={ref}>
                <ul {...innerProps} ref={innerRef}>
                    {children}
                </ul>
            </div>
        );
    },
);

Breadcrumbs.displayName = "Breadcrumbs";

export default Breadcrumbs;
