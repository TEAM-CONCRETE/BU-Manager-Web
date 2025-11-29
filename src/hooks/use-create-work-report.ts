"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createWorkReport,
  type CreateWorkReportPayload,
  type CreateWorkReportApiResponse,
} from "@/lib/api/create-work-report";

type UseCreateWorkReportOptions = {
  onSuccess?: (data: CreateWorkReportApiResponse) => void;
  onError?: (error: Error) => void;
};

export function useCreateWorkReport(siteId: number, options?: UseCreateWorkReportOptions) {
  const queryClient = useQueryClient();

  return useMutation<CreateWorkReportApiResponse, Error, CreateWorkReportPayload>({
    mutationFn: (payload) => createWorkReport(siteId, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["work-reports", "list", siteId] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
}
