import { HTMLAttributes, ReactElement, forwardRef } from "react";

import { cn } from "@app/helpers";

import { ComponentColor, IComponentBaseProps } from "../types";

export type RadialProgressProps = HTMLAttributes<HTMLDivElement> &
    IComponentBaseProps & {
        value: number;
        size?: string;
        thickness?: string;
        color?: ComponentColor;
    };

const RadialProgress = forwardRef<HTMLDivElement, RadialProgressProps>(
    (
        { value, size = "4rem", thickness = "4px", color, dataTheme, className, children, ...props },
        ref,
    ): ReactElement => {
        const classes = cn("radial-progress", className, {
            "text-primary": color === "primary",
            "text-secondary": color === "secondary",
            "text-accent": color === "accent",
            "text-info": color === "info",
            "text-success": color === "success",
            "text-warning": color === "warning",
            "text-error": color === "error",
        });

        const displayedValue = Math.min(100, Math.max(0, value));
        const progressStyle: Record<string, string | number> = {
            "--value": displayedValue,
            "--size": size,
            "--thickness": thickness,
        };

        return (
            <div
                role="progressbar"
                aria-valuenow={displayedValue}
                aria-valuemin={0}
                aria-valuemax={100}
                {...props}
                ref={ref}
                data-theme={dataTheme}
                className={classes}
                style={progressStyle}>
                {children}
            </div>
        );
    },
);

RadialProgress.displayName = "RadialProgress";

export default RadialProgress;
