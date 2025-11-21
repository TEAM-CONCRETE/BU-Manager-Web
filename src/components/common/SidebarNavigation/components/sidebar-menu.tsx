"use client";

import Link from "next/link";

import { cn } from "@/utils/cn";
import type { SidebarMenuItem } from "@/components/common/SidebarNavigation/sidebar-navigation";

interface SidebarMenuProps {
  items: SidebarMenuItem[];
  collapsed: boolean;
  isOverlayOpen: boolean;
  onNavigate?: () => void;
}

export function SidebarMenu({ items, collapsed, isOverlayOpen, onNavigate }: SidebarMenuProps) {
  const listPadding = collapsed ? "px-0 py-4" : "px-4 py-3";

  const renderItem = (item: SidebarMenuItem) => {
    const isActive = item.active ?? false;
    const content = (
      <div
        className={cn(
          "flex items-center text-base transition-colors",
          collapsed
            ? "mx-auto h-12 w-12 justify-center rounded-2xl border border-transparent"
            : "gap-3 rounded-lg px-3 py-3",
          isActive
            ? collapsed
              ? "bg-brand-primary/25 text-brand-primary border-brand-primary/40 dark:bg-brand-primary/30"
              : "bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20 dark:text-brand-primary"
            : collapsed
              ? "text-text-subtle hover:bg-bg-subtle/20 dark:text-dark-text-base dark:hover:bg-white/5"
              : "text-text-base hover:bg-bg-subtle dark:text-dark-text-base dark:hover:bg-dark-bg-surface/60",
        )}
      >
        {item.icon && (
          <span className={cn("flex items-center text-inherit", collapsed ? "text-xl" : undefined)}>
            {item.icon}
          </span>
        )}
        {!collapsed && <span className="flex-1">{item.label}</span>}
      </div>
    );

    if (item.href) {
      return (
        <Link
          key={item.id}
          href={item.href}
          className="block"
          onClick={isOverlayOpen ? onNavigate : undefined}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        key={item.id}
        type="button"
        onClick={() => {
          item.onClick?.();
          if (isOverlayOpen) onNavigate?.();
        }}
        className="w-full text-left"
      >
        {content}
      </button>
    );
  };

  return (
    <nav className={cn("flex-1 overflow-y-auto", listPadding)}>
      <ul className="flex flex-col gap-1">
        {items.map((item) => (
          <li key={item.id}>{renderItem(item)}</li>
        ))}
      </ul>
    </nav>
  );
}
