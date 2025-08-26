import { HTMLAttributes, ReactNode } from "react";

import { cn } from "@app/helpers";

import { IComponentBaseProps } from "../types";

export type DrawerProps = HTMLAttributes<HTMLDivElement> &
    IComponentBaseProps & {
        side: ReactNode;
        open?: boolean;
        end?: boolean;
        toggleClassName?: string;
        contentClassName?: string;
        sideClassName?: string;
        overlayClassName?: string;
        onClickOverlay?: () => void;
    };

const Drawer = ({
    children,
    side,
    open,
    end,
    dataTheme,
    className,
    toggleClassName,
    contentClassName,
    sideClassName,
    overlayClassName,
    onClickOverlay,
    ...props
}: DrawerProps) => {
    const classes = cn("drawer", className, {
        "drawer-end": end,
    });

    return (
        <div
            // aria-expanded={open}
            {...props}
            data-theme={dataTheme}
            className={classes}>
            <input
                aria-label="Drawer handler"
                type="checkbox"
                className={cn("drawer-toggle", toggleClassName)}
                checked={open}
                readOnly
            />
            <div className={cn("drawer-content", contentClassName)}>{children}</div>
            <div className={cn("drawer-side", sideClassName)}>
                <label className={cn("drawer-overlay", overlayClassName)} onClick={onClickOverlay}></label>
                {side}
            </div>
        </div>
    );
};

export default Drawer;
