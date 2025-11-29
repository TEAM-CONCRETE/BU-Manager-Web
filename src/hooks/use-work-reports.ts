"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  getWorkReports,
  type GetWorkReportsParams,
  type GetWorkReportsResponse,
} from "@/lib/api/get-work-reports";

type UseWorkReportsOptions = {
  enabled?: boolean;
};

export function useWorkReports(params: GetWorkReportsParams, options?: UseWorkReportsOptions) {
  return useQuery<GetWorkReportsResponse>({
    queryKey: [
      "work-reports",
      "list",
      params.siteId,
      params.page,
      params.size,
      params.year,
      params.month,
    ],
    queryFn: () => getWorkReports(params),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    placeholderData: keepPreviousData,
    enabled: options?.enabled ?? true,
  });
}
