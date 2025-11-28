"use client";

import { useQuery } from "@tanstack/react-query";

import { getContractPdfUrl } from "@/lib/api/get-contract-pdf";

export function useContractPdf(contractId: number | null, enabled = true) {
  return useQuery({
    queryKey: ["contract", "pdf", contractId],
    queryFn: () => (contractId != null ? getContractPdfUrl(contractId) : Promise.resolve("")),
    enabled: enabled && contractId != null,
    staleTime: 1000 * 60 * 15, // 15분 (URL 만료 시간)
    gcTime: 1000 * 60 * 15,
  });
}
