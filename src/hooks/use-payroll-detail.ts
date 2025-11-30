"use client";

import { useQuery } from "@tanstack/react-query";

import {
  type GetPayrollDetailParams,
  type GetPayrollDetailResponse,
  getPayrollDetail,
} from "@/lib/api/get-payroll-detail";

type UsePayrollDetailParams = GetPayrollDetailParams & {
  enabled?: boolean;
};

export function usePayrollDetail({
  payrollId,
  page = 0,
  size = 10,
  enabled = true,
}: UsePayrollDetailParams) {
  const queryEnabled = enabled && Number.isFinite(payrollId) && payrollId > 0;

  const { data, isLoading, isFetching, isError, error, refetch } =
    useQuery<GetPayrollDetailResponse>({
      queryKey: ["payroll-detail", payrollId, page, size],
      queryFn: () => getPayrollDetail({ payrollId, page, size }),
      enabled: queryEnabled,
      staleTime: 1000 * 60 * 5,
    });

  return {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
}
