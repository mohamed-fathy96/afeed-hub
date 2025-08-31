import { HTMLAttributes, ReactElement, forwardRef } from "react";

import { cn } from "@app/helpers";

import { ComponentSize, IComponentBaseProps } from "../types";

export type TabsProps = HTMLAttributes<HTMLDivElement> &
  IComponentBaseProps & {
    variant?: "bordered" | "lifted" | "boxed" | "tabs-box";
    size?: ComponentSize;
  };

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ children, className, variant, size }, ref): ReactElement => {
    const classes = cn("tabs", className, {
      "tabs-boxed": variant === "boxed",
      "tabs-bordered": variant === "bordered",
      "tabs-lifted": variant === "lifted",
      "tabs-box": variant === "tabs-box",
      "tabs-lg": size === "lg",
      "tabs-md": size === "md",
      "tabs-sm": size === "sm",
      "tabs-xs": size === "xs",
    });

    return (
      <div role="tablist" className={classes} ref={ref}>
        {children}
      </div>
    );
  }
);

Tabs.displayName = "Tabs";

export default Tabs;
