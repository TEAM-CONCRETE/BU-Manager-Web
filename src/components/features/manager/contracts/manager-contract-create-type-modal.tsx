"use client";

import { Modal } from "antd";

import { Button } from "@/components/ui/Button/button";

type ManagerContractCreateTypeModalProps = {
  open: boolean;
  onClose: () => void;
  employeeName?: string;
  onSelect: (type: "REGULAR" | "DAILY") => void;
};

export function ManagerContractCreateTypeModal({
  open,
  onClose,
  employeeName,
  onSelect,
}: ManagerContractCreateTypeModalProps) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={520}
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
      <div className="flex flex-col gap-5">
        <header className="space-y-1">
          <p className="mb-0! text-base font-semibold text-text-strong">근로계약서 유형 선택</p>
          <p className="mb-0! text-xs text-text-subtle">
            {employeeName
              ? `${employeeName}님의 근로계약서 유형을 선택하세요.`
              : "근로계약서 유형을 선택하세요."}
          </p>
        </header>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onSelect("REGULAR")}
            className="flex flex-col gap-2 rounded-2xl border border-border bg-bg-subtle px-4 py-3 text-left hover:border-brand-primary hover:bg-brand-primary/5"
          >
            <p className="mb-0! text-sm font-semibold text-text-strong">상용직 근로계약서</p>
            <p className="mb-0! text-xs text-text-subtle">
              정규/상용 근로자를 위한 표준 근로계약서 양식입니다.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onSelect("DAILY")}
            className="flex flex-col gap-2 rounded-2xl border border-border bg-bg-subtle px-4 py-3 text-left hover:border-brand-primary hover:bg-brand-primary/5"
          >
            <p className="mb-0! text-sm font-semibold text-text-strong">일용직 근로계약서</p>
            <p className="mb-0! text-xs text-text-subtle">
              일용 근로자를 위한 단기 계약서 양식입니다.
            </p>
          </button>
        </div>

        <div className="flex justify-end pt-1">
          <Button variant="ghost" size="sm" onClick={onClose}>
            닫기
          </Button>
        </div>
      </div>
    </Modal>
  );
}
