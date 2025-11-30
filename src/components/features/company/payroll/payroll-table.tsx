import Image from "next/image";

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

const renderPayoutStatus = (status: PayrollStatus) => {
  const isPaid = status === "PAID";
  const label = isPaid ? "지급" : "미지급";
  const chipClass = isPaid ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600";
  const dotClass = isPaid ? "bg-green-500" : "bg-red-400";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${chipClass}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
      {label}
    </span>
  );
};

type PayrollTableProps = {
  records: PayrollRecord[];
  isLoading: boolean;
  currentPage: number;
  pageSize: number;
  total?: number;
  onPageChange: (page: number) => void;
  locale?: BaseTableProps<PayrollRecord>["locale"];
  onViewPayslip?: (record: PayrollRecord) => void;
};

export function PayrollTable({
  records,
  isLoading,
  currentPage,
  pageSize,
  total,
  onPageChange,
  locale,
  onViewPayslip,
}: PayrollTableProps) {
  const columns: ColumnsType<PayrollRecord> = [
    {
      title: "근로자명",
      dataIndex: "workerName",
      key: "workerName",
      align: "center",
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
      align: "center",
      render: (value) => formatAmount(value),
    },
    {
      title: "비과세 소득",
      dataIndex: "nonTaxableIncome",
      key: "nonTaxableIncome",
      align: "center",
      render: (value) => formatAmount(value),
    },
    {
      title: "원천징수세액(소득세)",
      dataIndex: "withholdingIncomeTax",
      key: "withholdingIncomeTax",
      align: "center",
      render: (value) => formatAmount(value),
    },
    {
      title: "원천징수세액(주민세)",
      dataIndex: "withholdingResidentTax",
      key: "withholdingResidentTax",
      align: "center",
      render: (value) => formatAmount(value),
    },
    {
      title: "지급 여부",
      key: "paymentStatus",
      align: "center",
      render: (_, record) => renderPayoutStatus(record.paymentStatus),
    },
    {
      title: "급여명세서 조회",
      key: "payrollSlip",
      align: "center",
      render: (_, record) => {
        const disabled = !record.payrollSlipAvailable || !onViewPayslip;
        return (
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              if (!disabled) {
                onViewPayslip(record);
              }
            }}
            className={cn(
              "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition",
              disabled
                ? "cursor-not-allowed bg-gray-100 text-gray-400"
                : "bg-[#1C67B0] text-white! hover:bg-[#155089]",
            )}
          >
            <span
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full",
                disabled && "bg-transparent",
              )}
            >
              <Image
                src="/assets/icons/eye.svg"
                alt=""
                width={16}
                height={16}
                className={cn(disabled ? "opacity-40" : "opacity-90")}
              />
            </span>
            조회
          </button>
        );
      },
    },
  ];

  return (
    <Table<PayrollRecord>
      columns={columns}
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
