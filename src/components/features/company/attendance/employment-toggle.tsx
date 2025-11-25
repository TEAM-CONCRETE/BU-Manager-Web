"use client";

import { cn } from "@/utils/cn";

export type EmploymentType = "regular" | "daily";

type EmploymentToggleOption = {
  label: string;
  value: EmploymentType;
};

type EmploymentToggleProps = {
  value: EmploymentType;
  onChange: (value: EmploymentType) => void;
  options?: EmploymentToggleOption[];
};

const defaultOptions: EmploymentToggleOption[] = [
  { label: "상용직 근로자", value: "regular" },
  { label: "일용직 근로자", value: "daily" },
];

export function EmploymentToggle({
  value,
  onChange,
  options = defaultOptions,
}: EmploymentToggleProps) {
  return (
    <div className="flex rounded-2xl bg-brand-primary-soft p-1 text-sm text-text-subtle shadow-sm dark:bg-dark-bg-surface dark:text-dark-text-base">
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "min-w-[132px] rounded-xl px-5 py-2 font-medium transition-colors",
              isActive
                ? "bg-brand-primary text-white shadow hover:bg-brand-primary/90"
                : "text-text-subtle hover:text-text-strong dark:text-dark-text-base",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
