import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getPayrollRecords,
  type GetPayrollRecordsParams,
  type GetPayrollRecordsResponse,
} from "@/lib/api/get-payroll-records";

export function usePayrollRecords(params: GetPayrollRecordsParams) {
  const queryClient = useQueryClient();
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
    params.keyword,
    params.status,
    params.payCycle,
    params.weekOfMonth,
  ] as const;

  const cachedData = queryClient.getQueryData<GetPayrollRecordsResponse["data"]>(queryKey);

  return useQuery<GetPayrollRecordsResponse["data"]>({
    queryKey,
    queryFn: () => getPayrollRecords(params),
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30,
    enabled: !cachedData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    placeholderData: keepPreviousData,
  });
}
