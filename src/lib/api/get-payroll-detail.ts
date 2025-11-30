export type PayrollDetailHeader = {
  payrollId: number;
  employeeName: string;
  residentNum: string;
  payDueDate: string;
  totalPay: number;
  noneTaxIncome: number;
};

export type PayrollDetailSummary = {
  totalWorkHour: number;
  totalPay: number;
  totalWorkDays: number;
};

export type PayrollDetailAttendance = {
  searchDate: string;
  totalWorkHour: number;
  nightWorkHour: number;
  additionalWorkHour: number;
  holidayWorkHour: number;
  allowanceAmount: number;
};

export type PayrollDetailAttendancesPage = {
  content: PayrollDetailAttendance[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
};

export type GetPayrollDetailResponse = {
  header: PayrollDetailHeader;
  summary: PayrollDetailSummary;
  attendances: PayrollDetailAttendancesPage;
};

export type GetPayrollDetailParams = {
  payrollId: number;
  page?: number;
  size?: number;
};

export async function getPayrollDetail({
  payrollId,
  page,
  size,
}: GetPayrollDetailParams): Promise<GetPayrollDetailResponse> {
  const queryParams = new URLSearchParams();

  if (typeof page === "number") {
    queryParams.set("page", String(page));
  }

  if (typeof size === "number") {
    queryParams.set("size", String(size));
  }

  const queryString = queryParams.toString();
  const url = `/api/v1/payrolls/${payrollId}${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("급여명세서 상세 정보를 불러오는 중 오류가 발생했습니다.");
  }

  const json = (await response.json()) as GetPayrollDetailResponse;

  if (!json || !json.header || !json.summary || !json.attendances) {
    throw new Error("급여명세서 상세 응답 형식이 올바르지 않습니다.");
  }

  return json;
}
