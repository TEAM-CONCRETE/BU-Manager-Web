export type GetContractPdfApiResponse = {
  success: boolean;
  message: string;
  data?: {
    url: string;
    expiresAt: string;
  };
};

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

  const json = (await response.json()) as GetContractPdfApiResponse;

  if (!json.success || !json.data?.url) {
    throw new Error(json.message || "근로계약서 PDF URL이 응답에 포함되어 있지 않습니다.");
  }

  return json.data.url;
}
