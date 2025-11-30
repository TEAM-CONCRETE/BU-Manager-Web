export type SafetyEducationLogItem = {
  id: number;
  educationType: "REGULAR" | "HIRING" | "WORK_CHANGE" | "SPECIAL" | "OTHER";
  educationSubject: string;
  instructorName: string;
  status: "DRAFT" | "MANAGER_SIGNING_PENDING" | "MANAGER_SIGNED" | "COMPLETED";
  totalAttendeeCount: number;
  signedAttendeeCount: number;
  createdAt: string;
  pdfUrl: string;
};

export type GetSafetyEducationLogsApiResponse = {
  success: boolean;
  message: string;
  data: SafetyEducationLogItem[];
};

export type GetSafetyEducationLogsParams = {
  siteId: number;
  year?: number;
  month?: number;
};

export type GetSafetyEducationLogsResponse = {
  items: SafetyEducationLogItem[];
};

export async function getSafetyEducationLogs(
  params: GetSafetyEducationLogsParams,
): Promise<GetSafetyEducationLogsResponse> {
  const queryParams = new URLSearchParams();

  if (params.year) {
    queryParams.set("year", String(params.year));
  }

  if (params.month) {
    queryParams.set("month", String(params.month));
  }

  const queryString = queryParams.toString();
  const url = `/api/v1/${params.siteId}/safety-education-logs${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("안전교육일지 목록을 불러오는 중 오류가 발생했습니다.");
  }

  const json = (await response.json()) as GetSafetyEducationLogsApiResponse;

  if (!json.success || !json.data) {
    throw new Error(json.message || "안전교육일지 목록을 불러오는 중 오류가 발생했습니다.");
  }

  return {
    items: json.data,
  };
}
