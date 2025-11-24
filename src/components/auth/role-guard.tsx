"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useRefreshSession } from "@/hooks/use-refresh-session";
import { useSessionStore, type SessionUser } from "@/stores/session-store";

type RoleGuardProps = {
  allowedRoles: SessionUser["role"][];
  unauthenticatedRedirect: string;
  roleRedirectMap?: Partial<Record<SessionUser["role"], string>>;
  children: ReactNode;
};

export function RoleGuard({
  allowedRoles,
  unauthenticatedRedirect,
  roleRedirectMap,
  children,
}: RoleGuardProps) {
  const router = useRouter();
  const user = useSessionStore((state) => state.user);
  const [hasRequestedRefresh, setHasRequestedRefresh] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);
  const { refetch, isFetching } = useRefreshSession(false);

  useEffect(() => {
    if (user || hasRequestedRefresh || isFetching) return;
    setHasRequestedRefresh(true);
    refetch();
  }, [user, hasRequestedRefresh, isFetching, refetch]);

  useEffect(() => {
    if (isFetching) return;
    if (!user && !hasRedirected) {
      setHasRedirected(true);
      router.replace(unauthenticatedRedirect);
      return;
    }

    if (user && !allowedRoles.includes(user.role) && !hasRedirected) {
      const nextRoute = (roleRedirectMap && roleRedirectMap[user.role]) ?? unauthenticatedRedirect;
      setHasRedirected(true);
      router.replace(nextRoute);
    }
  }, [
    allowedRoles,
    hasRedirected,
    isFetching,
    roleRedirectMap,
    router,
    unauthenticatedRedirect,
    user,
  ]);

  const isAuthorized = !!user && allowedRoles.includes(user.role);
  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
