"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createSafetyEducationReport,
  type CreateSafetyEducationReportPayload,
} from "@/lib/api/create-safety-education-report";

type UseCreateSafetyEducationReportOptions = {
  onSuccess?: (data: { safetyEducationReportId: number; pdfUrl: string }) => void;
  onError?: (error: Error) => void;
};

export function useCreateSafetyEducationReport(
  siteId: number,
  options?: UseCreateSafetyEducationReportOptions,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSafetyEducationReportPayload) =>
      createSafetyEducationReport(siteId, payload),
    onSuccess: (data) => {
      // 안전교육 일지 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ["safety-education-reports", "list"],
      });
      if (data) {
        options?.onSuccess?.(data);
      }
    },
    onError: (error) => {
      options?.onError?.(error instanceof Error ? error : new Error(String(error)));
    },
  });
}
