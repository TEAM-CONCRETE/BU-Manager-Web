"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/Button/button";

interface SidebarFooterProps {
  collapsed: boolean;
  label?: string;
  icon?: ReactNode;
  onClick?: () => void;
  isOverlayOpen: boolean;
  onCloseOverlay?: () => void;
}

export function SidebarFooter({
  collapsed,
  label,
  icon,
  onClick,
  isOverlayOpen,
  onCloseOverlay,
}: SidebarFooterProps) {
  if (!label || collapsed) return null;

  return (
    <div className="border-t border-border px-4 py-3 dark:border-dark-border">
      <Button
        variant="soft"
        size="md"
        leftIcon={icon}
        fullWidth
        onClick={() => {
          onClick?.();
          if (isOverlayOpen) onCloseOverlay?.();
        }}
      >
        {label}
      </Button>
    </div>
  );
}
