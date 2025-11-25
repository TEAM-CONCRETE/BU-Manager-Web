export type AttendanceStatus = "NORMAL" | "LATE" | "EARLY_LEAVE" | "ABSENT";

export type AttendanceSummary = {
  normalAttendance: number;
  late: number;
  earlyLeave: number;
  absent: number;
};

export type AttendanceRecord = {
  workerId: number;
  workerName: string;
  residentNumber: string;
  attendanceStatus: string;
  checkInTime: string;
  checkOutTime: string;
  totalWorkHours: string;
  nightWorkHours: string;
  overtimeHours: string;
  holidayWorkHours: string;
  isLate: boolean;
};

export type AttendancePagination = {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  pageSize: number;
};

export type GetAttendanceRecordsResponse = {
  success: boolean;
  message: string;
  code: string;
  data: {
    summary: AttendanceSummary;
    records: AttendanceRecord[];
    pagination: AttendancePagination;
  };
};

export type GetAttendanceRecordsParams = {
  siteId: number;
  year: string;
  month: string;
  day?: string;
  employmentType: "REGULAR" | "DAILY";
  page?: number;
  size?: number;
};

export async function getAttendanceRecords({
  siteId,
  year,
  month,
  day,
  employmentType,
  page = 1,
  size = 20,
}: GetAttendanceRecordsParams): Promise<GetAttendanceRecordsResponse["data"]> {
  const queryParams = new URLSearchParams({
    year,
    month,
    employmentType,
    page: page.toString(),
    size: size.toString(),
  });

  if (day) {
    queryParams.append("day", day);
  }

  const response = await fetch(`/api/v1/${siteId}/attendance/records?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("근태 현황을 불러오는 중 오류가 발생했습니다.");
  }

  const json = (await response.json()) as GetAttendanceRecordsResponse;

  if (!json.success) {
    throw new Error(json.message || "근태 현황을 불러오는 중 오류가 발생했습니다.");
  }

  return json.data;
}
