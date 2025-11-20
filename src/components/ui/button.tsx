import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

import { cn } from "@/utils/cn";

const variantClasses = {
  primary:
    "bg-brand-primary text-white hover:bg-brand-primary-strong focus-visible:outline focus-visible:outline-brand-primary",
  secondary:
    "bg-brand-secondary text-white hover:bg-brand-secondary/90 focus-visible:outline focus-visible:outline-brand-secondary",
  soft: "bg-brand-primary-soft/70 text-brand-primary-strong hover:bg-brand-primary-soft/90 focus-visible:outline focus-visible:outline-brand-primary dark:bg-dark-bg-surface/30 dark:text-dark-text-strong dark:border-dark-border/60",
  ghost:
    "bg-transparent border border-border text-text-strong hover:bg-bg-subtle focus-visible:outline focus-visible:outline-brand-secondary dark:text-dark-text-strong dark:border-dark-border dark:hover:bg-dark-bg-surface/60",
  subtle:
    "bg-bg-subtle text-text-strong hover:bg-bg-subtle/80 dark:bg-dark-bg-surface dark:text-dark-text-base",
};

const sizeClasses = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm sm:text-base",
  lg: "h-12 px-5 text-base sm:text-lg",
  xl: "h-14 px-6 text-base sm:text-lg",
  icon: "h-11 w-11 p-0",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantClasses;
  size?: keyof typeof sizeClasses;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      leftIcon,
      rightIcon,
      children,
      isLoading,
      disabled,
      fullWidth,
      ...props
    },
    ref,
  ) => {
    const contentHidden = isLoading;

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:pointer-events-none",
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && "w-full",
          className,
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white dark:border-dark-text-base/40 dark:border-t-dark-text-base" />
        )}
        {!contentHidden && leftIcon ? (
          <span className="flex items-center text-inherit">{leftIcon}</span>
        ) : null}
        <span className={cn("whitespace-nowrap", contentHidden && "opacity-0")}>{children}</span>
        {!contentHidden && rightIcon ? (
          <span className="flex items-center text-inherit">{rightIcon}</span>
        ) : null}
      </button>
    );
  },
);

Button.displayName = "Button";
