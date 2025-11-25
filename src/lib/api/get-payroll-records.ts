export type PayrollStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "PAID";
export type DailyPayCycle = "DAY" | "WEEK" | "MONTH";
export type WeekOfMonth = "W1" | "W2" | "W3";

export type PayrollSummary = {
  totalPayrollAmount: number;
  regularWages: number;
  overtimeWages: number;
  deductions: number;
  headcount?: number;
  unpaidCount?: number;
};

export type PayrollRecord = {
  payrollId: number;
  workerId: number;
  workerName: string;
  residentNumber: string;
  employmentType: "REGULAR" | "DAILY";
  basePay: number;
  overtimePay: number;
  allowances: number;
  deductions: number;
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
  success: boolean;
  message: string;
  code: string;
  data: {
    summary: PayrollSummary;
    records: PayrollRecord[];
    pagination: PayrollPagination;
  };
};

export type GetPayrollRecordsParams = {
  siteId: number;
  year: string;
  month: string;
  day?: string;
  employmentType: "REGULAR" | "DAILY";
  page?: number;
  size?: number;
  keyword?: string;
  status?: PayrollStatus | "ALL";
  payCycle?: DailyPayCycle;
  weekOfMonth?: WeekOfMonth;
};

const useDummyPayrollData =
  typeof process === "undefined" ? true : process.env.NEXT_PUBLIC_USE_PAYROLL_DUMMY !== "false";

const payrollStatuses: PayrollStatus[] = ["PENDING", "IN_PROGRESS", "COMPLETED", "PAID"];

const now = new Date();
const currentYear = now.getFullYear();

const dummyPayrollRecords: PayrollRecord[] = Array.from({ length: 360 }, (_, index) => {
  const year = currentYear - 1 + Math.floor(index / 120);
  const baseMonth = ((index % 12) + 1).toString().padStart(2, "0");
  const baseDayNumber = ((index * 3) % 28) + 1;
  const baseDay = String(baseDayNumber).padStart(2, "0");
  const employmentType = index % 2 === 0 ? "DAILY" : "REGULAR";
  const status = payrollStatuses[index % payrollStatuses.length];

  const basePay =
    employmentType === "DAILY" ? 130000 + (index % 4) * 5000 : 2900000 + (index % 3) * 50000;
  const overtimePay =
    employmentType === "DAILY" ? 18000 + (index % 5) * 2000 : 300000 + (index % 4) * 25000;
  const allowances =
    employmentType === "DAILY" ? 12000 + (index % 3) * 1000 : 200000 + (index % 2) * 30000;
  const deductions =
    employmentType === "DAILY" ? 9000 + (index % 4) * 500 : 260000 + (index % 2) * 20000;
  const nonTaxableIncome = 180000 + (index % 4) * 5000;
  const withholdingIncomeTax = 20000 + (index % 3) * 1000;
  const withholdingResidentTax = 1200 + (index % 2) * 100;
  const payrollSlipAvailable = index % 4 !== 3;

  return {
    payrollId: index + 1,
    workerId: 1000 + index,
    workerName:
      employmentType === "DAILY" ? `일용직 근로자 ${index + 1}` : `상용직 근로자 ${index + 1}`,
    residentNumber: `900101-${(1000000 + index).toString().slice(1)}`,
    employmentType,
    basePay,
    overtimePay,
    allowances,
    deductions,
    totalPay: basePay + overtimePay + allowances - deductions,
    paymentStatus: status,
    payday: `${year}-${baseMonth}-${baseDay}`,
    nonTaxableIncome,
    withholdingIncomeTax,
    withholdingResidentTax,
    payrollSlipAvailable,
  };
});

function getWeekOfMonth(payday: string): WeekOfMonth {
  const day = Number(payday.split("-")[2]);
  if (day <= 7) return "W1";
  if (day <= 14) return "W2";
  return "W3";
}

function buildDummySummary(records: PayrollRecord[]): PayrollSummary {
  return records.reduce<PayrollSummary>(
    (acc, record) => {
      acc.totalPayrollAmount += record.totalPay;
      acc.regularWages += record.basePay;
      acc.overtimeWages += record.overtimePay;
      acc.deductions += record.deductions;
      acc.headcount = (acc.headcount ?? 0) + 1;
      if (record.paymentStatus !== "PAID") {
        acc.unpaidCount = (acc.unpaidCount ?? 0) + 1;
      }
      return acc;
    },
    {
      totalPayrollAmount: 0,
      regularWages: 0,
      overtimeWages: 0,
      deductions: 0,
      headcount: 0,
      unpaidCount: 0,
    },
  );
}

function getDummyPayrollData({
  year,
  month,
  day,
  employmentType,
  page = 1,
  size = 20,
  keyword,
  status,
  payCycle,
  weekOfMonth,
}: GetPayrollRecordsParams): GetPayrollRecordsResponse["data"] {
  let filtered = dummyPayrollRecords.filter((record) => {
    const [recordYear, recordMonth] = record.payday.split("-");
    if (recordYear !== year || recordMonth !== month) return false;
    return record.employmentType === employmentType;
  });

  if (payCycle === "DAY" && day) {
    filtered = filtered.filter((record) => record.payday.endsWith(`-${day}`));
  }

  if (payCycle === "WEEK" && weekOfMonth) {
    filtered = filtered.filter((record) => getWeekOfMonth(record.payday) === weekOfMonth);
  }

  if (keyword) {
    const normalizedKeyword = keyword.replace(/-/g, "");
    filtered = filtered.filter(
      (record) =>
        record.workerName.includes(keyword) ||
        record.residentNumber.replace(/-/g, "").includes(normalizedKeyword),
    );
  }

  if (status && status !== "ALL") {
    filtered = filtered.filter((record) => record.paymentStatus === status);
  }

  const totalRecords = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / size));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * size;
  const end = start + size;
  const paginated = filtered.slice(start, end);

  return {
    summary: buildDummySummary(filtered),
    records: paginated,
    pagination: {
      currentPage,
      totalPages,
      totalRecords,
      pageSize: size,
    },
  };
}

export async function getPayrollRecords({
  siteId,
  year,
  month,
  day,
  employmentType,
  page = 1,
  size = 20,
  keyword,
  status,
  payCycle,
  weekOfMonth,
}: GetPayrollRecordsParams): Promise<GetPayrollRecordsResponse["data"]> {
  if (useDummyPayrollData) {
    return getDummyPayrollData({
      siteId,
      year,
      month,
      day,
      employmentType,
      page,
      size,
      keyword,
      status,
      payCycle,
      weekOfMonth,
    });
  }

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

  if (payCycle) {
    queryParams.append("payCycle", payCycle);
  }

  if (weekOfMonth) {
    queryParams.append("weekOfMonth", weekOfMonth);
  }

  if (keyword) {
    queryParams.append("keyword", keyword);
  }

  if (status && status !== "ALL") {
    queryParams.append("status", status);
  }

  const response = await fetch(`/api/v1/${siteId}/payroll/records?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("급여 데이터를 불러오는 중 오류가 발생했습니다.");
  }

  const json = (await response.json()) as GetPayrollRecordsResponse;

  if (!json.success) {
    throw new Error(json.message || "급여 데이터를 불러오는 중 오류가 발생했습니다.");
  }

  return json.data;
}
