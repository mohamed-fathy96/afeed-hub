import { HTMLAttributes, forwardRef } from "react";

import { cn } from "@app/helpers";

import { IComponentBaseProps } from "../types";

export type CardBodyProps = HTMLAttributes<HTMLDivElement> & 
  IComponentBaseProps & {
    compact?: boolean; // For tighter spacing
    spacious?: boolean; // For more generous spacing
  };

const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, compact = false, spacious = false, ...props }, ref) => (
    <div 
      {...props} 
      className={cn(
        "card-body",
        {
          "p-4": compact,
          "p-6": !compact && !spacious,
          "p-8": spacious,
        },
        className
      )} 
      ref={ref} 
    />
  )
);

CardBody.displayName = "Card Body";

export default CardBody;
