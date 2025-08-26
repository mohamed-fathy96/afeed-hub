import { HTMLAttributes, forwardRef } from "react";

import { cn } from "@app/helpers";

export type ModalHeaderProps = HTMLAttributes<HTMLDivElement>;

const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(({ children, className, ...props }, ref) => {
    const classes = cn("w-full mb-8 text-xl", className);
    return (
        <div {...props} className={classes} ref={ref}>
            {children}
        </div>
    );
});

ModalHeader.displayName = "ModalHeader";

export default ModalHeader;
