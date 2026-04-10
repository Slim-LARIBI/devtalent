import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border font-medium transition-colors",
  {
    variants: {
      variant: {
        // Neutral
        default:   "border-border bg-surface-raised text-text-secondary text-xs px-2.5 py-0.5",
        outline:   "border-border bg-transparent text-text-secondary text-xs px-2.5 py-0.5",
        // Brand
        brand:     "border-brand/30 bg-brand-muted/50 text-brand-light text-xs px-2.5 py-0.5",
        // Semantic
        success:   "border-success/30 bg-success-muted text-success text-xs px-2.5 py-0.5",
        warning:   "border-warning/30 bg-warning-muted text-warning text-xs px-2.5 py-0.5",
        error:     "border-destructive/30 bg-destructive-muted text-destructive text-xs px-2.5 py-0.5",
        info:      "border-info/30 bg-info-muted text-info text-xs px-2.5 py-0.5",
        // Application statuses
        "status-new":          "border-info/30 bg-info-muted text-info text-xs px-2.5 py-0.5",
        "status-reviewed":     "border-warning/30 bg-warning-muted text-warning text-xs px-2.5 py-0.5",
        "status-shortlisted":  "border-brand/30 bg-brand-muted/50 text-brand-light text-xs px-2.5 py-0.5",
        "status-rejected":     "border-destructive/30 bg-destructive-muted text-destructive text-xs px-2.5 py-0.5",
        "status-hired":        "border-success/30 bg-success-muted text-success text-xs px-2.5 py-0.5",
        // Mission statuses
        "mission-draft":       "border-border bg-surface-raised text-text-muted text-xs px-2.5 py-0.5",
        "mission-published":   "border-success/30 bg-success-muted text-success text-xs px-2.5 py-0.5",
        "mission-closed":      "border-destructive/30 bg-destructive-muted text-destructive text-xs px-2.5 py-0.5",
        "mission-archived":    "border-border bg-surface-raised text-text-disabled text-xs px-2.5 py-0.5",
        // Level badges
        "level-junior":        "border-info/30 bg-info-muted text-info text-xs px-2.5 py-0.5",
        "level-mid":           "border-brand/30 bg-brand-muted/50 text-brand-light text-xs px-2.5 py-0.5",
        "level-senior":        "border-warning/30 bg-warning-muted text-warning text-xs px-2.5 py-0.5",
        "level-principal":     "border-accent/30 bg-accent/10 text-accent text-xs px-2.5 py-0.5",
        "level-director":      "border-accent/40 bg-accent/15 text-accent-light text-xs px-2.5 py-0.5",
      },
      size: {
        sm: "text-xs px-2 py-0.5",
        default: "text-xs px-2.5 py-0.5",
        lg: "text-sm px-3 py-1",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, size, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size, className }))} {...props}>
      {dot && (
        <span
          className={cn(
            "inline-block h-1.5 w-1.5 rounded-full shrink-0",
            variant === "success" || variant === "status-hired" || variant === "mission-published"
              ? "bg-success"
              : variant === "warning" || variant === "status-reviewed"
              ? "bg-warning"
              : variant === "error" || variant === "status-rejected" || variant === "mission-closed"
              ? "bg-destructive"
              : variant === "status-shortlisted"
              ? "bg-brand"
              : "bg-current"
          )}
        />
      )}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
