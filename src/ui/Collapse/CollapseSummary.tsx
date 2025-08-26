import { ReactElement, forwardRef } from "react";

import { cn } from "@app/helpers";

import { CollapseTitleProps } from "./CollapseTitle";

const classesFn = ({ className }: Pick<CollapseTitleProps, "className">) => cn("collapse-title", className);

export type CollapseSummaryProps = CollapseTitleProps<HTMLElement>;
export const CollapseSummary = forwardRef<HTMLElement, CollapseSummaryProps>(
    ({ children, className }, ref): ReactElement => {
        return (
            <summary ref={ref} className={classesFn({ className })}>
                {children}
            </summary>
        );
    },
);

CollapseSummary.displayName = "Collapse Summary";

export default CollapseSummary;
