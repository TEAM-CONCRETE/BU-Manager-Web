"use client";

import { useMemo } from "react";
import type { ColumnsType } from "antd/es/table";

import { Table } from "@/components/ui/Table/table";
import type { SafetyWorkRecord } from "@/lib/api/get-safety-work-records";
import { cn } from "@/utils/cn";

type SafetyWorkTableProps = {
  records: SafetyWorkRecord[];
  isLoading: boolean;
  currentPage: number;
  pageSize: number;
  total?: number;
  onPageChange: (page: number) => void;
  onOpenSafetyDiary: (record: SafetyWorkRecord) => void;
  onOpenWorkReport: (record: SafetyWorkRecord) => void;
};

const buttonClass = (enabled: boolean) =>
  cn(
    "inline-flex h-10 min-w-[72px] items-center justify-center rounded-xl border px-4 text-sm font-medium transition",
    enabled
      ? "border-brand-primary text-brand-primary hover:bg-brand-primary/5"
      : "cursor-not-allowed border-border text-text-disabled",
  );

export function SafetyWorkTable({
  records,
  isLoading,
  currentPage,
  pageSize,
  total,
  onPageChange,
  onOpenSafetyDiary,
  onOpenWorkReport,
}: SafetyWorkTableProps) {
  const columns = useMemo<ColumnsType<SafetyWorkRecord>>(
    () => [
      {
        title: "날짜",
        dataIndex: "date",
        key: "date",
        align: "center",
        render: (value: string) =>
          new Date(value).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
      },
      {
        title: "안전교육 일지 열람",
        key: "safetyDiary",
        align: "center",
        render: (_, record) => (
          <button
            type="button"
            onClick={() => record.safetyDiaryAvailable && onOpenSafetyDiary(record)}
            disabled={!record.safetyDiaryAvailable}
            className={buttonClass(record.safetyDiaryAvailable)}
          >
            열람
          </button>
        ),
      },
      {
        title: "작업일보 열람",
        key: "workReport",
        align: "center",
        render: (_, record) => (
          <button
            type="button"
            onClick={() => record.workReportAvailable && onOpenWorkReport(record)}
            disabled={!record.workReportAvailable}
            className={buttonClass(record.workReportAvailable)}
          >
            열람
          </button>
        ),
      },
    ],
    [onOpenSafetyDiary, onOpenWorkReport],
  );

  return (
    <Table<SafetyWorkRecord>
      columns={columns}
      dataSource={records}
      rowKey={(record) => record.id}
      loading={isLoading}
      pagination={{
        current: currentPage,
        pageSize,
        total,
        onChange: onPageChange,
        position: ["bottomCenter"],
        showSizeChanger: false,
      }}
      showHeaderBar={false}
      borderedContainer={false}
      className="rounded-2xl border border-border bg-white"
    />
  );
}
