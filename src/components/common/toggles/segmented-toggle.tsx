"use client";

import { cn } from "@/utils/cn";

export type SegmentedToggleOption<TValue extends string = string> = {
  label: string;
  value: TValue;
};

type SegmentedToggleProps<TValue extends string = string> = {
  value: TValue;
  onChange: (value: TValue) => void;
  options: SegmentedToggleOption<TValue>[];
  className?: string;
};

export function SegmentedToggle<TValue extends string = string>({
  value,
  onChange,
  options,
  className,
}: SegmentedToggleProps<TValue>) {
  return (
    <div
      className={cn(
        "flex rounded-2xl bg-brand-primary-soft p-1 text-sm text-text-subtle shadow-sm dark:bg-dark-bg-surface dark:text-dark-text-base",
        className,
      )}
    >
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
