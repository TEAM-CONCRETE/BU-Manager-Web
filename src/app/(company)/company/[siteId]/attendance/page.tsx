"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { notification } from "antd";

import { CompanyTopNav } from "@/components/features/company/company-top-nav";
import {
  InlineDateFilters,
  type InlineDateValue,
} from "@/components/common/filters/inline-date-filters";
import {
  SegmentedToggle,
  type SegmentedToggleOption,
} from "@/components/common/toggles/segmented-toggle";
import { AttendanceSummarySection } from "@/components/features/company/attendance/attendance-summary-section";
import { AttendanceTable } from "@/components/features/company/attendance/attendance-table";
import { buildCompanyNavItems } from "@/constants/company-nav";
import { useCompanySites } from "@/hooks/use-company-sites";
import { useAttendanceRecords } from "@/hooks/use-attendance-records";

const employmentOptions: SegmentedToggleOption[] = [
  { label: "상용직 근로자", value: "REGULAR" },
  { label: "일용직 근로자", value: "DAILY" },
];

type Props = {
  params: {
    siteId: string;
  };
};

export default function CompanyAttendancePage({ params }: Props) {
  const { data: sitesData } = useCompanySites();
  const sites = useMemo(() => sitesData?.sites ?? [], [sitesData]);
  const currentSite = useMemo(
    () => sites.find((site) => String(site.siteId) === params.siteId),
    [sites, params.siteId],
  );

  const navItems = useMemo(() => buildCompanyNavItems(params.siteId), [params.siteId]);

  const [employmentType, setEmploymentType] = useState<"REGULAR" | "DAILY">("REGULAR");
  const today = useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = useState<InlineDateValue>({
    year: String(today.getFullYear()),
    month: String(today.getMonth() + 1).padStart(2, "0"),
    day: String(today.getDate()).padStart(2, "0"),
  });

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const {
    data: attendanceData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useAttendanceRecords({
    siteId: Number(params.siteId),
    year: selectedDate.year,
    month: selectedDate.month,
    day: selectedDate.day,
    employmentType,
    page,
    size: pageSize,
  });

  const records = useMemo(() => attendanceData?.records ?? [], [attendanceData]);
  const summary = attendanceData?.summary;
  const pagination = attendanceData?.pagination;
  const totalRecords = pagination?.totalRecords ?? 0;
  const normalAttendanceCount = summary?.normalAttendance ?? 0;
  const tableLoading = isLoading || isFetching;

  const lastErrorMessageRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isError || !error) {
      lastErrorMessageRef.current = null;
      return;
    }
    const message =
      error instanceof Error ? error.message : "근태 데이터를 불러오는 중 오류가 발생했습니다.";
    if (lastErrorMessageRef.current === message) return;
    lastErrorMessageRef.current = message;
    notification.error({
      message,
      placement: "topRight",
      duration: 3,
    });
  }, [isError, error]);

  const yearOptions = useMemo(() => {
    return Array.from({ length: 3 }).map((_, index) => {
      const year = String(today.getFullYear() - 1 + index);
      return { label: `${year}년`, value: year };
    });
  }, [today]);

  const monthOptions = useMemo(() => {
    return Array.from({ length: 12 }).map((_, index) => {
      const month = String(index + 1).padStart(2, "0");
      return { label: `${Number(month)}월`, value: month };
    });
  }, []);

  const dayOptions = useMemo(() => {
    return Array.from({ length: 31 }).map((_, index) => {
      const day = String(index + 1).padStart(2, "0");
      return { label: `${Number(day)}일`, value: day };
    });
  }, []);

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
                onChange={(newDate) => {
                  setSelectedDate(newDate);
                  setPage(1);
                }}
              />

              <SegmentedToggle
                value={employmentType}
                onChange={(val) => {
                  setEmploymentType(val as "REGULAR" | "DAILY");
                  setPage(1);
                }}
                options={employmentOptions}
              />
            </div>

            <div className="flex items-center gap-3">
              <p className="mb-0! text-sm text-text-subtle dark:text-dark-text-base">
                {tableLoading ? "로딩 중..." : `${normalAttendanceCount}명 / ${totalRecords}명`}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-text-subtle hover:bg-bg-subtle dark:border-dark-border dark:text-dark-text-base dark:hover:bg-dark-bg-surface"
              >
                ↻
              </button>
            </div>
          </div>

          <AttendanceSummarySection summary={summary} />
        </section>

        <section className="rounded-3xl border border-border bg-bg-surface p-6 dark:border-dark-border dark:bg-dark-bg-surface">
          <AttendanceTable
            records={records}
            isLoading={tableLoading}
            currentPage={page}
            pageSize={pageSize}
            total={totalRecords}
            locale={{
              emptyText: isError
                ? "근태 데이터를 불러오는 중 오류가 발생했습니다."
                : "표시할 근태 데이터가 없습니다.",
            }}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </section>
      </div>
    </div>
  );
}
