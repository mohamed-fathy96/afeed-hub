import React, {
  HTMLAttributes,
  ReactElement,
  ReactNode,
  forwardRef,
} from "react";

import { cn } from "@app/helpers";

import { ComponentStatus, IComponentBaseProps } from "../types";

export type AlertProps = HTMLAttributes<HTMLDivElement> &
  IComponentBaseProps & {
    icon?: ReactNode;
    status?: ComponentStatus;
  };

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    { children, icon, status, dataTheme, className, ...props },
    ref
  ): ReactElement => {
    const classes = cn("alert", className, {
      "alert-info": status === "info",
      "alert-success": status === "success",
      "alert-warning": status === "warning",
      "alert-error": status === "error",
    });

    return (
      <div
        role="alert"
        {...props}
        ref={ref}
        data-theme={dataTheme}
        className={classes}
      >
        {icon}
        {children}
      </div>
    );
  }
);

Alert.displayName = "Alert";

export default Alert;
