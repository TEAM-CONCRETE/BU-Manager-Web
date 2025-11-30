export type CreateSafetyEducationLogPayload = {
  educationType: "REGULAR" | "HIRING" | "WORK_CHANGE" | "SPECIAL" | "OTHER";
  educationSubject: string;
  educationContent: string;
  instructorName: string;
  educationLocation: string;
  attendeeEmployeeIds: number[];
};

export type CreateSafetyEducationLogApiResponse = {
  success: boolean;
  message: string;
  data?: {
    safetyEducationLogId: number;
    status: "MANAGER_SIGNING_PENDING" | "MANAGER_SIGNED" | "COMPLETED";
    pdfUrl: string;
    attendeeCount: number;
  };
};

export async function createSafetyEducationLog(
  siteId: number,
  payload: CreateSafetyEducationLogPayload,
): Promise<NonNullable<CreateSafetyEducationLogApiResponse["data"]>> {
  const response = await fetch(`/api/v1/${siteId}/safety-education-logs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("안전교육일지를 생성하는 중 오류가 발생했습니다.");
  }

  const json = (await response.json()) as CreateSafetyEducationLogApiResponse;

  if (!json.success || !json.data) {
    throw new Error(json.message || "안전교육일지를 생성하는 중 오류가 발생했습니다.");
  }

  return json.data;
}
