import { HTMLAttributes, forwardRef } from "react";

import { cn } from "@app/helpers";

import { ComponentColor, IComponentBaseProps } from "../types";

export type ChatBubbleMessageProps = HTMLAttributes<HTMLDivElement> &
    IComponentBaseProps & {
        color?: ComponentColor;
    };

const ChatBubbleMessage = forwardRef<HTMLDivElement, ChatBubbleMessageProps>(({ color, className, ...props }, ref) => {
    const classes = cn(
        "chat-bubble",
        {
            "chat-bubble-primary": color === "primary",
            "chat-bubble-secondary": color === "secondary",
            "chat-bubble-accent": color === "accent",
            "chat-bubble-info": color === "info",
            "chat-bubble-success": color === "success",
            "chat-bubble-warning": color === "warning",
            "chat-bubble-error": color === "error",
        },
        className,
    );

    return <div {...props} className={classes} ref={ref} />;
});

ChatBubbleMessage.displayName = "Chat Bubble Message";

export default ChatBubbleMessage;
