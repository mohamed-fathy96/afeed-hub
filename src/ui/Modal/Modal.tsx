import { HTMLAttributes, ReactElement, forwardRef } from "react";

import { cn } from "@app/helpers";

import { IComponentBaseProps } from "../types";
import { twMerge } from "tailwind-merge";

export type ModalProps = HTMLAttributes<HTMLDialogElement> &
  IComponentBaseProps & {
    open?: boolean;
    responsive?: boolean;
    backdrop?: boolean;
    onClose?: () => void;
  };

const Modal = forwardRef<HTMLDialogElement, ModalProps>(
  (
    {
      children,
      open,
      responsive,
      backdrop,
      dataTheme,
      className,
      onClose,
      ...props
    },
    ref
  ): ReactElement => {
    const containerClasses = cn("modal", {
      "modal-bottom sm:modal-middle": responsive,
    });

    const bodyClasses = cn("modal-box", className);

    return (
      <dialog
        {...props}
        aria-label="Modal"
        aria-hidden={!open}
        open={open}
        aria-modal={open}
        data-theme={dataTheme}
        className={twMerge(containerClasses, open ? "modal-open" : "")}
        ref={ref}
      >
        <div data-theme={dataTheme} className={bodyClasses}>
          {children}
        </div>
        {backdrop && (
          <form method="dialog">
            <button onClick={onClose}>close</button>
          </form>
        )}
      </dialog>
    );
  }
);

Modal.displayName = "Modal";

export default Modal;

export type DialogProps = Omit<ModalProps, "ref">;
