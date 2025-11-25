"use client";

import type { SelectProps } from "antd";
import { Select } from "antd";

import { cn } from "@/utils/cn";

export type InlineDateValue = {
  year: string;
  month: string;
  day: string;
};

export type InlineDateOption = {
  label: string;
  value: string;
};

type InlineDateFiltersProps = {
  value: InlineDateValue;
  yearOptions: InlineDateOption[];
  monthOptions: InlineDateOption[];
  dayOptions: InlineDateOption[];
  onChange: (value: InlineDateValue) => void;
  className?: string;
  selectProps?: SelectProps;
  popupClassName?: string;
  hideDay?: boolean;
};

export function InlineDateFilters({
  value,
  yearOptions,
  monthOptions,
  dayOptions,
  onChange,
  className,
  selectProps,
  popupClassName = "inline-date-filters-dropdown",
  hideDay = false,
}: InlineDateFiltersProps) {
  const handleChange = (key: keyof InlineDateValue) => (selected: string) => {
    onChange({ ...value, [key]: selected });
  };

  const sharedSelectProps = {
    size: "large" as SelectProps["size"],
    bordered: true,
    ...selectProps,
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <Select
        {...sharedSelectProps}
        className={cn("w-28 md:w-32", sharedSelectProps.className)}
        options={yearOptions}
        value={value.year}
        onChange={handleChange("year")}
        popupClassName={popupClassName}
      />
      <Select
        {...sharedSelectProps}
        className={cn("w-24 md:w-28", sharedSelectProps.className)}
        options={monthOptions}
        value={value.month}
        onChange={handleChange("month")}
        popupClassName={popupClassName}
      />
      {!hideDay && (
        <Select
          {...sharedSelectProps}
          className={cn("w-24 md:w-28", sharedSelectProps.className)}
          options={dayOptions}
          value={value.day}
          onChange={handleChange("day")}
          popupClassName={popupClassName}
        />
      )}
    </div>
  );
}
