"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button/button";

type PDFViewerProps = {
  pdfUrl: string;
};

export function PDFViewer({ pdfUrl }: PDFViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setHasError(false);
                  setIsLoading(true);
                }}
              >
                다시 시도
              </Button>
            </div>
          </div>
        ) : (
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
            className="w-full h-[600px] border-0"
            title="PDF Viewer"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        )}
      </div>
      <div className="flex items-center justify-center gap-2 text-sm text-text-subtle">
        <Button variant="ghost" size="sm" onClick={() => window.open(pdfUrl, "_blank")}>
          새 창에서 열기
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const link = document.createElement("a");
            link.href = pdfUrl;
            link.download = "document.pdf";
            link.click();
          }}
        >
          다운로드
        </Button>
      </div>
    </div>
  );
}
