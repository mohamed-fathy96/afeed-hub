import { TimeHTMLAttributes, forwardRef } from "react";

import { cn } from "@app/helpers";

import { IComponentBaseProps } from "../types";

export type ChatBubbleTimeProps = TimeHTMLAttributes<HTMLTimeElement> & IComponentBaseProps;

const ChatBubbleTime = forwardRef<HTMLTimeElement, ChatBubbleTimeProps>(({ className, ...props }, ref) => (
    <time {...props} className={cn("text-xs opacity-50", className)} ref={ref} />
));

ChatBubbleTime.displayName = "Chat Bubble Time";

export default ChatBubbleTime;
