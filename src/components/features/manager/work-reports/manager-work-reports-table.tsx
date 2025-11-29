import type { ColumnsType } from "antd/es/table";

import { Table } from "@/components/ui/Table/table";
import { cn } from "@/utils/cn";

export type ManagerWorkReportRow = {
  id: number;
  workDate: string;
  authorName: string;
};

type ManagerWorkReportsTableProps = {
  records: ManagerWorkReportRow[];
  isLoading: boolean;
  currentPage: number;
  pageSize: number;
  total?: number;
  onPageChange: (page: number) => void;
  onViewDetail: (workReportId: number) => void;
};

const buttonClass = (enabled: boolean) =>
  cn(
    "inline-flex h-[30px] min-w-[54px] items-center justify-center rounded-lg border px-3 text-sm font-normal transition",
    enabled
      ? "border-brand-primary text-brand-primary hover:bg-brand-primary/5"
      : "cursor-not-allowed border-border text-text-disabled",
  );

export function ManagerWorkReportsTable({
  records,
  isLoading,
  currentPage,
  pageSize,
  total,
  onPageChange,
  onViewDetail,
}: ManagerWorkReportsTableProps) {
  const columns: ColumnsType<ManagerWorkReportRow> = [
    {
      title: "작업일자",
      dataIndex: "workDate",
      key: "workDate",
      align: "center",
    },
    {
      title: "작성자",
      dataIndex: "authorName",
      key: "authorName",
      align: "center",
    },
    {
      title: "상세보기",
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
            보기
          </button>
        );
      },
    },
  ];

  return (
    <Table<ManagerWorkReportRow>
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
