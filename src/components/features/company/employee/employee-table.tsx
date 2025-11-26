import type { ColumnsType } from "antd/es/table";

import { Table } from "@/components/ui/Table/table";
import type { EmployeeRecord } from "@/types/employee";
import { cn } from "@/utils/cn";

type EmployeeTableProps = {
  records: EmployeeRecord[];
  isLoading: boolean;
  currentPage: number;
  pageSize: number;
  total?: number;
  onPageChange: (page: number) => void;
  onOpenDetail: (employee: EmployeeRecord) => void;
};

const buttonClass = (enabled: boolean) =>
  cn(
    "inline-flex h-10 min-w-[72px] items-center justify-center rounded-xl border px-4 text-sm font-medium transition",
    enabled
      ? "border-brand-primary text-brand-primary hover:bg-brand-primary/5"
      : "cursor-not-allowed border-border text-text-disabled",
  );

export function EmployeeTable({
  records,
  isLoading,
  currentPage,
  pageSize,
  total,
  onPageChange,
  onOpenDetail,
}: EmployeeTableProps) {
  const columns: ColumnsType<EmployeeRecord> = [
    {
      title: "사원명",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "주민등록번호",
      dataIndex: "residentNumber",
      key: "residentNumber",
      align: "center",
    },
    {
      title: "상세 보기",
      key: "detail",
      align: "center",
      render: (_, record) => (
        <button type="button" onClick={() => onOpenDetail(record)} className={buttonClass(true)}>
          열람
        </button>
      ),
    },
  ];

  return (
    <Table<EmployeeRecord>
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
      className="rounded-2xl border border-border bg-white dark:border-dark-border dark:bg-dark-bg-surface"
    />
  );
}
