"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getSafetyEducationLogEmployees,
  type GetSafetyEducationLogEmployeesParams,
  type GetSafetyEducationLogEmployeesResponse,
} from "@/lib/api/get-safety-education-log-employees";

type UseSafetyEducationLogEmployeesOptions = {
  enabled?: boolean;
};

export function useSafetyEducationLogEmployees(
  params: GetSafetyEducationLogEmployeesParams,
  options?: UseSafetyEducationLogEmployeesOptions,
) {
  return useQuery<GetSafetyEducationLogEmployeesResponse>({
    queryKey: ["safety-education-logs", "employees", params.siteId, params.empType],
    queryFn: () => getSafetyEducationLogEmployees(params),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: options?.enabled ?? true,
  });
}
