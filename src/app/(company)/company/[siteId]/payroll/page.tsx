"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Select, notification } from "antd";

import { CompanyTopNav } from "@/components/features/company/company-top-nav";
import {
  InlineDateFilters,
  type InlineDateValue,
} from "@/components/common/filters/inline-date-filters";
import {
  SegmentedToggle,
  type SegmentedToggleOption,
} from "@/components/common/toggles/segmented-toggle";
import { PayrollSummarySection } from "@/components/features/company/payroll/payroll-summary-section";
import { PayrollTable } from "@/components/features/company/payroll/payroll-table";
import { buildCompanyNavItems } from "@/constants/company-nav";
import { useCompanySites } from "@/hooks/use-company-sites";
import { usePayrollRecords } from "@/hooks/use-payroll-records";

const employmentOptions: SegmentedToggleOption[] = [
  { label: "상용직 근로자", value: "REGULAR" },
  { label: "일용직 근로자", value: "DAILY" },
];

const dailyPayCycleOptions: SegmentedToggleOption[] = [
  { label: "일급", value: "DAY" },
  { label: "주급", value: "WEEK" },
  { label: "월급", value: "MONTH" },
];

const weekOfMonthOptions = [
  { label: "1주차", value: "W1" },
  { label: "2주차", value: "W2" },
  { label: "3주차", value: "W3" },
] as const;

const weekOfMonthSelectOptions = weekOfMonthOptions.map((option) => ({
  label: option.label,
  value: option.value,
}));

type DailyPayCycle = "DAY" | "WEEK" | "MONTH";
type WeekOfMonth = "W1" | "W2" | "W3";

type Props = {
  params: {
    siteId: string;
  };
};

export default function CompanyPayrollPage({ params }: Props) {
  const { data: sitesData } = useCompanySites();
  const sites = useMemo(() => sitesData?.sites ?? [], [sitesData]);
  const currentSite = useMemo(
    () => sites.find((site) => String(site.siteId) === params.siteId),
    [sites, params.siteId],
  );

  const navItems = useMemo(() => buildCompanyNavItems(params.siteId), [params.siteId]);

  const [employmentType, setEmploymentType] = useState<"REGULAR" | "DAILY">("REGULAR");
  const [dailyPayCycle, setDailyPayCycle] = useState<DailyPayCycle>("DAY");
  const [weekOfMonth, setWeekOfMonth] = useState<WeekOfMonth>("W1");
  const today = useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = useState<InlineDateValue>({
    year: String(today.getFullYear()),
    month: String(today.getMonth() + 1).padStart(2, "0"),
    day: String(today.getDate()).padStart(2, "0"),
  });

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const {
    data: payrollData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = usePayrollRecords({
    siteId: Number(params.siteId),
    year: selectedDate.year,
    month: selectedDate.month,
    day: employmentType === "DAILY" && dailyPayCycle === "DAY" ? selectedDate.day : undefined,
    employmentType,
    page,
    size: pageSize,
    payCycle: employmentType === "DAILY" ? dailyPayCycle : undefined,
    weekOfMonth: employmentType === "DAILY" && dailyPayCycle === "WEEK" ? weekOfMonth : undefined,
  });

  const records = useMemo(() => payrollData?.records ?? [], [payrollData]);
  const summary = payrollData?.summary;
  const pagination = payrollData?.pagination;
  const totalRecords = pagination?.totalRecords ?? 0;
  const tableLoading = isLoading || isFetching;
  const totalHeadcount = summary?.headcount ?? totalRecords;
  const unpaidCount =
    summary?.unpaidCount ?? records.filter((record) => record.paymentStatus !== "PAID").length;

  const lastErrorMessageRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isError && !error) {
      lastErrorMessageRef.current = null;
      return;
    }
    if (!isError || !error) {
      return;
    }
    const message =
      error instanceof Error ? error.message : "급여 데이터를 불러오는 중 오류가 발생했습니다.";
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
          <CompanyTopNav items={navItems} defaultActiveId="payroll" />
          <header className="space-y-1">
            <h1 className="mb-0! text-3xl font-bold! text-text-strong dark:text-dark-text-strong">
              {currentSite?.siteName ?? "현장 이름을 불러오는 중..."}
            </h1>
            <p className="mb-0! text-base text-text-subtle dark:text-dark-text-base">
              급여 정산 현황을 빠르게 확인하고 관리하세요
            </p>
          </header>
        </div>

        <section className="rounded-3xl border border-border bg-bg-surface p-6 dark:border-dark-border dark:bg-dark-bg-surface">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-3">
                <InlineDateFilters
                  value={selectedDate}
                  yearOptions={yearOptions}
                  monthOptions={monthOptions}
                  dayOptions={dayOptions}
                  hideDay
                  onChange={(newDate) => {
                    setSelectedDate(newDate);
                    setPage(1);
                  }}
                />

                <div className="flex flex-wrap items-center gap-2">
                  <SegmentedToggle
                    value={employmentType}
                    onChange={(val) => {
                      setEmploymentType(val as "REGULAR" | "DAILY");
                      setDailyPayCycle("DAY");
                      setPage(1);
                    }}
                    options={employmentOptions}
                    className="min-w-[180px] shrink-0"
                  />
                  {employmentType === "DAILY" && (
                    <>
                      <SegmentedToggle
                        value={dailyPayCycle}
                        onChange={(val) => {
                          setDailyPayCycle(val as DailyPayCycle);
                          setPage(1);
                        }}
                        options={dailyPayCycleOptions}
                        className="min-w-[180px] shrink-0"
                      />
                      {dailyPayCycle === "DAY" && (
                        <Select
                          size="large"
                          className="w-24 shrink-0"
                          options={dayOptions}
                          value={selectedDate.day}
                          onChange={(day) => {
                            setSelectedDate((prev) => ({ ...prev, day }));
                            setPage(1);
                          }}
                        />
                      )}
                      {dailyPayCycle === "WEEK" && (
                        <Select
                          size="large"
                          className="w-28 shrink-0"
                          options={weekOfMonthSelectOptions}
                          value={weekOfMonth}
                          onChange={(val) => {
                            setWeekOfMonth(val as WeekOfMonth);
                            setPage(1);
                          }}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
              {employmentType === "REGULAR" && (
                <p className="mb-0! text-sm text-text-subtle dark:text-dark-text-base">
                  상용직 급여는 월 단위로 조회됩니다.
                </p>
              )}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-text-subtle hover:bg-bg-subtle dark:border-dark-border dark:text-dark-text-base dark:hover:bg-dark-bg-surface"
                >
                  ↻
                </button>
              </div>
            </div>
          </div>

          <PayrollSummarySection
            summary={summary}
            headcount={totalHeadcount}
            unpaidCount={unpaidCount}
          />
        </section>

        <section className="rounded-3xl border border-border bg-bg-surface p-6 dark:border-dark-border dark:bg-dark-bg-surface">
          <PayrollTable
            records={records}
            isLoading={tableLoading}
            currentPage={page}
            pageSize={pageSize}
            total={totalRecords}
            locale={{
              emptyText: isError
                ? "급여 데이터를 불러오는 중 오류가 발생했습니다."
                : "표시할 급여 데이터가 없습니다.",
            }}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </section>
      </div>
    </div>
  );
}
