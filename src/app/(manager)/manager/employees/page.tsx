"use client";

import { useEffect, useRef, useState } from "react";
import { Input, notification } from "antd";
import { Modal } from "antd";
import { ManagerEmployeesTable } from "@/components/features/manager/employees/manager-employees-table";
import { ManagerEmployeeDetailModal } from "@/components/features/manager/employees/manager-employee-detail-modal";
import {
  EmploymentTypeFilterChips,
  type EmploymentFilterValue,
} from "@/components/features/manager/employment-type-filter-chips";
import { PDFViewer } from "@/components/common/pdf-viewer";
import { Button } from "@/components/ui/Button/button";
import { useContractPdf } from "@/hooks/use-contract-pdf";
import { useEmployees } from "@/hooks/use-employees";
import { useEmployeeDetail } from "@/hooks/use-employee-detail";
import { useSiteDetail } from "@/hooks/use-site-detail";
import { useSessionStore } from "@/stores/session-store";
import type { EmployeeContractDocument, EmployeeRecord } from "@/types/employee";

export default function ManagerEmployeesPage() {
  const user = useSessionStore((state) => state.user);
  const parsedSiteId = user?.siteId ?? 0;
  const hasValidSiteId = !!parsedSiteId && !Number.isNaN(parsedSiteId);

  const { data: siteDetail } = useSiteDetail(parsedSiteId);

  const [employmentFilter, setEmploymentFilter] = useState<EmploymentFilterValue>("REGULAR");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [appliedKeyword, setAppliedKeyword] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const {
    data: employeesData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useEmployees(
    {
      siteId: parsedSiteId,
      employmentType:
        employmentFilter === "ALL"
          ? undefined
          : employmentFilter === "REGULAR"
            ? "REGULAR"
            : "DAILY",
      page,
      size: pageSize,
      searchKeyword: appliedKeyword,
    },
    {
      enabled: hasValidSiteId,
    },
  );

  const records: EmployeeRecord[] = employeesData?.records ?? [];
  const totalCount = employeesData?.summary.totalCount ?? 0;
  const tableLoading = isLoading || isFetching;

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [selectedContract, setSelectedContract] = useState<EmployeeContractDocument | null>(null);

  const { employee, contracts } = useEmployeeDetail({
    siteId: parsedSiteId,
    employeeId: selectedEmployeeId,
  });

  const { data: contractPdfUrl, isLoading: isPdfLoading } = useContractPdf(
    selectedContract?.id ?? null,
    selectedContract !== null,
  );

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
      error instanceof Error ? error.message : "근로자 데이터를 불러오는 중 오류가 발생했습니다.";
    if (lastErrorMessageRef.current === message) return;
    lastErrorMessageRef.current = message;
    notification.error({
      message,
      placement: "topRight",
      duration: 3,
    });
  }, [isError, error]);

  const handleSearchSubmit = (value: string) => {
    const keyword = value.trim() || undefined;
    setAppliedKeyword(keyword);
    setPage(1);
  };

  const handleViewDetail = (employeeId: number) => {
    setSelectedEmployeeId(employeeId);
  };

  const handleCloseModal = () => {
    setSelectedEmployeeId(null);
  };

  const handleOpenContract = (contract: EmployeeContractDocument) => {
    setSelectedContract(contract);
  };

  const handleCloseContractModal = () => {
    setSelectedContract(null);
  };

  const handleOpenContractInNewWindow = () => {
    if (contractPdfUrl) {
      window.open(contractPdfUrl, "_blank");
    }
  };

  const disabledMessage = !hasValidSiteId
    ? "현장 정보가 없어 근로자 데이터를 불러올 수 없습니다. 관리자에게 현장 정보 설정을 요청해주세요."
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
          근로자 관리
        </h2>
        <p className="mb-0! text-sm text-text-subtle dark:text-dark-text-base">
          현장에 등록된 근로자들의 정보를 확인합니다.
        </p>
      </header>

      <section className="rounded-2xl border border-border bg-bg-surface px-6 py-4 dark:border-dark-border dark:bg-dark-bg-surface">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <EmploymentTypeFilterChips
              value={employmentFilter}
              onChange={(val) => {
                setEmploymentFilter(val);
                setPage(1);
              }}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={!hasValidSiteId}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-text-subtle hover:bg-bg-subtle disabled:cursor-not-allowed disabled:opacity-60 dark:border-dark-border dark:text-dark-text-base dark:hover:bg-dark-bg-surface"
            >
              ↻
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-bg-surface px-6 py-4 dark:border-dark-border dark:bg-dark-bg-surface">
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <Input
              className="employee-search-input"
              placeholder="근로자명 입력"
              allowClear
              value={searchKeyword}
              onChange={(e) => {
                const value = e.target.value;
                setSearchKeyword(value);
                if (value === "") {
                  setAppliedKeyword(undefined);
                  setPage(1);
                }
              }}
              onPressEnter={(e) => {
                handleSearchSubmit((e.target as HTMLInputElement).value);
              }}
              size="large"
            />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-bg-surface p-6 dark:border-dark-border dark:bg-dark-bg-surface">
        {!hasValidSiteId ? (
          <div className="flex h-40 items-center justify-center text-sm text-text-subtle dark:text-dark-text-base">
            {disabledMessage}
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="mb-0 text-xl font-semibold text-text-strong">사원 목록</p>
              <p className="mb-0 text-sm text-text-subtle">총 {totalCount}명</p>
            </div>

            <ManagerEmployeesTable
              records={records}
              isLoading={tableLoading}
              currentPage={page}
              pageSize={pageSize}
              total={totalCount}
              onPageChange={(newPage) => setPage(newPage)}
              onViewDetail={handleViewDetail}
            />
          </>
        )}
      </section>

      <ManagerEmployeeDetailModal
        open={selectedEmployeeId !== null}
        onClose={handleCloseModal}
        employee={employee ?? null}
        contracts={contracts}
        siteName={siteDetail?.siteName}
        onOpenContract={handleOpenContract}
      />

      <Modal
        open={selectedContract !== null}
        onCancel={handleCloseContractModal}
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
              <p className="mb-0! text-2xl font-semibold text-brand-primary-strong">
                {selectedContract?.title ?? "근로계약서"}
              </p>
              <p className="mb-0! text-sm text-text-subtle">{siteDetail?.siteName ?? ""}</p>
            </div>
            <div className="flex items-center gap-2">
              {contractPdfUrl && (
                <Button variant="primary" size="md" onClick={handleOpenContractInNewWindow}>
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
            ) : contractPdfUrl ? (
              <PDFViewer pdfUrl={contractPdfUrl} />
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
