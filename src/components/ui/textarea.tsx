import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[100px] w-full rounded-lg border bg-surface px-4 py-3 text-sm text-text-primary",
          "placeholder:text-text-muted",
          "transition-colors duration-150 resize-y",
          "focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error
            ? "border-destructive/60 focus:border-destructive focus:ring-destructive/20"
            : "border-border hover:border-border-strong",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
