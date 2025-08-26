import { HTMLAttributes, ReactElement, forwardRef } from "react";

import { cn } from "@app/helpers";

import { IComponentBaseProps } from "../types";

export type TimelineProps = HTMLAttributes<HTMLUListElement> &
    IComponentBaseProps & {
        vertical?: boolean;
        horizontal?: boolean;
        responsive?: boolean;
        snap?: boolean;
        compact?: boolean;
    };

const Timeline = forwardRef<HTMLUListElement, TimelineProps>(
    (
        { dataTheme, className, vertical, horizontal, responsive, snap, compact, children, ...props },
        ref,
    ): ReactElement => {
        const classes = cn(
            "timeline",
            {
                "timeline-vertical": vertical,
                "timeline-horizontal": horizontal,
                "timeline-vertical lg:timeline-horizontal": responsive,
                "timeline-snap-icon": snap,
                "timeline-compact": compact,
            },
            className,
        );

        return (
            <ul {...props} data-theme={dataTheme} className={classes} ref={ref}>
                {children}
            </ul>
        );
    },
);

Timeline.displayName = "Timeline";

export default Timeline;
