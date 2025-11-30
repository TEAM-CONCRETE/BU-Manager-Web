export type SafetyEducationReportItem = {
  safetyEducationReportId: number;
  educationDate: string;
  writerName: string;
  participantCount: number;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
};

export type SafetyEducationReportsListApiResponse = {
  success: boolean;
  message: string;
  code: string | null;
  data: {
    content: SafetyEducationReportItem[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
  };
};

export type GetSafetyEducationReportsParams = {
  siteId: number;
  page?: number;
  size?: number;
  year?: number;
  month?: number;
};

export type GetSafetyEducationReportsResponse = {
  items: SafetyEducationReportItem[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
};

export async function getSafetyEducationReports(
  params: GetSafetyEducationReportsParams,
): Promise<GetSafetyEducationReportsResponse> {
  const queryParams = new URLSearchParams({
    page: String((params.page ?? 1) - 1), // API는 0부터 시작
    size: String(params.size ?? 20),
  });

  if (params.year) {
    queryParams.set("year", String(params.year));
  }

  if (params.month) {
    queryParams.set("month", String(params.month));
  }

  const response = await fetch(
    `/api/v1/${params.siteId}/safety-education-reports?${queryParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("안전교육 일지 목록을 불러오는 중 오류가 발생했습니다.");
  }

  const json = (await response.json()) as SafetyEducationReportsListApiResponse;

  if (!json.success || !json.data) {
    throw new Error(json.message || "안전교육 일지 목록을 불러오는 중 오류가 발생했습니다.");
  }

  return {
    items: json.data.content,
    pagination: {
      currentPage: json.data.pageNumber + 1, // 1부터 시작하도록 변환
      pageSize: json.data.pageSize,
      totalElements: json.data.totalElements,
      totalPages: json.data.totalPages,
      hasNext: !json.data.last,
      hasPrevious: !json.data.first,
    },
  };
}
