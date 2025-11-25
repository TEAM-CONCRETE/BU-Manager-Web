"use client";

export type AttendanceStatus = "normal" | "late" | "earlyLeave" | "absent";

export type EmploymentType = "regular" | "daily";

export type AttendanceRecord = {
  id: string;
  name: string;
  ssnMasked: string;
  status: AttendanceStatus;
  clockIn?: string;
  clockOut?: string;
  totalHours?: string;
  overtimeSummary?: string;
};

export type AttendanceSummary = Record<AttendanceStatus, number>;

export type AttendanceRequestParams = {
  siteId: string;
  employmentType: EmploymentType;
  date: string;
};

export type AttendanceResponse = {
  records: AttendanceRecord[];
  totalWorkers: number;
  checkedInWorkers: number;
  summary?: AttendanceSummary;
};

type AttendanceApiResponse = {
  success: boolean;
  message: string;
  data?: {
    records?: AttendanceRecord[];
    totalWorkers?: number;
    checkedInWorkers?: number;
    summary?: AttendanceSummary;
  };
};

const FALLBACK_ERROR =
  "근태 정보를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";

export async function getAttendanceRecords({
  siteId,
  employmentType,
  date,
}: AttendanceRequestParams): Promise<AttendanceResponse> {
  const searchParams = new URLSearchParams({
    employmentType,
    date,
  });

  let response: Response;
  try {
    response = await fetch(`/api/v1/sites/${siteId}/attendance?${searchParams.toString()}`, {
      method: "GET",
      credentials: "include",
    });
  } catch {
    throw new Error(FALLBACK_ERROR);
  }

  let json: AttendanceApiResponse | null = null;
  try {
    json = (await response.json()) as AttendanceApiResponse;
  } catch {
    json = null;
  }

  if (!response.ok) {
    throw new Error(json?.message || FALLBACK_ERROR);
  }

  if (!json?.success || !json.data) {
    throw new Error(json?.message || FALLBACK_ERROR);
  }

  const records = json.data.records ?? [];

  const checkedInWorkers =
    typeof json.data.checkedInWorkers === "number"
      ? json.data.checkedInWorkers
      : records.filter((record) => record.status !== "absent").length;

  const totalWorkers =
    typeof json.data.totalWorkers === "number" ? json.data.totalWorkers : records.length;

  return {
    records,
    checkedInWorkers,
    totalWorkers,
    summary: json.data.summary,
  };
}
