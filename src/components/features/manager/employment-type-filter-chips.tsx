"use client";

import { cn } from "@/utils/cn";

export type EmploymentFilterValue = "ALL" | "REGULAR" | "DAILY";

type EmploymentTypeFilterChipsProps = {
  value: EmploymentFilterValue;
  onChange: (value: EmploymentFilterValue) => void;
  className?: string;
};

export function EmploymentTypeFilterChips({
  value,
  onChange,
  className,
}: EmploymentTypeFilterChipsProps) {
  const options: { label: string; value: EmploymentFilterValue }[] = [
    { label: "전체", value: "ALL" },
    { label: "상용", value: "REGULAR" },
    { label: "일용", value: "DAILY" },
  ];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-bg-subtle px-2 py-1 text-sm dark:bg-dark-bg-subtle",
        className,
      )}
    >
      <div className="flex gap-1">
        {options.map((option) => {
          const active = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition",
                active
                  ? "bg-brand-primary-strong text-white! shadow-sm"
                  : "bg-transparent text-text-subtle hover:bg-bg-surface/70 dark:text-dark-text-base dark:hover:bg-dark-bg-surface/70",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
