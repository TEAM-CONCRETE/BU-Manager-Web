"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

import { cn } from "@/utils/cn";

const variantClasses = {
  success:
    "bg-state-success/10 text-state-success border border-state-success/20 dark:bg-state-success/20 dark:text-state-success dark:border-state-success/30",
  danger:
    "bg-state-danger/10 text-state-danger border border-state-danger/20 dark:bg-state-danger/20 dark:text-state-danger dark:border-state-danger/30",
  warning:
    "bg-state-warning/15 text-state-warning border border-state-warning/20 dark:bg-state-warning/20 dark:text-state-warning",
  info: "bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20 dark:bg-brand-secondary/20 dark:text-brand-secondary",
  neutral:
    "bg-bg-subtle text-text-strong border border-border dark:bg-dark-bg-surface dark:text-dark-text-strong dark:border-dark-border",
};

const dotClasses = {
  success: "bg-state-success",
  danger: "bg-state-danger",
  warning: "bg-state-warning",
  info: "bg-brand-secondary",
  neutral: "bg-text-base dark:bg-dark-text-base",
};

type StatusVariant = keyof typeof variantClasses;

export interface StatusPillProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: StatusVariant;
  size?: "sm" | "md";
  icon?: ReactNode;
  dot?: boolean;
}

export const StatusPill = forwardRef<HTMLSpanElement, StatusPillProps>(
  ({ className, variant = "info", size = "md", dot = true, icon, children, ...props }, ref) => {
    const dotSize = size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2";

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-3 font-medium transition-colors",
          size === "sm" ? "py-1 text-xs" : "py-1.5 text-sm",
          variantClasses[variant],
          className,
        )}
        {...props}
      >
        {icon ? (
          <span className="flex items-center text-current">{icon}</span>
        ) : (
          dot && <span className={cn("rounded-full", dotSize, dotClasses[variant])} />
        )}
        <span>{children}</span>
      </span>
    );
  },
);

StatusPill.displayName = "StatusPill";
