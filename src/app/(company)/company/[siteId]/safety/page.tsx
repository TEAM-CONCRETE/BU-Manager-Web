"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { notification } from "antd";

import {
  InlineDateFilters,
  type InlineDateValue,
} from "@/components/common/filters/inline-date-filters";
import { CompanyTopNav } from "@/components/features/company/company-top-nav";
import { SafetyDocumentModal } from "@/components/features/company/safety/safety-document-modal";
import { SafetyWorkTable } from "@/components/features/company/safety/safety-work-table";
import { buildCompanyNavItems } from "@/constants/company-nav";
import { useCompanySites } from "@/hooks/use-company-sites";
import { useSafetyWorkRecords } from "@/hooks/use-safety-work-records";
import type { SafetyWorkRecord } from "@/lib/api/get-safety-work-records";

type Props = {
  params: {
    siteId: string;
  };
};

export default function CompanySafetyPage({ params }: Props) {
  const { data: sitesData } = useCompanySites();
  const sites = useMemo(() => sitesData?.sites ?? [], [sitesData]);
  const currentSite = useMemo(
    () => sites.find((site) => String(site.siteId) === params.siteId),
    [sites, params.siteId],
  );

  const navItems = useMemo(() => buildCompanyNavItems(params.siteId), [params.siteId]);

  const today = useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = useState<InlineDateValue>({
    year: String(today.getFullYear()),
    month: String(today.getMonth() + 1).padStart(2, "0"),
    day: String(today.getDate()).padStart(2, "0"),
  });
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const {
    data: safetyData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useSafetyWorkRecords({
    siteId: Number(params.siteId),
    year: selectedDate.year,
    month: selectedDate.month,
    page,
    size: pageSize,
  });

  const records = safetyData?.records ?? [];
  const totalRecords = safetyData?.pagination.totalRecords ?? 0;
  const totalCount = safetyData?.summary.totalCount ?? 0;
  const tableLoading = isLoading || isFetching;

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
      error instanceof Error
        ? error.message
        : "안전/작업 데이터를 불러오는 중 오류가 발생했습니다.";
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

  const [openDiaryRecord, setOpenDiaryRecord] = useState<SafetyWorkRecord | null>(null);
  const [openWorkReportRecord, setOpenWorkReportRecord] = useState<SafetyWorkRecord | null>(null);

  return (
    <div className="min-h-full bg-bg-page px-4 py-6 dark:bg-dark-bg-page sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4">
        <div className="flex flex-col gap-4">
          <CompanyTopNav items={navItems} defaultActiveId="safety" />
          <header className="space-y-1">
            <h1 className="mb-0! text-3xl font-bold! text-text-strong dark:text-dark-text-strong">
              {currentSite?.siteName ?? "현장 이름을 불러오는 중..."}
            </h1>
            <p className="mb-0! text-base text-text-subtle dark:text-dark-text-base">
              안전교육과 작업일보를 투명하게 관리하세요
            </p>
          </header>
        </div>

        <section className="rounded-3xl border border-border bg-bg-surface p-6 dark:border-dark-border dark:bg-dark-bg-surface">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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

            <div className="flex items-center gap-3 text-sm text-text-subtle">
              {tableLoading ? "로딩 중..." : `총 ${totalCount}건`}
              <button
                type="button"
                onClick={() => refetch()}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-text-subtle hover:bg-bg-subtle dark:border-dark-border dark:text-dark-text-base dark:hover:bg-dark-bg-surface"
              >
                ↻
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-border bg-white p-6 shadow-sm dark:border-dark-border dark:bg-dark-bg-surface">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-semibold text-text-strong">안전교육 및 작업일보</p>
              </div>
            </div>

            <div className="mt-4">
              <SafetyWorkTable
                records={records}
                isLoading={tableLoading}
                currentPage={page}
                pageSize={pageSize}
                total={totalRecords}
                onPageChange={(newPage) => setPage(newPage)}
                onOpenSafetyDiary={(record) => setOpenDiaryRecord(record)}
                onOpenWorkReport={(record) => setOpenWorkReportRecord(record)}
              />
            </div>
          </div>
        </section>
      </div>

      <SafetyDocumentModal
        open={Boolean(openDiaryRecord)}
        onClose={() => setOpenDiaryRecord(null)}
        title="안전교육일지"
        subtitle={
          openDiaryRecord ? `${currentSite?.siteName ?? ""} | ${openDiaryRecord.date}` : undefined
        }
        pdfUrl={openDiaryRecord?.safetyDiaryUrl}
        onDownload={() => {
          if (openDiaryRecord?.safetyDiaryUrl) {
            window.open(openDiaryRecord.safetyDiaryUrl, "_blank");
          }
        }}
      />

      <SafetyDocumentModal
        open={Boolean(openWorkReportRecord)}
        onClose={() => setOpenWorkReportRecord(null)}
        title="작업일보"
        subtitle={
          openWorkReportRecord
            ? `${currentSite?.siteName ?? ""} | ${openWorkReportRecord.date}`
            : undefined
        }
        pdfUrl={openWorkReportRecord?.workReportUrl}
        onDownload={() => {
          if (openWorkReportRecord?.workReportUrl) {
            window.open(openWorkReportRecord.workReportUrl, "_blank");
          }
        }}
      />
    </div>
  );
}
