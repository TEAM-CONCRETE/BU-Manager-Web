export type CreateContractDetailsPayload = {
  workPlace: string;
  workType: string;
  workStartTime: string;
  workEndTime: string;
  breakStartTime: string;
  breakEndTime: string;
  workOnDays: string;
  workOffDays: string;
  workPay: number;
  additionalHourPay: number;
  additionalNightPay: number;
  additionalHolidayPay: number;
  payDay: number;
  payPeriod: "MONTHLY" | "WEEKLY" | "DAILY";
  payType: "CASH" | "TRANSFER";
  isEoiApplicable: boolean;
  isWciApplicable: boolean;
  isNpsApplicable: boolean;
  isNhiApplicable: boolean;
};

export type CreateContractPayload = {
  userId: string;
  role: string;
  empType: "PERMANENT" | "DAILY";
  employeeStartDate: string;
  employeeEndDate: string;
  details: CreateContractDetailsPayload;
};

export type CreateContractApiResponse = {
  success: boolean;
  message: string;
  data?: {
    contractId: number;
  };
};

async function postContract(path: string, body: CreateContractPayload): Promise<number> {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    if (response.status === 422) {
      const errorBody = (await response.json().catch(() => null)) as { message?: string } | null;
      throw new Error(
        errorBody?.message ?? "이미 다른 유형의 근로계약이 존재하여 계약을 생성할 수 없습니다.",
      );
    }
    throw new Error("근로계약서를 생성하는 중 오류가 발생했습니다.");
  }

  const json = (await response.json()) as CreateContractApiResponse;

  if (!json.success || !json.data?.contractId) {
    throw new Error(json.message || "근로계약서를 생성하는 중 알 수 없는 오류가 발생했습니다.");
  }

  return json.data.contractId;
}

export async function createDailyContract(
  siteId: number,
  payload: CreateContractPayload,
): Promise<number> {
  return postContract(`/api/v1/${siteId}/contracts/daily`, payload);
}

export async function createRegularContract(
  siteId: number,
  payload: CreateContractPayload,
): Promise<number> {
  return postContract(`/api/v1/${siteId}/contracts/regular`, payload);
}
