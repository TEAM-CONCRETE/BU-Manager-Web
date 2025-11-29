"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input, notification } from "antd";
import { Button } from "@/components/ui/Button/button";
import { Table } from "@/components/ui/Table/table";
import {
  EmploymentTypeFilterChips,
  type EmploymentFilterValue,
} from "@/components/features/manager/employment-type-filter-chips";
import { useEmployees } from "@/hooks/use-employees";
import { useSiteDetail } from "@/hooks/use-site-detail";
import { useSessionStore } from "@/stores/session-store";
import type { EmployeeRecord, EmploymentType } from "@/types/employee";

type SelectedEmployee = {
  employeeId: number;
  name: string;
  employmentType: EmploymentType;
};

export default function ManagerSafetyEducationSelectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useSessionStore((state) => state.user);
  const parsedSiteId = user?.siteId ?? 0;
  const hasValidSiteId = !!parsedSiteId && !Number.isNaN(parsedSiteId);

  const { data: siteDetail } = useSiteDetail(parsedSiteId);

  // Query params에서 교육 정보 가져오기
  const educationData = useMemo(() => {
    return {
      siteName: searchParams.get("siteName") ?? "",
      siteAddress: searchParams.get("siteAddress") ?? "",
      educationDate: searchParams.get("educationDate") ?? "",
      author: searchParams.get("author") ?? "",
      educationType: searchParams.get("educationType") ?? "",
      otherEducationType: searchParams.get("otherEducationType") ?? "",
      educationSubject: searchParams.get("educationSubject") ?? "",
      educationContent: searchParams.get("educationContent") ?? "",
      instructorName: searchParams.get("instructorName") ?? "",
      educationLocation: searchParams.get("educationLocation") ?? "",
    };
  }, [searchParams]);

  const [employmentFilter, setEmploymentFilter] = useState<EmploymentFilterValue>("ALL");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<Set<number>>(new Set());

  // 근로자 목록 조회
  const employmentType: EmploymentType | undefined =
    employmentFilter === "ALL" ? undefined : employmentFilter;

  const { data: employeesData, isLoading: isLoadingEmployees } = useEmployees(
    {
      siteId: parsedSiteId,
      employmentType,
      page,
      size: pageSize,
      searchKeyword: searchKeyword || undefined,
    },
    {
      enabled: hasValidSiteId,
    },
  );

  const employees = useMemo(() => employeesData?.records ?? [], [employeesData?.records]);
  const totalCount = employeesData?.pagination.totalRecords ?? 0;

  // 선택된 근로자 통계
  const selectedEmployees = useMemo(() => {
    return employees.filter((emp) => selectedEmployeeIds.has(emp.id));
  }, [employees, selectedEmployeeIds]);

  const selectedCount = selectedEmployees.length;
  const selectedRegularCount = selectedEmployees.filter(
    (emp) => emp.employmentType === "REGULAR",
  ).length;
  const selectedDailyCount = selectedEmployees.filter(
    (emp) => emp.employmentType === "DAILY",
  ).length;

  const handleResetSelection = () => {
    setSelectedEmployeeIds(new Set());
  };

  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    if (selectedEmployeeIds.size === 0) {
      notification.warning({
        message: "교육 대상자를 최소 1명 이상 선택해주세요.",
        placement: "topRight",
        duration: 3,
      });
      return;
    }

    // 선택된 근로자 정보를 query params로 전달
    const selectedEmployeesData: SelectedEmployee[] = employees
      .filter((emp) => selectedEmployeeIds.has(emp.id))
      .map((emp) => ({
        employeeId: emp.id,
        name: emp.name,
        employmentType: emp.employmentType,
      }));

    const params = new URLSearchParams();
    Object.entries(educationData).forEach(([key, value]) => {
      params.set(key, value);
    });
    params.set("selectedEmployees", JSON.stringify(selectedEmployeesData));

    router.push(`/manager/safety-education/create/sign?${params.toString()}`);
  };

  // TODO: 안전교육이수 여부는 API에서 받아와야 함
  const hasCompletedSafetyEducation = (employeeId: number): boolean => {
    // 임시로 일부 근로자만 이수한 것으로 표시
    return employeeId % 3 === 0;
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
          안전교육 대상자 선택
        </h2>
        <p className="mb-0! text-sm text-text-subtle dark:text-dark-text-base">
          안전교육을 받은 근로자를 아래 표에서 선택하세요.
        </p>
      </header>

      {/* 필터 영역 */}
      <section className="rounded-2xl border border-border bg-bg-surface px-6 py-4 dark:border-dark-border dark:bg-dark-bg-surface">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <EmploymentTypeFilterChips
              value={employmentFilter}
              onChange={(value) => {
                setEmploymentFilter(value);
                setPage(1);
              }}
            />
            <div className="flex items-center gap-2">
              <Input
                value={searchKeyword}
                onChange={(e) => {
                  setSearchKeyword(e.target.value);
                  setPage(1);
                }}
                placeholder="근로자명 또는 연락처로 검색"
                className="w-64 rounded-lg"
                prefix={
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14 14L11.1 11.1"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* 근로자 선택 테이블 */}
      <section className="rounded-3xl border border-border bg-bg-surface p-6 dark:border-dark-border dark:bg-dark-bg-surface">
        <Table<EmployeeRecord>
          dataSource={employees}
          loading={isLoadingEmployees}
          rowKey={(record) => record.id}
          pagination={{
            current: page,
            pageSize,
            total: totalCount,
            onChange: (newPage) => setPage(newPage),
            position: ["bottomCenter"],
            showSizeChanger: false,
          }}
          rowSelection={{
            selectedRowKeys: Array.from(selectedEmployeeIds),
            onSelectAll: (selected) => {
              if (selected) {
                setSelectedEmployeeIds(new Set(employees.map((emp) => emp.id)));
              } else {
                setSelectedEmployeeIds(new Set());
              }
            },
            onSelect: (record, selected) => {
              const newSet = new Set(selectedEmployeeIds);
              if (selected) {
                newSet.add(record.id);
              } else {
                newSet.delete(record.id);
              }
              setSelectedEmployeeIds(newSet);
            },
          }}
          columns={[
            {
              title: "구분",
              dataIndex: "employmentType",
              key: "employmentType",
              align: "center",
              render: (type: EmploymentType) => (type === "REGULAR" ? "상용" : "일용"),
            },
            {
              title: "사원",
              dataIndex: "name",
              key: "name",
              align: "center",
            },
            {
              title: (
                <>
                  안전교육이수
                  <br />
                  여부
                </>
              ),
              key: "safetyEducation",
              align: "center",
              render: (_, record) => {
                const hasCompleted = hasCompletedSafetyEducation(record.id);
                return hasCompleted ? (
                  <span className="text-state-success">○</span>
                ) : (
                  <span className="text-state-danger">×</span>
                );
              },
            },
            {
              title: "입사일",
              key: "joinDate",
              align: "center",
              render: () => "-", // TODO: 입사일 정보 필요
            },
            {
              title: "퇴사일",
              key: "resignDate",
              align: "center",
              render: () => "-", // TODO: 퇴사일 정보 필요
            },
            {
              title: "주민등록번호",
              dataIndex: "residentNumber",
              key: "residentNumber",
              align: "center",
              render: (value) => value || "-",
            },
            {
              title: "연락처",
              key: "phone",
              align: "center",
              render: () => "-", // TODO: 연락처 정보 필요
            },
            {
              title: "이메일",
              key: "email",
              align: "center",
              render: () => "-", // TODO: 이메일 정보 필요
            },
            {
              title: "주소",
              key: "address",
              align: "center",
              render: () => "-", // TODO: 주소 정보 필요
            },
            {
              title: "비상연락망",
              key: "emergencyContact",
              align: "center",
              render: () => "-", // TODO: 비상연락망 정보 필요
            },
          ]}
          showHeaderBar={false}
          borderedContainer={false}
          className="rounded-2xl border border-border bg-white dark:border-dark-border dark:bg-dark-bg-surface"
        />
      </section>

      {/* 선택된 근로자 통계 */}
      <section className="rounded-2xl border border-border bg-[#f8f9fb] px-6 py-4 dark:border-dark-border dark:bg-dark-bg-surface">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="mb-1 text-sm text-brand-primary-strong">선택된 근로자 수</p>
            <p className="text-lg font-medium text-brand-primary">{selectedCount}명</p>
          </div>
          <div className="text-center">
            <p className="mb-1 text-sm text-brand-primary-strong">상용 근로자</p>
            <p className="text-lg font-medium text-brand-primary">{selectedRegularCount}명</p>
          </div>
          <div className="text-center">
            <p className="mb-1 text-sm text-brand-primary-strong">일용 근로자</p>
            <p className="text-lg font-medium text-brand-primary">{selectedDailyCount}명</p>
          </div>
        </div>
      </section>

      {/* 하단 액션 버튼 */}
      <section className="flex justify-end gap-3">
        <Button variant="secondary" size="md" onClick={handleBack}>
          이전 단계
        </Button>
        <Button variant="secondary" size="md" onClick={handleResetSelection}>
          선택 초기화
        </Button>
        <Button variant="primary" size="md" onClick={handleNext}>
          다음 단계로
        </Button>
      </section>
    </div>
  );
}
