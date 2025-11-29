"use client";

import { useMutation } from "@tanstack/react-query";

import {
  createDailyContract,
  createRegularContract,
  type CreateContractPayload,
} from "@/lib/api/create-contract";

export function useCreateContract(siteId: number | null, empType: "PERMANENT" | "DAILY") {
  return useMutation({
    mutationKey: ["contract", "create", empType, siteId],
    mutationFn: async (payload: CreateContractPayload) => {
      if (siteId == null) {
        throw new Error("siteId가 유효하지 않아 근로계약서를 생성할 수 없습니다.");
      }
      if (empType === "DAILY") {
        return createDailyContract(siteId, payload);
      }
      return createRegularContract(siteId, payload);
    },
  });
}
