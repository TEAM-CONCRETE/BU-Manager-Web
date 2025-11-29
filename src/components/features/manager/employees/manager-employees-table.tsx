import type { ColumnsType } from "antd/es/table";

import { Table } from "@/components/ui/Table/table";
import type { EmployeeRecord } from "@/types/employee";
import { cn } from "@/utils/cn";

export type ManagerEmployeesRow = {
  id: number;
  name: string;
  residentNumber: string;
  employmentType: EmployeeRecord["employmentType"];
};

type ManagerEmployeesTableProps = {
  records: ManagerEmployeesRow[];
  isLoading: boolean;
  currentPage: number;
  pageSize: number;
  total?: number;
  onPageChange: (page: number) => void;
  onViewDetail: (employeeId: number) => void;
};

const buttonClass = (enabled: boolean) =>
  cn(
    "inline-flex h-9 min-w-[62px] items-center justify-center rounded-lg border px-4 text-sm font-medium transition",
    enabled
      ? "border-brand-primary text-brand-primary hover:bg-brand-primary/5"
      : "cursor-not-allowed border-border text-text-disabled",
  );

export function ManagerEmployeesTable({
  records,
  isLoading,
  currentPage,
  pageSize,
  total,
  onPageChange,
  onViewDetail,
}: ManagerEmployeesTableProps) {
  const columns: ColumnsType<ManagerEmployeesRow> = [
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
      render: (value) => value ?? "-",
    },
    {
      title: "상세 보기",
      key: "detailAction",
      align: "center",
      render: (_, record) => {
        return (
          <button
            type="button"
            onClick={() => {
              onViewDetail(record.id);
            }}
            className={buttonClass(true)}
          >
            열람
          </button>
        );
      },
    },
  ];

  return (
    <Table<ManagerEmployeesRow>
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
