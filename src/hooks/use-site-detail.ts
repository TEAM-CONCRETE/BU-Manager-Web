"use client";

import { useQuery } from "@tanstack/react-query";

import { getSiteDetail, type SiteDetail } from "@/lib/api/get-site-detail";

export function useSiteDetail(siteId: number) {
  return useQuery<SiteDetail>({
    queryKey: ["site", "detail", siteId],
    queryFn: () => getSiteDetail(siteId),
    enabled: !!siteId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
