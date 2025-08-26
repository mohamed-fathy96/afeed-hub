import { HTMLAttributes, forwardRef } from "react";

import { cn } from "@app/helpers";

import { IComponentBaseProps } from "../types";

export type ChatBubbleHeaderProps = HTMLAttributes<HTMLDivElement> & IComponentBaseProps;

const ChatBubbleHeader = forwardRef<HTMLDivElement, ChatBubbleHeaderProps>(({ className, ...props }, ref) => (
    <div {...props} className={cn("chat-header", className)} ref={ref} />
));

ChatBubbleHeader.displayName = "Chat Bubble Header";

export default ChatBubbleHeader;
