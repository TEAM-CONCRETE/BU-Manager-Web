"use client";

import { useMemo, useState } from "react";
import type { ColumnsType } from "antd/es/table";

import { CompanyTopNav } from "@/components/features/company/company-top-nav";
import {
  InlineDateFilters,
  type InlineDateValue,
} from "@/components/common/filters/inline-date-filters";
import {
  SegmentedToggle,
  type SegmentedToggleOption,
} from "@/components/common/toggles/segmented-toggle";
import { buildCompanyNavItems } from "@/constants/company-nav";
import { useCompanySites } from "@/hooks/use-company-sites";
import { useAttendanceRecords } from "@/hooks/use-attendance-records";
import { Table } from "@/components/ui/Table/table";
import { cn } from "@/utils/cn";
import type {
  AttendanceRecord,
  AttendanceStatus,
  EmploymentType,
} from "@/lib/api/get-attendance";

const yearOptions = Array.from({ length: 3 }).map((_, index) => {
  const year = String(2024 + index);
  return { label: `${year}년`, value: year };
});
const monthOptions = Array.from({ length: 12 }).map((_, index) => {
  const month = String(index + 1).padStart(2, "0");
  return { label: `${Number(month)}월`, value: month };
});
const dayOptions = Array.from({ length: 31 }).map((_, index) => {
  const day = String(index + 1).padStart(2, "0");
  return { label: `${Number(day)}일`, value: day };
});

const employmentOptions: SegmentedToggleOption<EmploymentType>[] = [
  { label: "상용직 근로자", value: "regular" },
  { label: "일용직 근로자", value: "daily" },
];

const renderStatusPill = (status: AttendanceStatus) => {
  switch (status) {
    case "normal":
      return (
        <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
          <span className="mr-1 h-1.5 w-1.5 rounded-full bg-green-500" />
          정상
        </span>
      );
    case "late":
      return (
        <span className="inline-flex items-center rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-800">
          <span className="mr-1 h-1.5 w-1.5 rounded-full bg-yellow-400" />
          지각
        </span>
      );
    case "earlyLeave":
      return (
        <span className="inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-800">
          <span className="mr-1 h-1.5 w-1.5 rounded-full bg-orange-500" />
          조퇴
        </span>
      );
    case "absent":
      return (
        <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-800">
          <span className="mr-1 h-1.5 w-1.5 rounded-full bg-red-500" />
          결근
        </span>
      );
    default:
      return null;
  }
};

const attendanceColumns: ColumnsType<AttendanceRecord> = [
  {
    title: "근로자명",
    dataIndex: "name",
    key: "name",
    align: "center",
  },
  {
    title: "주민등록번호",
    dataIndex: "ssnMasked",
    key: "ssnMasked",
    align: "center",
  },
  {
    title: "근태 상태",
    dataIndex: "status",
    key: "status",
    align: "center",
    render: (_value, record) => renderStatusPill(record.status),
  },
  {
    title: "출근시간",
    dataIndex: "clockIn",
    key: "clockIn",
    align: "center",
    render: (value: AttendanceRecord["clockIn"]) => value ?? "-",
  },
  {
    title: "퇴근시간",
    dataIndex: "clockOut",
    key: "clockOut",
    align: "center",
    render: (value: AttendanceRecord["clockOut"]) => value ?? "-",
  },
  {
    title: "총 근로시간",
    dataIndex: "totalHours",
    key: "totalHours",
    align: "center",
    render: (value: AttendanceRecord["totalHours"]) => value ?? "-",
  },
  {
    title: "야간/연장/휴일",
    dataIndex: "overtimeSummary",
    key: "overtimeSummary",
    align: "center",
    render: (value: AttendanceRecord["overtimeSummary"]) => value ?? "-",
  },
  // ...
];

type Props = {
  params: {
    siteId: string;
  };
};

export default function CompanyAttendancePage({ params }: Props) {
  const { data } = useCompanySites();
  const sites = useMemo(() => data?.sites ?? [], [data]);
  const currentSite = useMemo(
    () => sites.find((site) => String(site.siteId) === params.siteId),
    [sites, params.siteId],
  );

  const navItems = useMemo(() => buildCompanyNavItems(params.siteId), [params.siteId]);

  const [employmentType, setEmploymentType] = useState<EmploymentType>("regular");
  const [selectedDate, setSelectedDate] = useState<InlineDateValue>({
    year: "2025",
    month: "09",
    day: "10",
  });

  const selectedDateKey = useMemo(
    () => `${selectedDate.year}-${selectedDate.month}-${selectedDate.day}`,
    [selectedDate],
  );

  const attendanceQuery = useAttendanceRecords({
    siteId: params.siteId,
    employmentType,
    date: selectedDateKey,
  });

  const attendanceData = attendanceQuery.data;
  const attendanceRecords = attendanceData?.records ?? [];
  const totalWorkers = attendanceData?.totalWorkers ?? attendanceRecords.length;
  const presentWorkers =
    attendanceData?.checkedInWorkers ??
    attendanceRecords.filter((record) => record.status !== "absent").length;

  const summaryCounts = useMemo<Record<AttendanceStatus, number>>(() => {
    const base: Record<AttendanceStatus, number> = {
      normal: 0,
      late: 0,
      earlyLeave: 0,
      absent: 0,
    };

    if (attendanceData?.summary) {
      return { ...base, ...attendanceData.summary };
    }

    return attendanceRecords.reduce((acc, record) => {
      acc[record.status] += 1;
      return acc;
    }, base);
  }, [attendanceData?.summary, attendanceRecords]);

  const attendanceError =
    attendanceQuery.error instanceof Error ? attendanceQuery.error.message : null;

  return (
    <div className="min-h-full bg-bg-page px-4 py-6 dark:bg-dark-bg-page sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4">
        <div className="flex flex-col gap-4">
          <CompanyTopNav items={navItems} defaultActiveId="attendance" />
          <header className="space-y-1">
            <h1 className="mb-0! text-3xl font-bold! text-text-strong dark:text-dark-text-strong">
              {currentSite?.siteName ?? "현장 이름을 불러오는 중..."}
            </h1>
            <p className="mb-0! text-base text-text-subtle dark:text-dark-text-base">
              오늘 현장의 근태 현황을 한눈에 확인하세요
            </p>
          </header>
        </div>

        <section className="rounded-3xl border border-border bg-bg-surface p-6 dark:border-dark-border dark:bg-dark-bg-surface">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-3">
              <InlineDateFilters
                value={selectedDate}
                yearOptions={yearOptions}
                monthOptions={monthOptions}
                dayOptions={dayOptions}
                onChange={setSelectedDate}
              />

              <SegmentedToggle
                value={employmentType}
                onChange={setEmploymentType}
                options={employmentOptions}
              />
            </div>

            <div className="flex items-center gap-3">
              <p className="!mb-0 text-sm text-text-subtle dark:text-dark-text-base">
                {`${presentWorkers}명 / ${totalWorkers}명`}
              </p>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-text-subtle hover:bg-bg-subtle dark:border-dark-border dark:text-dark-text-base dark:hover:bg-dark-bg-surface"
                onClick={() => void attendanceQuery.refetch()}
                disabled={attendanceQuery.isFetching || attendanceQuery.isLoading}
                aria-label="근태 정보 새로고침"
              >
                <span
                  className={cn(
                    "text-lg",
                    attendanceQuery.isFetching || attendanceQuery.isLoading ? "animate-spin" : "",
                  )}
                >
                  ↻
                </span>
              </button>
            </div>
          </div>

          {attendanceError ? (
            <p className="mt-3 text-sm text-red-500">{attendanceError}</p>
          ) : null}

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <AttendanceSummaryCard
              label="정상 출근"
              value={`${summaryCounts.normal}명`}
              dotColor="bg-green-500"
              textColor="text-green-600"
            />
            <AttendanceSummaryCard
              label="지각"
              value={`${summaryCounts.late}명`}
              dotColor="bg-yellow-400"
              textColor="text-yellow-600"
            />
            <AttendanceSummaryCard
              label="조퇴"
              value={`${summaryCounts.earlyLeave}명`}
              dotColor="bg-orange-500"
              textColor="text-orange-600"
            />
            <AttendanceSummaryCard
              label="결근"
              value={`${summaryCounts.absent}명`}
              dotColor="bg-red-500"
              textColor="text-red-600"
            />
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-bg-surface p-6 dark:border-dark-border dark:bg-dark-bg-surface">
          <Table<AttendanceRecord>
            columns={attendanceColumns}
            dataSource={attendanceRecords}
            rowKey="id"
            loading={attendanceQuery.isLoading || attendanceQuery.isFetching}
            pagination={{
              pageSize: 10,
              position: ["bottomRight"],
              showSizeChanger: false,
            }}
            showHeaderBar={false}
            borderedContainer={false}
            className="rounded-2xl border border-border dark:border-dark-border"
          />
        </section>
      </div>
    </div>
  );
}

type AttendanceSummaryCardProps = {
  label: string;
  value: string;
  dotColor: string;
  textColor: string;
};

function AttendanceSummaryCard({ label, value, dotColor, textColor }: AttendanceSummaryCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-4 dark:border-dark-border dark:bg-dark-bg-surface">
      <div className="flex items-center gap-2 text-sm">
        <span className={cn("h-2 w-2 rounded-full", dotColor)} />
        <span className="text-text-subtle dark:text-dark-text-base">{label}</span>
      </div>
      <p className={cn("mt-1 text-2xl font-semibold", textColor)}>{value}</p>
    </div>
  );
}
