"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { SiteFormValues } from "@/components/features/company/site/site-create-modal";
import { createSite } from "@/lib/api/create-site";

export function useCreateSite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["company-sites", "create"],
    mutationFn: (values: SiteFormValues) => createSite(values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["company-sites"] });
    },
  });
}
