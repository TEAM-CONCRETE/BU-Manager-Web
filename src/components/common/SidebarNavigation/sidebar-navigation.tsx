"use client";

import { useState, useEffect, type ReactNode } from "react";
import Image from "next/image";
import { SearchOutlined, PlusOutlined, MenuOutlined } from "@ant-design/icons";

import { cn } from "@/utils/cn";
import { Input } from "@/components/ui/Input/input";
import { SidebarHeader } from "./components/sidebar-header";
import { SidebarMenu } from "./components/sidebar-menu";
import { SidebarFooter } from "./components/sidebar-footer";

export interface SidebarMenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
  active?: boolean;
}

export interface SidebarNavigationProps {
  logo?: ReactNode;
  logoText?: string;
  logoHref?: string;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  searchValue?: string;
  menuItems: SidebarMenuItem[];
  bottomAction?: {
    label: string;
    icon?: ReactNode;
    onClick: () => void;
  };
  className?: string;
  collapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
  responsive?: boolean;
  mobileBreakpoint?: number;
  showCollapseToggle?: boolean;
}

export function SidebarNavigation({
  logo,
  logoText = "Build-Up",
  logoHref = "/",
  searchPlaceholder = "검색...",
  onSearch,
  searchValue: controlledSearchValue,
  menuItems,
  bottomAction,
  className,
  collapsed: controlledCollapsed,
  onCollapseChange,
  responsive = true,
  mobileBreakpoint = 1024,
  showCollapseToggle = true,
}: SidebarNavigationProps) {
  const [internalSearchValue, setInternalSearchValue] = useState("");
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const searchValue = controlledSearchValue ?? internalSearchValue;
  const collapsed = controlledCollapsed ?? internalCollapsed;

  useEffect(() => {
    if (!responsive) return;
    const checkMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
      if (window.innerWidth >= mobileBreakpoint) setIsMobileOpen(false);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [responsive, mobileBreakpoint]);

  const handleSearchChange = (value: string) => {
    if (controlledSearchValue === undefined) setInternalSearchValue(value);
    onSearch?.(value);
  };

  const handleMobileToggle = () => setIsMobileOpen((prev) => !prev);
  const handleMobileClose = () => setIsMobileOpen(false);

  const handleCollapseToggle = () => {
    const next = !collapsed;
    if (controlledCollapsed === undefined) setInternalCollapsed(next);
    onCollapseChange?.(next);
  };

  const defaultLogo = (
    <div className="flex h-10 w-10 items-center justify-center overflow-hidden">
      <Image
        src="/assets/service_logo.svg"
        alt="Build-Up"
        width={40}
        height={40}
        priority
        className="h-full w-full object-cover scale-[1.25]"
      />
    </div>
  );

  const sidebarContent = (isOverlayOpen: boolean) => (
    <>
      <SidebarHeader
        collapsed={collapsed}
        logo={logo}
        logoText={logoText}
        logoHref={logoHref}
        defaultLogo={defaultLogo}
        isOverlayOpen={isOverlayOpen}
        onCloseOverlay={handleMobileClose}
      />

      {!collapsed && (
        <div className="border-b border-border px-4 py-3 dark:border-dark-border">
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            prefix={<SearchOutlined className="text-text-subtle dark:text-dark-text-base" />}
            variant="subtle"
            size="sm"
            className="w-full"
          />
        </div>
      )}

      <SidebarMenu
        items={menuItems}
        collapsed={collapsed}
        isOverlayOpen={isOverlayOpen}
        onNavigate={handleMobileClose}
      />

      <SidebarFooter
        collapsed={collapsed}
        label={bottomAction?.label}
        icon={bottomAction?.icon ?? <PlusOutlined />}
        onClick={bottomAction?.onClick}
        isOverlayOpen={isOverlayOpen}
        onCloseOverlay={handleMobileClose}
      />
    </>
  );

  if (responsive && isMobile) {
    return (
      <>
        <button
          type="button"
          onClick={handleMobileToggle}
          className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-bg-surface text-text-strong shadow-lg dark:bg-dark-bg-surface dark:text-dark-text-strong lg:hidden"
        >
          <MenuOutlined />
        </button>

        {isMobileOpen && (
          <>
            <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={handleMobileClose} />
            <aside
              className={cn(
                "fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-border bg-bg-surface shadow-xl transition-transform duration-300 dark:border-dark-border dark:bg-dark-bg-surface",
                isMobileOpen ? "translate-x-0" : "-translate-x-full",
                className,
              )}
            >
              {sidebarContent(true)}
            </aside>
          </>
        )}
      </>
    );
  }

  return (
    <div className="relative h-full">
      <aside
        className={cn(
          "flex h-screen w-64 flex-col border-r border-border bg-bg-surface transition-all duration-300 dark:border-dark-border dark:bg-dark-bg-surface",
          collapsed && "w-16",
          className,
        )}
      >
        {sidebarContent(false)}
      </aside>
      {showCollapseToggle && (
        <button
          type="button"
          onClick={handleCollapseToggle}
          className={cn(
            "absolute top-6 flex h-9 w-9 translate-x-1/2 items-center justify-center rounded-md bg-bg-surface text-text-subtle",
            "dark:bg-dark-bg-surface dark:text-dark-text-base",
          )}
          style={{ right: collapsed ? -10 : -6 }}
          aria-label={collapsed ? "사이드바 펼치기" : "사이드바 접기"}
        >
          <Image
            src={
              collapsed ? "/assets/icons/sidebar-collapse.svg" : "/assets/icons/sidebar-expand.svg"
            }
            alt={collapsed ? "사이드바 펼치기" : "사이드바 접기"}
            width={20}
            height={20}
            className="h-5 w-5 dark:invert"
          />
        </button>
      )}
    </div>
  );
}
