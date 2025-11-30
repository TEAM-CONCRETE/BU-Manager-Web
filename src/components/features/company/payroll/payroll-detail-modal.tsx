"use client";

import { useEffect, useMemo, useState } from "react";
import { Modal, Pagination, Spin } from "antd";

import { Table } from "@/components/ui/Table/table";
import { Button } from "@/components/ui/Button/button";
import { SafetyDocumentModal } from "@/components/features/company/safety/safety-document-modal";
import type {
  PayrollDetailAttendance,
  PayrollDetailHeader,
  PayrollDetailSummary,
} from "@/lib/api/get-payroll-detail";
import { usePayrollDetail } from "@/hooks/use-payroll-detail";
import { useEmployeeDocumentPdf } from "@/hooks/use-employee-document-pdf";
import { cn } from "@/utils/cn";

type PayrollDetailModalProps = {
  open: boolean;
  onClose: () => void;
  payrollId: number | null;
};

const currencyFormatter = new Intl.NumberFormat("ko-KR", {
  style: "currency",
  currency: "KRW",
  maximumFractionDigits: 0,
});

const formatAmount = (value?: number) => currencyFormatter.format(value ?? 0);

function HeaderSection({ header }: { header: PayrollDetailHeader }) {
  return (
    <div className="mb-4 rounded-xl border border-border bg-bg-subtle px-6 py-5 dark:border-dark-border dark:bg-dark-bg-subtle">
      <div className="grid gap-y-3 gap-x-8 md:grid-cols-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-subtle dark:text-dark-text-base">성명</span>
          <span className="text-base font-medium text-brand-primary-strong dark:text-dark-text-strong">
            {header.employeeName}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-subtle dark:text-dark-text-base">주민등록번호</span>
          <span className="text-base text-text-strong dark:text-dark-text-strong">
            {header.residentNum}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-subtle dark:text-dark-text-base">지급(예정)일</span>
          <span className="text-base text-text-strong dark:text-dark-text-strong">
            {header.payDueDate}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-subtle dark:text-dark-text-base">총 지급액</span>
          <span className="text-base font-medium text-brand-primary-strong dark:text-dark-text-strong">
            {formatAmount(header.totalPay)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-subtle dark:text-dark-text-base">비과세 소득</span>
          <span className="text-base text-text-strong dark:text-dark-text-strong">
            {formatAmount(header.noneTaxIncome)}
          </span>
        </div>
      </div>
    </div>
  );
}

function SummarySection({ summary }: { summary: PayrollDetailSummary }) {
  const cards = [
    {
      label: "총 근무시간",
      value: `${summary.totalWorkHour}시간`,
      iconSrc: "/assets/icons/clock.svg",
      iconBgClass: "bg-brand-primary/10",
      valueColorClass: "text-brand-primary-strong",
      iconColorClass: "bg-brand-primary-strong",
    },
    {
      label: "총 근무일수",
      value: `${summary.totalWorkDays}일`,
      iconSrc: "/assets/icons/calendar.svg",
      iconBgClass: "bg-blue-50",
      valueColorClass: "text-blue-600",
      iconColorClass: "bg-blue-600",
    },
    {
      label: "총 지급액",
      value: formatAmount(summary.totalPay),
      iconSrc: "/assets/icons/money.svg",
      iconBgClass: "bg-green-100",
      valueColorClass: "text-green-600",
      iconColorClass: "bg-green-600",
    },
  ] as const;

  return (
    <div className="mb-4 grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="flex flex-col gap-3 rounded-3xl border border-border bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-bg-surface"
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-2xl",
                card.iconBgClass,
              )}
            >
              <span
                className={cn("h-6 w-6", card.iconColorClass)}
                style={{
                  mask: `url(${card.iconSrc}) center / contain no-repeat`,
                  WebkitMask: `url(${card.iconSrc}) center / contain no-repeat`,
                  display: "inline-block",
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-text-subtle dark:text-dark-text-base">
                {card.label}
              </span>
              <span
                className={cn(
                  "text-2xl font-semibold text-text-strong dark:text-dark-text-strong",
                  card.valueColorClass,
                )}
              >
                {card.value}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function PayrollDetailModal({ open, onClose, payrollId }: PayrollDetailModalProps) {
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // payrollId가 변경되거나 모달이 열릴 때 페이지를 0으로 리셋
  useEffect(() => {
    if (open) {
      setPage(0);
    }
  }, [open, payrollId]);

  const { data, isLoading, isFetching, isError, error } = usePayrollDetail({
    payrollId: payrollId ?? 0,
    page,
    size: pageSize,
    enabled: open && !!payrollId,
  });

  const effectiveData = useMemo(() => {
    return data;
  }, [data]);

  const attendances = effectiveData?.attendances.content ?? [];
  const totalElements = effectiveData?.attendances.totalElements ?? 0;
  const currentPage = effectiveData?.attendances.currentPage ?? page;
  const size = effectiveData?.attendances.size ?? pageSize;

  const isTableLoading = isLoading || isFetching;

  const columns = useMemo(
    () => [
      {
        title: "날짜",
        dataIndex: "searchDate",
        key: "searchDate",
        align: "center" as const,
      },
      {
        title: "근무시간",
        dataIndex: "totalWorkHour",
        key: "totalWorkHour",
        align: "center" as const,
        render: (value: number) => `${value}시간`,
      },
      {
        title: "연장근로",
        dataIndex: "additionalWorkHour",
        key: "additionalWorkHour",
        align: "center" as const,
        render: (value: number) => `${value}시간`,
      },
      {
        title: "야간근로",
        dataIndex: "nightWorkHour",
        key: "nightWorkHour",
        align: "center" as const,
        render: (value: number) => `${value}시간`,
      },
      {
        title: "휴일근로",
        dataIndex: "holidayWorkHour",
        key: "holidayWorkHour",
        align: "center" as const,
        render: (value: number) => `${value}시간`,
      },
      {
        title: "수당 금액",
        dataIndex: "allowanceAmount",
        key: "allowanceAmount",
        align: "center" as const,
        render: (value: number) => formatAmount(value),
      },
    ],
    [],
  );

  const handlePageChange = (nextPage: number) => {
    // Pagination 컴포넌트는 1-based, API는 그대로 전달
    setPage(nextPage - 1);
  };

  const errorMessage =
    error instanceof Error
      ? error.message
      : "급여명세서 상세 정보를 불러오는 중 오류가 발생했습니다.";

  const { pdfUrl } = useEmployeeDocumentPdf({
    type: isPdfModalOpen && payrollId ? "payslip" : null,
    id: isPdfModalOpen && payrollId ? payrollId : null,
    enabled: isPdfModalOpen && !!payrollId,
  });

  const pdfSubtitle = effectiveData
    ? `${effectiveData.header.employeeName} · ${effectiveData.header.payDueDate}`
    : undefined;

  return (
    <>
      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        centered
        width={960}
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
        <div className="flex flex-col">
          {/* Header */}
          <div className="border-b border-border px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-0! text-2xl font-semibold text-brand-primary-strong">
                  급여명세서 상세
                </p>
                {effectiveData && (
                  <p className="mb-0! text-sm text-text-subtle">
                    {effectiveData.header.employeeName} · {effectiveData.header.payDueDate}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {payrollId && (
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => setIsPdfModalOpen(true)}
                    disabled={!payrollId}
                  >
                    급여명세서 조회
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="max-h-[640px] overflow-y-auto px-6 py-5">
            {isLoading && (
              <div className="flex h-64 items-center justify-center">
                <Spin />
              </div>
            )}

            {!isLoading && isError && (
              <div className="flex h-64 items-center justify-center text-sm text-text-subtle">
                {errorMessage}
              </div>
            )}

            {!isLoading && !isError && effectiveData && (
              <>
                <HeaderSection header={effectiveData.header} />
                <SummarySection summary={effectiveData.summary} />

                <div className="mt-4 rounded-2xl border border-border bg-bg-surface p-4 dark:border-dark-border dark:bg-dark-bg-surface">
                  <p className="mb-3 text-sm font-semibold text-text-strong dark:text-dark-text-strong">
                    근무일지
                  </p>
                  <Table<PayrollDetailAttendance>
                    columns={columns}
                    dataSource={attendances}
                    rowKey={(row) => `${row.searchDate}-${row.allowanceAmount}`}
                    loading={isTableLoading}
                    pagination={false}
                    showHeaderBar={false}
                    borderedContainer={false}
                    scroll={{ x: "max-content" }}
                  />
                  <div className="mt-4 flex justify-end">
                    <Pagination
                      size="small"
                      current={currentPage + 1}
                      total={totalElements}
                      pageSize={size}
                      onChange={handlePageChange}
                      showSizeChanger={false}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Modal>

      <SafetyDocumentModal
        open={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        title="급여명세서"
        subtitle={pdfSubtitle}
        pdfUrl={pdfUrl}
        zIndex={2000}
        onDownload={() => {
          if (pdfUrl) {
            window.open(pdfUrl, "_blank");
          }
        }}
      />
    </>
  );
}
