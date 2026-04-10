"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
    required?: boolean;
    hint?: string;
  }
>(({ className, required, hint, children, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "flex items-center gap-1 text-sm font-medium text-text-primary leading-none",
      "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  >
    {children}
    {required && <span className="text-destructive">*</span>}
    {hint && (
      <span className="ml-auto text-xs font-normal text-text-muted">{hint}</span>
    )}
  </LabelPrimitive.Root>
));
Label.displayName = "Label";

export { Label };
