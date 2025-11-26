"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getEmployeeList } from "@/lib/api/get-employees";
import type { GetEmployeeListParams, GetEmployeeListResponse } from "@/types/employee";

type UseEmployeesOptions = {
  enabled?: boolean;
};

export function useEmployees(params: GetEmployeeListParams, options?: UseEmployeesOptions) {
  return useQuery<GetEmployeeListResponse>({
    queryKey: [
      "employees",
      "list",
      params.siteId,
      params.employmentType,
      params.page,
      params.size,
      params.searchKeyword,
    ],
    queryFn: () => getEmployeeList(params),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    placeholderData: keepPreviousData,
    enabled: options?.enabled ?? true,
  });
}
