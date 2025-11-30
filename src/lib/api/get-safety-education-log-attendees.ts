export type SafetyEducationLogAttendee = {
  employeeId: number;
  empName: string;
  empType: "PERMANENT" | "DAILY";
  isSigned: boolean;
  signedAt: string | null;
};

export type GetSafetyEducationLogAttendeesApiResponse = {
  success: boolean;
  message: string;
  data?: {
    safetyEducationLogId: number;
    totalCount: number;
    signedCount: number;
    unsignedCount: number;
    attendees: SafetyEducationLogAttendee[];
  };
};

export type GetSafetyEducationLogAttendeesResponse = {
  safetyEducationLogId: number;
  totalCount: number;
  signedCount: number;
  unsignedCount: number;
  attendees: SafetyEducationLogAttendee[];
};

export async function getSafetyEducationLogAttendees(
  siteId: number,
  logId: number,
): Promise<GetSafetyEducationLogAttendeesResponse> {
  const response = await fetch(
    `/api/v1/${siteId}/safety-education-logs/${logId}/attendees/signature-status`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("참석자 서명 현황을 불러오는 중 오류가 발생했습니다.");
  }

  const json = (await response.json()) as GetSafetyEducationLogAttendeesApiResponse;

  if (!json.success || !json.data) {
    throw new Error(json.message || "참석자 서명 현황을 불러오는 중 오류가 발생했습니다.");
  }

  return json.data;
}
