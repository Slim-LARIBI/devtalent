"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 select-none",
  {
    variants: {
      variant: {
        // Primary brand button — electric blue with glow
        brand:
          "rounded-lg bg-brand text-white shadow-brand-glow hover:bg-brand-dark hover:shadow-brand-glow-lg active:scale-[0.97] active:shadow-none",
        // Brand outlined — for secondary CTAs
        "brand-outline":
          "rounded-lg border border-brand/40 text-brand bg-brand-muted/30 hover:bg-brand-muted/60 hover:border-brand/60 active:scale-[0.97]",
        // Default — uses primary token
        default:
          "rounded-lg bg-primary text-primary-foreground shadow-elevation-1 hover:bg-primary/90 active:scale-[0.97]",
        // Secondary — surface background
        secondary:
          "rounded-lg bg-surface-raised border border-border text-text-primary hover:bg-surface-overlay hover:border-border-strong active:scale-[0.97]",
        // Ghost — no background until hover
        ghost:
          "rounded-lg text-text-secondary hover:bg-surface-raised hover:text-text-primary",
        // Outline — border only
        outline:
          "rounded-lg border border-border bg-transparent text-text-primary hover:bg-surface-raised hover:border-border-strong active:scale-[0.97]",
        // Destructive
        destructive:
          "rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-elevation-1 active:scale-[0.97]",
        // Destructive ghost
        "destructive-ghost":
          "rounded-lg text-destructive hover:bg-destructive-muted/40",
        // Link-style
        link: "text-brand underline-offset-4 hover:underline h-auto p-0",
      },
      size: {
        xs:      "h-7 px-2.5 text-xs rounded-md",
        sm:      "h-8 px-3 text-xs",
        default: "h-10 px-5 text-sm",
        lg:      "h-11 px-6 text-sm",
        xl:      "h-13 px-8 text-base font-semibold rounded-xl",
        "2xl":   "h-14 px-10 text-base font-semibold rounded-xl",
        icon:    "h-10 w-10",
        "icon-sm": "h-8 w-8 rounded-md",
        "icon-xs": "h-7 w-7 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <span className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin shrink-0" />
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
