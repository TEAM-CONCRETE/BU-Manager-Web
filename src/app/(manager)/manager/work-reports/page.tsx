"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ManagerWorkReportsTable } from "@/components/features/manager/work-reports/manager-work-reports-table";
import { Button } from "@/components/ui/Button/button";
import { useSiteDetail } from "@/hooks/use-site-detail";
import { useSessionStore } from "@/stores/session-store";
import type { ManagerWorkReportRow } from "@/components/features/manager/work-reports/manager-work-reports-table";

export default function ManagerWorkReportsPage() {
  const router = useRouter();
  const user = useSessionStore((state) => state.user);
  const parsedSiteId = user?.siteId ?? 0;
  const hasValidSiteId = !!parsedSiteId && !Number.isNaN(parsedSiteId);

  const { data: siteDetail } = useSiteDetail(parsedSiteId);

  const [page, setPage] = useState(1);
  const pageSize = 20;

  // TODO: API 연동 후 실제 데이터로 교체
  const records: ManagerWorkReportRow[] = [];
  const totalCount = 0;
  const tableLoading = false;

  const handleCreate = () => {
    router.push("/manager/work-reports/create");
  };

  const handleViewDetail = (workReportId: number) => {
    // TODO: 작업일보 상세 모달/페이지 구현
    // workReportId will be used when implementing the detail modal/page
    void workReportId; // Temporary: will be used later
  };

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
    </div>
  );
}
