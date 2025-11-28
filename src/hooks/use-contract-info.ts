"use client";

import { useQuery } from "@tanstack/react-query";

import { getContractInfo, type ContractInfoResponse } from "@/lib/api/get-contract-info";

type UseContractInfoOptions = {
  enabled?: boolean;
};

export function useContractInfo(siteId: number | null, options?: UseContractInfoOptions) {
  return useQuery<ContractInfoResponse>({
    queryKey: ["contract", "info", siteId],
    queryFn: () => {
      if (siteId == null) {
        return Promise.reject(new Error("siteId가 유효하지 않습니다."));
      }
      return getContractInfo(siteId);
    },
    enabled: Boolean(siteId) && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 5,
  });
}
