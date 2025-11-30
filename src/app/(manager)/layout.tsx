"use client";

import { Suspense, type ReactNode } from "react";

import { RoleGuard } from "@/components/auth/role-guard";

type ManagerLayoutProps = {
  children: ReactNode;
};

export default function ManagerLayout({ children }: ManagerLayoutProps) {
  return (
    <RoleGuard
      allowedRoles={["siteManager"]}
      unauthenticatedRedirect="/login/site-manager"
      roleRedirectMap={{ company: "/login/company" }}
    >
      <Suspense fallback={null}>{children}</Suspense>
    </RoleGuard>
  );
}
