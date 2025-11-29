import type { ColumnsType } from "antd/es/table";

import { Table } from "@/components/ui/Table/table";
import { StatusPill } from "@/components/ui/StatusPill/status-pill";
import { cn } from "@/utils/cn";

export type ManagerSafetyEducationReportRow = {
  id: number;
  educationDate: string;
  writerName: string;
  participantCount: number;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
};

type ManagerSafetyEducationTableProps = {
  records: ManagerSafetyEducationReportRow[];
  isLoading: boolean;
  currentPage: number;
  pageSize: number;
  total?: number;
  onPageChange: (page: number) => void;
  onViewDetail: (reportId: number) => void;
};

const buttonClass = (enabled: boolean) =>
  cn(
    "inline-flex h-[30px] min-w-[54px] items-center justify-center rounded-lg border px-3 text-sm font-normal transition",
    enabled
      ? "border-brand-primary text-brand-primary hover:bg-brand-primary/5"
      : "cursor-not-allowed border-border text-text-disabled",
  );

const mapStatusToVariant = (
  status: ManagerSafetyEducationReportRow["status"],
): "success" | "danger" | "warning" | "info" | "neutral" => {
  switch (status) {
    case "COMPLETED":
      return "success";
    case "PENDING":
      return "danger";
    case "IN_PROGRESS":
      return "info";
    default:
      return "neutral";
  }
};

const mapStatusToLabel = (status: ManagerSafetyEducationReportRow["status"]): string => {
  switch (status) {
    case "COMPLETED":
      return "완료";
    case "PENDING":
      return "서명 대기";
    case "IN_PROGRESS":
      return "진행 중";
    default:
      return status;
  }
};

export function ManagerSafetyEducationTable({
  records,
  isLoading,
  currentPage,
  pageSize,
  total,
  onPageChange,
  onViewDetail,
}: ManagerSafetyEducationTableProps) {
  const columns: ColumnsType<ManagerSafetyEducationReportRow> = [
    {
      title: "작업일자",
      dataIndex: "educationDate",
      key: "educationDate",
      align: "center",
    },
    {
      title: "작성자",
      dataIndex: "writerName",
      key: "writerName",
      align: "center",
    },
    {
      title: "교육 대상자 수",
      dataIndex: "participantCount",
      key: "participantCount",
      align: "center",
      render: (count) => `${count}명`,
    },
    {
      title: "상태",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status: ManagerSafetyEducationReportRow["status"]) => {
        return (
          <StatusPill variant={mapStatusToVariant(status)} size="sm">
            {mapStatusToLabel(status)}
          </StatusPill>
        );
      },
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
    <Table<ManagerSafetyEducationReportRow>
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
