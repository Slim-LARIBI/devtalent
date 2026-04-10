import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva("rounded-xl transition-all duration-200", {
  variants: {
    variant: {
      // Default — solid surface
      default: "border border-border bg-surface shadow-elevation-2",
      // Elevated — slightly brighter surface, stronger shadow
      elevated: "border border-border-strong bg-surface-raised shadow-elevation-3",
      // Glass morphism
      glass: "border border-border/60 bg-surface/60 backdrop-blur-md shadow-elevation-2",
      // Transparent with just a border — for data sections
      outline: "border border-border bg-transparent",
      // Interactive — default with hover state
      interactive:
        "border border-border bg-surface shadow-elevation-2 cursor-pointer hover:border-border-strong hover:bg-surface-raised hover:shadow-elevation-3",
      // Brand accent — subtle brand highlight
      brand:
        "border border-brand/20 bg-brand-muted/10 shadow-elevation-1",
      // Ghost — minimal, just subtle bg
      ghost: "bg-surface-raised/50",
    },
  },
  defaultVariants: { variant: "default" },
});

// ─── Card Root ────────────────────────────────────────────────────────────────

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(cardVariants({ variant, className }))} {...props} />
  )
);
Card.displayName = "Card";

// ─── Card Header ─────────────────────────────────────────────────────────────

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

// ─── Card Title ───────────────────────────────────────────────────────────────

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-base font-semibold leading-tight text-text-primary", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

// ─── Card Description ─────────────────────────────────────────────────────────

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-text-secondary leading-relaxed", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

// ─── Card Content ─────────────────────────────────────────────────────────────

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

// ─── Card Footer ──────────────────────────────────────────────────────────────

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-3 p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
