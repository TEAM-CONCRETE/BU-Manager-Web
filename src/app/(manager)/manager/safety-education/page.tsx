"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Modal, notification } from "antd";
import { useQuery } from "@tanstack/react-query";
import { ManagerSafetyEducationTable } from "@/components/features/manager/safety-education/manager-safety-education-table";
import { Button } from "@/components/ui/Button/button";
import { PDFViewer } from "@/components/common/pdf-viewer";
import { useSafetyEducationReports } from "@/hooks/use-safety-education-reports";
import { useSiteDetail } from "@/hooks/use-site-detail";
import { useSessionStore } from "@/stores/session-store";
import { getSafetyEducationReportPdfUrl } from "@/lib/api/get-safety-education-report-pdf";
import type { ManagerSafetyEducationReportRow } from "@/components/features/manager/safety-education/manager-safety-education-table";

export default function ManagerSafetyEducationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useSessionStore((state) => state.user);
  const parsedSiteId = user?.siteId ?? 0;
  const hasValidSiteId = !!parsedSiteId && !Number.isNaN(parsedSiteId);

  const { data: siteDetail } = useSiteDetail(parsedSiteId);

  const [page, setPage] = useState(1);
  const pageSize = 20;

  const {
    data: reportsData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useSafetyEducationReports(
    {
      siteId: parsedSiteId,
      page,
      size: pageSize,
    },
    {
      enabled: hasValidSiteId,
    },
  );

  const records: ManagerSafetyEducationReportRow[] =
    reportsData?.items?.map((item) => ({
      id: item.safetyEducationReportId,
      educationDate: item.educationDate,
      writerName: item.writerName,
      participantCount: item.participantCount,
      status: item.status,
    })) ?? [];
  const totalCount = reportsData?.pagination.totalElements ?? 0;
  const tableLoading = isLoading || isFetching;

  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);

  // 안전교육 일지 PDF URL 가져오기
  const { data: reportPdfUrl, isLoading: isPdfLoading } = useQuery({
    queryKey: ["safety-education-report-pdf", parsedSiteId, selectedReportId],
    queryFn: () => {
      if (selectedReportId == null) {
        return Promise.reject(new Error("안전교육 일지 ID가 없습니다."));
      }
      return getSafetyEducationReportPdfUrl(parsedSiteId, selectedReportId);
    },
    enabled: selectedReportId != null && hasValidSiteId,
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
        queryString ? `/manager/safety-education?${queryString}` : "/manager/safety-education",
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
      error instanceof Error
        ? error.message
        : "안전교육 일지 데이터를 불러오는 중 오류가 발생했습니다.";
    if (lastErrorMessageRef.current === message) return;
    lastErrorMessageRef.current = message;
    notification.error({
      message,
      placement: "topRight",
      duration: 3,
    });
  }, [isError, error]);

  const handleCreate = () => {
    router.push("/manager/safety-education/create");
  };

  const handleViewDetail = (reportId: number) => {
    setSelectedReportId(reportId);
  };

  const handleCloseModal = () => {
    setSelectedReportId(null);
  };

  const handleOpenInNewWindow = () => {
    if (reportPdfUrl) {
      window.open(reportPdfUrl, "_blank");
    }
  };

  const selectedReport = records.find((r) => r.id === selectedReportId);

  const disabledMessage = !hasValidSiteId
    ? "현장 정보가 없어 안전교육 일지 데이터를 불러올 수 없습니다. 관리자에게 현장 정보 설정을 요청해주세요."
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
          안전교육일지 작성
        </h2>
        <p className="mb-0! text-sm text-text-subtle dark:text-dark-text-base">
          진행한 안전교육에 대해 일지를 작성합니다.
        </p>
      </header>

      <section className="rounded-2xl border border-border bg-bg-surface px-6 py-4 dark:border-dark-border dark:bg-dark-bg-surface">
        <div className="flex items-center justify-between">
          <h3 className="mb-0 text-xl font-semibold text-brand-primary-strong">
            안전교육 일지 목록
          </h3>
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
          <ManagerSafetyEducationTable
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
        open={selectedReportId !== null}
        onCancel={handleCloseModal}
        footer={null}
        centered
        width={900}
        classNames={{
          content: "bg-white dark:bg-dark-bg-surface",
          body: "p-6",
        }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="mb-0! text-2xl font-semibold text-brand-primary-strong">
                안전교육 일지
              </p>
              <p className="mb-0! text-sm text-text-subtle">
                {siteDetail?.siteName ?? ""}
                {selectedReport ? ` | ${selectedReport.educationDate}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-2 mr-4">
              {reportPdfUrl && (
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
            ) : reportPdfUrl ? (
              <PDFViewer pdfUrl={reportPdfUrl} />
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
