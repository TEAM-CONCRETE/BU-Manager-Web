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
  const [refreshStatus, setRefreshStatus] = useState<"idle" | "pending" | "success" | "error">(
    user ? "success" : "idle",
  );
  const [hasRedirected, setHasRedirected] = useState(false);
  const { refetch, isFetching } = useRefreshSession(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (user || hasRequestedRefresh) return;
    setHasRequestedRefresh(true);
    setIsRefreshing(true);
    setRefreshStatus("pending");
    refetch()
      .then(() => {
        setRefreshStatus("success");
      })
      .catch(() => {
        setRefreshStatus("error");
      })
      .finally(() => {
        setIsRefreshing(false);
      });
  }, [user, hasRequestedRefresh, refetch]);

  useEffect(() => {
    const hasSession = !!user;
    const shouldWait =
      isFetching ||
      isRefreshing ||
      (!hasSession && !hasRequestedRefresh) ||
      refreshStatus === "pending" ||
      (refreshStatus === "success" && !hasSession);

    if (shouldWait) {
      return;
    }

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
    isRefreshing,
    hasRequestedRefresh,
    refreshStatus,
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
