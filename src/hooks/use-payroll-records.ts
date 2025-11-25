import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  getPayrollRecords,
  type GetPayrollRecordsParams,
  type GetPayrollRecordsResponse,
} from "@/lib/api/get-payroll-records";

export function usePayrollRecords(params: GetPayrollRecordsParams) {
  const queryKey = [
    "payroll",
    "records",
    params.siteId,
    params.year,
    params.month,
    params.employmentType,
    params.day,
    params.page,
    params.size,
    params.payCycle,
    params.weekOfMonth,
  ] as const;

  return useQuery<GetPayrollRecordsResponse>({
    queryKey,
    queryFn: () => getPayrollRecords(params),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    placeholderData: keepPreviousData,
  });
}
