"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Input, notification } from "antd";

import { SegmentedToggle } from "@/components/common/toggles/segmented-toggle";
import { CompanyTopNav } from "@/components/features/company/company-top-nav";
import { EmployeeDetailModal } from "@/components/features/company/employee/employee-detail-modal";
import { EmployeeTable } from "@/components/features/company/employee/employee-table";
import { buildCompanyNavItems } from "@/constants/company-nav";
import { useCompanySites } from "@/hooks/use-company-sites";
import { useEmployees } from "@/hooks/use-employees";
import type { EmploymentType, EmployeeRecord } from "@/types/employee";

type Props = {
  params: {
    siteId: string;
  };
};

const employmentOptions = [
  { label: "상용직 근로자", value: "REGULAR" as EmploymentType },
  { label: "일용직 근로자", value: "DAILY" as EmploymentType },
];

export default function CompanyEmployeePage({ params }: Props) {
  const { data: sitesData } = useCompanySites();
  const sites = useMemo(() => sitesData?.sites ?? [], [sitesData]);
  const currentSite = useMemo(
    () => sites.find((site) => String(site.siteId) === params.siteId),
    [sites, params.siteId],
  );

  const navItems = useMemo(() => buildCompanyNavItems(params.siteId), [params.siteId]);

  const [employmentType, setEmploymentType] = useState<EmploymentType>("REGULAR");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const {
    data: employeeData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useEmployees({
    siteId: Number(params.siteId),
    employmentType,
    page,
    size: pageSize,
    searchKeyword: searchKeyword.trim() || undefined,
  });

  const records = employeeData?.records ?? [];
  const totalRecords = employeeData?.pagination.totalRecords ?? 0;
  const totalCount = employeeData?.summary.totalCount ?? 0;
  const tableLoading = isLoading || isFetching;

  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeRecord | null>(null);

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
      error instanceof Error ? error.message : "사원 데이터를 불러오는 중 오류가 발생했습니다.";
    if (lastErrorMessageRef.current === message) return;
    lastErrorMessageRef.current = message;
    notification.error({
      message,
      placement: "topRight",
      duration: 3,
    });
  }, [isError, error]);

  const handleSearchSubmit = () => {
    setPage(1);
  };

  return (
    <div className="min-h-full bg-bg-page px-4 py-6 dark:bg-dark-bg-page sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4">
        <div className="flex flex-col gap-4">
          <CompanyTopNav items={navItems} defaultActiveId="employee" />
          <header className="space-y-1">
            <h1 className="mb-0! text-3xl font-bold! text-text-strong dark:text-dark-text-strong">
              {currentSite?.siteName ?? "현장 이름을 불러오는 중..."}
            </h1>
            <p className="mb-0! text-base text-text-subtle dark:text-dark-text-base">
              사원 정보를 빠르게 조회하고 문서를 열람하세요
            </p>
          </header>
        </div>

        <section className="rounded-3xl border border-border bg-bg-surface px-6 py-5 dark:border-dark-border dark:bg-dark-bg-surface">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <SegmentedToggle<EmploymentType>
                value={employmentType}
                onChange={(val) => {
                  setEmploymentType(val);
                  setPage(1);
                }}
                options={employmentOptions}
                className="min-w-[180px] shrink-0"
              />
            </div>

            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
              <div className="w-full max-w-md mr-4!">
                <Input.Search
                  className="employee-search-input"
                  placeholder="근로자명 입력"
                  allowClear
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onSearch={handleSearchSubmit}
                  enterButton="검색"
                  size="large"
                />
              </div>
              <div className="flex items-center gap-3 text-sm text-text-subtle dark:text-dark-text-base">
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
        </section>

        <section className="rounded-3xl border border-border bg-bg-surface p-6 dark:border-dark-border dark:bg-dark-bg-surface">
          <div className="mb-4 flex items-center justify-between">
            <p className="mb-0 text-xl font-semibold text-text-strong">사원 목록</p>
            <p className="mb-0 text-sm text-text-subtle">총 {totalCount}명</p>
          </div>

          <EmployeeTable
            records={records}
            isLoading={tableLoading}
            currentPage={page}
            pageSize={pageSize}
            total={totalRecords}
            onPageChange={(newPage) => setPage(newPage)}
            onOpenDetail={(employee) => setSelectedEmployee(employee)}
          />
        </section>
      </div>

      <EmployeeDetailModal
        open={Boolean(selectedEmployee)}
        onClose={() => setSelectedEmployee(null)}
        employee={selectedEmployee}
        siteName={currentSite?.siteName}
      />
    </div>
  );
}
