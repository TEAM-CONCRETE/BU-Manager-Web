export type SafetyEducationLogEmployee = {
  employeeId: number;
  empName: string;
  empType: "PERMANENT" | "DAILY";
  residentNum: string;
  hasSafetyEducation: boolean;
};

export type GetSafetyEducationLogEmployeesApiResponse = {
  success: boolean;
  message: string;
  data?: {
    items: SafetyEducationLogEmployee[];
    summary: {
      totalCount: number;
      permanentCount: number;
      dailyCount: number;
    };
  };
};

export type GetSafetyEducationLogEmployeesResponse = {
  items: SafetyEducationLogEmployee[];
  summary: {
    totalCount: number;
    permanentCount: number;
    dailyCount: number;
  };
};

export type GetSafetyEducationLogEmployeesParams = {
  siteId: number;
  empType?: "ALL" | "PERMANENT" | "DAILY";
};

export async function getSafetyEducationLogEmployees(
  params: GetSafetyEducationLogEmployeesParams,
): Promise<GetSafetyEducationLogEmployeesResponse> {
  const queryParams = new URLSearchParams();
  if (params.empType && params.empType !== "ALL") {
    queryParams.set("empType", params.empType);
  }

  const queryString = queryParams.toString();
  const url = `/api/v1/${params.siteId}/safety-education-logs/employees${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("교육 대상자 목록을 불러오는 중 오류가 발생했습니다.");
  }

  const json = (await response.json()) as GetSafetyEducationLogEmployeesApiResponse;

  if (!json.success || !json.data) {
    throw new Error(json.message || "교육 대상자 목록을 불러오는 중 오류가 발생했습니다.");
  }

  return json.data;
}
