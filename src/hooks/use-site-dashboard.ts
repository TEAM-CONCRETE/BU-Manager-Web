"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getSiteDashboard } from "@/lib/api/get-dashboard";
import type { SiteDashboard } from "@/types/dashboard";

export function useSiteDashboard(siteId: number) {
  return useQuery<SiteDashboard>({
    queryKey: ["site", "dashboard", siteId],
    queryFn: () => getSiteDashboard(siteId),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    placeholderData: keepPreviousData,
    enabled: !!siteId,
  });
}
