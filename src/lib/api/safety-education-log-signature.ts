import {
  getSignatureUploadUrl,
  uploadSignatureToS3,
  dataURLtoBlob,
  generateSHA256Hash,
} from "@/lib/api/contract-signature";

export type SubmitSafetyEducationLogManagerSignaturePayload = {
  signatureS3Key: string;
  clientHash: string;
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
    viewWidth: number;
    viewHeight: number;
  };
};

export type SubmitSafetyEducationLogManagerSignatureApiResponse = {
  success: boolean;
  message: string;
  data?: {
    safetyEducationLogId: number;
    status: "MANAGER_SIGNED" | "COMPLETED";
    pdfUrl: string;
    pdfHash: string | null;
    signedAt: string;
  };
};

export async function submitSafetyEducationLogManagerSignature(
  siteId: number,
  logId: number,
  payload: SubmitSafetyEducationLogManagerSignaturePayload,
): Promise<SubmitSafetyEducationLogManagerSignatureApiResponse["data"]> {
  const response = await fetch(
    `/api/v1/${siteId}/safety-education-logs/${logId}/signatures/manager`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error("안전교육일지 관리자 서명을 처리하는 중 오류가 발생했습니다.");
  }

  const json = (await response.json()) as SubmitSafetyEducationLogManagerSignatureApiResponse;

  if (!json.success || !json.data) {
    throw new Error(json.message || "안전교육일지 관리자 서명 처리에 실패했습니다.");
  }

  return json.data;
}

export async function handleSafetyEducationLogManagerSignature(
  siteId: number,
  logId: number,
  signatureDataURL: string,
): Promise<SubmitSafetyEducationLogManagerSignatureApiResponse["data"]> {
  // 1. Presigned URL 발급
  const { uploadUrl, s3Key } = await getSignatureUploadUrl({
    resourceType: "CONTRACT", // TODO: 안전교육일지용 resourceType이 필요할 수 있음
    resourceId: String(logId),
    signerRole: "MANAGER",
    fileExtension: "png",
  });

  // 2. 이미지 Blob 변환 및 해시 생성
  const imageBlob = dataURLtoBlob(signatureDataURL);
  const clientHash = await generateSHA256Hash(imageBlob);

  // 3. S3에 업로드
  await uploadSignatureToS3(uploadUrl, imageBlob);

  // 4. 관리자 서명 처리 API 호출
  // A4 PDF 기본 크기: 595 x 842 포인트
  // 서명은 일반적으로 하단 중앙에 배치
  const coordinates = {
    x: 400, // 서명 시작 X 좌표
    y: 750, // 서명 시작 Y 좌표 (하단 근처)
    width: 150, // 서명 너비
    height: 50, // 서명 높이
    viewWidth: 595, // PDF 뷰포트 너비 (A4)
    viewHeight: 842, // PDF 뷰포트 높이 (A4)
  };

  return await submitSafetyEducationLogManagerSignature(siteId, logId, {
    signatureS3Key: s3Key,
    clientHash,
    coordinates,
  });
}
