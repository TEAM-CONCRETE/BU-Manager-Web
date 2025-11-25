"use client";

import { useState } from "react";
import Link from "next/link";

import { cn } from "@/utils/cn";

export type CompanyTopNavItem = {
  id: string;
  label: string;
  href?: string;
};

type CompanyTopNavProps = {
  items: CompanyTopNavItem[];
  defaultActiveId?: string;
  onSelect?: (id: string) => void;
};

export function CompanyTopNav({ items, defaultActiveId, onSelect }: CompanyTopNavProps) {
  const [activeId, setActiveId] = useState(defaultActiveId ?? items[0]?.id);

  const handleSelect = (id: string) => {
    setActiveId(id);
    onSelect?.(id);
  };

  return (
    <nav className="flex items-center gap-3 rounded-2xl border border-border bg-bg-surface px-4 py-3 dark:border-dark-border dark:bg-dark-bg-surface">
      {items.map((item) => {
        const isActive = item.id === activeId;
        const className = cn(
          "rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
          isActive
            ? "bg-brand-primary !text-white shadow-lg dark:text-white"
            : "text-text-subtle hover:text-text-strong dark:text-dark-text-base",
        );

        if (item.href) {
          return (
            <Link
              key={item.id}
              href={item.href}
              className={className}
              onClick={() => handleSelect(item.id)}
            >
              {item.label}
            </Link>
          );
        }

        return (
          <button
            key={item.id}
            type="button"
            className={className}
            onClick={() => handleSelect(item.id)}
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
