export type SafetyEducationParticipantPayload = {
  employeeId: number;
  name: string;
  employmentType: "REGULAR" | "DAILY";
};

export type CreateSafetyEducationReportPayload = {
  educationDate: string;
  educationType: "REGULAR" | "HIRING" | "WORK_CHANGE" | "SPECIAL" | "OTHER";
  otherEducationType?: string;
  educationSubject: string;
  educationContent: string;
  instructorName: string;
  educationLocation: string;
  participants: SafetyEducationParticipantPayload[];
};

export type CreateSafetyEducationReportApiResponse = {
  success: boolean;
  message: string;
  data?: {
    safetyEducationReportId: number;
    pdfUrl: string;
  };
};

export async function createSafetyEducationReport(
  siteId: number,
  payload: CreateSafetyEducationReportPayload,
): Promise<NonNullable<CreateSafetyEducationReportApiResponse["data"]>> {
  const response = await fetch(`/api/v1/${siteId}/safety-education-reports`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("안전교육 일지를 생성하는 중 오류가 발생했습니다.");
  }

  const json = (await response.json()) as CreateSafetyEducationReportApiResponse;

  if (!json.success || !json.data) {
    throw new Error(json.message || "안전교육 일지를 생성하는 중 오류가 발생했습니다.");
  }

  return json.data;
}
