"use client";

import { Suspense, type ReactNode } from "react";

import { RoleGuard } from "@/components/auth/role-guard";

type CompanyLayoutProps = {
  children: ReactNode;
};

export default function CompanyLayout({ children }: CompanyLayoutProps) {
  return (
    <RoleGuard
      allowedRoles={["company"]}
      unauthenticatedRedirect="/login/company"
      roleRedirectMap={{ siteManager: "/login/site-manager" }}
    >
      <Suspense fallback={null}>{children}</Suspense>
    </RoleGuard>
  );
}
