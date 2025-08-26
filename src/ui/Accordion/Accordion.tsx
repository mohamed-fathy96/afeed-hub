import React, { HTMLAttributes, ReactElement, forwardRef } from "react";

import { cn } from "@app/helpers";

import { IComponentBaseProps } from "../types";

export type AccordionProps = Omit<HTMLAttributes<HTMLInputElement>, "type"> &
  IComponentBaseProps & {
    name?: string;
    icon?: "arrow" | "plus";
  };

const Accordion = forwardRef<HTMLInputElement, AccordionProps>(
  (
    { name = "accordion", icon, dataTheme, className, children, ...props },
    ref
  ): ReactElement => {
    const classes = cn(
      "collapse",
      {
        "collapse-arrow": icon === "arrow",
        "collapse-plus": icon === "plus",
      },
      className
    );

    return (
      <div data-theme={dataTheme} className={classes}>
        <input
          {...props}
          ref={ref}
          type="radio"
          aria-label="Accordion radio"
          name={name}
        />
        {children}
      </div>
    );
  }
);

Accordion.displayName = "Accordion";

export default Accordion;
