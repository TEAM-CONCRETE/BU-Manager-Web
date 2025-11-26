import type {
  GetSafetyDocumentPdfApiResponse,
  GetSafetyWorkRecordsParams,
  GetSafetyWorkRecordsResponse,
  SafetyWorkDocumentsApiResponse,
  SafetyWorkRecord,
} from "@/types/safety-work";

export async function getSafetyEducationLogPdfUrl(siteId: number, logId: number): Promise<string> {
  const response = await fetch(`/api/documents/safety-education-logs/${logId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("안전교육일지 PDF를 불러오는 중 오류가 발생했습니다.");
  }

  const json = (await response.json()) as GetSafetyDocumentPdfApiResponse;

  if (!json.success || !json.data?.url) {
    throw new Error(json.message || "안전교육일지 PDF URL이 응답에 포함되어 있지 않습니다.");
  }

  return json.data.url;
}

export async function getWorkReportPdfUrl(siteId: number, workReportId: number): Promise<string> {
  const response = await fetch(`/api/documents/work-reports/${workReportId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("작업일보 PDF를 불러오는 중 오류가 발생했습니다.");
  }

  const json = (await response.json()) as GetSafetyDocumentPdfApiResponse;

  if (!json.success || !json.data?.url) {
    throw new Error(json.message || "작업일보 PDF URL이 응답에 포함되어 있지 않습니다.");
  }

  return json.data.url;
}

export async function getSafetyWorkRecords({
  siteId,
  year,
  month,
  page = 1,
  size = 20,
}: GetSafetyWorkRecordsParams): Promise<GetSafetyWorkRecordsResponse> {
  const queryParams = new URLSearchParams({
    year,
    month,
    page: (page - 1).toString(), // API는 0부터 시작하므로 변환
    size: size.toString(),
  });

  const response = await fetch(
    `/api/v1/sites/${siteId}/safety-work-documents?${queryParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("안전/작업 문서 목록을 불러오는 중 오류가 발생했습니다.");
  }

  const json = (await response.json()) as SafetyWorkDocumentsApiResponse;

  if (!json.success) {
    throw new Error(json.message || "안전/작업 문서 목록을 불러오는 중 오류가 발생했습니다.");
  }

  const records: SafetyWorkRecord[] = json.data.content.map((item) => ({
    id: `${item.date}-${item.safetyEducationLog?.logId || 0}-${item.workReport?.workReportId || 0}`,
    date: item.date,
    safetyDiaryAvailable: item.safetyEducationLog !== null,
    workReportAvailable: item.workReport !== null,
    safetyDiaryUrl: undefined,
    workReportUrl: undefined,
    safetyEducationLog: item.safetyEducationLog,
    workReport: item.workReport,
  }));

  return {
    summary: {
      totalCount: json.data.totalElements,
    },
    records,
    pagination: {
      currentPage: json.data.pageNumber + 1, // API는 0부터 시작하므로 1부터 시작하도록 변환
      totalPages: json.data.totalPages,
      totalRecords: json.data.totalElements,
      pageSize: json.data.pageSize,
    },
  };
}
