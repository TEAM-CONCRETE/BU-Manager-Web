"use client";

export type SiteDetail = {
  siteId: number;
  siteName: string;
  siteAddress: string;
  clientName: string;
  startDate: string | null;
  endDate: string | null;
  managerName: string;
};

type GetSiteDetailApiResponse = {
  success: boolean;
  message: string;
  code: string | null;
  data: SiteDetail;
};

const FALLBACK_ERROR = "현장 정보를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";

export async function getSiteDetail(siteId: number): Promise<SiteDetail> {
  let response: Response;
  try {
    response = await fetch(`/api/v1/sites/${siteId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  } catch {
    throw new Error(FALLBACK_ERROR);
  }

  let json: GetSiteDetailApiResponse | null = null;
  try {
    json = (await response.json()) as GetSiteDetailApiResponse;
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
