export type ContractCorporationInfo = {
  corporationId: number;
  corpName: string;
  corpCeoName: string;
  corpAddress: string;
};

export type ContractInfoResponse = {
  siteId: number;
  siteName: string;
  siteAddress: string;
  corporation: ContractCorporationInfo;
};

export async function getContractInfo(siteId: number): Promise<ContractInfoResponse> {
  const query = new URLSearchParams();
  query.set("siteId", String(siteId));

  const response = await fetch(`/api/v1/sites/contract-info?${query.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("기업/현장 정보를 불러오는 중 오류가 발생했습니다.");
  }

  const json = (await response.json()) as {
    success: boolean;
    message: string;
    data?: ContractInfoResponse;
  };

  if (!json.success || !json.data) {
    throw new Error(json.message || "기업/현장 정보를 불러오는 중 오류가 발생했습니다.");
  }

  return json.data;
}
