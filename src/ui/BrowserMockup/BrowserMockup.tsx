import { HTMLAttributes, ReactElement, Ref, forwardRef } from "react";

import { cn } from "@app/helpers";

import { IComponentBaseProps } from "../types";

export type BrowserMockupProps = HTMLAttributes<HTMLDivElement> &
    IComponentBaseProps & {
        url: string;
        variant?: "border" | "background";
        inputClassName?: string;
        innerClassName?: string;
        inputRef?: Ref<HTMLDivElement>;
        innerRef?: Ref<HTMLDivElement>;
    };

const BrowserMockup = forwardRef<HTMLDivElement, BrowserMockupProps>(
    (
        {
            dataTheme,
            className,
            inputClassName,
            innerClassName,
            children,
            url,
            variant = "border",
            inputRef,
            innerRef,
            ...props
        },
        ref,
    ): ReactElement => {
        const classes = cn(
            "mockup-browser border",
            {
                "border-base-300": variant === "border",
                "bg-base-300": variant === "background",
            },
            className,
        );

        const inputClasses = cn(
            "input",
            {
                "border-base-300": variant === "border",
            },
            inputClassName,
        );

        const innerClasses = cn(
            "flex justify-center px-4 py-16 ",
            {
                "border-t border-base-300": variant === "border",
                "bg-base-200": variant === "background",
            },
            innerClassName,
        );

        return (
            <div aria-label="Browser mockup" {...props} data-theme={dataTheme} className={classes} ref={ref}>
                <div className="mockup-browser-toolbar">
                    <div className={inputClasses} ref={inputRef}>
                        {url}
                    </div>
                </div>
                <div className={innerClasses} ref={innerRef}>
                    {children}
                </div>
            </div>
        );
    },
);

BrowserMockup.displayName = "BrowserMockup";

export default BrowserMockup;
