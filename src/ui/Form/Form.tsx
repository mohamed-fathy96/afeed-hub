import { FormHTMLAttributes, ReactElement, forwardRef } from "react";

import { cn } from "@app/helpers";

import { IComponentBaseProps } from "../types";

export type FormProps = FormHTMLAttributes<HTMLFormElement> & IComponentBaseProps;

const Form = forwardRef<HTMLFormElement, FormProps>(
    ({ children, dataTheme, className, ...props }, ref): ReactElement => {
        const classes = cn("form-control", className);

        return (
            <form role="form" {...props} data-theme={dataTheme} className={classes} ref={ref}>
                {children}
            </form>
        );
    },
);

Form.displayName = "Form";

export default Form;
