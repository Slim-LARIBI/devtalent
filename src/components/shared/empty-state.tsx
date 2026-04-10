import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
  compact?: boolean;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "py-12 px-6" : "py-20 px-8",
        className
      )}
    >
      {icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-surface-raised text-text-muted [&_svg]:size-7">
          {icon}
        </div>
      )}
      <h3
        className={cn(
          "font-semibold text-text-primary mb-1.5",
          compact ? "text-base" : "text-lg"
        )}
      >
        {title}
      </h3>
      {description && (
        <p
          className={cn(
            "text-text-secondary max-w-sm leading-relaxed",
            compact ? "text-sm" : "text-sm"
          )}
        >
          {description}
        </p>
      )}
      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          {action && (
            <Button
              variant="brand"
              size="default"
              asChild={!!action.href}
              onClick={action.onClick}
            >
              {action.href ? <a href={action.href}>{action.label}</a> : action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="secondary"
              size="default"
              asChild={!!secondaryAction.href}
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.href ? (
                <a href={secondaryAction.href}>{secondaryAction.label}</a>
              ) : (
                secondaryAction.label
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
