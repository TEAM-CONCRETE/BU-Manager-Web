"use client";

import { useState } from "react";
import { Modal } from "antd";

import { Button } from "@/components/ui/Button/button";

type SiteSecretKeyModalProps = {
  open: boolean;
  onClose: () => void;
  managerKey: string;
  workerKey: string;
  createdAt?: string;
  createdBy?: string;
  onGoToMain?: () => void;
  onGoToSiteList?: () => void;
};

export function SiteSecretKeyModal({
  open,
  onClose,
  managerKey,
  workerKey,
  createdAt,
  createdBy,
  onGoToMain,
  onGoToSiteList,
}: SiteSecretKeyModalProps) {
  const [copiedTarget, setCopiedTarget] = useState<"manager" | "worker" | null>(null);

  const handleCopy = async (value: string, target: "manager" | "worker") => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      setCopiedTarget(target);
      setTimeout(() => setCopiedTarget((prev) => (prev === target ? null : prev)), 2000);
    } catch {
      // clipboard가 동작하지 않는 환경에서는 조용히 실패
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleGoToMain = () => {
    onGoToMain?.();
  };

  const handleGoToSiteList = () => {
    onGoToSiteList?.();
  };

  const renderKeyBlock = (label: string, value: string, target: "manager" | "worker") => {
    const isCopied = copiedTarget === target;

    return (
      <div className="space-y-2">
        <p className="mb-0 text-sm font-medium text-text-strong">{label}</p>
        <div className="flex items-center justify-between gap-2 rounded-2xl border border-border bg-bg-subtle px-4 py-3">
          <span className="truncate text-base font-mono tracking-[0.12em] text-brand-primary-strong">
            {value || "-"}
          </span>
          <button
            type="button"
            onClick={() => handleCopy(value, target)}
            className="inline-flex h-8 items-center rounded-lg border border-border bg-white px-3 text-xs font-medium text-text-subtle hover:border-brand-primary hover:text-brand-primary"
          >
            {isCopied ? "복사됨" : "복사"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      centered
      width={620}
      classNames={{
        content: "bg-white",
        body: "p-0",
      }}
      styles={{
        content: {
          backgroundColor: "#ffffff",
        },
      }}
    >
      <div className="flex flex-col rounded-2xl">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 px-8 pt-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#eff6ff]">
            <span className="text-3xl text-brand-primary-strong">✓</span>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-brand-primary-strong">
              현장 등록이 완료되었습니다!
            </p>
            <p className="mb-0 text-sm text-text-subtle">
              새로운 현장이 성공적으로 등록되었습니다.
              <br />
              아래의 시크릿 키를 안전하게 보관해주세요.
            </p>
          </div>
        </div>

        <div className="space-y-4 px-8 py-6">
          {renderKeyBlock("현장 관리자용 시크릿 키 (Secret Key)", managerKey, "manager")}
          {renderKeyBlock("근로자용 시크릿 키 (Secret Key)", workerKey, "worker")}

          <div className="mt-2 rounded-lg border border-[#fee2e2] bg-[#fef2f2] px-4 py-3">
            <p className="mb-0! text-xs leading-relaxed text-[#b91c1c]">
              이 시크릿 키는 이후 재발급되지 않습니다. 안전한 장소에 복사 또는 저장해 주세요.
              <br />
              이후 시크릿 키를 현장 관리자와 근로자에게 전달하세요!
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border px-8 py-4">
          <Button variant="ghost" size="md" onClick={handleGoToMain}>
            메인으로 돌아가기
          </Button>
          <Button variant="primary" size="md" onClick={handleGoToSiteList}>
            현장 목록 보기
          </Button>
        </div>

        {(createdAt || createdBy) && (
          <div className="border-t border-border px-8 py-4 text-center text-xs text-text-subtle">
            {createdAt && <p className="mb-1">등록일: {createdAt}</p>}
            {createdBy && <p className="mb-0">등록자: {createdBy}</p>}
          </div>
        )}
      </div>
    </Modal>
  );
}
