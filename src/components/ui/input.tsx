import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leftIcon, rightIcon, error, ...props }, ref) => {
    if (leftIcon || rightIcon) {
      return (
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3.5 text-text-muted [&_svg]:size-4">
              {leftIcon}
            </span>
          )}
          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-lg border bg-surface px-4 py-2.5 text-sm text-text-primary",
              "placeholder:text-text-muted",
              "transition-colors duration-150",
              "focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error
                ? "border-destructive/60 focus:border-destructive focus:ring-destructive/20"
                : "border-border hover:border-border-strong",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <span className="pointer-events-none absolute right-3.5 text-text-muted [&_svg]:size-4">
              {rightIcon}
            </span>
          )}
        </div>
      );
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border bg-surface px-4 py-2.5 text-sm text-text-primary",
          "placeholder:text-text-muted",
          "transition-colors duration-150",
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
Input.displayName = "Input";

export { Input };
