"use client";

import { Modal } from "antd";

import { Button } from "@/components/ui/Button/button";
import { PDFViewer } from "@/components/common/pdf-viewer";

type SafetyDocumentModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  pdfUrl?: string;
  downloadLabel?: string;
  onDownload?: () => void;
  zIndex?: number;
};

export function SafetyDocumentModal({
  open,
  onClose,
  title,
  subtitle,
  pdfUrl,
  downloadLabel = "새 창에서 열기",
  onDownload,
  zIndex,
}: SafetyDocumentModalProps) {
  const handleDownload = () => {
    if (pdfUrl && onDownload) {
      onDownload();
    } else if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      centered
      width={900}
      zIndex={zIndex}
      classNames={{
        content: "bg-white",
        body: "p-6",
      }}
      styles={{
        content: {
          backgroundColor: "#ffffff",
        },
      }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between mr-8">
          <div>
            <p className="!mb-0 text-2xl font-semibold text-brand-primary-strong">{title}</p>
            {subtitle && <p className="!mb-0 text-sm text-text-subtle">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">
            {pdfUrl && (
              <Button variant="primary" size="md" onClick={handleDownload}>
                {downloadLabel}
              </Button>
            )}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-bg-subtle p-4">
          {pdfUrl ? (
            <PDFViewer pdfUrl={pdfUrl} />
          ) : (
            <div className="flex h-[480px] items-center justify-center text-text-subtle">
              PDF를 불러올 수 없습니다.
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
