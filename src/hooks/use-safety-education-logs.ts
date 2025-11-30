"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getSafetyEducationLogs,
  type GetSafetyEducationLogsParams,
  type GetSafetyEducationLogsResponse,
} from "@/lib/api/get-safety-education-logs";

type UseSafetyEducationLogsOptions = {
  enabled?: boolean;
};

export function useSafetyEducationLogs(
  params: GetSafetyEducationLogsParams,
  options?: UseSafetyEducationLogsOptions,
) {
  return useQuery<GetSafetyEducationLogsResponse>({
    queryKey: ["safety-education-logs", "list", params.siteId, params.year, params.month],
    queryFn: () => getSafetyEducationLogs(params),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: options?.enabled ?? true,
  });
}
