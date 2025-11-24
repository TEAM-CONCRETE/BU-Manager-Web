"use client";

import { useEffect, useRef } from "react";

import { useRefreshSession } from "@/hooks/use-refresh-session";

export function AuthInitializer() {
  const hasAttempted = useRef(false);
  const { refetch, isFetching } = useRefreshSession(false);

  useEffect(() => {
    if (hasAttempted.current) return;
    hasAttempted.current = true;
    refetch();
  }, [refetch]);

  return isFetching ? null : null;
}
