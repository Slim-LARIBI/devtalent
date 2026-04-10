import * as React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;    // e.g. 12 (for +12%)
    label?: string;   // e.g. "vs last month"
  };
  variant?: "default" | "brand" | "success" | "warning";
  className?: string;
  loading?: boolean;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  variant = "default",
  className,
  loading,
}: StatCardProps) {
  const trendPositive = trend && trend.value > 0;
  const trendNeutral  = trend && trend.value === 0;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-surface p-6 shadow-elevation-2 transition-all duration-200 hover:shadow-elevation-3",
        variant === "brand"   && "border-brand/20 bg-gradient-brand-subtle",
        variant === "success" && "border-success/20 bg-success-muted/30",
        variant === "warning" && "border-warning/20 bg-warning-muted/30",
        variant === "default" && "border-border",
        className
      )}
    >
      {/* Top row */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-label-sm font-medium text-text-secondary uppercase tracking-wider">
          {title}
        </p>
        {icon && (
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg [&_svg]:size-4.5",
              variant === "brand"
                ? "bg-brand-muted/60 text-brand-light"
                : variant === "success"
                ? "bg-success-muted text-success"
                : variant === "warning"
                ? "bg-warning-muted text-warning"
                : "bg-surface-overlay text-text-secondary"
            )}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Value */}
      {loading ? (
        <div className="space-y-2">
          <div className="h-8 w-20 rounded-md bg-surface-overlay animate-shimmer" />
          <div className="h-3 w-28 rounded-md bg-surface-overlay animate-shimmer" />
        </div>
      ) : (
        <>
          <p
            className={cn(
              "text-3xl font-bold tracking-tight",
              variant === "brand"
                ? "text-brand-light"
                : variant === "success"
                ? "text-success"
                : variant === "warning"
                ? "text-warning"
                : "text-text-primary"
            )}
          >
            {value}
          </p>

          {(description || trend) && (
            <div className="mt-1.5 flex items-center gap-2 flex-wrap">
              {trend && (
                <span
                  className={cn(
                    "inline-flex items-center gap-1 text-xs font-medium",
                    trendNeutral
                      ? "text-text-muted"
                      : trendPositive
                      ? "text-success"
                      : "text-destructive"
                  )}
                >
                  {trendNeutral ? (
                    <Minus className="h-3 w-3" />
                  ) : trendPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {trendPositive ? "+" : ""}
                  {trend.value}%
                </span>
              )}
              {description && (
                <p className="text-xs text-text-muted">{description}</p>
              )}
            </div>
          )}
        </>
      )}

      {/* Decorative gradient for brand variant */}
      {variant === "brand" && (
        <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-brand/10 blur-2xl" />
      )}
    </div>
  );
}
