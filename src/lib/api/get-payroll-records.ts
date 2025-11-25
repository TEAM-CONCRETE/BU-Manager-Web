export type PayrollStatus = "PAID" | "UNPAID";
export type DailyPayCycle = "DAY" | "WEEK" | "MONTH";
export type WeekOfMonth = "W1" | "W2" | "W3";

export type PayrollSummary = {
  totalPayrollAmount: number;
  headcount: number;
  unpaidCount: number;
};

export type PayrollRecord = {
  payrollId: number;
  workerId: number;
  workerName: string;
  residentNumber: string;
  totalPay: number;
  paymentStatus: PayrollStatus;
  payday: string;
  nonTaxableIncome: number;
  withholdingIncomeTax: number;
  withholdingResidentTax: number;
  payrollSlipAvailable?: boolean;
};

export type PayrollPagination = {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  pageSize: number;
};

export type GetPayrollRecordsResponse = {
  summary: PayrollSummary;
  records: PayrollRecord[];
  pagination: PayrollPagination;
};

export type GetPayrollRecordsParams = {
  siteId: number;
  year: string;
  month: string;
  day?: string;
  employmentType: "REGULAR" | "DAILY";
  page?: number;
  size?: number;
  payCycle?: DailyPayCycle;
  weekOfMonth?: WeekOfMonth;
};

type PayrollApiRecord = {
  employeeId: number;
  name: string;
  residentId: string;
  payDate: string;
  totalPay: number;
  nonTaxIncome: number;
  taxIncome: number;
  localTax: number;
  paid: boolean;
  payslipAvailable: boolean;
  payCycle: string;
};

type PayrollApiResponse = {
  totalCount: number;
  unpaidCount: number;
  totalPaidAmount: number;
  data: PayrollApiRecord[];
};

const buildEndpoint = (employmentType: "REGULAR" | "DAILY", payCycle?: DailyPayCycle) => {
  if (employmentType === "REGULAR") {
    return "/payrolls/period/permanent";
  }

  if (payCycle === "WEEK") {
    return "/payrolls/period/daily/weekly";
  }

  if (payCycle === "MONTH") {
    return "/payrolls/period/daily/monthly";
  }

  return "/payrolls/period/daily/daily";
};

const mapWeekOfMonth = (value?: WeekOfMonth) => {
  if (!value) return undefined;
  switch (value) {
    case "W1":
      return "1";
    case "W2":
      return "2";
    case "W3":
      return "3";
    default:
      return undefined;
  }
};

export async function getPayrollRecords({
  siteId,
  year,
  month,
  day,
  employmentType,
  page = 1,
  size = 20,
  payCycle,
  weekOfMonth,
}: GetPayrollRecordsParams): Promise<GetPayrollRecordsResponse> {
  const endpoint = buildEndpoint(employmentType, payCycle);
  const queryParams = new URLSearchParams({
    siteId: String(siteId),
    year,
    month,
    page: page.toString(),
    size: size.toString(),
  });

  if (payCycle === "DAY" && day) {
    queryParams.append("day", day);
  }

  if (payCycle === "WEEK") {
    const week = mapWeekOfMonth(weekOfMonth);
    if (week) {
      queryParams.append("week", week);
    }
  }

  const response = await fetch(`/api/v1${endpoint}?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("급여 데이터를 불러오는 중 오류가 발생했습니다.");
  }

  const json = (await response.json()) as PayrollApiResponse;

  const paginationTotal = json.totalCount ?? 0;
  const mappedRecords: PayrollRecord[] = json.data.map((record) => ({
    payrollId: record.employeeId,
    workerId: record.employeeId,
    workerName: record.name,
    residentNumber: record.residentId,
    totalPay: record.totalPay,
    nonTaxableIncome: record.nonTaxIncome,
    withholdingIncomeTax: record.taxIncome,
    withholdingResidentTax: record.localTax,
    paymentStatus: record.paid ? "PAID" : "UNPAID",
    payday: record.payDate,
    payrollSlipAvailable: record.payslipAvailable,
  }));

  return {
    summary: {
      totalPayrollAmount: json.totalPaidAmount,
      headcount: json.totalCount,
      unpaidCount: json.unpaidCount,
    },
    records: mappedRecords,
    pagination: {
      currentPage: page,
      pageSize: size,
      totalRecords: paginationTotal,
      totalPages: Math.max(1, Math.ceil(paginationTotal / size)),
    },
  };
}
