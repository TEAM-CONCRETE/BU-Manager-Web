"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input, notification } from "antd";
import {
  ManagerContractsTable,
  type ManagerContractsRow,
} from "@/components/features/manager/contracts/manager-contracts-table";
import { ManagerContractViewModal } from "@/components/features/manager/contracts/manager-contract-view-modal";
import { ManagerContractCreateTypeModal } from "@/components/features/manager/contracts/manager-contract-create-type-modal";
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
  const router = useRouter();
  const searchParams = useSearchParams();
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
      id: item.contractId != null ? `contract-${item.contractId}` : `employee-${item.employeeId}`,
      contractId: item.contractId,
      employeeId: item.employeeId,
      employeeUserId: item.userId,
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
      phone: item.employeePhone ?? undefined,
      writtenAt: item.writtenAt,
      corporationSignedAt: item.corporationSignedAt,
      employeeSignedAt: item.employeeSignedAt,
    })) ?? [];
  const totalRecords = contractsData?.pagination.totalElements ?? 0;
  const totalCount = contractsData?.pagination.totalElements ?? 0;
  const tableLoading = isLoading || isFetching;

  const [selectedContractId, setSelectedContractId] = useState<number | null>(null);
  const [createTarget, setCreateTarget] = useState<ManagerContractsRow | null>(null);

  // 계약서 작성 후 모달 오픈 시 사용할 임시 데이터 (쿼리스트링이 사라지기 전에 저장)
  const [tempContractData, setTempContractData] = useState<{
    employeeName: string;
    employeeUserId: string | null;
    empType: string | null;
    phone: string | null;
    startDate: string | null;
    endDate: string | null;
  } | null>(null);

  const selectedContract = useMemo(() => {
    if (selectedContractId == null) return null;

    // 먼저 테이블 데이터에서 찾기
    const foundInRecords = records.find((record) => record.contractId === selectedContractId);
    if (foundInRecords) {
      return foundInRecords;
    }

    // 테이블에서 못 찾으면 임시 데이터로 객체 생성
    if (tempContractData?.employeeName) {
      return {
        id: `contract-${selectedContractId}`,
        contractId: selectedContractId,
        name: tempContractData.employeeName,
        residentNumber: "",
        employmentType:
          tempContractData.empType === "PERMANENT"
            ? ("REGULAR" as const)
            : tempContractData.empType === "DAILY"
              ? ("DAILY" as const)
              : ("UNCONTRACTED" as const),
        contractStatus: "DRAFT" as const,
        joinDate: tempContractData.startDate ?? undefined,
        endDate: tempContractData.endDate ?? undefined,
        phone: tempContractData.phone ?? undefined,
        employeeUserId: tempContractData.employeeUserId ?? undefined,
        writtenAt: new Date().toISOString(),
        corporationSignedAt: null,
        employeeSignedAt: null,
      } as ManagerContractsRow;
    }

    return null;
  }, [selectedContractId, records, tempContractData]);

  // 테이블 데이터를 찾으면 임시 데이터 초기화 (side effect는 useEffect에서 처리)
  useEffect(() => {
    if (selectedContractId != null && tempContractData) {
      const foundInRecords = records.find((record) => record.contractId === selectedContractId);
      if (foundInRecords) {
        setTempContractData(null);
      }
    }
  }, [selectedContractId, records, tempContractData]);

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

  const { data: pdfUrl, refetch: refetchPdf } = useContractPdf(
    selectedContractId,
    Boolean(selectedContractId),
  );

  // 작성 완료 후 돌아온 경우, 생성된 계약서 현황 모달 자동 오픈
  useEffect(() => {
    const createdIdParam = searchParams.get("createdContractId");
    if (!createdIdParam) return;

    const createdId = Number(createdIdParam);
    if (Number.isNaN(createdId)) return;

    // 쿼리스트링에서 근로자 정보를 state에 저장 (쿼리스트링이 사라지기 전에)
    const employeeName = searchParams.get("employeeName");
    const employeeUserId = searchParams.get("employeeUserId");
    const empType = searchParams.get("empType");
    const phone = searchParams.get("phone");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (employeeName) {
      setTempContractData({
        employeeName,
        employeeUserId,
        empType,
        phone,
        startDate,
        endDate,
      });
    }

    // 모달 즉시 오픈 (임시 데이터로 표시)
    setSelectedContractId(createdId);

    // 리스트 refetch (백그라운드에서 실행)
    refetch();

    // 쿼리스트링 정리 (계약서 작성 관련 파라미터 제거)
    const cleaned = new URLSearchParams(Array.from(searchParams.entries()));
    cleaned.delete("createdContractId");
    cleaned.delete("employeeName");
    cleaned.delete("employeeUserId");
    cleaned.delete("empType");
    cleaned.delete("phone");
    cleaned.delete("startDate");
    cleaned.delete("endDate");
    const queryString = cleaned.toString();
    router.replace(queryString ? `/manager/contracts?${queryString}` : "/manager/contracts");
  }, [searchParams, router, refetch]);

  const handleSearchSubmit = (value: string) => {
    const keyword = value.trim() || undefined;
    setAppliedKeyword(keyword);
    setPage(1);
  };

  const disabledMessage = !hasValidSiteId
    ? "현장 정보가 없어 근로계약서 데이터를 불러올 수 없습니다. 관리자에게 현장 정보 설정을 요청해주세요."
    : undefined;

  const handleSelectCreateType = (type: "REGULAR" | "DAILY") => {
    if (!createTarget) return;

    const empTypeParam = type === "REGULAR" ? "PERMANENT" : "DAILY";
    const searchParams = new URLSearchParams();
    searchParams.set("empType", empTypeParam);
    if (createTarget.employeeId != null) {
      searchParams.set("employeeId", String(createTarget.employeeId));
    }
    if (createTarget.name) {
      searchParams.set("employeeName", createTarget.name);
    }
    if (createTarget.employeeUserId) {
      searchParams.set("userId", createTarget.employeeUserId);
    }
    if (createTarget.phone) {
      searchParams.set("phone", createTarget.phone);
    }

    router.push(`/manager/contracts/create?${searchParams.toString()}`);
    setCreateTarget(null);
  };

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
              onCreateContract={(record) => setCreateTarget(record)}
            />
          </>
        )}
      </section>

      <ManagerContractViewModal
        open={Boolean(selectedContractId)}
        onClose={() => {
          setSelectedContractId(null);
          setTempContractData(null); // 임시 데이터 초기화
          refetch(); // 모달 닫을 때 테이블 리프레시
        }}
        contract={selectedContract}
        siteName={siteDetail?.siteName}
        pdfUrl={pdfUrl ?? undefined}
        siteId={parsedSiteId}
        zIndex={2000}
        onOpenInNewWindow={() => {
          if (pdfUrl) {
            window.open(pdfUrl, "_blank");
          }
        }}
        onSignatureSuccess={async () => {
          await refetchPdf();
          await refetch();
        }}
      />

      <ManagerContractCreateTypeModal
        open={createTarget != null}
        onClose={() => setCreateTarget(null)}
        employeeName={createTarget?.name}
        onSelect={handleSelectCreateType}
      />
    </div>
  );
}
