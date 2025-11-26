"use client";

import { useEffect } from "react";

import { useQuery } from "@tanstack/react-query";

import { useSessionStore } from "@/stores/session-store";

import { refreshToken } from "@/lib/api/refresh-token";
import { mapRoleToSessionRole } from "@/utils/map-role";

export function useRefreshSession(enabled = true) {
  const setUser = useSessionStore((state) => state.setUser);
  const clearUser = useSessionStore((state) => state.clear);

  const query = useQuery({
    queryKey: ["auth", "refresh"],
    queryFn: refreshToken,
    enabled,
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!query.isSuccess || !query.data) return;
    const mappedRole = mapRoleToSessionRole(query.data.role);
    if (!mappedRole) {
      clearUser();
      return;
    }

    setUser({
      id: query.data.userId,
      name: query.data.userName,
      email: query.data.userId,
      role: mappedRole,
      siteId: query.data.siteId,
    });
  }, [query.isSuccess, query.data, clearUser, setUser]);

  useEffect(() => {
    if (!query.isError) return;
    clearUser();
  }, [query.isError, clearUser]);

  return query;
}
