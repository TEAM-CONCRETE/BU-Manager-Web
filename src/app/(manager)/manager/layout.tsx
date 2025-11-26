"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { RoleGuard } from "@/components/auth/role-guard";
import { SidebarLayout } from "@/components/common/SidebarNavigation/sidebar-layout";
import type { SidebarMenuItem } from "@/components/common/SidebarNavigation/sidebar-navigation";
import { managerNavItems } from "@/constants/manager-nav";

type ManagerShellLayoutProps = {
  children: ReactNode;
};

const iconMap: Record<string, string> = {
  attendance: "/assets/icons/clock.svg",
  contracts: "/assets/icons/contract.svg",
  employees: "/assets/icons/people.svg",
  "work-daily": "/assets/icons/work-report.svg",
  "safety-education": "/assets/icons/graduate.svg",
};

function ManagerNavIcon({ id }: { id: string }) {
  const src = iconMap[id];
  if (!src) return null;

  return (
    <span className="flex h-5 w-5 items-center justify-center">
      <Image src={src} alt="" width={20} height={20} className="h-5 w-5" aria-hidden />
    </span>
  );
}

export default function ManagerShellLayout({ children }: ManagerShellLayoutProps) {
  const pathname = usePathname();

  const menuItems = useMemo<SidebarMenuItem[]>(() => {
    return managerNavItems.map((item) => ({
      id: item.id,
      label: item.label,
      href: item.href,
      icon: <ManagerNavIcon id={item.id} />,
      active: pathname?.startsWith(item.href) ?? false,
    }));
  }, [pathname]);

  return (
    <RoleGuard
      allowedRoles={["siteManager"]}
      unauthenticatedRedirect="/login/site-manager"
      roleRedirectMap={{ company: "/login/company" }}
    >
      <SidebarLayout
        menuItems={menuItems}
        searchPlaceholder="메뉴 또는 기능을 검색하세요"
        logoHref="/manager/attendance"
        collapsedWidth={64}
        expandedWidth={256}
      >
        <main className="min-h-screen bg-bg-page px-6 py-6 lg:px-8 dark:bg-dark-bg-page">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </SidebarLayout>
    </RoleGuard>
  );
}
