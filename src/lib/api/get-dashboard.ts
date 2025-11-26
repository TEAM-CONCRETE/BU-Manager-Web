import type { GetSiteDashboardApiResponse, SiteDashboard } from "@/types/dashboard";

export async function getSiteDashboard(siteId: number): Promise<SiteDashboard> {
  const response = await fetch(`/api/v1/sites/${siteId}/dashboard`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("대시보드 정보를 불러오는 중 오류가 발생했습니다.");
  }

  const json = (await response.json()) as GetSiteDashboardApiResponse;

  if (!json.success || !json.data) {
    throw new Error(json.message || "대시보드 정보를 불러오는 중 오류가 발생했습니다.");
  }

  return json.data;
}
