import type {
  EmployeeContractDocument,
  EmployeeDetail,
  EmployeePayslipDocument,
  EmployeeRecord,
  GetEmployeeDetailParams,
  GetEmployeeDocumentPdfApiResponse,
  GetEmployeeListParams,
  GetEmployeeListResponse,
  GetEmployeeContractsParams,
  GetEmployeePayslipsParams,
  GetEmployeeContractsResponse,
  GetEmployeePayslipsResponse,
  EmploymentType,
} from "@/types/employee";

type EmployeeListApiResponse = {
  success: boolean;
  message: string;
  code: string;
  data: {
    totalCount: number;
    page: number;
    size: number;
    data: {
      employeeId: number;
      name: string;
      residentId: string;
      empType: string;
    }[];
  };
};

type EmployeeDetailApiPayload = {
  employeeId: number;
  name: string;
  residentId: string;
  empType: string;
  phone: string;
  email: string;
  address: string;
  emergencyContact: string;
  joinedAt: string;
  leftAt: string | null;
};

type EmployeeDetailApiResponse =
  | EmployeeDetailApiPayload
  | {
      success: boolean;
      message: string;
      data?: EmployeeDetailApiPayload;
    };

type EmployeeContractsApiPayload = {
  employeeId: number;
  contracts: {
    contractId: number;
    title: string;
    createdAt: string;
    status: string;
  }[];
};

type EmployeeContractsApiResponse =
  | EmployeeContractsApiPayload
  | {
      success: boolean;
      message: string;
      data?: EmployeeContractsApiPayload;
    };

type EmployeePayslipsApiPayload = {
  employeeId: number;
  payslips: {
    payrollId: number;
    title: string;
    createdAt: string;
    status: string;
  }[];
};

type EmployeePayslipsApiResponse =
  | EmployeePayslipsApiPayload
  | {
      success: boolean;
      message: string;
      data?: EmployeePayslipsApiPayload;
    };

function mapEmploymentTypeToQuery(type: EmploymentType): "DAILY" | "PERMANENT" | null {
  if (type === "REGULAR") return "PERMANENT";
  if (type === "DAILY") return "DAILY";
  return null;
}

function mapEmploymentTypeFromApi(empType: string): EmploymentType {
  if (empType === "PERMANENT") return "REGULAR";
  if (empType === "DAILY") return "DAILY";
  if (empType === "UNCONTRACTED") return "UNCONTRACTED";
  return "DAILY"; // fallback
}

export async function getEmployeeList(
  params: GetEmployeeListParams,
): Promise<GetEmployeeListResponse> {
  const queryParams = new URLSearchParams({
    page: String(params.page),
    size: String(params.size),
  });

  if (params.employmentType) {
    const mappedType = mapEmploymentTypeToQuery(params.employmentType);
    if (mappedType !== null) {
      queryParams.set("empType", mappedType);
    }
  }

  if (params.searchKeyword) {
    queryParams.set("name", params.searchKeyword);
  }

  const response = await fetch(`/api/sites/${params.siteId}/employees?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("사원 목록을 불러오는 중 오류가 발생했습니다.");
  }

  const json = (await response.json()) as EmployeeListApiResponse;

  if (!json.success || !json.data) {
    throw new Error(json.message || "사원 목록을 불러오는 중 오류가 발생했습니다.");
  }

  const records: EmployeeRecord[] = json.data.data.map((item) => ({
    id: item.employeeId,
    name: item.name,
    residentNumber: item.residentId,
    employmentType: mapEmploymentTypeFromApi(item.empType),
  }));

  const totalCount = json.data.totalCount;
  const page = json.data.page;
  const size = json.data.size;
  const totalPages = Math.max(1, Math.ceil(totalCount / size));

  return {
    summary: {
      totalCount,
    },
    records,
    pagination: {
      currentPage: page,
      totalPages,
      totalRecords: totalCount,
      pageSize: size,
    },
  };
}

export async function getEmployeeDetail({
  siteId,
  employeeId,
}: GetEmployeeDetailParams): Promise<EmployeeDetail> {
  const response = await fetch(`/api/sites/${siteId}/employees/${employeeId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("사원 상세 정보를 불러오는 중 오류가 발생했습니다.");
  }

  const raw = (await response.json()) as EmployeeDetailApiResponse;

  const payload: EmployeeDetailApiPayload | undefined = "success" in raw ? raw.data : raw;

  if (!payload) {
    const message =
      "success" in raw ? raw.message : "사원 상세 정보를 불러오는 중 오류가 발생했습니다.";
    throw new Error(message);
  }

  return {
    id: payload.employeeId,
    name: payload.name,
    residentNumber: payload.residentId,
    employmentType: mapEmploymentTypeFromApi(payload.empType),
    phone: payload.phone,
    email: payload.email,
    address: payload.address,
    emergencyContact: payload.emergencyContact,
    joinDate: payload.joinedAt,
    resignDate: payload.leftAt || undefined,
  };
}

export async function getEmployeeContracts({
  siteId,
  employeeId,
}: GetEmployeeContractsParams): Promise<GetEmployeeContractsResponse> {
  const response = await fetch(`/api/sites/${siteId}/employees/${employeeId}/contracts`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("근로계약서 목록을 불러오는 중 오류가 발생했습니다.");
  }

  const raw = (await response.json()) as EmployeeContractsApiResponse;
  const payload: EmployeeContractsApiPayload | undefined = "success" in raw ? raw.data : raw;

  if (!payload) {
    const message =
      "success" in raw ? raw.message : "근로계약서 목록을 불러오는 중 오류가 발생했습니다.";
    throw new Error(message);
  }

  const contracts: EmployeeContractDocument[] = payload.contracts.map((item) => ({
    id: item.contractId,
    title: item.title,
    createdAt: item.createdAt,
    status: item.status,
  }));

  return {
    employeeId: payload.employeeId,
    contracts,
  };
}

export async function getEmployeePayslips({
  siteId,
  employeeId,
}: GetEmployeePayslipsParams): Promise<GetEmployeePayslipsResponse> {
  const response = await fetch(`/api/sites/${siteId}/employees/${employeeId}/payslips`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("급여명세서 목록을 불러오는 중 오류가 발생했습니다.");
  }

  const raw = (await response.json()) as EmployeePayslipsApiResponse;
  const payload: EmployeePayslipsApiPayload | undefined = "success" in raw ? raw.data : raw;

  if (!payload) {
    const message =
      "success" in raw ? raw.message : "급여명세서 목록을 불러오는 중 오류가 발생했습니다.";
    throw new Error(message);
  }

  const payslips: EmployeePayslipDocument[] = payload.payslips.map((item) => ({
    id: item.payrollId,
    title: item.title,
    createdAt: item.createdAt,
    status: item.status,
  }));

  return {
    employeeId: payload.employeeId,
    payslips,
  };
}

export async function getContractPdfUrl(contractId: number): Promise<string> {
  const response = await fetch(`/api/documents/contracts/${contractId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("근로계약서 PDF를 불러오는 중 오류가 발생했습니다.");
  }

  const json = (await response.json()) as GetEmployeeDocumentPdfApiResponse;

  if (!json.success || !json.data?.url) {
    throw new Error(json.message || "근로계약서 PDF URL이 응답에 포함되어 있지 않습니다.");
  }

  return json.data.url;
}

export async function getPayslipPdfUrl(payrollId: number): Promise<string> {
  const response = await fetch(`/api/documents/payslips/${payrollId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("급여명세서 PDF를 불러오는 중 오류가 발생했습니다.");
  }

  const json = (await response.json()) as GetEmployeeDocumentPdfApiResponse;

  if (!json.success || !json.data?.url) {
    throw new Error(json.message || "급여명세서 PDF URL이 응답에 포함되어 있지 않습니다.");
  }

  return json.data.url;
}
