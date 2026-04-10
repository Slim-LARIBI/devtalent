import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  badge?: string;
  className?: string;
  size?: "sm" | "default" | "lg";
}

export function SectionHeader({
  title,
  description,
  action,
  badge,
  className,
  size = "default",
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="flex flex-col gap-1">
        {badge && (
          <span className="text-label-xs font-semibold uppercase tracking-widest text-brand">
            {badge}
          </span>
        )}
        <h2
          className={cn(
            "font-semibold text-text-primary tracking-tight",
            size === "sm"      && "text-base",
            size === "default" && "text-xl",
            size === "lg"      && "text-2xl"
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "text-text-secondary",
              size === "sm"      && "text-xs",
              size === "default" && "text-sm",
              size === "lg"      && "text-base"
            )}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
