import { HTMLAttributes, ReactElement } from "react";

import { cn } from "@app/helpers";

import { IComponentBaseProps } from "../types";

export type CollapseTitleProps<T extends HTMLElement = HTMLDivElement> = HTMLAttributes<T> & IComponentBaseProps;

const classesFn = ({ className }: Pick<CollapseTitleProps, "className">) => cn("collapse-title", className);

const CollapseTitle = ({ children, className, ...props }: CollapseTitleProps): ReactElement => {
    return (
        <div {...props} className={classesFn({ className })}>
            {children}
        </div>
    );
};

export default CollapseTitle;
