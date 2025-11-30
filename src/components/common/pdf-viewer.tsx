"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button/button";

type PDFViewerProps = {
  pdfUrl: string;
};

export function PDFViewer({ pdfUrl }: PDFViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!pdfUrl) {
      setIsLoading(false);
      setHasError(true);
      return;
    }

    let currentBlobUrl: string | null = null;
    let isCancelled = false;

    // S3 presigned URL을 blob으로 다운로드하여 CORS 문제 우회
    const fetchPdfAsBlob = async () => {
      try {
        setIsLoading(true);
        setHasError(false);

        const response = await fetch(pdfUrl, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`PDF 다운로드 실패: ${response.status}`);
        }

        const blob = await response.blob();

        // 취소되었으면 blob URL 생성하지 않음
        if (isCancelled) {
          return;
        }

        const url = URL.createObjectURL(blob);
        currentBlobUrl = url;
        setBlobUrl(url);
        setIsLoading(false);
      } catch (error) {
        if (!isCancelled) {
          console.error("PDF 로드 오류:", error);
          setIsLoading(false);
          setHasError(true);
        }
      }
    };

    fetchPdfAsBlob();

    // Cleanup: 컴포넌트 언마운트 또는 pdfUrl/retryKey 변경 시 blob URL 해제
    return () => {
      isCancelled = true;
      if (currentBlobUrl) {
        URL.revokeObjectURL(currentBlobUrl);
      }
    };
  }, [pdfUrl, retryKey]);

  // blobUrl이 변경될 때 이전 blob URL 정리
  useEffect(() => {
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [blobUrl]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
      setBlobUrl(null);
    }
    // retryKey를 변경하여 useEffect 재실행
    setRetryKey((prev) => prev + 1);
  };

  return (
    <div className="flex h-[600px] flex-col gap-4">
      <div className="relative rounded-xl border border-border bg-white shadow-sm overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-bg-subtle z-10">
            <p className="text-text-subtle">PDF를 불러오는 중입니다...</p>
          </div>
        )}
        {hasError ? (
          <div className="flex h-[600px] flex-col items-center justify-center gap-4 text-center px-4">
            <p className="text-red-500 font-semibold">PDF를 불러올 수 없습니다.</p>
            <p className="text-sm text-text-subtle">
              접근 권한이 없거나 파일이 존재하지 않을 수 있습니다.
            </p>
            <div className="flex items-center gap-2">
              <Button variant="primary" size="sm" onClick={() => window.open(pdfUrl, "_blank")}>
                새 창에서 열기
              </Button>
              <Button variant="ghost" size="sm" onClick={handleRetry}>
                다시 시도
              </Button>
            </div>
          </div>
        ) : blobUrl ? (
          <iframe
            src={`${blobUrl}#toolbar=1&navpanes=1&scrollbar=1`}
            className="w-full h-[600px] border-0"
            title="PDF Viewer"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        ) : null}
      </div>
    </div>
  );
}
