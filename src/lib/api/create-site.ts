"use client";

import type { SiteFormValues } from "@/components/features/company/site/site-create-modal";

type CreateSitePayload = {
  siteName: string;
  siteAddress: string;
  clientName: string;
  startDate: string;
  endDate: string;
};

type CreateSiteApiResponse = {
  success: boolean;
  message: string;
  code: string;
  data: {
    siteId: number;
    siteName: string;
    siteAddress: string;
    clientName: string;
    startDate: string;
    endDate: string;
    managerSecretKey: string;
    employeeSecretKey: string;
  };
};

const FALLBACK_ERROR = "현장 등록 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";

export type CreatedSiteInfo = CreateSiteApiResponse["data"];

export async function createSite(values: SiteFormValues): Promise<CreatedSiteInfo> {
  const payload: CreateSitePayload = {
    siteName: values.siteName,
    siteAddress: values.siteAddress,
    clientName: values.clientName,
    startDate: values.startDate,
    endDate: values.endDate,
  };

  let response: Response;
  try {
    response = await fetch("/api/v1/sites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(FALLBACK_ERROR);
  }

  let json: CreateSiteApiResponse | null = null;
  try {
    json = (await response.json()) as CreateSiteApiResponse;
  } catch {
    json = null;
  }

  if (!response.ok) {
    throw new Error(json?.message || FALLBACK_ERROR);
  }

  if (!json?.success || !json.data) {
    throw new Error(json?.message || FALLBACK_ERROR);
  }

  return json.data;
}
