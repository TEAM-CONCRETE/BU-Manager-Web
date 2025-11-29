export type WorkSectionPayload = {
  sectionName: string;
  employeeNum: number;
  context: string;
};

export type MaterialPayload = {
  materialName: string;
  materialStandard: string;
  materialUnit: string;
};

export type CreateWorkReportPayload = {
  workSections: WorkSectionPayload[];
  materials: MaterialPayload[];
};

export type CreateWorkReportApiResponse = {
  workReportId?: number;
  pdfUrl?: string;
  workSections?: WorkSectionPayload[];
  materials?: MaterialPayload[];
};

export async function createWorkReport(
  siteId: number,
  payload: CreateWorkReportPayload,
): Promise<CreateWorkReportApiResponse> {
  const response = await fetch(`/api/v1/${siteId}/work-reports`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("작업일보를 생성하는 중 오류가 발생했습니다.");
  }

  const json = (await response.json()) as CreateWorkReportApiResponse;

  return json;
}
