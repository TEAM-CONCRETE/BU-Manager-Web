export type ContractState =
  | "DRAFT"
  | "MANAGER_SIGNING_PENDING"
  | "EMPLOYEE_SIGNING_PENDING"
  | "SENT"
  | "ADMIN_SIGNED"
  | "FULLY_SIGNED"
  | "TERMINATED"
  | "VOID";

export type EmpType = "PERMANENT" | "DAILY" | "UNCONTRACTED";

export type ContractItem = {
  contractId: number | null;
  employeeId: number;
  userId: string;
  employeeName: string;
  employeeResidentNumber: string | null;
  employeePhone?: string | null;
  empType: EmpType;
  role: string;
  contractState: ContractState;
  employeeStartDate: string;
  employeeEndDate: string;
  writtenAt: string;
  corporationSignedAt: string | null;
  employeeSignedAt: string | null;
};

export type ContractsListApiResponse = {
  success: boolean;
  message: string;
  code: string | null;
  data: {
    items: ContractItem[];
    pageInfo: {
      currentPage: number;
      pageSize: number;
      totalElements: number;
      totalPages: number;
      hasNext: boolean;
      hasPrevious: boolean;
    };
  };
};

export type GetContractsParams = {
  siteId: number;
  page?: number;
  size?: number;
  empType?: "PERMANENT" | "DAILY";
  searchKeyword?: string;
};

export type GetContractsResponse = {
  items: ContractItem[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
};

export async function getContracts(params: GetContractsParams): Promise<GetContractsResponse> {
  const queryParams = new URLSearchParams({
    page: String(params.page ?? 1),
    size: String(params.size ?? 20),
  });

  if (params.empType) {
    queryParams.set("empType", params.empType);
  }

  if (params.searchKeyword) {
    queryParams.set("name", params.searchKeyword);
  }

  const response = await fetch(`/api/v1/${params.siteId}/contracts?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("근로계약서 목록을 불러오는 중 오류가 발생했습니다.");
  }

  const json = (await response.json()) as ContractsListApiResponse;

  if (!json.success || !json.data) {
    throw new Error(json.message || "근로계약서 목록을 불러오는 중 오류가 발생했습니다.");
  }

  return {
    items: json.data.items,
    pagination: {
      currentPage: json.data.pageInfo.currentPage,
      pageSize: json.data.pageInfo.pageSize,
      totalElements: json.data.pageInfo.totalElements,
      totalPages: json.data.pageInfo.totalPages,
      hasNext: json.data.pageInfo.hasNext,
      hasPrevious: json.data.pageInfo.hasPrevious,
    },
  };
}
