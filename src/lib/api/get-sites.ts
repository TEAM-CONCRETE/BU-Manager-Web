"use client";

export type CompanySite = {
  siteId: number;
  siteName: string;
  siteAddress: string;
  managerName: string;
};

type GetSitesApiResponse = {
  success: boolean;
  message: string;
  data: {
    sites: CompanySite[];
    totalCount: number;
  };
};

const FALLBACK_ERROR = "현장 목록을 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";

export async function getCompanySites() {
  let response: Response;
  try {
    response = await fetch("/api/v1/sites", {
      method: "GET",
      credentials: "include",
    });
  } catch {
    throw new Error(FALLBACK_ERROR);
  }

  let json: GetSitesApiResponse | null = null;
  try {
    json = (await response.json()) as GetSitesApiResponse;
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
