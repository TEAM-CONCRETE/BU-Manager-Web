"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Modal, notification } from "antd";
import SignatureCanvas from "react-signature-canvas";
import dayjs from "dayjs";

import { PDFViewer } from "@/components/common/pdf-viewer";
import { Button } from "@/components/ui/Button/button";
import { StatusPill } from "@/components/ui/StatusPill/status-pill";
import type { ManagerContractsRow } from "@/components/features/manager/contracts/manager-contracts-table";
import { formatPhone } from "@/utils/phone";
import { mapStatusToLabelAndVariant } from "@/components/features/manager/contracts/manager-contracts-table";
import { useManagerSignature } from "@/hooks/use-manager-signature";

type ManagerContractViewModalProps = {
  open: boolean;
  onClose: () => void;
  contract: ManagerContractsRow | null;
  siteName?: string;
  pdfUrl?: string;
  onOpenInNewWindow?: () => void;
  onSignatureSuccess?: () => void;
  siteId?: number;
  zIndex?: number;
};

type SignatureHistoryItem = {
  id: number;
  occurredAt: string;
  description: string;
  status: "completed" | "pending";
};

export function ManagerContractViewModal({
  open,
  onClose,
  contract,
  siteName,
  pdfUrl,
  onOpenInNewWindow,
  onSignatureSuccess,
  siteId,
  zIndex,
}: ManagerContractViewModalProps) {
  const signaturePadRef = useRef<SignatureCanvas | null>(null);
  const [hasSignature, setHasSignature] = useState(false);

  const contractId = contract?.contractId;

  const managerSignatureMutation = useManagerSignature({
    siteId: siteId ?? 0,
    contractId: contractId ?? 0,
  });

  // 계약서 작성 이력 생성
  const signatureHistory = useMemo((): SignatureHistoryItem[] => {
    if (!contract) return [];

    const history: SignatureHistoryItem[] = [];

    // 1. 계약서 작성 완료
    if (contract.writtenAt) {
      history.push({
        id: 1,
        occurredAt: dayjs(contract.writtenAt).format("YYYY.MM.DD HH:mm"),
        description: "계약서 작성 완료",
        status: "completed",
      });
    }

    // 2. 관리자 서명 완료
    if (contract.corporationSignedAt) {
      history.push({
        id: 2,
        occurredAt: dayjs(contract.corporationSignedAt).format("YYYY.MM.DD HH:mm"),
        description: "관리자 서명 완료",
        status: "completed",
      });
    } else if (contract.writtenAt) {
      // 작성은 됐지만 관리자 서명이 안 된 경우
      history.push({
        id: 2,
        occurredAt: "-",
        description: "관리자 서명 대기",
        status: "pending",
      });
    }

    // 3. 근로자 서명 완료
    if (contract.employeeSignedAt) {
      history.push({
        id: 3,
        occurredAt: dayjs(contract.employeeSignedAt).format("YYYY.MM.DD HH:mm"),
        description: "근로자 서명 완료",
        status: "completed",
      });
    } else if (contract.corporationSignedAt) {
      // 관리자 서명은 됐지만 근로자 서명이 안 된 경우
      history.push({
        id: 3,
        occurredAt: "-",
        description: "근로자 서명 대기",
        status: "pending",
      });
    }

    return history;
  }, [contract]);

  const handleClose = () => {
    signaturePadRef.current?.clear();
    setHasSignature(false);
    onClose();
  };

  const handleOpenInNewWindow = () => {
    if (onOpenInNewWindow && pdfUrl) {
      onOpenInNewWindow();
      return;
    }

    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    }
  };

  const handleSignatureClear = () => {
    signaturePadRef.current?.clear();
    setHasSignature(false);
  };

  const handleSignatureSave = async () => {
    const pad = signaturePadRef.current;
    if (!pad || pad.isEmpty()) return;
    if (!siteId || !contractId) {
      notification.error({
        message: "서명 처리에 필요한 정보가 없습니다. 페이지를 새로고침 후 다시 시도해주세요.",
        placement: "topRight",
      });
      return;
    }

    try {
      const dataUrl = pad.toDataURL("image/png");
      await managerSignatureMutation.mutateAsync(dataUrl);

      notification.success({
        message: "관리자 서명이 저장되었습니다.",
        placement: "topRight",
      });

      setHasSignature(false);
      pad.clear();
      onSignatureSuccess?.();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "관리자 서명을 처리하는 중 오류가 발생했습니다.";
      notification.error({
        message,
        placement: "topRight",
      });
    }
  };

  const status = contract
    ? mapStatusToLabelAndVariant(contract.employmentType, contract.contractStatus)
    : null;

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      centered
      width={960}
      zIndex={zIndex}
      classNames={{
        content: "bg-white",
        body: "p-6 max-h-[90vh] overflow-y-auto",
      }}
      styles={{
        content: {
          backgroundColor: "#ffffff",
        },
      }}
    >
      <div className="flex flex-col gap-6">
        <header className="space-y-1">
          <p className="mb-0! text-xl font-semibold text-text-strong">근로계약서 관리</p>
          <p className="mb-0! text-xs text-text-subtle">
            계약서 작성 후, 문서 열람 및 전자 서명을 진행하세요.
          </p>
        </header>

        <section className="rounded-2xl border border-border bg-bg-surface px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <p className="mb-0! text-sm font-semibold text-text-strong">계약서 정보 요약</p>
          </div>
          <div className="grid grid-cols-1 gap-4 text-xs text-text-subtle sm:grid-cols-2">
            <div className="space-y-1">
              <p className="mb-1! text-[11px] text-text-subtle">근로자 이름</p>
              <p className="mb-2! text-sm text-text-strong">{contract?.name ?? "-"}</p>
              <p className="mb-1! mt-3 text-[11px] text-text-subtle">직무</p>
              <p className="mb-2! text-sm text-text-strong">현장 근로자</p>
              <p className="mb-1! mt-3 text-[11px] text-text-subtle">근로자 유형</p>
              <p className="mb-2! text-sm text-text-strong">
                {contract?.employmentType === "REGULAR"
                  ? "상용직 근로자"
                  : contract?.employmentType === "DAILY"
                    ? "일용직 근로자"
                    : "-"}
              </p>
              <p className="mb-1! mt-3 text-[11px] text-text-subtle">연락처</p>
              <p className="mb-2! text-sm text-text-strong">{formatPhone(contract?.phone)}</p>
            </div>
            <div className="space-y-1">
              <p className="mb-1! text-[11px] text-text-subtle">계약기간</p>
              <p className="mb-2! text-sm text-text-strong">
                {contract?.joinDate ?? "-"} {contract?.endDate ? ` ~ ${contract.endDate}` : ""}
              </p>
              <p className="mb-1! mt-3 text-[11px] text-text-subtle">현장명</p>
              <p className="mb-2! text-sm text-text-strong">{siteName ?? "-"}</p>
              <p className="mb-1! mt-3 text-[11px] text-text-subtle">상태</p>
              {status ? (
                <StatusPill size="sm" variant={status.variant}>
                  {status.label}
                </StatusPill>
              ) : (
                <p className="mb-2! text-sm text-text-subtle">-</p>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-bg-surface px-6 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-0! text-sm font-semibold text-text-strong">근로계약서 미리보기</p>
              <p className="mb-0! mt-1 text-xs text-text-subtle">
                입력된 정보를 기반으로 자동 생성된 계약서를 확인하세요.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleOpenInNewWindow}
                disabled={!pdfUrl}
              >
                전체 보기
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-bg-subtle p-4">
            {pdfUrl ? (
              <PDFViewer pdfUrl={pdfUrl} />
            ) : (
              <div className="flex h-[320px] flex-col items-center justify-center gap-2 text-center text-text-subtle">
                <p className="text-sm">PDF를 불러올 수 없습니다.</p>
                <p className="text-xs">
                  계약서가 아직 생성되지 않았거나, 일시적인 오류가 발생했을 수 있습니다.
                </p>
              </div>
            )}
          </div>
        </section>

        {!contract?.corporationSignedAt && (
          <section className="rounded-2xl border border-border bg-bg-surface px-6 py-4 space-y-4">
            <p className="mb-0! text-sm font-semibold text-text-strong">관리자 서명 및 승인</p>
            <div className="flex h-40 flex-col gap-2 rounded-2xl border border-dashed border-border bg-bg-subtle px-4 py-3">
              <div className="relative flex-1 overflow-hidden rounded-xl bg-white">
                <SignatureCanvas
                  ref={signaturePadRef}
                  penColor="#2563EB"
                  onEnd={() => {
                    if (!signaturePadRef.current?.isEmpty()) {
                      setHasSignature(true);
                    }
                  }}
                  canvasProps={{
                    className: "w-full h-full cursor-crosshair bg-transparent",
                  }}
                />
                {!hasSignature && (
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
                    <Image
                      src="/assets/icons/signature.svg"
                      alt="서명 아이콘"
                      width={32}
                      height={32}
                      className="h-8 w-8"
                    />
                    <p className="mb-0! text-xs text-text-subtle">
                      서명을 추가하려면 여기를 드래그하거나 터치하세요.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-start justify-between gap-2 pt-2 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignatureClear}
                  disabled={!hasSignature}
                >
                  서명 삭제
                </Button>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSignatureSave}
                disabled={!hasSignature || managerSignatureMutation.isPending}
              >
                {managerSignatureMutation.isPending ? "서명 저장 중..." : "서명 저장"}
              </Button>
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-border bg-bg-surface px-6 py-4 space-y-3">
          <p className="mb-0! text-sm font-semibold text-text-strong">계약서 이력</p>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="min-w-full divide-y divide-border bg-white text-xs">
              <thead className="bg-bg-subtle text-text-subtle">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">변경 일시</th>
                  <th className="px-4 py-2 text-left font-medium">변경 내용</th>
                  <th className="px-4 py-2 text-left font-medium">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-text-base">
                {signatureHistory.length > 0 ? (
                  signatureHistory.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-2 whitespace-nowrap">{item.occurredAt}</td>
                      <td className="px-4 py-2">{item.description}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <StatusPill
                          size="sm"
                          variant={item.status === "completed" ? "success" : "neutral"}
                        >
                          {item.status === "completed" ? "완료" : "대기"}
                        </StatusPill>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-text-subtle">
                      계약서 이력이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </Modal>
  );
}
