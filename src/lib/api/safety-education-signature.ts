import {
  getSignatureUploadUrl,
  uploadSignatureToS3,
  dataURLtoBlob,
  generateSHA256Hash,
} from "@/lib/api/contract-signature";

export type SubmitSafetyEducationManagerSignaturePayload = {
  signatureS3Key: string;
  clientHash: string;
};

export type SubmitSafetyEducationManagerSignatureResponse = {
  success: boolean;
  message: string;
  data?: {
    pdfUrl: string;
  };
};

export async function submitSafetyEducationManagerSignature(
  siteId: number,
  reportId: number,
  payload: SubmitSafetyEducationManagerSignaturePayload,
): Promise<void> {
  const response = await fetch(
    `/api/v1/${siteId}/safety-education-reports/${reportId}/signatures/manager`,
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
    throw new Error("안전교육 일지 관리자 서명을 처리하는 중 오류가 발생했습니다.");
  }

  const json = (await response.json()) as SubmitSafetyEducationManagerSignatureResponse;

  if (!json.success) {
    throw new Error(json.message || "안전교육 일지 관리자 서명 처리에 실패했습니다.");
  }
}

export async function handleSafetyEducationManagerSignature(
  siteId: number,
  reportId: number,
  signatureDataURL: string,
): Promise<void> {
  // 1. Presigned URL 발급
  const { uploadUrl, s3Key } = await getSignatureUploadUrl({
    resourceType: "CONTRACT", // TODO: 안전교육 일지용 resourceType이 필요할 수 있음
    resourceId: String(reportId),
    signerRole: "MANAGER",
    fileExtension: "png",
  });

  // 2. 이미지 Blob 변환 및 해시 생성
  const imageBlob = dataURLtoBlob(signatureDataURL);
  const clientHash = await generateSHA256Hash(imageBlob);

  // 3. S3에 업로드
  await uploadSignatureToS3(uploadUrl, imageBlob);

  // 4. 관리자 서명 처리 API 호출
  await submitSafetyEducationManagerSignature(siteId, reportId, {
    signatureS3Key: s3Key,
    clientHash,
  });
}
