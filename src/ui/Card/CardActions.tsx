import { HTMLAttributes, forwardRef } from "react";

import { cn } from "@app/helpers";

import { IComponentBaseProps } from "../types";

export type CardActionsProps = HTMLAttributes<HTMLDivElement> & IComponentBaseProps;

const CardActions = forwardRef<HTMLDivElement, CardActionsProps>(({ className, ...props }, ref) => (
    <div {...props} className={cn("card-actions", className)} ref={ref} />
));

CardActions.displayName = "Card actions";

export default CardActions;
