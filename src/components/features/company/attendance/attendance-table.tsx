import type { ColumnsType } from "antd/es/table";

import { Table, type TableProps as BaseTableProps } from "@/components/ui/Table/table";
import type { AttendanceRecord } from "@/lib/api/get-attendance-records";

type AttendanceTableProps = {
  records: AttendanceRecord[];
  isLoading: boolean;
  currentPage: number;
  pageSize: number;
  total?: number;
  onPageChange: (page: number) => void;
  locale?: BaseTableProps<AttendanceRecord>["locale"];
};

const renderStatusPill = (status: string, isLate: boolean) => {
  if (isLate) {
    return (
      <span className="inline-flex items-center rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-800">
        <span className="mr-1 h-1.5 w-1.5 rounded-full bg-yellow-400" />
        지각
      </span>
    );
  }

  switch (status) {
    case "NORMAL":
      return (
        <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
          <span className="mr-1 h-1.5 w-1.5 rounded-full bg-green-500" />
          정상
        </span>
      );
    case "EARLY_LEAVE":
      return (
        <span className="inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-800">
          <span className="mr-1 h-1.5 w-1.5 rounded-full bg-orange-500" />
          조퇴
        </span>
      );
    case "ABSENT":
      return (
        <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-800">
          <span className="mr-1 h-1.5 w-1.5 rounded-full bg-red-500" />
          결근
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700">
          <span className="mr-1 h-1.5 w-1.5 rounded-full bg-gray-400" />-
        </span>
      );
  }
};

const attendanceColumns: ColumnsType<AttendanceRecord> = [
  {
    title: "근로자명",
    dataIndex: "workerName",
    key: "workerName",
    align: "center",
  },
  {
    title: "주민등록번호",
    dataIndex: "residentNumber",
    key: "residentNumber",
    align: "center",
  },
  {
    title: "근태 상태",
    key: "status",
    align: "center",
    render: (_, record) => renderStatusPill(record.attendanceStatus, record.isLate),
  },
  {
    title: "출근시간",
    dataIndex: "checkInTime",
    key: "checkInTime",
    align: "center",
    render: (value) => value ?? "-",
  },
  {
    title: "퇴근시간",
    dataIndex: "checkOutTime",
    key: "checkOutTime",
    align: "center",
    render: (value) => value ?? "-",
  },
  {
    title: "총 근로시간",
    dataIndex: "totalWorkHours",
    key: "totalWorkHours",
    align: "center",
    render: (value) => value ?? "-",
  },
  {
    title: "야간/연장/휴일",
    key: "overtimeSummary",
    align: "center",
    render: (_, record) => {
      const night = record.nightWorkHours || "-";
      const overtime = record.overtimeHours || "-";
      const holiday = record.holidayWorkHours || "-";
      if (night === "-" && overtime === "-" && holiday === "-") return "-";
      return `${night} / ${overtime} / ${holiday}`;
    },
  },
];

export function AttendanceTable({
  records,
  isLoading,
  currentPage,
  pageSize,
  total,
  onPageChange,
  locale,
}: AttendanceTableProps) {
  return (
    <Table<AttendanceRecord>
      columns={attendanceColumns}
      dataSource={records}
      rowKey="workerId"
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
