"use client";

import { useQuery } from "@tanstack/react-query";

import { getCompanySites } from "@/lib/api/get-sites";

export function useCompanySites() {
  return useQuery({
    queryKey: ["company-sites"],
    queryFn: getCompanySites,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}
