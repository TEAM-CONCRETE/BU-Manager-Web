import type { ColumnsType } from "antd/es/table";

import { Table, type TableProps as BaseTableProps } from "@/components/ui/Table/table";
import type { PayrollRecord, PayrollStatus } from "@/lib/api/get-payroll-records";
import { cn } from "@/utils/cn";

const currencyFormatter = new Intl.NumberFormat("ko-KR", {
  style: "currency",
  currency: "KRW",
  maximumFractionDigits: 0,
});

const formatAmount = (value?: number) => currencyFormatter.format(value ?? 0);

const statusMeta: Record<PayrollStatus, { label: string; chipClass: string; dotClass: string }> = {
  PENDING: {
    label: "지급 예정",
    chipClass: "bg-yellow-50 text-yellow-800",
    dotClass: "bg-yellow-400",
  },
  IN_PROGRESS: {
    label: "정산 중",
    chipClass: "bg-sky-50 text-sky-700",
    dotClass: "bg-sky-400",
  },
  COMPLETED: {
    label: "정산 완료",
    chipClass: "bg-emerald-50 text-emerald-700",
    dotClass: "bg-emerald-400",
  },
  PAID: {
    label: "지급 완료",
    chipClass: "bg-green-50 text-green-700",
    dotClass: "bg-green-500",
  },
};

const renderStatusPill = (status: PayrollStatus) => {
  const meta = statusMeta[status];
  if (!meta) {
    return (
      <span className="inline-flex items-center rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
        -
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${meta.chipClass}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} />
      {meta.label}
    </span>
  );
};

const payrollColumns: ColumnsType<PayrollRecord> = [
  {
    title: "근로자명",
    dataIndex: "workerName",
    key: "workerName",
    align: "left",
    render: (value: PayrollRecord["workerName"]) => (
      <span className="font-medium text-text-strong dark:text-dark-text-strong">{value}</span>
    ),
  },
  {
    title: "주민등록번호",
    dataIndex: "residentNumber",
    key: "residentNumber",
    align: "center",
  },
  {
    title: "지급(예정)일",
    dataIndex: "payday",
    key: "payday",
    align: "center",
    render: (value) => value ?? "-",
  },
  {
    title: "총 지급액",
    dataIndex: "totalPay",
    key: "totalPay",
    align: "right",
    render: (value) => formatAmount(value),
  },
  {
    title: "비과세 소득",
    dataIndex: "nonTaxableIncome",
    key: "nonTaxableIncome",
    align: "right",
    render: (value) => formatAmount(value),
  },
  {
    title: "원천징수세액(소득세)",
    dataIndex: "withholdingIncomeTax",
    key: "withholdingIncomeTax",
    align: "right",
    render: (value) => formatAmount(value),
  },
  {
    title: "원천징수세액(주민세)",
    dataIndex: "withholdingResidentTax",
    key: "withholdingResidentTax",
    align: "right",
    render: (value) => formatAmount(value),
  },
  {
    title: "지급 여부",
    key: "paymentStatus",
    align: "center",
    render: (_, record) => renderStatusPill(record.paymentStatus),
  },
  {
    title: "급여명세서 조회",
    key: "payrollSlip",
    align: "center",
    render: (_, record) => {
      const disabled = !record.payrollSlipAvailable;
      return (
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "inline-flex items-center rounded-xl px-4 py-1.5 text-sm font-medium transition",
            disabled
              ? "cursor-not-allowed bg-gray-100 text-gray-400"
              : "bg-blue-50 text-blue-600 hover:bg-blue-100",
          )}
        >
          조회
        </button>
      );
    },
  },
];

type PayrollTableProps = {
  records: PayrollRecord[];
  isLoading: boolean;
  currentPage: number;
  pageSize: number;
  total?: number;
  onPageChange: (page: number) => void;
  locale?: BaseTableProps<PayrollRecord>["locale"];
};

export function PayrollTable({
  records,
  isLoading,
  currentPage,
  pageSize,
  total,
  onPageChange,
  locale,
}: PayrollTableProps) {
  return (
    <Table<PayrollRecord>
      columns={payrollColumns}
      dataSource={records}
      rowKey={(record) => record.payrollId ?? `${record.workerId}-${record.payday}`}
      loading={isLoading}
      locale={locale}
      pagination={{
        current: currentPage,
        pageSize,
        total,
        onChange: onPageChange,
        position: ["bottomRight"],
        showSizeChanger: false,
      }}
      showHeaderBar={false}
      borderedContainer={false}
      className="rounded-2xl border border-border dark:border-dark-border"
    />
  );
}
