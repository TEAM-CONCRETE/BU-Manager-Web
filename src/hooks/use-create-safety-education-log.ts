"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createSafetyEducationLog,
  type CreateSafetyEducationLogPayload,
} from "@/lib/api/create-safety-education-log";

type UseCreateSafetyEducationLogOptions = {
  onSuccess?: (data: {
    safetyEducationLogId: number;
    status: "MANAGER_SIGNING_PENDING" | "MANAGER_SIGNED" | "COMPLETED";
    pdfUrl: string;
    attendeeCount: number;
  }) => void;
  onError?: (error: Error) => void;
};

export function useCreateSafetyEducationLog(
  siteId: number,
  options?: UseCreateSafetyEducationLogOptions,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSafetyEducationLogPayload) =>
      createSafetyEducationLog(siteId, payload),
    onSuccess: (data) => {
      // 안전교육일지 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ["safety-education-logs", "list"],
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
