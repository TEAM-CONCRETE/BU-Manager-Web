"use client";

import { useEffect, useRef, useState } from "react";
import { Input, notification } from "antd";
import { ManagerContractsTable } from "@/components/features/manager/contracts/manager-contracts-table";
import { SafetyDocumentModal } from "@/components/features/company/safety/safety-document-modal";
import { useContractPdf } from "@/hooks/use-contract-pdf";
import { useContracts } from "@/hooks/use-contracts";
import { useSiteDetail } from "@/hooks/use-site-detail";
import { useSessionStore } from "@/stores/session-store";
import {
  EmploymentTypeFilterChips,
  type EmploymentFilterValue,
} from "@/components/features/manager/employment-type-filter-chips";

type ContractEmploymentFilter = EmploymentFilterValue;

export default function ManagerContractsPage() {
  const user = useSessionStore((state) => state.user);
  const parsedSiteId = user?.siteId ?? 0;
  const hasValidSiteId = !!parsedSiteId && !Number.isNaN(parsedSiteId);

  const { data: siteDetail } = useSiteDetail(parsedSiteId);

  const [employmentFilter, setEmploymentFilter] = useState<ContractEmploymentFilter>("ALL");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [appliedKeyword, setAppliedKeyword] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const {
    data: contractsData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useContracts(
    {
      siteId: parsedSiteId,
      empType:
        employmentFilter === "ALL"
          ? undefined
          : employmentFilter === "REGULAR"
            ? "PERMANENT"
            : "DAILY",
      page,
      size: pageSize,
      searchKeyword: appliedKeyword,
    },
    {
      enabled: hasValidSiteId,
    },
  );

  const records =
    contractsData?.items.map((item) => ({
      id: item.contractId, // 각 행은 계약서를 나타내므로 contractId를 고유 키로 사용
      contractId: item.contractId,
      name: item.employeeName,
      residentNumber: item.employeeResidentNumber ?? "",
      employmentType:
        item.empType === "PERMANENT"
          ? ("REGULAR" as const)
          : item.empType === "DAILY"
            ? ("DAILY" as const)
            : ("UNCONTRACTED" as const),
      contractStatus: item.contractState,
      joinDate: item.employeeStartDate,
      endDate: item.employeeEndDate,
      phone: undefined, // API에 없음
    })) ?? [];
  const totalRecords = contractsData?.pagination.totalElements ?? 0;
  const totalCount = contractsData?.pagination.totalElements ?? 0;
  const tableLoading = isLoading || isFetching;

  const [selectedContractId, setSelectedContractId] = useState<number | null>(null);

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
        : "근로계약서 데이터를 불러오는 중 오류가 발생했습니다.";
    if (lastErrorMessageRef.current === message) return;
    lastErrorMessageRef.current = message;
    notification.error({
      message,
      placement: "topRight",
      duration: 3,
    });
  }, [isError, error]);

  const { data: pdfUrl } = useContractPdf(selectedContractId, Boolean(selectedContractId));

  const handleSearchSubmit = (value: string) => {
    const keyword = value.trim() || undefined;
    setAppliedKeyword(keyword);
    setPage(1);
  };

  const disabledMessage = !hasValidSiteId
    ? "현장 정보가 없어 근로계약서 데이터를 불러올 수 없습니다. 관리자에게 현장 정보 설정을 요청해주세요."
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
          근로계약서 관리
        </h2>
        <p className="mb-0! text-sm text-text-subtle dark:text-dark-text-base">
          앱을 통해 가입한 근로자의 계약서를 관리합니다.
        </p>
      </header>

      <section className="rounded-3xl border border-border bg-bg-surface px-6 py-5 dark:border-dark-border dark:bg-dark-bg-surface">
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

          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
            <div className="w-full max-w-md mr-4!">
              <Input.Search
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
                onSearch={handleSearchSubmit}
                enterButton="검색"
                size="large"
              />
            </div>
            <div className="flex items-center gap-3 text-sm text-text-subtle dark:text-dark-text-base">
              <button
                type="button"
                onClick={() => refetch()}
                disabled={!hasValidSiteId}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-text-subtle hover:bg-bg-subtle disabled:cursor-not-allowed disabled:opacity-60 dark:border-dark-border dark:text-dark-text-base dark:hover:bg-dark-bg-surface"
              >
                ↻
              </button>
            </div>
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
              <p className="mb-0 text-xl font-semibold text-text-strong">근로계약서 목록</p>
              <p className="mb-0 text-sm text-text-subtle">총 {totalCount}명</p>
            </div>

            <ManagerContractsTable
              records={records}
              isLoading={tableLoading}
              currentPage={page}
              pageSize={pageSize}
              total={totalRecords}
              onPageChange={(newPage) => setPage(newPage)}
              onOpenContract={(contractId) => setSelectedContractId(contractId)}
            />
          </>
        )}
      </section>

      <SafetyDocumentModal
        open={Boolean(selectedContractId)}
        onClose={() => setSelectedContractId(null)}
        title="근로계약서"
        subtitle={siteDetail?.siteName}
        pdfUrl={pdfUrl ?? undefined}
        zIndex={2000}
        onDownload={() => {
          if (pdfUrl) {
            window.open(pdfUrl, "_blank");
          }
        }}
      />
    </div>
  );
}
