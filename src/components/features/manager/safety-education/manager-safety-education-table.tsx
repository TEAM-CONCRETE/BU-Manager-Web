import type { ColumnsType } from "antd/es/table";

import { Table } from "@/components/ui/Table/table";
import { StatusPill } from "@/components/ui/StatusPill/status-pill";
import { cn } from "@/utils/cn";

export type ManagerSafetyEducationLogRow = {
  id: number;
  createdAt: string;
  instructorName: string;
  totalAttendeeCount: number;
  signedAttendeeCount: number;
  status: "DRAFT" | "MANAGER_SIGNING_PENDING" | "MANAGER_SIGNED" | "COMPLETED";
};

type ManagerSafetyEducationTableProps = {
  records: ManagerSafetyEducationLogRow[];
  isLoading: boolean;
  onViewDetail: (logId: number, status: ManagerSafetyEducationLogRow["status"]) => void;
};

const buttonClass = (enabled: boolean) =>
  cn(
    "inline-flex h-[30px] min-w-[54px] items-center justify-center rounded-lg border px-3 text-sm font-normal transition",
    enabled
      ? "border-brand-primary text-brand-primary hover:bg-brand-primary/5"
      : "cursor-not-allowed border-border text-text-disabled",
  );

const mapStatusToVariant = (
  status: ManagerSafetyEducationLogRow["status"],
): "success" | "danger" | "warning" | "info" | "neutral" => {
  switch (status) {
    case "COMPLETED":
      return "success";
    case "DRAFT":
      return "neutral";
    case "MANAGER_SIGNING_PENDING":
      return "warning";
    case "MANAGER_SIGNED":
      return "info";
    default:
      return "neutral";
  }
};

const mapStatusToLabel = (status: ManagerSafetyEducationLogRow["status"]): string => {
  switch (status) {
    case "COMPLETED":
      return "완료";
    case "DRAFT":
      return "초안";
    case "MANAGER_SIGNING_PENDING":
      return "관리자 서명 대기";
    case "MANAGER_SIGNED":
      return "관리자 서명 완료";
    default:
      return status;
  }
};

export function ManagerSafetyEducationTable({
  records,
  isLoading,
  onViewDetail,
}: ManagerSafetyEducationTableProps) {
  const columns: ColumnsType<ManagerSafetyEducationLogRow> = [
    {
      title: "생성일시",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (date: string) => new Date(date).toLocaleDateString("ko-KR"),
    },
    {
      title: "교육 실시자",
      dataIndex: "instructorName",
      key: "instructorName",
      align: "center",
    },
    {
      title: "전체 참석자 수",
      dataIndex: "totalAttendeeCount",
      key: "totalAttendeeCount",
      align: "center",
      render: (count: number) => `${count}명`,
    },
    {
      title: "서명 완료 인원 수",
      dataIndex: "signedAttendeeCount",
      key: "signedAttendeeCount",
      align: "center",
      render: (count: number) => `${count}명`,
    },
    {
      title: "상태",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status: ManagerSafetyEducationLogRow["status"]) => {
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
              onViewDetail(record.id, record.status);
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
    <Table<ManagerSafetyEducationLogRow>
      columns={columns}
      dataSource={records}
      rowKey={(record) => record.id}
      loading={isLoading}
      pagination={false}
      showHeaderBar={false}
      borderedContainer={false}
      className="rounded-2xl border border-border bg-white dark:border-dark-border dark:bg-dark-bg-surface"
    />
  );
}
