import { useMutation } from "@tanstack/react-query";
import {
  getSignatureUploadUrl,
  uploadSignatureToS3,
  submitManagerSignature,
  dataURLtoBlob,
  generateSHA256Hash,
  type SubmitManagerSignaturePayload,
} from "@/lib/api/contract-signature";

type UseManagerSignatureParams = {
  siteId: number;
  contractId: number;
};

export function useManagerSignature({ siteId, contractId }: UseManagerSignatureParams) {
  return useMutation({
    mutationFn: async (signatureDataURL: string) => {
      // 1. Presigned URL 발급
      const { uploadUrl, s3Key } = await getSignatureUploadUrl({
        resourceType: "CONTRACT",
        resourceId: String(contractId),
        signerRole: "MANAGER",
        fileExtension: "png",
      });

      // 2. 이미지 Blob 변환 및 해시 생성
      const imageBlob = dataURLtoBlob(signatureDataURL);
      const clientHash = await generateSHA256Hash(imageBlob);

      // 3. S3에 업로드
      await uploadSignatureToS3(uploadUrl, imageBlob);

      // 4. 관리자 서명 처리 API 호출
      const payload: SubmitManagerSignaturePayload = {
        signatureS3Key: s3Key,
        clientHash,
      };
      await submitManagerSignature(siteId, contractId, payload);
    },
  });
}
