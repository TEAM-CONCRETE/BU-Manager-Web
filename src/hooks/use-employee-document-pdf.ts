"use client";

import { useQuery } from "@tanstack/react-query";

import { getContractPdfUrl, getPayslipPdfUrl } from "@/lib/api/get-employees";

type UseEmployeeDocumentPdfParams = {
  type: "contract" | "payslip" | null;
  id: number | null;
  enabled?: boolean;
};

export function useEmployeeDocumentPdf({ type, id, enabled = true }: UseEmployeeDocumentPdfParams) {
  const { data: pdfUrl } = useQuery({
    queryKey: ["employee-document-pdf", type, id],
    queryFn: () =>
      type === "contract" ? getContractPdfUrl(id as number) : getPayslipPdfUrl(id as number),
    enabled: enabled && !!type && !!id,
    staleTime: 1000 * 60 * 5,
  });

  return { pdfUrl };
}
