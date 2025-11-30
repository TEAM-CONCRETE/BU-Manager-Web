"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  getSafetyEducationReports,
  type GetSafetyEducationReportsParams,
  type GetSafetyEducationReportsResponse,
} from "@/lib/api/get-safety-education-reports";

type UseSafetyEducationReportsOptions = {
  enabled?: boolean;
};

export function useSafetyEducationReports(
  params: GetSafetyEducationReportsParams,
  options?: UseSafetyEducationReportsOptions,
) {
  return useQuery<GetSafetyEducationReportsResponse>({
    queryKey: [
      "safety-education-reports",
      "list",
      params.siteId,
      params.page,
      params.size,
      params.year,
      params.month,
    ],
    queryFn: () => getSafetyEducationReports(params),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    placeholderData: keepPreviousData,
    enabled: options?.enabled ?? true,
  });
}
