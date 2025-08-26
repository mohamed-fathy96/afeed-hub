import { HTMLAttributes, forwardRef } from "react";

import { cn } from "@app/helpers";

import { IComponentBaseProps } from "../types";

export type ModalActionsProps = HTMLAttributes<HTMLDivElement> & IComponentBaseProps;

const ModalActions = forwardRef<HTMLDivElement, ModalActionsProps>(({ children, className, ...props }, ref) => {
    const classes = cn("modal-action", className);
    return (
        <div {...props} className={classes} ref={ref}>
            {children}
        </div>
    );
});

ModalActions.displayName = "ModalActions";

export default ModalActions;
