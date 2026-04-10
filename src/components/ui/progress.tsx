"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorClassName?: string;
  showValue?: boolean;
  variant?: "default" | "brand" | "success" | "warning";
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, indicatorClassName, showValue, variant = "default", ...props }, ref) => (
  <div className="flex items-center gap-3">
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-surface-overlay",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 rounded-full transition-all duration-500 ease-out-expo",
          variant === "brand"   && "bg-brand",
          variant === "success" && "bg-success",
          variant === "warning" && "bg-warning",
          variant === "default" && "bg-brand",
          indicatorClassName
        )}
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      />
    </ProgressPrimitive.Root>
    {showValue && (
      <span className="shrink-0 text-xs font-medium text-text-secondary w-8 text-right">
        {Math.round(value ?? 0)}%
      </span>
    )}
  </div>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
