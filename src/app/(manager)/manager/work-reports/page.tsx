"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Modal, notification } from "antd";
import { useQuery } from "@tanstack/react-query";
import { ManagerWorkReportsTable } from "@/components/features/manager/work-reports/manager-work-reports-table";
import { Button } from "@/components/ui/Button/button";
import { PDFViewer } from "@/components/common/pdf-viewer";
import { getWorkReportPdfUrl } from "@/lib/api/get-safety-work-records";
import { useWorkReports } from "@/hooks/use-work-reports";
import { useSiteDetail } from "@/hooks/use-site-detail";
import { useSessionStore } from "@/stores/session-store";
import type { ManagerWorkReportRow } from "@/components/features/manager/work-reports/manager-work-reports-table";

export default function ManagerWorkReportsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useSessionStore((state) => state.user);
  const parsedSiteId = user?.siteId ?? 0;
  const hasValidSiteId = !!parsedSiteId && !Number.isNaN(parsedSiteId);

  const { data: siteDetail } = useSiteDetail(parsedSiteId);

  const [page, setPage] = useState(1);
  const pageSize = 20;

  const {
    data: workReportsData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useWorkReports(
    {
      siteId: parsedSiteId,
      page,
      size: pageSize,
    },
    {
      enabled: hasValidSiteId,
    },
  );

  const records: ManagerWorkReportRow[] =
    workReportsData?.items?.map((item) => ({
      id: item.workReportId,
      workDate: item.workDate,
      authorName: item.writerName,
    })) ?? [];
  const totalCount = workReportsData?.pagination.totalElements ?? 0;
  const tableLoading = isLoading || isFetching;

  const [selectedWorkReportId, setSelectedWorkReportId] = useState<number | null>(null);

  // 작업일보 PDF URL 가져오기
  const { data: workReportPdfUrl, isLoading: isPdfLoading } = useQuery({
    queryKey: ["work-report-pdf", parsedSiteId, selectedWorkReportId],
    queryFn: () => {
      if (selectedWorkReportId == null) {
        return Promise.reject(new Error("작업일보 ID가 없습니다."));
      }
      return getWorkReportPdfUrl(parsedSiteId, selectedWorkReportId);
    },
    enabled: selectedWorkReportId != null && hasValidSiteId,
    staleTime: 1000 * 60 * 5, // 5분
  });

  const lastErrorMessageRef = useRef<string | null>(null);

  // 작성 완료 후 돌아온 경우 목록 새로고침
  useEffect(() => {
    const created = searchParams.get("created");
    if (created === "true") {
      refetch();
      // 쿼리스트링 정리
      const cleaned = new URLSearchParams(Array.from(searchParams.entries()));
      cleaned.delete("created");
      const queryString = cleaned.toString();
      router.replace(
        queryString ? `/manager/work-reports?${queryString}` : "/manager/work-reports",
      );
    }
  }, [searchParams, router, refetch]);

  useEffect(() => {
    if (!isError && !error) {
      lastErrorMessageRef.current = null;
      return;
    }
    if (!isError || !error) {
      return;
    }
    const message =
      error instanceof Error ? error.message : "작업일보 데이터를 불러오는 중 오류가 발생했습니다.";
    if (lastErrorMessageRef.current === message) return;
    lastErrorMessageRef.current = message;
    notification.error({
      message,
      placement: "topRight",
      duration: 3,
    });
  }, [isError, error]);

  const handleCreate = () => {
    router.push("/manager/work-reports/create");
  };

  const handleViewDetail = (workReportId: number) => {
    setSelectedWorkReportId(workReportId);
  };

  const handleCloseModal = () => {
    setSelectedWorkReportId(null);
  };

  const handleOpenInNewWindow = () => {
    if (workReportPdfUrl) {
      window.open(workReportPdfUrl, "_blank");
    }
  };

  const selectedWorkReport = records.find((r) => r.id === selectedWorkReportId);

  const disabledMessage = !hasValidSiteId
    ? "현장 정보가 없어 작업일보 데이터를 불러올 수 없습니다. 관리자에게 현장 정보 설정을 요청해주세요."
    : undefined;

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-lg border border-border bg-bg-surface p-3 dark:border-dark-border dark:bg-dark-bg-surface">
        <header className="space-y-1">
          <h1 className="mb-0! text-2xl font-semibold! text-text-strong dark:text-dark-text-strong">
            {siteDetail?.siteName ?? "현장 이름을 불러오는 중..."}
          </h1>
          <p className="mb-0! text-base text-text-subtle dark:text-dark-text-base">
            {siteDetail?.siteAddress ?? "현장 주소를 불러오는 중입니다."}
          </p>
        </header>
      </section>

      <header className="ml-3 space-y-1">
        <h2 className="mb-0! text-2xl font-semibold! text-brand-primary-strong dark:text-dark-text-strong">
          작업일보 작성
        </h2>
        <p className="mb-0! text-sm text-text-subtle dark:text-dark-text-base">
          당일 작업 내용을 기록합니다.
        </p>
      </header>

      <section className="rounded-2xl border border-border bg-bg-surface px-6 py-4 dark:border-dark-border dark:bg-dark-bg-surface">
        <div className="flex items-center justify-between">
          <h3 className="mb-0 text-xl font-semibold text-brand-primary-strong">작업일보 목록</h3>
          <Button variant="primary" size="md" onClick={handleCreate}>
            작성하기
          </Button>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-bg-surface p-6 dark:border-dark-border dark:bg-dark-bg-surface">
        {!hasValidSiteId ? (
          <div className="flex h-40 items-center justify-center text-sm text-text-subtle dark:text-dark-text-base">
            {disabledMessage}
          </div>
        ) : (
          <ManagerWorkReportsTable
            records={records}
            isLoading={tableLoading}
            currentPage={page}
            pageSize={pageSize}
            total={totalCount}
            onPageChange={(newPage) => setPage(newPage)}
            onViewDetail={handleViewDetail}
          />
        )}
      </section>

      <Modal
        open={selectedWorkReportId !== null}
        onCancel={handleCloseModal}
        footer={null}
        centered
        width={900}
        classNames={{
          content: "bg-white",
          body: "p-6",
        }}
        styles={{
          content: {
            backgroundColor: "#ffffff",
          },
        }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="mb-0! text-2xl font-semibold text-brand-primary-strong">작업일보</p>
              <p className="mb-0! text-sm text-text-subtle">
                {siteDetail?.siteName ?? ""}
                {selectedWorkReport ? ` | ${selectedWorkReport.workDate}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-2 mr-4">
              {workReportPdfUrl && (
                <Button variant="primary" size="md" onClick={handleOpenInNewWindow}>
                  전체 보기
                </Button>
              )}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-bg-subtle p-4">
            {isPdfLoading ? (
              <div className="flex h-[480px] items-center justify-center text-text-subtle">
                PDF를 불러오는 중...
              </div>
            ) : workReportPdfUrl ? (
              <PDFViewer pdfUrl={workReportPdfUrl} />
            ) : (
              <div className="flex h-[480px] items-center justify-center text-text-subtle">
                PDF를 불러올 수 없습니다.
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
