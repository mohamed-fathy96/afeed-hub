import { HTMLAttributes, ReactElement, forwardRef } from "react";

import { cn } from "@app/helpers";

import { ComponentSize, IComponentBaseProps } from "../types";

export type CardProps = HTMLAttributes<HTMLDivElement> &
  IComponentBaseProps & {
    bordered?: boolean;
    imageFull?: boolean;
    elevated?: boolean; // New prop for elevated cards with stronger shadows
    hoverable?: boolean; // New prop for hover effects
    glass?: boolean; // New prop for glass morphism effect

    // responsive props
    normal?: ComponentSize | boolean; // Applies default paddings
    compact?: ComponentSize | boolean; // Applies smaller padding
    side?: ComponentSize | boolean; // The image in <figure> will be on to the side
  };

interface ModifierMap {
  [key: string]: {
    [key: string]: string | undefined;
  };
}

const DYNAMIC_MODIFIERS: ModifierMap = {
  compact: {
    true: "card-compact",
    xs: "xs:card-compact",
    sm: "sm:card-compact",
    md: "md:card-compact",
    lg: "lg:card-compact",
  },
  normal: {
    true: "card-normal",
    xs: "xs:card-normal",
    sm: "sm:card-normal",
    md: "md:card-normal",
    lg: "lg:card-normal",
  },
  side: {
    true: "card-side",
    xs: "xs:card-side",
    sm: "sm:card-side",
    md: "md:card-side",
    lg: "lg:card-side",
  },
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { 
      bordered = true, 
      imageFull, 
      elevated = false,
      hoverable = false,
      glass = false,
      normal, 
      compact, 
      side, 
      className, 
      ...props 
    },
    ref
  ): ReactElement => {
    const classes = cn(
      "card overflow-hidden transition-all duration-300",
      {
        // Modern base styling
        "bg-white dark:bg-gray-800": !glass,
        "backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20": glass,
        "rounded-xl": !imageFull, // Modern rounded corners
        "rounded-none": imageFull,
        
        // Border styling
        "border border-gray-200 dark:border-gray-700": bordered && !glass,
        "border-0": !bordered,
        
        // Shadow and elevation
        "shadow-sm": !elevated && !glass,
        "shadow-lg": elevated && !glass,
        "shadow-xl": elevated && glass,
        
        // Hover effects
        "hover:shadow-md hover:-translate-y-1": hoverable && !elevated,
        "hover:shadow-2xl hover:-translate-y-2": hoverable && elevated,
        
        // Image full styling
        "image-full": imageFull,
        
        // Responsive modifiers
        [(compact && DYNAMIC_MODIFIERS.compact[compact.toString()]) || ""]: compact,
        [(normal && DYNAMIC_MODIFIERS.normal[normal.toString()]) || ""]: normal,
        [(side && DYNAMIC_MODIFIERS.side[side.toString()]) || ""]: side,
      },
      className
    );

    return <div aria-label="Card" {...props} className={classes} ref={ref} />;
  }
);

Card.displayName = "Card";

export default Card;
