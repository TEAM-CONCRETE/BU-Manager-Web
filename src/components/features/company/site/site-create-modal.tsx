"use client";

import { useEffect, useState } from "react";
import { Modal } from "antd";

import { Button } from "@/components/ui/Button/button";
import { Input } from "@/components/ui/Input/input";

export type SiteFormValues = {
  clientName: string;
  siteName: string;
  siteAddress: string;
  startDate: string;
  endDate: string;
};

type SiteCreateModalProps = {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: SiteFormValues) => Promise<void> | void;
};

type SiteFormErrors = Partial<Record<keyof SiteFormValues, string>>;

export function SiteCreateModal({ open, onCancel, onSubmit }: SiteCreateModalProps) {
  const [values, setValues] = useState<SiteFormValues>({
    clientName: "",
    siteName: "",
    siteAddress: "",
    startDate: "",
    endDate: "",
  });
  const [errors, setErrors] = useState<SiteFormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      resetState();
    }
  }, [open]);

  const resetState = () => {
    setValues({
      clientName: "",
      siteName: "",
      siteAddress: "",
      startDate: "",
      endDate: "",
    });
    setErrors({});
    setSubmitting(false);
  };

  const handleClose = () => {
    if (submitting) return;
    resetState();
    onCancel();
  };

  const handleChange = <K extends keyof SiteFormValues>(key: K, value: SiteFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): SiteFormErrors => {
    const nextErrors: SiteFormErrors = {};

    if (!values.clientName.trim()) {
      nextErrors.clientName = "발주처를 입력해주세요.";
    }
    if (!values.siteName.trim()) {
      nextErrors.siteName = "현장명을 입력해주세요.";
    }
    if (!values.siteAddress.trim()) {
      nextErrors.siteAddress = "현장주소를 입력해주세요.";
    }
    if (!values.startDate) {
      nextErrors.startDate = "시작일을 선택해주세요.";
    }
    if (!values.endDate) {
      nextErrors.endDate = "종료일을 선택해주세요.";
    }

    if (values.startDate && values.endDate) {
      const start = new Date(values.startDate);
      const end = new Date(values.endDate);
      if (start > end) {
        nextErrors.endDate = "종료일은 시작일 이후여야 합니다.";
      }
    }

    return nextErrors;
  };

  const handleSubmit = async () => {
    if (submitting) return;

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSubmitting(true);
      await Promise.resolve(onSubmit(values));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      centered
      width={640}
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
        <div className="border-b border-border px-8 py-6">
          <p className="mb-0! text-2xl font-semibold text-brand-primary-strong">현장 등록</p>
          <p className="mb-0! text-sm text-text-subtle">
            새로운 현장 정보를 입력하고 Build-Up 시스템에 등록하세요.
          </p>
        </div>

        <div className="max-h-[520px] overflow-y-auto px-8 py-6 space-y-5">
          <Input
            label="발주처"
            placeholder="예: 현대건설"
            value={values.clientName}
            onChange={(e) => handleChange("clientName", e.target.value)}
            error={errors.clientName}
          />
          <Input
            label="현장명"
            placeholder="예: 이천 A 아파트 현장"
            value={values.siteName}
            onChange={(e) => handleChange("siteName", e.target.value)}
            error={errors.siteName}
          />
          <Input
            label="현장주소"
            placeholder="예: 경기도 이천시 쌀구 하이니스동 21-1"
            value={values.siteAddress}
            onChange={(e) => handleChange("siteAddress", e.target.value)}
            error={errors.siteAddress}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="시작일"
              type="date"
              value={values.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
              error={errors.startDate}
            />
            <Input
              label="종료일"
              type="date"
              value={values.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
              error={errors.endDate}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border px-8 py-4">
          <Button variant="ghost" size="md" onClick={handleClose} disabled={submitting}>
            취소
          </Button>
          <Button variant="primary" size="md" onClick={handleSubmit} isLoading={submitting}>
            등록하기
          </Button>
        </div>
      </div>
    </Modal>
  );
}
