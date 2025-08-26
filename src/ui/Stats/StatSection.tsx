import { HTMLAttributes, ReactElement, forwardRef } from "react";

import { cn } from "@app/helpers";

import { IComponentBaseProps } from "../types";

export type StatSectionProps = HTMLAttributes<HTMLDivElement> &
    IComponentBaseProps & {
        section: "title" | "value" | "desc" | "figure" | "actions";
    };

const StatSection = forwardRef<HTMLDivElement, StatSectionProps>(
    ({ children, section, className, ...props }, ref): ReactElement => {
        const classes = cn(className, {
            "stat-title": section === "title",
            "stat-value": section === "value",
            "stat-desc": section === "desc",
            "stat-figure": section === "figure",
            "stat-actions": section === "actions",
        });

        return (
            <div {...props} className={classes} ref={ref}>
                {children}
            </div>
        );
    },
);

StatSection.displayName = "Stat Section";

export default StatSection;
