"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  getContracts,
  type GetContractsParams,
  type GetContractsResponse,
} from "@/lib/api/get-contracts";

type UseContractsOptions = {
  enabled?: boolean;
};

export function useContracts(params: GetContractsParams, options?: UseContractsOptions) {
  return useQuery<GetContractsResponse>({
    queryKey: [
      "contracts",
      "list",
      params.siteId,
      params.page,
      params.size,
      params.empType,
      params.searchKeyword,
    ],
    queryFn: () => getContracts(params),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    placeholderData: keepPreviousData,
    enabled: options?.enabled ?? true,
  });
}
