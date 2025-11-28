import type { ColumnsType } from "antd/es/table";

import { Table } from "@/components/ui/Table/table";
import { StatusPill } from "@/components/ui/StatusPill/status-pill";
import type { ContractItem } from "@/lib/api/get-contracts";
import { cn } from "@/utils/cn";
import { formatPhone } from "@/utils/phone";

export type ManagerContractsRow = {
  id: number;
  employeeId?: number;
  employeeUserId?: string;
  contractId?: number;
  name: string;
  residentNumber: string;
  employmentType: "REGULAR" | "DAILY" | "UNCONTRACTED";
  contractStatus?: ContractItem["contractState"] | null;
  joinDate?: string;
  endDate?: string;
  phone?: string;
};

type ManagerContractsTableProps = {
  records: ManagerContractsRow[];
  isLoading: boolean;
  currentPage: number;
  pageSize: number;
  total?: number;
  onPageChange: (page: number) => void;
  onOpenContract: (contractId: number) => void;
  onCreateContract: (record: ManagerContractsRow) => void;
};

const buttonClass = (enabled: boolean) =>
  cn(
    "inline-flex h-9 min-w-[80px] items-center justify-center rounded-xl border px-4 text-xs font-medium transition",
    enabled
      ? "border-brand-primary text-brand-primary hover:bg-brand-primary/5"
      : "cursor-not-allowed border-border text-text-disabled",
  );

const employmentLabelMap: Record<ManagerContractsRow["employmentType"], string> = {
  REGULAR: "상용",
  DAILY: "일용",
  UNCONTRACTED: "-",
};

export function mapStatusToLabelAndVariant(
  empType: ManagerContractsRow["employmentType"],
  contractStatus?: ContractItem["contractState"] | null,
): { label: string; variant: Parameters<typeof StatusPill>[0]["variant"] } {
  // emp_type이 UNCONTRACTED면 미작성
  if (empType === "UNCONTRACTED") {
    return { label: "미작성", variant: "neutral" };
  }

  // 그 외는 contract status 기준
  if (!contractStatus || contractStatus === "DRAFT") {
    return { label: "미작성", variant: "neutral" };
  }
  if (
    contractStatus === "MANAGER_SIGNING_PENDING" ||
    contractStatus === "EMPLOYEE_SIGNING_PENDING" ||
    contractStatus === "SENT" ||
    contractStatus === "ADMIN_SIGNED"
  ) {
    return { label: "서명 대기", variant: "warning" };
  }
  if (contractStatus === "FULLY_SIGNED") {
    return { label: "승인 완료", variant: "success" };
  }
  if (contractStatus === "TERMINATED" || contractStatus === "VOID") {
    return { label: "계약 종료", variant: "danger" };
  }
  return { label: contractStatus, variant: "info" };
}

export function ManagerContractsTable({
  records,
  isLoading,
  currentPage,
  pageSize,
  total,
  onPageChange,
  onOpenContract,
  onCreateContract,
}: ManagerContractsTableProps) {
  const columns: ColumnsType<ManagerContractsRow> = [
    {
      title: "구분",
      dataIndex: "employmentType",
      key: "employmentType",
      align: "center",
      render: (value: ManagerContractsRow["employmentType"]) => employmentLabelMap[value] ?? "-",
    },
    {
      title: "사원명",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "입사일",
      dataIndex: "joinDate",
      key: "joinDate",
      align: "center",
      render: (value) => value ?? "-",
    },
    {
      title: "퇴사일",
      dataIndex: "endDate",
      key: "endDate",
      align: "center",
      render: (value) => value ?? "-",
    },
    {
      title: "주민등록번호",
      dataIndex: "residentNumber",
      key: "residentNumber",
      align: "center",
      render: (value) => value ?? "-",
    },
    {
      title: "연락처",
      dataIndex: "phone",
      key: "phone",
      align: "center",
      render: (value) => formatPhone(value),
    },
    {
      title: "현황",
      key: "contractStatus",
      align: "center",
      render: (_, record) => {
        const { label, variant } = mapStatusToLabelAndVariant(
          record.employmentType,
          record.contractStatus,
        );
        return (
          <StatusPill size="sm" variant={variant}>
            {label}
          </StatusPill>
        );
      },
    },
    {
      title: "근로계약서",
      key: "contractAction",
      align: "center",
      render: (_, record) => {
        const empType = record.employmentType;
        const contractStatus = record.contractStatus;

        if (empType === "UNCONTRACTED") {
          return (
            <button
              type="button"
              onClick={() => {
                onCreateContract(record);
              }}
              className={buttonClass(true)}
            >
              작성
            </button>
          );
        }

        const isFullySigned = contractStatus === "FULLY_SIGNED";
        const isTerminated = contractStatus === "TERMINATED" || contractStatus === "VOID";

        let label = "조회";
        if (isFullySigned) label = "열람";

        const enabled = !isTerminated && record.contractId != null;

        return (
          <button
            type="button"
            onClick={() => {
              if (enabled && record.contractId) {
                onOpenContract(record.contractId);
              }
            }}
            disabled={!enabled}
            className={buttonClass(enabled)}
          >
            {label}
          </button>
        );
      },
    },
  ];

  return (
    <Table<ManagerContractsRow>
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
