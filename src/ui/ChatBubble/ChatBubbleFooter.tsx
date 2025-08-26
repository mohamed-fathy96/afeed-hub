import { HTMLAttributes, forwardRef } from "react";

import { cn } from "@app/helpers";

import { IComponentBaseProps } from "../types";

export type ChatBubbleFooterProps = HTMLAttributes<HTMLDivElement> & IComponentBaseProps;

const ChatBubbleFooter = forwardRef<HTMLDivElement, ChatBubbleFooterProps>(({ className, ...props }, ref) => (
    <div {...props} className={cn("chat-footer opacity-50", className)} ref={ref} />
));

ChatBubbleFooter.displayName = "Chat Bubble Footer";

export default ChatBubbleFooter;
