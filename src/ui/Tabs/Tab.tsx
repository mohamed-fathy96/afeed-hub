import { AnchorHTMLAttributes, ReactElement, forwardRef } from "react";

import { cn } from "@app/helpers";

export type TabProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
    active?: boolean;
    disabled?: boolean;
};

const Tab = forwardRef<HTMLAnchorElement, TabProps>(
    ({ children, className, active, disabled, ...props }, ref): ReactElement => {
        const classes = cn("tab", className, {
            "tab-active": active,
            "tab-disabled": disabled,
        });
        return (
            <a role="tab" {...props} ref={ref} className={classes}>
                {children}
            </a>
        );
    },
);

Tab.displayName = "Tab";

export default Tab;
