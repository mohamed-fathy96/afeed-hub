import { HTMLAttributes, ReactElement, Ref, forwardRef } from "react";

import { cn } from "@app/helpers";

import { ComponentColor, IComponentBaseProps } from "../types";

export type PhoneMockupProps = HTMLAttributes<HTMLDivElement> &
    IComponentBaseProps & {
        color?: Omit<ComponentColor, "ghost">;
        innerProps?: HTMLAttributes<HTMLDivElement>;
        innerRef?: Ref<HTMLDivElement>;
    };

const PhoneMockup = forwardRef<HTMLDivElement, PhoneMockupProps>(
    ({ color, dataTheme, className, children, innerRef, innerProps, ...props }, ref): ReactElement => {
        const classes = cn(
            "mockup-phone",
            {
                "border-primary": color === "primary",
                "border-secondary": color === "secondary",
                "border-info": color === "info",
                "border-success": color === "success",
                "border-warning": color === "warning",
                "border-error": color === "error",
            },
            className,
        );

        return (
            <div aria-label="Phone mockup" {...props} data-theme={dataTheme} className={classes} ref={ref}>
                <div className="camera" />
                <div className="display">
                    <div
                        {...innerProps}
                        className={cn("artboard artboard-demo phone-1", innerProps?.className)}
                        ref={innerRef}>
                        {children}
                    </div>
                </div>
            </div>
        );
    },
);

PhoneMockup.displayName = "PhoneMockup";

export default PhoneMockup;
