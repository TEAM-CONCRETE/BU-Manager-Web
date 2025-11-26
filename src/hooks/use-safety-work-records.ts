"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  getSafetyWorkRecords,
  type GetSafetyWorkRecordsParams,
  type GetSafetyWorkRecordsResponse,
} from "@/lib/api/get-safety-work-records";

export function useSafetyWorkRecords(params: GetSafetyWorkRecordsParams) {
  return useQuery<GetSafetyWorkRecordsResponse>({
    queryKey: [
      "safety",
      "work-records",
      params.siteId,
      params.year,
      params.month,
      params.page,
      params.size,
    ],
    queryFn: () => getSafetyWorkRecords(params),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    placeholderData: keepPreviousData,
  });
}
