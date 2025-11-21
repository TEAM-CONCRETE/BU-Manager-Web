"use client";

import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

interface SidebarHeaderProps {
  collapsed: boolean;
  logo?: ReactNode;
  logoText: string;
  logoHref: string;
  defaultLogo: ReactNode;
  isOverlayOpen: boolean;
  onCloseOverlay?: () => void;
}

export function SidebarHeader({
  collapsed,
  logo,
  logoText,
  logoHref,
  defaultLogo,
  isOverlayOpen,
  onCloseOverlay,
}: SidebarHeaderProps) {
  const label = !collapsed && (
    <span className="text-2xl font-extrabold leading-none text-brand-primary">{logoText}</span>
  );

  return (
    <div className="flex items-center gap-3 border-b border-border px-4 py-3 dark:border-dark-border">
      {logoHref ? (
        <Link
          href={logoHref}
          className="flex items-center gap-1 font-sans"
          onClick={isOverlayOpen ? onCloseOverlay : undefined}
        >
          {logo ?? defaultLogo}
          {label}
        </Link>
      ) : (
        <div className="flex items-center gap-3 font-sans">
          {logo ?? defaultLogo}
          {label}
        </div>
      )}

      {isOverlayOpen ? (
        <button
          type="button"
          onClick={onCloseOverlay}
          className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg border border-transparent text-text-subtle transition-colors hover:border-brand-primary/40 hover:bg-brand-primary/10 hover:text-brand-primary dark:text-dark-text-base dark:hover:border-dark-border dark:hover:bg-dark-bg-surface/60 dark:hover:text-brand-primary"
          aria-label="사이드바 닫기"
        >
          <Image
            src="/assets/icons/sidebar-collapse.svg"
            alt="사이드바 닫기"
            width={20}
            height={20}
            className="h-5 w-5 dark:invert"
          />
        </button>
      ) : null}
    </div>
  );
}
