import { HTMLAttributes, forwardRef } from "react";

import { cn } from "@app/helpers";

export type TimelineEndProps = HTMLAttributes<HTMLDivElement> & {
    box?: boolean;
};

const TimelineEnd = forwardRef<HTMLDivElement, TimelineEndProps>(
    ({ children, className, box = true, ...props }, ref) => {
        const classes = cn(
            "timeline-end",
            {
                "timeline-box": box,
            },
            className,
        );
        return (
            <div {...props} className={classes} ref={ref}>
                {children}
            </div>
        );
    },
);

TimelineEnd.displayName = "TimelineEnd";
export default TimelineEnd;
