"use client";

import { useState, type ReactNode } from "react";

import {
  SidebarNavigation,
  type SidebarNavigationProps,
} from "@/components/common/SidebarNavigation/sidebar-navigation";

interface SidebarLayoutProps extends SidebarNavigationProps {
  children: ReactNode;
  collapsedWidth?: number;
  expandedWidth?: number;
}

export function SidebarLayout({
  children,
  collapsedWidth = 64,
  expandedWidth = 256,
  ...sidebarProps
}: SidebarLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? collapsedWidth : expandedWidth;

  return (
    <div className="flex h-screen overflow-hidden bg-bg-page dark:bg-dark-bg-page">
      <div className="h-full transition-[width] duration-300" style={{ width: sidebarWidth }}>
        <SidebarNavigation
          {...sidebarProps}
          collapsed={collapsed}
          onCollapseChange={setCollapsed}
        />
      </div>
      <main className="flex-1 overflow-y-auto transition-all duration-300">{children}</main>
    </div>
  );
}
