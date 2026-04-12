"use client";

interface CompanyTooltipProps {
  companies: string[];
  visibleCount?: number;
}

export function CompanyTooltip({
  companies,
  visibleCount = 2,
}: CompanyTooltipProps) {
  const visible = companies.slice(0, visibleCount);
  const remaining = companies.slice(visibleCount);

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-text-primary">
        {companies.length} compan{companies.length > 1 ? "ies" : "y"}
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {visible.map((company) => (
          <span
            key={company}
            className="inline-flex items-center rounded-full bg-surface-secondary px-2.5 py-1 text-xs font-medium text-text-primary"
          >
            {company}
          </span>
        ))}

        {remaining.length > 0 && (
          <span
            title={remaining.join(" • ")}
            className="inline-flex items-center rounded-full bg-surface-secondary px-2.5 py-1 text-xs font-medium text-text-secondary hover:text-text-primary"
          >
            +{remaining.length} more
          </span>
        )}
      </div>
    </div>
  );
}