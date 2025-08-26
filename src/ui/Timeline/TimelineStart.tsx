import { HTMLAttributes, forwardRef } from "react";

import { cn } from "@app/helpers";

export type TimelineStartProps = HTMLAttributes<HTMLDivElement> & {
    box?: boolean;
};

const TimelineStart = forwardRef<HTMLDivElement, TimelineStartProps>(({ children, className, box, ...props }, ref) => {
    const classes = cn(
        "timeline-start",
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
});

TimelineStart.displayName = "TimelineStart";
export default TimelineStart;
