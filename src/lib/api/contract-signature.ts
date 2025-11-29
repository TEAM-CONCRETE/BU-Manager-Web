/**
 * 서명 이미지 업로드를 위한 Presigned URL 발급 API
 */
export type GetSignatureUploadUrlPayload = {
  resourceType: "CONTRACT";
  resourceId: string;
  signerRole: "MANAGER" | "EMPLOYEE";
  fileExtension: "png" | "jpg" | "jpeg" | "pdf";
};

export type GetSignatureUploadUrlResponse = {
  success: boolean;
  message: string;
  data?: {
    uploadUrl: string;
    expiresAt: string;
    s3Key: string;
    bucket: string;
  };
};

export async function getSignatureUploadUrl(payload: GetSignatureUploadUrlPayload): Promise<{
  uploadUrl: string;
  s3Key: string;
}> {
  const response = await fetch("/api/v1/uploads/signatures", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("서명 업로드 URL을 발급받는 중 오류가 발생했습니다.");
  }

  const json = (await response.json()) as GetSignatureUploadUrlResponse;

  if (!json.success || !json.data?.uploadUrl || !json.data?.s3Key) {
    throw new Error(json.message || "서명 업로드 URL 발급에 실패했습니다.");
  }

  return {
    uploadUrl: json.data.uploadUrl,
    s3Key: json.data.s3Key,
  };
}

/**
 * S3에 서명 이미지 업로드
 */
export async function uploadSignatureToS3(uploadUrl: string, imageBlob: Blob): Promise<void> {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    body: imageBlob,
    headers: {
      "Content-Type": "image/png",
    },
  });

  if (!response.ok) {
    throw new Error("서명 이미지를 S3에 업로드하는 중 오류가 발생했습니다.");
  }
}

/**
 * 관리자 서명 처리 API
 */
export type SubmitManagerSignaturePayload = {
  signatureS3Key: string;
  clientHash: string;
};

export type SubmitManagerSignatureResponse = {
  success: boolean;
  message: string;
  data?: {
    contractState: string;
    pdfUrl: string;
  };
};

export async function submitManagerSignature(
  siteId: number,
  contractId: number,
  payload: SubmitManagerSignaturePayload,
): Promise<void> {
  const response = await fetch(`/api/v1/${siteId}/contracts/${contractId}/signatures/manager`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("관리자 서명을 처리하는 중 오류가 발생했습니다.");
  }

  const json = (await response.json()) as SubmitManagerSignatureResponse;

  if (!json.success) {
    throw new Error(json.message || "관리자 서명 처리에 실패했습니다.");
  }
}

/**
 * 이미지 데이터 URL을 Blob으로 변환
 */
export function dataURLtoBlob(dataURL: string): Blob {
  const arr = dataURL.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/png";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * SHA-256 해시 생성
 */
export async function generateSHA256Hash(blob: Blob): Promise<string> {
  const arrayBuffer = await blob.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}
