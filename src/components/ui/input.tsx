"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

import { cn } from "@/utils/cn";

const variantClasses = {
  default:
    "border-border hover:border-brand-primary focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/20 dark:border-dark-border dark:hover:border-brand-primary/70",
  error:
    "border-state-danger focus-within:border-state-danger focus-within:ring-2 focus-within:ring-state-danger/20 text-state-danger",
  subtle:
    "border-transparent bg-bg-subtle hover:border-border focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/15 dark:bg-dark-bg-surface/60",
};

const sizeClasses = {
  sm: "h-9 text-sm",
  md: "h-11 text-sm sm:text-base",
  lg: "h-12 text-base",
};

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix" | "suffix"> {
  label?: string;
  description?: string;
  error?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  size?: keyof typeof sizeClasses;
  variant?: keyof typeof variantClasses;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      description,
      error,
      prefix,
      suffix,
      size = "md",
      variant = "default",
      fullWidth = true,
      disabled,
      ...props
    },
    ref,
  ) => {
    const hasError = Boolean(error);
    const variantClass =
      variant === "default" && hasError ? variantClasses.error : variantClasses[variant];

    return (
      <label
        className={cn(
          "flex w-full flex-col gap-1 text-text-strong dark:text-dark-text-strong",
          fullWidth ? "w-full" : "w-max",
        )}
      >
        {label ? (
          <span className="text-sm font-medium text-text-strong dark:text-dark-text-strong">
            {label}
          </span>
        ) : null}
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg border bg-bg-surface px-3 transition-all dark:bg-dark-bg-surface",
            variantClass,
            disabled && "opacity-60 cursor-not-allowed",
          )}
        >
          {prefix ? (
            <span className="text-text-subtle dark:text-dark-text-base">{prefix}</span>
          ) : null}
          <input
            ref={ref}
            className={cn(
              "flex-1 bg-transparent text-text-base placeholder:text-text-subtle outline-none dark:text-dark-text-base dark:placeholder:text-dark-text-base/70",
              sizeClasses[size],
              className,
            )}
            disabled={disabled}
            {...props}
          />
          {suffix ? (
            <span className="text-text-subtle dark:text-dark-text-base">{suffix}</span>
          ) : null}
        </div>
        {hasError ? (
          <span className="text-sm text-state-danger">{error}</span>
        ) : description ? (
          <span className="text-sm text-text-subtle dark:text-dark-text-base">{description}</span>
        ) : null}
      </label>
    );
  },
);

Input.displayName = "Input";
