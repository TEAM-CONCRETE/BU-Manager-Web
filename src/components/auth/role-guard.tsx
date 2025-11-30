"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useRefreshSession } from "@/hooks/use-refresh-session";
import { useSessionStore, type SessionUser } from "@/stores/session-store";

function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-page dark:bg-dark-bg-page">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-brand-primary dark:border-dark-border dark:border-t-brand-primary" />
        <p className="text-sm text-text-subtle dark:text-dark-text-base">로딩 중...</p>
      </div>
    </div>
  );
}

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
    if (user || hasRequestedRefresh || isFetching) return;
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
  }, [user, hasRequestedRefresh, isFetching, refetch]);

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
  const isLoading =
    isFetching ||
    isRefreshing ||
    refreshStatus === "pending" ||
    (!user && !hasRedirected && hasRequestedRefresh);

  // Next.js의 loading.tsx와 동일한 UI를 표시
  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
