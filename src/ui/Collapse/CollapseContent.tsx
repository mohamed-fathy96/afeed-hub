

import { HTMLAttributes, ReactElement } from "react";

import { cn } from "@app/helpers";

import { IComponentBaseProps } from "../types";

export type CollapseContentProps = HTMLAttributes<HTMLDivElement> & IComponentBaseProps;

const CollapseContent = ({ children, className, ...props }: CollapseContentProps): ReactElement => {
    const classes = cn("collapse-content", className);

    return (
        <div {...props} className={classes}>
            {children}
        </div>
    );
};

export default CollapseContent;
